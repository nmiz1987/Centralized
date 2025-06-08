import Link from 'next/link';

export default async function PricingPage() {
  return (
    <main className="container mx-auto min-h-screen">
      <h1 className="mt-14 text-center text-4xl font-extrabold text-white sm:text-5xl md:mt-16 md:text-6xl">Pricing</h1>
      <p className="mt-10 px-4 text-center text-lg text-balance text-gray-300">No cost, no hidden fees, no subscriptions. FREE forever.</p>
      <p className="mt-10 px-4 text-center text-lg text-balance text-gray-300">
        Want the code and host it yourself?{' '}
        <Link href="https://github.com/nmiz1987/centralized" className="link-animation text-md text-gray-300 underline">
          View the source code on GitHub
        </Link>
      </p>
    </main>
  );
}
