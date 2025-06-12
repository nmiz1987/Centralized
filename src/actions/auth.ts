'use server';

import { verifyPassword, createSession, createUser, deleteSession, updateUserLastVisitedAt, resetUserPassword, getSession } from '@/lib/auth';
import { getUserByEmail } from '@/lib/dal';
import { redirect } from 'next/navigation';
import { ResetPasswordSchema, SignInSchema, SignUpSchema } from '@/lib/schemas';
import { CACHE_TAGS } from '@/lib/constants';
import { unstable_expireTag as expireTag } from 'next/cache';

export type ActionResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  values?: Record<string, string>;
};

export async function resetPassword(formData: FormData): Promise<ActionResponse> {
  try {
    const session = await getSession();

    if (!session || !session.isActiveSession) {
      return {
        success: false,
        message: 'You are not logged in',
      };
    }

    // Extract and sanitize data from form
    const newPassword = (formData.get('newPassword') as string)?.trim();
    const confirmPassword = (formData.get('confirmPassword') as string)?.trim();

    // Basic input validation
    if (!newPassword || !confirmPassword) {
      return {
        success: false,
        message: 'Password fields cannot be empty',
      };
    }

    // Remove any potential XSS or injection attempts
    const sanitizedData = {
      newPassword: newPassword.replace(/[<>]/g, ''),
      confirmPassword: confirmPassword.replace(/[<>]/g, ''),
    };

    // Check if passwords match
    if (sanitizedData.newPassword !== sanitizedData.confirmPassword) {
      return {
        success: false,
        message: 'Ops! Passwords do not match',
      };
    }

    // Validate with Zod
    const validationResult = ResetPasswordSchema.safeParse(sanitizedData);
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
      };
    }

    // Find user by email
    const result = await resetUserPassword(session.userId, sanitizedData.newPassword);

    // Clear any sensitive data from memory
    sanitizedData.newPassword = '';
    sanitizedData.confirmPassword = '';

    return result;
  } catch (error) {
    console.error('Reset password error:', error);
    return {
      success: false,
      message: 'An error occurred while resetting password',
      errors: {
        error: ['Failed to reset password'],
      },
    };
  }
}

export async function signIn(formData: FormData, returnDataInResponse: boolean): Promise<ActionResponse> {
  try {
    // Extract and sanitize data from form
    const email = (formData.get('email') as string)?.trim().toLowerCase();
    const password = (formData.get('password') as string)?.trim();

    // Basic input validation
    if (!email || !password) {
      return {
        success: false,
        message: 'Email and password are required',
        ...(returnDataInResponse && { values: { email: email || '', password: '' } }),
      };
    }

    // Remove any potential XSS or injection attempts
    const sanitizedData = {
      email: email.replace(/[<>]/g, ''),
      password: password.replace(/[<>]/g, ''),
    };

    // Validate with Zod
    const validationResult = SignInSchema.safeParse(sanitizedData);
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
        ...(returnDataInResponse && { values: sanitizedData }),
      };
    }

    // Find user by email
    const user = await getUserByEmail(sanitizedData.email);
    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password',
        ...(returnDataInResponse && { values: { email: sanitizedData.email, password: '' } }),
      };
    }

    // Verify password
    const isPasswordValid = await verifyPassword(sanitizedData.password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Invalid email or password',
        ...(returnDataInResponse && { values: { email: sanitizedData.email, password: '' } }),
      };
    }

    // Create session
    await createSession(user.id);
    await updateUserLastVisitedAt(user.id);

    // Clear sensitive data from memory
    sanitizedData.password = '';

    return {
      success: true,
      message: 'Signed in successfully',
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

export async function signUp(formData: FormData, returnDataInResponse: boolean): Promise<ActionResponse> {
  try {
    // Extract and sanitize data from form
    const email = (formData.get('email') as string)?.trim().toLowerCase();
    const password = (formData.get('password') as string)?.trim();
    const confirmPassword = (formData.get('confirmPassword') as string)?.trim();

    // Basic input validation
    if (!email || !password || !confirmPassword) {
      return {
        success: false,
        message: 'All fields are required',
        ...(returnDataInResponse && { values: { email: email || '', password: '', confirmPassword: '' } }),
      };
    }

    // Remove any potential XSS or injection attempts
    const sanitizedData = {
      email: email.replace(/[<>]/g, ''),
      password: password.replace(/[<>]/g, ''),
      confirmPassword: confirmPassword.replace(/[<>]/g, ''),
    };

    // Check if passwords match
    if (sanitizedData.password !== sanitizedData.confirmPassword) {
      return {
        success: false,
        message: 'Ops! Passwords do not match',
        ...(returnDataInResponse && { values: { email: sanitizedData.email, password: '', confirmPassword: '' } }),
      };
    }

    // Validate with Zod
    const validationResult = SignUpSchema.safeParse(sanitizedData);
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
        ...(returnDataInResponse && { values: { email: sanitizedData.email, password: '', confirmPassword: '' } }),
      };
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(sanitizedData.email);
    if (existingUser) {
      return {
        success: false,
        message: 'Ops! User with this email already exists',
        errors: {
          email: ['Try another email'],
        },
        ...(returnDataInResponse && { values: { email: sanitizedData.email, password: '', confirmPassword: '' } }),
      };
    }

    // Create new user
    const user = await createUser(sanitizedData.email, sanitizedData.password);
    if (!user) {
      return {
        success: false,
        message: 'Failed to create user',
        errors: {
          error: ['Failed to create user'],
        },
        ...(returnDataInResponse && { values: { email: sanitizedData.email, password: '', confirmPassword: '' } }),
      };
    }

    // Create session for the newly registered user
    await createSession(user.id);

    // Clear sensitive data from memory
    sanitizedData.password = '';
    sanitizedData.confirmPassword = '';

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

export async function signOut(redirectAfterSignOut: boolean = true): Promise<void> {
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
    if (redirectAfterSignOut) {
      redirect('/signin');
    }
  }
}
