import { Suspense } from 'react';
import { Navigation } from '@/components/Navigation';
import { DashboardSkeleton } from '@/components/DashboardSkeleton';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col sm:flex-row">
      <Navigation />
      <main className="min-h-screen w-full">
        <div className="mx-auto max-w-6xl p-4 md:p-8">
          <Suspense fallback={<DashboardSkeleton />}>{children}</Suspense>
        </div>
      </main>
    </div>
  );
}
