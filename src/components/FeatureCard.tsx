export function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-secondary rounded-lg border border-gray-700 p-6 shadow-sm">
      <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
