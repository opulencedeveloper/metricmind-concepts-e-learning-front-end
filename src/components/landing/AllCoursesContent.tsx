'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import appConfig from '@/lib/config'
import CourseCard from '@/components/courses/CourseCard'
import SearchBar from '@/components/landing/SearchBar'
import CategoryFilter from '@/components/landing/CategoryFilter'
import ErrorUI from '@/components/error/ErrorUI'
import { useHttp } from '@/hooks/useHttp'
import { Course, SearchPageContentProps } from '@/types/course'
import { HttpMethod } from '@/types/http'

export default function AllCoursesContent({
  categories,
  initialCourses = [],
  initialTotal = 0
}: SearchPageContentProps) {
  const searchParams = useSearchParams()
  const { isLoading, sendHttpRequest, error } = useHttp()
  const [searchQuery, setSearchQuery] = useState('')
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [retryTrigger, setRetryTrigger] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCourses, setTotalCourses] = useState(initialTotal)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasFetched, setHasFetched] = useState(initialCourses.length > 0)
  const isInitialMount = useRef(true)

  const handleRetry = () => {
    setRetryTrigger((prev) => prev + 1)
  }

  const hasMoreCourses = courses.length < totalCourses
  const coursesPerPage = 12

  // Initialize category from URL params
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      setSelectedCategory(decodeURIComponent(categoryParam))
    }
  }, [searchParams])

  // Reset pagination when search or category changes
  useEffect(() => {
    setCurrentPage(1)
    setTotalCourses(0)
  }, [searchQuery, selectedCategory])

  // Fetch courses when category, search query, or retry changes
  useEffect(() => {
    const isMounted = { current: true }

    const fetchCourses = async (page: number = 1, append: boolean = false) => {
      if (!isMounted.current) return

      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', coursesPerPage.toString())

      // Validate search query - must be 2+ characters (backend requirement)
      const trimmedQuery = searchQuery.trim()
      const hasValidSearchQuery = trimmedQuery.length >= 2
      const hasPartialQuery = trimmedQuery.length > 0 && trimmedQuery.length < 2

      // Don't fetch if query is too short (1 character)
      if (hasPartialQuery) {
        return
      }

      // Use search endpoint if search query exists, otherwise use browse endpoint with filters
      let endpoint = '/student/courses'

      if (hasValidSearchQuery) {
        endpoint = '/student/courses/search'
        params.set('query', trimmedQuery)
        // Search within selected category for refined results
        if (selectedCategory) {
          params.append('category', selectedCategory)
        }
      } else if (selectedCategory) {
        params.append('category', selectedCategory)
      }

      console.log(`📡 Fetching courses from ${endpoint}...`)

      await sendHttpRequest({
        requestConfig: {
          method: HttpMethod.GET,
          url: `${endpoint}?${params.toString()}`,
          baseURL: appConfig.api.baseURL,
        },
        successRes: (res: any) => {
          if (!isMounted.current) return
          const coursesData = res.courses || []
          const pagination = res.pagination

          console.log('📚 Courses Data:', coursesData)
          console.log('📊 Pagination:', pagination)

          if (append) {
            setCourses((prev) => [...prev, ...coursesData])
          } else {
            setCourses(coursesData)
          }

          if (pagination?.total) {
            setTotalCourses(pagination.total)
          }
          setIsLoadingMore(false)
          setHasFetched(true)
        },
        errorRes: () => {
          if (!isMounted.current) return
          console.log('❌ Courses API Error')
          if (!append) {
            setCourses([])
          }
          setIsLoadingMore(false)
        },
      })
    }

    // Skip initial fetch if we have initial courses from server
    if (isInitialMount.current) {
      isInitialMount.current = false
      return () => {
        isMounted.current = false
      }
    }

    if (currentPage === 1) {
      fetchCourses(1, false)
    }

    return () => {
      isMounted.current = false
    }
  }, [selectedCategory, searchQuery, sendHttpRequest, retryTrigger, currentPage, coursesPerPage])

  const handleLoadMore = async () => {
    setIsLoadingMore(true)
    const nextPage = currentPage + 1

    const params = new URLSearchParams()
    params.append('page', nextPage.toString())
    params.append('limit', coursesPerPage.toString())

    const trimmedQuery = searchQuery.trim()
    const hasValidSearchQuery = trimmedQuery.length >= 2
    let endpoint = '/student/courses'

    if (hasValidSearchQuery) {
      endpoint = '/student/courses/search'
      params.set('query', trimmedQuery)
      if (selectedCategory) {
        params.append('category', selectedCategory)
      }
    } else if (selectedCategory) {
      params.append('category', selectedCategory)
    }

    await sendHttpRequest({
      requestConfig: {
        method: HttpMethod.GET,
        url: `${endpoint}?${params.toString()}`,
        baseURL: appConfig.api.baseURL,
      },
      successRes: (res: any) => {
        const coursesData = res.courses || []
        setCourses((prev) => [...prev, ...coursesData])
        setCurrentPage(nextPage)
        setIsLoadingMore(false)
      },
      errorRes: () => {
        setIsLoadingMore(false)
      },
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-15 pb-12"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6 tracking-tight">
            Learn Something New
          </h1>
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
            Explore courses across all topics. Find exactly what you're looking for.
          </p>
        </div>
      </motion.div>

      {/* Search Bar */}
      <SearchBar onSearchChange={setSearchQuery} placeholder="Search courses, skills, topics..." />

      {/* Category Filter - Smart filtering with search integration */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={(category) => {
          console.log('📂 Category selected:', category)
          setSelectedCategory(category)
        }}
      />

      {/* Courses Grid - Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {error ? (
          <ErrorUI message={error} onRetry={handleRetry} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full"
          >
            {(isLoading || !hasFetched) ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="h-80 bg-gray-200 rounded-2xl"
              />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gray-100 rounded-full">
                <Search className="h-8 w-8 text-gray-700" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              No courses found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto font-light">
              Try a different search or explore other categories to find what you're looking for.
            </p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {courses.map((course, index) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                >
                  <CourseCard course={course} variant="browse" index={index} />
                </motion.div>
              ))}
            </div>

            {/* Load More Button - Apple Style */}
            {hasMoreCourses && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex justify-center"
              >
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="px-8 py-3 text-gray-900 font-medium rounded-full border border-gray-200 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isLoadingMore ? 'Loading...' : 'Load More'}
                </button>
              </motion.div>
            )}
          </div>
        )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
