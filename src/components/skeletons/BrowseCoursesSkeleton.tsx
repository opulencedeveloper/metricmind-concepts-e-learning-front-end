export function BrowseCoursesSkeleton() {
  return (
    <section className="py-20 md:py-24 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-12 bg-gray-200 rounded-lg w-1/3 mb-4 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded-lg w-1/2 mb-12 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_: unknown, i: number) => (
            <div key={i} className="space-y-4">
              <div className="bg-gray-100 rounded-2xl h-64 animate-pulse" />
              <div className="h-6 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-4 bg-gray-200 rounded-lg w-3/4 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
