import { getLink } from '@/lib/dal';
import { formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon, Edit2Icon } from 'lucide-react';
import DeleteLinkButton from '@/components/DeleteLinkButton';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/Icon';

export default async function LinkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const link = await getLink(parseInt(id));

  if (!link) {
    notFound();
  }

  const { category, icon, isRecommended, name, url, description, createdAt, updatedAt } = link;

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8">
      <div className="mb-8">
        <Link href="/dashboard" className="mb-4 inline-flex items-center text-sm text-gray-400 hover:text-gray-200">
          <ArrowLeftIcon size={16} className="mr-1" />
          Back to links
        </Link>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <span className="flex items-center gap-2">
            <Icon alt={name} icon={icon ?? ''} />
            <h1 className="text-3xl font-bold">{name}</h1>
          </span>
          <div className="flex items-center space-x-2">
            <Link href={`/links/${id}/edit`}>
              <Button variant="outline" size="sm">
                <span className="flex items-center">
                  <Edit2Icon size={16} className="mr-1" />
                  Edit
                </span>
              </Button>
            </Link>
            <DeleteLinkButton id={parseInt(id)} />
          </div>
        </div>
      </div>

      <div className="bg-elevated border-default mb-8 rounded-lg border p-6 shadow-sm">
        {description ? (
          <div className="prose-invert max-w-none">
            <p className="whitespace-pre-line">{description}</p>
          </div>
        ) : (
          <p className="text-gray-500 italic">No description provided.</p>
        )}
      </div>

      <div className="bg-elevated border-default rounded-lg border p-6 shadow-sm">
        <h2 className="mb-2 text-lg font-medium">Details</h2>
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="mb-1 text-sm font-medium text-gray-500">Category</p>
            <p className="block max-w-full truncate overflow-hidden whitespace-nowrap">{category}</p>
          </div>

          <div className="">
            <p className="mb-1 text-sm font-medium text-gray-500">URL</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-animation block max-w-full truncate overflow-hidden whitespace-nowrap"
            >
              {url}
            </a>
          </div>
        </div>
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="mb-1 text-sm font-medium text-gray-500">Is Recommended</p>
            <p>{isRecommended ? 'Yes' : 'No'}</p>
          </div>

          <div>
            <p className="mb-1 text-sm font-medium text-gray-500">Created</p>
            <p>{formatRelativeTime(new Date(createdAt))}</p>
          </div>
        </div>
      </div>
      <div className="mt-8 mb-6 flex flex-wrap gap-3">
        <div className="text-sm text-gray-500">Created {formatRelativeTime(new Date(createdAt))}</div>
        {updatedAt !== createdAt && <div className="text-sm text-gray-500">Updated {formatRelativeTime(new Date(updatedAt))}</div>}
      </div>
    </div>
  );
}
