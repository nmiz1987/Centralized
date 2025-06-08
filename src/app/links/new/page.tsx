import { NewLink } from '@/components/NewLink';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

export default async function NewLinkPage() {
  return (
    <div className="mx-auto max-w-3xl p-4 md:p-8">
      <Link href="/dashboard" className="mb-6 inline-flex items-center text-sm text-gray-400 hover:text-gray-200">
        <ArrowLeftIcon size={16} className="mr-1" />
        Back to Dashboard
      </Link>

      <h1 className="mb-6 text-2xl font-bold">Create New Link</h1>

      <div className="bg-elevated border-default rounded-lg border p-6 shadow-sm">
        <Suspense fallback={<div>Loading...</div>}>
          <NewLink />
        </Suspense>
      </div>
    </div>
  );
}
