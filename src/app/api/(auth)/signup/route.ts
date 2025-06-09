import { signUp } from '@/actions/auth';
import { NextRequest, NextResponse } from 'next/server';

// create user with api
export const POST = async (req: NextRequest) => {
  try {
    // const body = await req.formData();
    const { email, password, confirmPassword } = await req.json();
    const body = new FormData();
    body.append('email', email);
    body.append('password', password);
    body.append('confirmPassword', confirmPassword);
    const newUser = await signUp(body, true);

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error signing up:', error);
    return NextResponse.json({ error, message: 'Failed to sign up' }, { status: 500 });
  }
};
