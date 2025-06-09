import Link from 'next/link';
import { LogInIcon } from 'lucide-react';
import { UserEmail } from './UserEmail';
import { Suspense } from 'react';
import { NavLink } from './NavLink';
import { UsersCategories } from './UsersCategories';

export async function Navigation() {
  return (
    <aside className="border-subtle bg-elevated sticky top-0 flex w-full flex-row border-b px-2 py-4 sm:flex-col sm:border-r md:w-52 md:px-4 lg:w-64">
      <div className="flex items-center justify-center px-2 sm:mb-8 md:justify-start">
        <Link href="/dashboard" className="text-xl font-bold tracking-tight text-white">
          <span className="text-primary">Centralized</span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col space-y-1">
        <div className="hidden md:inline">
          <Suspense fallback={<div>Loading categories...</div>}>
            <UsersCategories />
          </Suspense>
        </div>
      </nav>

      <div className="sm:border-subtle sm:border-t sm:pt-4">
        <Suspense fallback={<NavLink href="/signin" icon={<LogInIcon size={20} />} label="Sign In" />}>
          <UserEmail />
        </Suspense>
      </div>
    </aside>
  );
}
