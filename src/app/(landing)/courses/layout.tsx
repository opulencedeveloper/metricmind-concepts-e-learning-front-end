import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'All Courses - MetricMind',
  description: 'Explore our collection of courses by category and skill level. Find the perfect course to advance your learning.',
}

export default function AllCoursesLayout({
  children,
}: {
  children: ReactNode
}) {
  return <>{children}</>
}
