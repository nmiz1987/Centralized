import { signOut } from '@/actions/auth';
import { NextResponse } from 'next/server';

// delete user's session
export const POST = async () => {
  try {
    await signOut(false);
    return NextResponse.json({ success: true, message: 'Signed out successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error signing up:', error);
    return NextResponse.json({ error, message: 'Failed to sign up' }, { status: 500 });
  }
};
