import appConfig from '@/lib/config'
import CategoriesContent from './CategoriesContent'

interface CategoriesResponse {
  data: {
    categories: string[]
  }
}

async function getCategories() {
  try {
    const response = await fetch(`${appConfig.api.baseURL}/student/courses/categories`, {
      next: { revalidate: 3600 }
    })

    if (!response.ok) throw new Error('Failed to fetch categories')
    return (await response.json()) as CategoriesResponse
  } catch (error) {
    console.log('Error fetching categories:', error)
    return null
  }
}

export default async function CategoriesSection() {
  const data = await getCategories()
  const categories = data?.data.categories || []

  if (categories.length === 0) {
    return null
  }

  return <CategoriesContent categories={categories} />
}
