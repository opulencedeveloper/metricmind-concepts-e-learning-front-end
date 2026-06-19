'use client'

import { motion } from 'framer-motion'
import { Course, Section } from '@/types/course'
import { CourseDetailTab } from '@/enums/course'
import CourseAbout from './tabs/CourseAbout'
import CourseCurriculum from './tabs/CourseCurriculum'
import CourseReviews from './tabs/CourseReviews'

interface CourseTabsProps {
  activeTab: CourseDetailTab
  onTabChange: (tab: CourseDetailTab) => void
  course: Course
  sections: Section[]
  totalLessons: number
}

const tabConfig = [
  { key: CourseDetailTab.About, label: 'About' },
  { key: CourseDetailTab.Curriculum, label: 'Curriculum' },
  { key: CourseDetailTab.Reviews, label: 'Reviews' },
]

export default function CourseTabs({
  activeTab,
  onTabChange,
  course,
  sections,
  totalLessons,
}: CourseTabsProps) {
  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          {tabConfig.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              className={`py-4 font-medium text-sm md:text-base transition-all relative ${
                activeTab === key
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {label}
              {activeTab === key && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-x-0 bottom-0 h-1 bg-gray-900 rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="relative">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === CourseDetailTab.About && (
            <CourseAbout course={course} />
          )}
          {activeTab === CourseDetailTab.Curriculum && (
            <CourseCurriculum
              sections={sections}
              totalLessons={totalLessons}
            />
          )}
          {activeTab === CourseDetailTab.Reviews && (
            <CourseReviews course={course} />
          )}
        </motion.div>
      </div>
    </div>
  )
}
