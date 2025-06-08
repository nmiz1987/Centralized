import { FeatureCard } from '@/components/FeatureCard';

export default async function FeaturesPage() {
  return (
    <main className="container mx-auto min-h-screen">
      <h1 className="mt-14 text-center text-4xl font-extrabold text-white sm:text-5xl md:mt-16 md:text-6xl">Features</h1>
      <p className="mt-10 px-4 text-center text-lg text-balance text-gray-300">
        Discover how Centralized can help you manage your lists more efficiently.
      </p>
      <div className="mt-10 mb-16 grid grid-cols-1 gap-8 px-4 sm:px-0 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard title="Notes Tracking" description="Create, assign, and track notes with ease. Set priorities, due dates, and statuses." />
        <FeatureCard
          title="Intuitive UI"
          description="A clean, modern interface that makes project management a breeze. No clutter, just what you need to get work done."
        />
        <FeatureCard
          title="Powerful Search"
          description="Find anything instantly with our powerful search. Filter by assignee, status, priority, and more."
        />
        <FeatureCard title="Free to use" description="No hidden fees or subscriptions. Use Centralized for free forever." />
        <FeatureCard title="Privacy focused" description="Your data is yours. We don't collect any data from you." />
        <FeatureCard title="Open source" description="Centralized is open source. You can view the source code on GitHub." />
      </div>
    </main>
  );
}
