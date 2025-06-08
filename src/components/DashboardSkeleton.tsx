export function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton: simulating the page title and New Link button */}
      <div className="mb-8 flex items-center justify-between">
        <div className="h-8 w-32 rounded bg-gray-600" />
        <div className="h-10 w-36 rounded bg-gray-600" />
      </div>
      {/* Skeleton for links list */}
      <div className="border-default bg-high overflow-hidden rounded-lg border shadow-sm">
        {/* Header row skeleton */}
        <div className="bg-elevated border-default grid grid-cols-12 gap-4 border-b px-6 py-3">
          <div className="col-span-5 h-4 rounded bg-gray-600" />
          <div className="col-span-2 h-4 rounded bg-gray-600" />
          <div className="col-span-2 h-4 rounded bg-gray-600" />
          <div className="col-span-3 h-4 rounded bg-gray-600" />
        </div>
        {/* Link row skeletons */}
        <div className="divide-default divide-y">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="grid grid-cols-12 items-center gap-4 px-6 py-4">
              <div className="col-span-5 h-4 rounded bg-gray-600" />
              <div className="col-span-2 h-4 rounded bg-gray-600" />
              <div className="col-span-2 h-4 rounded bg-gray-600" />
              <div className="col-span-3 h-4 rounded bg-gray-600" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
