import { signIn } from '@/actions/auth';
import { NextRequest, NextResponse } from 'next/server';

// create user with api
export const POST = async (req: NextRequest) => {
  try {
    // const body = await req.formData();
    const { email, password } = await req.json();
    const body = new FormData();
    body.append('email', email);
    body.append('password', password);
    const newUser = await signIn(body, true);

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error signing in:', error);
    return NextResponse.json({ error, message: 'Failed to sign in' }, { status: 500 });
  }
};
