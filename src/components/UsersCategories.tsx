import { getCategories } from '@/lib/dal';
import { PlusIcon, Bookmark } from 'lucide-react';
import { CategoryLink } from './CategoryLink';

export async function UsersCategories() {
  const categories = await getCategories();

  return (
    <div className="space-y-1">
      {!categories?.length ? (
        <CategoryLink href="/links/new" icon={<PlusIcon size={20} />} label="New Link" />
      ) : (
        categories.map(category => (
          <CategoryLink key={category} href={`/dashboard?category=${category}`} icon={<Bookmark size={20} />} label={category} />
        ))
      )}
    </div>
  );
}
