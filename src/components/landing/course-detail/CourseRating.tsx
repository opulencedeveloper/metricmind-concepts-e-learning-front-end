'use client'

import { Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { CourseRatingProps } from '@/types/course'
import { CourseRatingVariant } from '@/enums/course'

export default function CourseRating({
  course,
  variant = CourseRatingVariant.Default,
  itemVariants,
}: CourseRatingProps) {
  const content = (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        <span
          className={
            variant === CourseRatingVariant.Compact
              ? 'font-semibold text-gray-900'
              : 'font-semibold text-lg text-gray-900'
          }
        >
          {course.rating?.toFixed(1) || 'N/A'}
        </span>
      </div>
      <p className="text-sm text-gray-600">
        {course.reviewCount || 0}{' '}
        {variant === CourseRatingVariant.Compact ? 'ratings' : 'reviews'}
      </p>
    </div>
  )

  if (itemVariants) {
    return <motion.div variants={itemVariants}>{content}</motion.div>
  }

  return content
}
