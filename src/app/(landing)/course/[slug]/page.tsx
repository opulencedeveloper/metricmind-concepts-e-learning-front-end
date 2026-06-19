import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import appConfig from '@/lib/config'
import CourseDetailPage from '@/components/landing/CourseDetailPage'
import { Course, CourseDetailRouteProps } from '@/types/course'

async function getCourseData(slug: string) {
  try {
    const response = await fetch(
      `${appConfig.api.baseURL}/student/courses/${slug}`,
      {
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.log('Error fetching course:', error)
    return null
  }
}

export async function generateMetadata(
  { params }: CourseDetailRouteProps
): Promise<Metadata> {
  const resolvedParams = await params
  const courseData = await getCourseData(resolvedParams.slug)

  if (!courseData) {
    return {
      title: 'Course Not Found',
    }
  }

  const course = courseData.course as Course

  return {
    title: `${course.title} - Learn on MetricMind`,
    description: course.description.substring(0, 160),
    keywords: [
      course.category,
      course.level,
      course.instructor,
      'online course',
      'learning',
    ],
    openGraph: {
      title: course.title,
      description: course.description,
      images: course.thumbnail ? [{ url: course.thumbnail }] : [],
      type: 'website',
    },
  }
}

export default async function CourseDetailRoute({
  params,
}: CourseDetailRouteProps) {
  const resolvedParams = await params
  const courseData = await getCourseData(resolvedParams.slug)

  if (!courseData) {
    notFound()
  }

  const { course, sections } = courseData

  return <CourseDetailPage course={course} sections={sections} />
}
