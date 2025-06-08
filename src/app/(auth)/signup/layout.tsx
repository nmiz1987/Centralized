import Link from 'next/link';

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-subtle bg-base border-b">
        <div className="container mx-auto py-4 max-sm:px-4">
          <Link href="/" className="text-primary text-2xl font-black">
            Centralized
          </Link>
        </div>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}
