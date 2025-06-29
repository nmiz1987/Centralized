import { getCurrentUser } from '@/lib/dal';
import { UserIcon } from 'lucide-react';
import { SignOutButton } from './SignOutButton';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export async function UserEmail() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/');
  }

  return (
    <div className="flex flex-row space-y-1 sm:flex-col">
      <Link href="/dashboard/profile" className="hidden items-center justify-start px-2 py-2 md:flex">
        <UserIcon size={20} className="mr-2 text-gray-500" />
        <span className="hidden truncate text-sm text-gray-300 md:inline">{user?.email}</span>
      </Link>
      <Link
        href="/dashboard/profile"
        className="bg-primary-400 text-md mx-2 flex aspect-square w-8 items-center justify-center truncate rounded-full text-center font-bold text-black md:hidden"
      >
        {user?.email[0].toUpperCase()}
      </Link>
      <SignOutButton />
    </div>
  );
}
