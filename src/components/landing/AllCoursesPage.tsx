import { Suspense } from 'react'
import appConfig from '@/lib/config'
import AllCoursesContent from './AllCoursesContent'
import LoadingState from '@/components/ui/LoadingState'

async function getCategories() {
  try {
    const response = await fetch(
      `${appConfig.api.baseURL}/student/courses/categories`,
      {
        next: { revalidate: 3600 },
      }
    )
    if (!response.ok) throw new Error('Failed to fetch categories')
    const data = await response.json()
    return data.data?.categories || []
  } catch (error) {
    console.log('Error fetching categories:', error)
    return []
  }
}

async function getInitialCourses() {
  try {
    const response = await fetch(
      `${appConfig.api.baseURL}/student/courses?page=1&limit=12`,
      {
        next: { revalidate: 300 },
      }
    )
    if (!response.ok) throw new Error('Failed to fetch courses')
    const data = await response.json()
    return {
      courses: data.data?.courses || [],
      total: data.data?.pagination?.total || 0,
    }
  } catch (error) {
    console.log('Error fetching initial courses:', error)
    return { courses: [], total: 0 }
  }
}

export default async function AllCoursesPage() {
  const [categories, initialData] = await Promise.all([
    getCategories(),
    getInitialCourses(),
  ])

  return (
    <Suspense fallback={<LoadingState />}>
      <AllCoursesContent
        categories={categories}
        initialCourses={initialData.courses}
        initialTotal={initialData.total}
      />
    </Suspense>
  )
}
