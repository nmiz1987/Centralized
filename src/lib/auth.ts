import { compare, hash, genSalt } from 'bcrypt';
import { nanoid } from 'nanoid';
import { cookies } from 'next/headers';
import { db } from '@/db';
import { users } from '@/db/schema';
import * as jose from 'jose';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from './dal';
import { NextRequest, NextResponse } from 'next/server';

type RouteHandler = (req: NextRequest) => Promise<NextResponse>;

// JWT types
interface JWTPayload {
  userId: string;
  [key: string]: string | number | boolean | null | undefined;
}

// Secret key for JWT signing (in a real app, use an environment variable)
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-min-32-chars-long!!!');

// JWT expiration time
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1d'; // 1 days

// Hash a password
export async function hashPassword(password: string) {
  const salt = await genSalt();
  return hash(password, salt);
}

// Verify a password
export async function verifyPassword(password: string, hashedPassword: string) {
  return compare(password, hashedPassword);
}

export async function resetUserPassword(userId: string, newPassword: string) {
  try {
    const user = await db.select().from(users).where(eq(users.id, userId));

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const hashNewPassword = await hashPassword(newPassword);
    await db.update(users).set({ password: hashNewPassword }).where(eq(users.id, userId));

    return { success: true, message: 'Password reset successfully' };
  } catch (error) {
    console.error('Error resetting password:', error);
    return { success: false, message: 'Failed to reset password' };
  }
}

// Create a new user
export async function createUser(email: string, password: string) {
  const hashedPassword = await hashPassword(password);
  const id = nanoid();

  try {
    await db.insert(users).values({
      id,
      email,
      password: hashedPassword,
    });

    return { id, email };
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

// Create a new user
export async function updateUserLastVisitedAt(userId: string) {
  try {
    await db
      .update(users)
      .set({
        lastVisitedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return true;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

// Generate a JWT token
export async function generateJWT(payload: JWTPayload) {
  return await new jose.SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime(JWT_EXPIRATION).sign(JWT_SECRET);
}

// Verify a JWT token
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return payload as JWTPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

// Check if token needs refresh
export async function isHaveActiveSession(token: string): Promise<boolean> {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET, {
      clockTolerance: 15, // 15 seconds tolerance for clock skew
    });

    // Get expiration time
    const exp = payload.exp as number;
    const now = Math.floor(Date.now() / 1000);

    return exp - now > 0;
  } catch {
    // If verification fails, token is invalid or expired
    return false;
  }
}

// Create a session using JWT
export async function createSession(userId: string) {
  try {
    // Create JWT with user data
    const token = await generateJWT({ userId });

    // Store JWT in a cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
      sameSite: 'lax',
    });

    return true;
  } catch (error) {
    console.error('Error creating session:', error);
    return false;
  }
}

// Get current session from JWT
export const getSession = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return null;

    const payload = await verifyJWT(token);
    const isActiveSession = await isHaveActiveSession(token);

    return payload ? { userId: payload.userId, isActiveSession } : null;
  } catch (error) {
    // Handle the specific prerendering error
    if (error instanceof Error && error.message.includes('During prerendering, `cookies()` rejects')) {
      // console.error('Cookies not available during prerendering, returning null session');
      return null;
    }

    console.error('Error getting session:', error);
    return null;
  }
};

// Delete session by clearing the JWT cookie
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
}

// Check if user is authenticated with cookies
export function withUser(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest) => {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          message: 'Unauthorized',
        },
        { status: 401 },
      );
    }

    return handler(req);
  };
}

// Check if user is authenticated with Authorization header
export function withAuth(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest) => {
    const authHeader = req.headers.get('Authorization');

    // If no Authorization header is present, return a 401 Unauthorized response
    if (!authHeader) {
      return NextResponse.json({ success: false, message: 'Authorization header is required' }, { status: 401 });
    }
    return handler(req);
  };
}
