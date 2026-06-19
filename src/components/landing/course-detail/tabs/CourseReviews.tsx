'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { CourseReviewsProps } from '@/types/course'

export default function CourseReviews({ course }: CourseReviewsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  const ratingDistribution = [
    { stars: 5, percentage: 70 },
    { stars: 4, percentage: 15 },
    { stars: 3, percentage: 10 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 2 },
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12"
    >
      {/* Rating Summary */}
      <motion.div variants={itemVariants} className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center gap-8">
          {/* Average Rating */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="text-6xl font-bold text-gray-900">
              {course.rating?.toFixed(1) || 'N/A'}
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(course.rating || 0)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-600 text-sm">
              Based on {course.reviewCount || 0} reviews
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 space-y-3">
            {ratingDistribution.map(({ stars, percentage }) => (
              <div key={stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm text-gray-600">{stars}</span>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-yellow-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">
                  {percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Coming Soon Message */}
      <motion.div
        variants={itemVariants}
        className="p-8 bg-gray-50 rounded-lg border border-gray-200 text-center space-y-2"
      >
        <h3 className="font-semibold text-gray-900">Student reviews</h3>
        <p className="text-gray-600 text-sm">
          Detailed student reviews will be available after your first enrollment
        </p>
      </motion.div>
    </motion.div>
  )
}
