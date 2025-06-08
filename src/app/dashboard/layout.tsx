import { Suspense } from 'react';
import { Navigation } from '@/components/Navigation';
import { DashboardSkeleton } from '@/components/DashboardSkeleton';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="min-h-screen pt-0 pl-16 md:pl-52 lg:pl-64">
        <div className="mx-auto max-w-6xl p-4 md:p-8">
          <Suspense fallback={<DashboardSkeleton />}>{children}</Suspense>
        </div>
      </main>
    </div>
  );
}
