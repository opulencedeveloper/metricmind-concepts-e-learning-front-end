import type { Metadata } from 'next'
import AllCoursesPage from '@/components/landing/AllCoursesPage'

export const metadata: Metadata = {
  title: 'Browse Courses - MetricMind',
  description: 'Search and discover courses by category, skill level, and topic. Find the perfect course to advance your learning.',
}

export default function AllCoursesRoute() {
  return <AllCoursesPage />
}
