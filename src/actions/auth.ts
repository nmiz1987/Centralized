'use server';

import { verifyPassword, createSession, createUser, deleteSession, updateUserLastVisitedAt } from '@/lib/auth';
import { getUserByEmail } from '@/lib/dal';
import { redirect } from 'next/navigation';
import { SignInSchema, SignUpSchema } from '@/lib/schemas';
import { CACHE_TAGS } from '@/lib/constants';
import { unstable_expireTag as expireTag } from 'next/cache';

export type ActionResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  values?: Record<string, string>;
};

export async function signIn(formData: FormData): Promise<ActionResponse> {
  try {
    // Extract data from form
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    // Validate with Zod
    const validationResult = SignInSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
        values: data,
      };
    }

    // Find user by email
    const user = await getUserByEmail(data.email);
    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password',
        values: data,
      };
    }

    // Verify password
    const isPasswordValid = await verifyPassword(data.password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Invalid email or password',
        values: data,
      };
    }

    // Create session
    await createSession(user.id);
    await updateUserLastVisitedAt(user.id);

    return {
      success: true,
      message: 'Signed in successfully',
      values: data,
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      message: 'An error occurred while signing in',
      errors: {
        error: ['Failed to sign in'],
      },
    };
  }
}

export async function signUp(formData: FormData): Promise<ActionResponse> {
  try {
    // Extract data from form
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    // Check if passwords match
    if (data.password !== data.confirmPassword) {
      return {
        success: false,
        message: 'Ops! Passwords do not match',
        values: data,
      };
    }

    // Validate with Zod
    const validationResult = SignUpSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
        values: data,
      };
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(data.email);
    if (existingUser) {
      return {
        success: false,
        message: 'Ops! User with this email already exists',
        errors: {
          email: ['Try another email'],
        },
        values: data,
      };
    }

    // Create new user
    const user = await createUser(data.email, data.password);
    if (!user) {
      return {
        success: false,
        message: 'Failed to create user',
        errors: {
          error: ['Failed to create user'],
        },
        values: data,
      };
    }

    // Create session for the newly registered user
    await createSession(user.id);

    return {
      success: true,
      message: 'Account created successfully',
    };
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      success: false,
      message: 'An error occurred while creating your account',
      errors: {
        error: ['Failed to create account'],
      },
    };
  }
}

export async function signOut(): Promise<void> {
  try {
    await deleteSession();
    // Expire all cache tags
    Object.values(CACHE_TAGS).forEach(tag => {
      expireTag(tag);
    });
  } catch (error) {
    console.error('Sign out error:', error);
    throw new Error('Failed to sign out');
  } finally {
    redirect('/signin');
  }
}
