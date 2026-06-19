'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Star, Users, Clock, Award, CheckCircle2, BookOpen } from 'lucide-react'
import { Course, CourseDetailPageProps, Section } from '@/types/course'
import { CourseDetailTab } from '@/enums/course'
import CourseDetailHero from './course-detail/CourseDetailHero'
import CourseTabs from './course-detail/CourseTabs'
import CourseEnrollment from './course-detail/CourseEnrollment'
import CourseInstructor from './course-detail/CourseInstructor'

export default function CourseDetailPage({
  course,
  sections,
}: CourseDetailPageProps) {
  const [activeTab, setActiveTab] = useState<CourseDetailTab>(CourseDetailTab.About)
  const [isEnrollmentSticky, setIsEnrollmentSticky] = useState(false)
  const enrollmentRef = useRef<HTMLDivElement>(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    const handleScroll = () => {
      if (!isMountedRef.current || !enrollmentRef.current) return

      const rect = enrollmentRef.current.getBoundingClientRect()
      setIsEnrollmentSticky(rect.top < 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const totalLessons = sections.reduce(
    (acc, section) => acc + (section.items?.length || 0),
    0
  )

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

  return (
    <div className="min-h-screen bg-white">
      <CourseDetailHero course={course} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-5 border-b border-gray-200 min-h-40"
        >
<motion.div variants={itemVariants} className="space-y-2 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Users className="h-5 w-5 text-gray-600" />
              {(course.studentsEnrolled || 0).toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">students enrolled</p>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2 flex flex-col justify-center">
            <p className="font-semibold text-lg text-gray-900 capitalize">
              {course.level}
            </p>
            <p className="text-sm text-gray-600">skill level</p>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Clock className="h-5 w-5 text-gray-600" />
              {course.totalDuration || '—'}
            </div>
            <p className="text-sm text-gray-600">hours</p>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <BookOpen className="h-5 w-5 text-gray-600" />
              {totalLessons}
            </div>
            <p className="text-sm text-gray-600">total lessons</p>
          </motion.div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 py-12">
          <div className="flex-1">
            <CourseTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              course={course}
              sections={sections}
              totalLessons={totalLessons}
            />
          </div>

          <div className="lg:w-96">
            <div ref={enrollmentRef} className="sticky top-4">
              <CourseEnrollment course={course} isSticky={isEnrollmentSticky} />

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-100px' }}
                className="mt-8 space-y-6"
              >
                {course.learningObjectives &&
                  course.learningObjectives.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        What you'll learn
                      </h3>
                      <ul className="space-y-3">
                        {course.learningObjectives.map((objective, idx) => (
                          <motion.li
                            key={idx}
                            variants={itemVariants}
                            className="flex gap-3 items-start"
                          >
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700 leading-relaxed">
                              {objective}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}

                {course.requirements && course.requirements.length > 0 && (
                  <div className="space-y-4 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      Requirements
                    </h3>
                    <ul className="space-y-2">
                      {course.requirements.map((req, idx) => (
                        <motion.li
                          key={idx}
                          variants={itemVariants}
                          className="flex gap-3 items-start"
                        >
                          <Award className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{req}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        <CourseInstructor course={course} />
      </div>
    </div>
  )
}
