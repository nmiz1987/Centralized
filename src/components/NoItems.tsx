import Link from 'next/link';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NoItems() {
  return (
    <div className="border-default bg-high flex flex-col items-center justify-center rounded-lg border p-8 py-12 text-center">
      <h3 className="mb-2 text-lg font-medium">No links found</h3>
      <p className="mb-6 text-gray-400">Get started by storing your first link.</p>
      <Link href="/links/new">
        <Button>
          <span className="flex items-center">
            <PlusIcon size={18} className="mr-2" />
            Create new link
          </span>
        </Button>
      </Link>
    </div>
  );
}
