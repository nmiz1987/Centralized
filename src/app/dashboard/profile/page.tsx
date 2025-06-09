import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser, getLinks } from '@/lib/dal';
import { UserInfo } from '@/components/UserInfo';
import { ResetPasswordForm } from '@/components/ResetPasswordForm';

export default async function ProfilePage() {
  const user = await getCurrentUser();
  const links = await getLinks();
  if (!user) {
    redirect('/signin');
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Link href="/dashboard" className="mb-6 inline-flex items-center text-sm text-gray-400 hover:text-gray-200">
        <ArrowLeftIcon size={16} className="mr-1" />
        Back to Dashboard
      </Link>

      <div className="space-y-8">
        <UserInfo user={user} links={links} />

        <ResetPasswordForm />
      </div>
    </div>
  );
}
