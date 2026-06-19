import appConfig from '@/lib/config'
import BrowseCoursesContent from './BrowseCoursesContent'

async function getCourses() {
  try {
    const response = await fetch(
      `${appConfig.api.baseURL}/student/courses?page=1&limit=6`,
      {
        next: { revalidate: 3600 },
      }
    )
    if (!response.ok) throw new Error('Failed to fetch courses')
    const data = await response.json()
    return data.data.courses || []
  } catch (error) {
    console.log('Error fetching browse courses:', error)
    return []
  }
}

export default async function BrowseCoursesSection() {
  const courses = await getCourses()

  if (courses.length === 0) {
    return null
  }

  console.log("Courses", courses);

  return <BrowseCoursesContent courses={courses} />
}
