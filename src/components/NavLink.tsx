import { cn } from '@/lib/utils';
import Link from 'next/link';

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

export function NavLink({ href, icon, label, isActive }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex items-center rounded-md px-2 py-2 text-sm font-medium',
        isActive
          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200'
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
      )}
    >
      <span className="mr-3 text-gray-500 dark:text-gray-400">{icon}</span>
      <span className="hidden md:inline">{label}</span>
    </Link>
  );
}
