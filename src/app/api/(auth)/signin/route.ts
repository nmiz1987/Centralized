import { signIn } from '@/actions/auth';
import { NextRequest, NextResponse } from 'next/server';

// create user with api
export const POST = async (req: NextRequest) => {
  // const body = await req.formData();
  const { email, password } = await req.json();
  const body = new FormData();
  body.append('email', email);
  body.append('password', password);
  const newUser = await signIn(body, true);

  return NextResponse.json(newUser);
};
