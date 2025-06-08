import { LinkForm } from '@/components/LinkForm';
import { getCategories, getLink } from '@/lib/dal';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EditLinkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const link = await getLink(parseInt(id));
  const categories = await getCategories();

  if (!link) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl p-4 md:p-8">
      <Link href={`/links/${id}`} className="mb-6 inline-flex items-center text-sm text-gray-400 hover:text-gray-200">
        <ArrowLeftIcon size={16} className="mr-1" />
        Back to Link
      </Link>

      <h1 className="mb-6 text-2xl font-bold">Edit Link</h1>

      <div className="bg-elevated border-default rounded-lg border p-6 shadow-sm">
        <LinkForm categories={categories ?? []} link={link} isEditing />
      </div>
    </div>
  );
}
