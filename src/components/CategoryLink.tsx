'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface CategoryLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

export function CategoryLink({ href, icon, label }: CategoryLinkProps) {
  const currentCategory = useSearchParams().get('category');

  const isActive = currentCategory === label;

  const clickHandler = isActive ? '/dashboard' : href;

  return (
    <Link
      href={clickHandler}
      className={cn(
        'group flex items-center rounded-md px-2 py-2 text-sm font-medium',
        isActive ? 'bg-gray-700' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
      )}
    >
      <span className="mr-3 text-gray-500 dark:text-gray-400">{icon}</span>
      <span className="hidden md:inline">{label}</span>
    </Link>
  );
}
