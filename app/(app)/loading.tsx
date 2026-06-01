export default function AppLoading() {
  return (
    <div className="mx-auto max-w-7xl p-6 lg:p-8">
      {/* Header block */}
      <div className="mb-8 space-y-3">
        <div className="skeleton-shimmer h-4 w-40 rounded-md" />
        <div className="skeleton-shimmer h-9 w-72 rounded-lg" />
        <div className="skeleton-shimmer h-4 w-96 max-w-full rounded-md" />
      </div>

      {/* Grid of 3 cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="sinad-card space-y-4 p-6">
            <div className="flex items-center gap-3">
              <div className="skeleton-shimmer h-10 w-10 rounded-2xl" />
              <div className="skeleton-shimmer h-4 w-32 rounded-md" />
            </div>
            <div className="skeleton-shimmer h-9 w-20 rounded-lg" />
            <div className="skeleton-shimmer h-3 w-24 rounded-md" />
            <div className="border-t border-slate-100 pt-3">
              <div className="skeleton-shimmer h-3 w-28 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Wide card */}
      <div className="rounded-3xl border border-blue-200 bg-blue-50/60 p-6 lg:p-8">
        <div className="max-w-3xl space-y-4">
          <div className="skeleton-shimmer h-7 w-56 rounded-lg" />
          <div className="skeleton-shimmer h-4 w-full max-w-md rounded-md" />
          <div className="space-y-3 pt-2">
            <div className="skeleton-shimmer h-4 w-72 max-w-full rounded-md" />
            <div className="skeleton-shimmer h-4 w-64 max-w-full rounded-md" />
          </div>
          <div className="skeleton-shimmer h-12 w-48 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
