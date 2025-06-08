'use client';

import { signOut } from '@/actions/auth';
import { LogOutIcon } from 'lucide-react';
import { useTransition } from 'react';

export function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut();
    });
  };

  return (
    <>
      <div className="hidden md:inline">
        <button
          onClick={handleSignOut}
          disabled={isPending}
          className="flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-300 transition-colors hover:cursor-pointer hover:bg-gray-800"
        >
          <LogOutIcon size={20} className="mr-2 text-gray-500" />
          <span>{isPending ? 'Signing out...' : 'Sign Out'}</span>
        </button>
      </div>
      <div className="md:hidden">
        <button
          onClick={handleSignOut}
          disabled={isPending}
          className="flex items-center justify-center rounded-md px-2 py-2 text-sm text-gray-300 transition-colors hover:cursor-pointer hover:bg-gray-800"
        >
          <LogOutIcon size={20} className="mr-2 text-gray-500" />
        </button>
      </div>
    </>
  );
}
