import { getLinks } from '@/lib/dal';
import Link from 'next/link';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NoItems } from '@/components/NoItems';
import { ListItems } from '@/components/ListItems';
import { SearchForm } from '@/components/SearchForm';

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ category: string; search: string }> }) {
  const params = await searchParams;
  const currentCategory = params?.category;
  const searchQuery = params?.search;
  const links = await getLinks(currentCategory, searchQuery);

  return (
    <div>
      <header className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">All Links</h1>
          <Link href="/links/new">
            <Button>
              <span className="flex items-center">
                <PlusIcon size={18} className="mr-2" />
                New Link
              </span>
            </Button>
          </Link>
        </div>
        <SearchForm />
      </header>

      {links.length > 0 ? <ListItems links={links} /> : <NoItems />}
    </div>
  );
}
