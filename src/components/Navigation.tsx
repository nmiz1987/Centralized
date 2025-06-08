import Link from 'next/link';
import { LogInIcon } from 'lucide-react';
import { UserEmail } from './UserEmail';
import { Suspense } from 'react';
import { NavLink } from './NavLink';
import { UsersCategories } from './UsersCategories';

export async function Navigation() {
  return (
    <aside className="border-subtle bg-elevated fixed inset-y-0 left-0 flex w-16 flex-col border-r px-2 py-4 md:w-52 md:px-4 lg:w-64">
      <div className="mb-8 flex items-center justify-center px-2 md:justify-start">
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          <span className="text-primary hidden md:inline">Centralized</span>
          <span className="text-primary md:hidden">C</span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col space-y-1">
        <div className="hidden md:inline">
          <Suspense fallback={<div>Loading categories...</div>}>
            <UsersCategories />
          </Suspense>
        </div>
      </nav>

      <div className="border-subtle border-t pt-4">
        <Suspense fallback={<NavLink href="/signin" icon={<LogInIcon size={20} />} label="Sign In" />}>
          <UserEmail />
        </Suspense>
      </div>
    </aside>
  );
}
