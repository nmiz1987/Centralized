'use client';

import { ActionResponse, signIn } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Form, FormError, FormGroup, FormInput, FormLabel } from '@/components/ui/Form';
import Link from 'next/link';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { TOAST_STYLES } from '@/lib/constants';

const initialState: ActionResponse = {
  success: false,
  message: '',
  errors: undefined,
  values: undefined,
};

export default function SignInPage() {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(async (prevState: ActionResponse, formData: FormData) => {
    try {
      const result = await signIn(formData, true);

      if (result.success) {
        toast.success(result.message, TOAST_STYLES.success);
        router.replace('/dashboard');
      }

      return result;
    } catch (err) {
      return {
        success: false,
        message: (err as Error)?.message || 'An error occurred',
        errors: undefined,
        values: undefined,
      };
    }
  }, initialState);

  return (
    <div className="flex h-screen flex-col items-center pt-14">
      <h1 className="mb-10 text-3xl font-bold">Login to your account</h1>
      <div className="flex w-full items-center justify-center px-6">
        <div className="bg-secondary w-full max-w-lg rounded-lg p-8">
          <Form action={formAction}>
            {state?.message && !state.success && <FormError>{state.message}</FormError>}
            <FormGroup>
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormInput
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Enter your email"
                defaultValue={state?.values?.email || ''}
                disabled={isPending}
                aria-describedby="email-error"
                className={state?.errors?.email ? 'border-red-500' : ''}
              />
              {state?.errors?.email && (
                <p id="email-error" className="text-sm text-red-500">
                  {state.errors.email.join(', ')}
                </p>
              )}
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="password">Password</FormLabel>
              <FormInput
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Enter your password"
                defaultValue={state?.values?.password || ''}
                disabled={isPending}
                aria-describedby="password-error"
                className={state?.errors?.password ? 'border-red-500' : ''}
              />
              {state?.errors?.password && (
                <p id="password-error" className="text-sm text-red-500">
                  {state.errors.password.join(', ')}
                </p>
              )}
            </FormGroup>
            <div>
              <Button type="submit" className="w-full" isLoading={isPending}>
                Sign in
              </Button>
            </div>
          </Form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="link-animation font-medium text-gray-300 hover:text-gray-100">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
