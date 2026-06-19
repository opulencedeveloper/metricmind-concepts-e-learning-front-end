'use client'

import { motion } from 'framer-motion'
import { CourseAboutProps } from '@/types/course'

export default function CourseAbout({ course }: CourseAboutProps) {
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12"
    >
      <motion.div variants={itemVariants} className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-900">About this course</h3>
        <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
          {course.description}
        </p>
      </motion.div>

      {course.instructor && (
        <motion.div variants={itemVariants} className="space-y-4 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Your instructor</h3>
          <div className="flex gap-4 items-start">
            {course.instructorImage && (
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                <img
                  src={course.instructorImage}
                  alt={course.instructor}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-lg">
                {course.instructor}
              </p>
              {course.instructorBio && (
                <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                  {course.instructorBio}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
