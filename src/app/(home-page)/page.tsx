import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function LandingPage() {
  return (
    <main className="container mx-auto min-h-screen">
      <h1 className="mt-14 px-4 text-center text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:mt-16 md:text-6xl">
        List tracking <br className="hidden sm:block" />
        <span className="text-purple-400">simplified</span>
      </h1>
      <p className="mt-10 px-4 text-center text-lg text-balance text-gray-300">
        A minimal and elegant list tracking tool for you. Store your lists, don&apos;t forget them.
      </p>
      <div className="mt-14 flex justify-center">
        <Link href="/signup">
          <Button size="lg">Get Started</Button>
        </Link>
      </div>
    </main>
  );
}
