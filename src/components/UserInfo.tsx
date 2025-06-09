import { Link, User } from '@/db/schema';
import { UserIcon, LinkIcon } from 'lucide-react';

interface UserInfoProps {
  user: User;
  links: Link[];
}

export function UserInfo({ user, links }: UserInfoProps) {
  return (
    <div className="bg-elevated rounded-lg border border-gray-700 p-6">
      <h2 className="mb-4 text-xl font-semibold">Profile Information</h2>
      <div className="space-y-4">
        <div className="flex items-center text-gray-300">
          <UserIcon size={20} className="mr-2 text-gray-500" />
          <span>Email: {user.email}</span>
        </div>
        <div className="flex items-center text-gray-300">
          <LinkIcon size={20} className="mr-2 text-gray-500" />
          <span>Total Links: {links.length}</span>
        </div>
      </div>
    </div>
  );
}
