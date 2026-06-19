export function FeaturedCoursesSkeleton() {
  return (
    <section className="py-12 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-12 bg-gray-200 rounded-lg w-1/3 mb-4 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded-lg w-1/2 mb-8 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_: unknown, i: number) => (
            <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  )
}
