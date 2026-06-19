'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Star, ArrowRight, Heart } from 'lucide-react'
import { getAuthToken } from '@/lib/utils/auth'
import { useHttp } from '@/hooks/useHttp'
import { useWishlist } from '@/hooks/useWishlist'
import { HttpMethod } from '@/types/http'
import SmartImage from '@/components/common/SmartImage'
import PlayButton from './PlayButton'
import VideoModal from './VideoModal'
import { CourseCardProps } from '@/types/course'
import { CourseCardVariant } from '@/enums/course'
import { getCategoryLabel } from '@/enums/category'

export default function CourseCard({
  course,
  variant = CourseCardVariant.Featured,
  variants,
  index = 999,
}: CourseCardProps & { index?: number }) {
  // First 6 cards are typically above the fold in a 3-column grid
  const isAboveFold = index < 6
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { sendHttpRequest } = useHttp()
  const { isInWishlist, toggleWishlistItem } = useWishlist()

  useEffect(() => {
    setIsMounted(true)
    const token = getAuthToken()
    setIsAuthenticated(!!token)
  }, [])

  const handlePlayClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (course.previewVideoUrl) {
        setIsVideoOpen(true)
      }
    },
    [course.previewVideoUrl]
  )

  const handleCloseVideo = useCallback(() => {
    setIsVideoOpen(false)
  }, [])

  const handleWishlistToggle = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      console.log('[WISHLIST] Button clicked')
      e.preventDefault()
      e.stopPropagation()

      console.log('[WISHLIST] isAuthenticated:', isAuthenticated)
      console.log('[WISHLIST] isMounted:', isMounted)

      if (!isAuthenticated || !isMounted) {
        console.log('[WISHLIST] Early return - not authenticated or not mounted')
        return
      }

      // Optimistic update via Redux
      toggleWishlistItem(course)
      console.log('[WISHLIST] Optimistic update: toggled wishlist')

      console.log('[WISHLIST] Sending request for course:', course._id)
      sendHttpRequest({
        requestConfig: {
          method: HttpMethod.POST,
          url: '/student/wishlist',
          body: { courseId: course._id },
          isAuth: true,
        },
        successRes: () => {
          console.log('[WISHLIST] Request successful')
        },
        errorRes: (err: any) => {
          console.log('[WISHLIST] Request failed:', err)
          // Revert optimistic update on error
          toggleWishlistItem(course)
          console.log('[WISHLIST] Reverted wishlist state')
        },
      })
    },
    [course, isAuthenticated, isMounted, toggleWishlistItem, sendHttpRequest]
  )

  if (variant === CourseCardVariant.Browse) {
    return (
      <>
        <motion.div
          variants={variants}
          whileHover={{ y: -5 }}
          className="group h-full"
        >
          <Link href={`/course/${course.slug}`} className="block h-full">
            <div className="relative h-full rounded-2xl overflow-hidden bg-gray-100 flex flex-col shadow-md border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300">
              {/* Image area */}
              <div className="relative h-48 overflow-hidden">
                {course.thumbnail && (
                  <SmartImage
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    useSkeleton
                    eager={isAboveFold}
                  />
                )}

                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent opacity-100 group-hover:opacity-90 transition-opacity duration-300" />

                <PlayButton
                  onClick={handlePlayClick}
                  ariaLabel={`Play preview for ${course.title}`}
                  show={!!course.previewVideoUrl}
                />

                {course.category && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="absolute top-0 left-0 z-10"
                  >
                    <div className="inline-flex px-3 py-1 bg-white/20 backdrop-blur-md rounded-br-2xl text-xs font-semibold text-white border border-white/30">
                      {getCategoryLabel(course.category)}
                    </div>
                  </motion.div>
                )}

                {isMounted && isAuthenticated && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    onClick={handleWishlistToggle}
                    className={`absolute top-3 right-3 z-10 p-2 rounded-lg backdrop-blur-md border transition-all ${
                      isInWishlist(course._id)
                        ? 'bg-red-500/30 border-red-400/50'
                        : 'bg-white/20 border-white/30 hover:bg-white/30'
                    }`}
                    aria-label="Add to wishlist"
                  >
                    <Heart className={`h-4 w-4 ${isInWishlist(course._id) ? 'fill-red-300 text-red-300' : 'text-white'}`} />
                  </motion.button>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-between p-5 md:p-6">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-gray-800 transition-colors">
                    {course.title}
                  </h3>

                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-gray-500">
                      By {course.instructor}
                    </p>
                    {course.rating && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-1"
                      >
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-semibold text-gray-900">{course.rating.toFixed(1)}</span>
                        <span className="text-xs text-gray-500">({(course.reviewCount || 0).toLocaleString()})</span>
                      </motion.div>
                    )}
                  </div>

                  {course.description && (
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {course.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500 mb-1 capitalize">{course.level}</p>
                    <p className="text-lg font-bold text-gray-900">
                      {course.currency} {course.price}
                    </p>
                  </div>
                  <motion.div whileHover={{ x: 4 }} whileTap={{ x: -2 }}>
                    <div className="p-3 bg-gray-900 rounded-full text-white hover:bg-gray-800 transition-colors">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {isVideoOpen && course.previewVideoUrl && (
          <VideoModal
            videoUrl={course.previewVideoUrl}
            courseTitle={course.title}
            onClose={handleCloseVideo}
          />
        )}
      </>
    )
  }

  // Featured variant (default)
  return (
    <>
      <motion.div
        variants={variants}
        whileHover={{ y: -5 }}
        className="group h-full"
      >
        <div className="h-full bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 flex flex-col">
          <div className="relative overflow-hidden bg-linear-to-br from-gray-700 via-gray-800 to-purple-600 aspect-video group">
            <Link href={`/course/${course.slug}`} className="absolute inset-0">
              {course.thumbnail ? (
                <SmartImage
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  containerClassName="w-full h-full"
                  eager={isAboveFold}
                />
              ) : (
                <div className="w-full h-full opacity-20" />
              )}
            </Link>

            <PlayButton
              onClick={handlePlayClick}
              ariaLabel={`Play preview for ${course.title}`}
              show={!!course.previewVideoUrl}
            />

            {isMounted && isAuthenticated && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                onClick={handleWishlistToggle}
                className={`absolute top-3 right-3 w-max p-2.5 rounded-full backdrop-blur-md border transition-all ${
                  isInWishlist(course._id)
                    ? 'bg-red-500/40 border-red-400/60 shadow-lg'
                    : 'bg-white/20 border-white/40 hover:bg-white/30'
                }`}
                aria-label="Add to wishlist"
              >
                <Heart className={`h-5 w-5 ${isInWishlist(course._id) ? 'fill-red-300 text-red-300' : 'text-white'}`} />
              </motion.button>
            )}
          </div>

          <Link href={`/course/${course.slug}`} className="p-4 flex-1 flex flex-col cursor-pointer">
            <div className="flex-1 flex flex-col">
              <h3 className="text-base font-semibold text-gray-900 line-clamp-1 group-hover:text-gray-800 transition-colors mb-2">
                {course.title}
              </h3>

              <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                {course.description}
              </p>

              <p className="text-xs text-gray-500 mb-auto">
                By {course.instructor}
              </p>
            </div>

            <div className="mt-4 space-y-2 border-t border-gray-100 pt-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-gray-900">
                    {course.rating?.toFixed(1) || '0.0'}
                  </span>
                  <span className="text-gray-500 text-xs">
                    ({(course.reviewCount || 0).toLocaleString()})
                  </span>
                </div>
                <span className="text-gray-600">{course.totalDuration}h</span>
              </div>

              <p className="text-lg font-bold text-gray-900">
                {course.currency} {course.price.toLocaleString()}
              </p>
            </div>
          </Link>
        </div>
      </motion.div>

      {isVideoOpen && course.previewVideoUrl && (
        <VideoModal
          videoUrl={course.previewVideoUrl}
          courseTitle={course.title}
          onClose={handleCloseVideo}
        />
      )}
    </>
  )
}
