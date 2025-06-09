import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';

export default async function ProfilePage() {
  return (
    <div>
      <Link href="/dashboard" className="mb-6 inline-flex items-center text-sm text-gray-400 hover:text-gray-200">
        <ArrowLeftIcon size={16} className="mr-1" />
        Back to Dashboard
      </Link>
      <p>Profile</p>
    </div>
  );
}
