'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Star, Bookmark } from 'lucide-react'
import PlayButton from '@/components/courses/PlayButton'
import VideoModal from '@/components/courses/VideoModal'
import SmartImage from '@/components/common/SmartImage'
import { Course, CourseDetailHeroProps } from '@/types/course'
import { toSentenceCase } from '@/lib/format'
import { getCategoryLabel } from '@/enums/category'
//<Marked
export default function CourseDetailHero({ course }: CourseDetailHeroProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false)

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative w-full bg-linear-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 py-12 lg:py-20">
          {/* Text Content */}
          <motion.div
            variants={containerVariants}
            className="lg:col-span-2 space-y-6"
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                <Bookmark className="h-3 w-3 text-gray-700" />
                <span className="text-xs font-semibold text-gray-700">
                  {getCategoryLabel(course.category)}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                {course.title}
              </h1>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-600 leading-relaxed max-w-2xl"
            >
              {course.description}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-6 pt-4"
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-900">
                    {course.rating?.toFixed(1) || 'N/A'}
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  ({course.reviewCount || 0} ratings)
                </span>
              </div>

              <div className="h-1 w-1 bg-gray-300 rounded-full" />

              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">By</span>{' '}
                {course.instructor}
              </div>

              <div className="h-1 w-1 bg-gray-300 rounded-full" />

              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">
                  {toSentenceCase(course.language || 'English')}
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-1"
          >
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl bg-gray-100 group">
              {course.thumbnail && (
                <SmartImage
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  useSkeleton
                  eager
                />
              )}

              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <PlayButton
                onClick={handlePlayClick}
                ariaLabel={`Play preview for ${course.title}`}
                show={!!course.previewVideoUrl}
              />
            </div>

            <motion.div
              variants={itemVariants}
              className="mt-6 space-y-3"
            >
              <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Price</span>
                <span className="font-semibold text-lg text-gray-900">
                  {course.currency} {course.price}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {isVideoOpen && course.previewVideoUrl && (
          <VideoModal
            videoUrl={course.previewVideoUrl}
            courseTitle={course.title}
            onClose={handleCloseVideo}
          />
        )}
      </div>
    </motion.div>
  )
}
