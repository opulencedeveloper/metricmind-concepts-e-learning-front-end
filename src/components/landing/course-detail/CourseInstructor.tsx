'use client'

import { motion } from 'framer-motion'
import { CourseInstructorProps } from '@/types/course'

export default function CourseInstructor({ course }: CourseInstructorProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  if (!course.instructor) return null

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="py-16 border-t border-gray-200"
    >
      <motion.h2
        variants={itemVariants}
        className="text-3xl font-bold text-gray-900 mb-8"
      >
        About the instructor
      </motion.h2>

      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row gap-8 items-start"
      >
        {course.instructorImage && (
          <motion.div
            variants={itemVariants}
            className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex-shrink-0"
          >
            <img
              src={course.instructorImage}
              alt={course.instructor}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        <div className="flex-1 space-y-4">
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold text-gray-900">
              {course.instructor}
            </h3>
          </motion.div>

          {course.instructorBio && (
            <motion.p
              variants={itemVariants}
              className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap"
            >
              {course.instructorBio}
            </motion.p>
          )}
        </div>
      </motion.div>
    </motion.section>
  )
}
