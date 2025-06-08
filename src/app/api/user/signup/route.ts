import { signUp } from '@/actions/auth';
import { getCurrentUser } from '@/lib/dal';
import { NextRequest, NextResponse } from 'next/server';

type RouteHandler = (req: NextRequest) => Promise<NextResponse>;

// Middleware to check if user is authenticated
const withUser = (handler: RouteHandler): RouteHandler => {
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
};

export const GET = withUser(async () => {
  return NextResponse.json({
    message: 'Hello, world!',
  });
});

// create user with api
export const POST = async (req: NextRequest) => {
  // const body = await req.formData();
  const { email, password, confirmPassword } = await req.json();
  const body = new FormData();
  body.append('email', email);
  body.append('password', password);
  body.append('confirmPassword', confirmPassword);
  const newUser = await signUp(body);

  return NextResponse.json(newUser);
};
