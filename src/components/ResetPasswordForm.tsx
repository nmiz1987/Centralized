'use client';
import { LockIcon } from 'lucide-react';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, FormGroup, FormLabel, FormInput, FormError } from './ui/Form';
import { type ActionResponse } from '@/actions/links';
import { Button } from './ui/button';
import { resetPassword } from '@/actions/auth';
import toast from 'react-hot-toast';
import { TOAST_STYLES } from '@/lib/constants';

const initialState: ActionResponse = {
  success: false,
  message: '',
  errors: undefined,
};

export function ResetPasswordForm() {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(async (prevState: ActionResponse, formData: FormData) => {
    try {
      // Call the appropriate action based on whether we're editing or creating
      const result = await resetPassword(formData);

      // Handle successful submission
      if (result.success) {
        router.refresh();
        toast.success(result.message, TOAST_STYLES.success);
      }

      return result;
    } catch (err) {
      return {
        success: false,
        message: (err as Error).message || 'An error occurred',
        errors: undefined,
      };
    }
  }, initialState);

  return (
    <div className="bg-elevated rounded-lg border border-gray-700 p-6">
      <h2 className="mb-4 text-xl font-semibold">Reset Password</h2>
      <Form action={formAction}>
        {state?.message && !state.success && <FormError>{state.message}</FormError>}
        <FormGroup>
          <FormLabel htmlFor="newPassword">New Password</FormLabel>
          <FormInput
            disabled={isPending}
            id="newPassword"
            name="newPassword"
            type="password"
            placeholder="Enter new password"
            required
            className={state?.errors?.newPassword ? 'border-red-500' : ''}
          />
          {state?.errors?.newPassword && (
            <p id="newPassword-error" className="text-sm text-red-500">
              {state.errors.newPassword.join(', ')}
            </p>
          )}
        </FormGroup>

        <FormGroup className="mt-6">
          <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
          <FormInput
            disabled={isPending}
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            required
            className={state?.errors?.confirmPassword ? 'border-red-500' : ''}
          />
          {state?.errors?.confirmPassword && (
            <p id="confirmPassword-error" className="text-sm text-red-500">
              {state.errors.confirmPassword.join(', ')}
            </p>
          )}
        </FormGroup>

        <div className="mt-6">
          <Button type="submit" className="flex w-full items-center justify-center" disabled={isPending}>
            <LockIcon size={18} className="mr-2" />
            Reset Password
          </Button>
        </div>
      </Form>
    </div>
  );
}
