import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Timestamp } from '@/components/Timestamp';
import { FooterLinks } from '@/components/FooterLinks';
import { getSession } from '@/lib/auth';
import { Suspense } from 'react';

async function MainButton() {
  const session = await getSession();

  if (!session || !session.isActiveSession) {
    return (
      <Link href="/signin">
        <Button variant="outline">Sign in</Button>
      </Link>
    );
  }

  return (
    <Link href="/dashboard">
      <Button variant="outline">Go To Dashboard</Button>
    </Link>
  );
}

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-subtle bg-base border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-primary text-2xl font-black">
              Centralized
            </Link>
            <nav className="hidden gap-6 md:flex">
              <Link href="/features" className="text-md link-animation">
                Features
              </Link>
              <Link href="/pricing" className="text-md link-animation">
                Pricing
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-4">
              <Suspense
                fallback={
                  <Link href="/signup">
                    <Button>Sign up</Button>
                  </Link>
                }
              >
                <MainButton />
              </Suspense>

              <Link href="/signup">
                <Button>Sign up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      <div className="flex-1">{children}</div>
      <footer className="border-subtle bg-base border-t">
        <div className="container mx-auto px-4 py-8">
          <FooterLinks />
          <p className="text-center text-sm text-gray-600">
            &copy; <Timestamp /> Centralized. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
