import { getCurrentUser } from '@/lib/dal';
import { UserIcon } from 'lucide-react';
import { SignOutButton } from './SignOutButton';

export async function UserEmail() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-1">
      <div className="hidden items-center justify-start px-2 py-2 md:flex">
        <UserIcon size={20} className="mr-2 text-gray-500" />
        <span className="hidden truncate text-sm text-gray-300 md:inline">{user?.email}</span>
      </div>
      <div className="bg-primary-400 flex aspect-square items-center justify-center truncate rounded-full text-center text-xl font-bold text-black md:hidden">
        {user?.email[0].toUpperCase()}
      </div>
      <SignOutButton />
    </div>
  );
}
