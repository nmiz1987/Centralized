import { redirect } from 'next/navigation';

import { getCategories, getCurrentUser } from '@/lib/dal';
import { LinkForm } from './LinkForm';

export async function NewLink() {
  const user = await getCurrentUser();
  const categories = await getCategories();

  if (!user) {
    redirect('/signin');
  }

  return <LinkForm categories={categories} />;
}
