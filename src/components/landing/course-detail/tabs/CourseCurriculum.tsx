'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Play, FileText, HelpCircle } from 'lucide-react'
import { CourseCurriculumProps } from '@/types/course'
import { CurriculumItemType } from '@/types/course'

export default function CourseCurriculum({
  sections,
  totalLessons,
}: CourseCurriculumProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set([sections[0]?._id?.toString() || ''])
  )

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const getItemIcon = (type: string) => {
    switch (type) {
      case CurriculumItemType.Lecture:
        return <Play className="h-4 w-4" />
      case CurriculumItemType.Article:
        return <FileText className="h-4 w-4" />
      case CurriculumItemType.Quiz:
        return <HelpCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-gray-900">Course curriculum</h3>
        <p className="text-gray-600">
          {sections.length} sections • {totalLessons} lessons
        </p>
      </div>

      <div className="space-y-3">
        {sections.map((section) => (
          <motion.div
            key={section._id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleSection(section._id.toString())}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 text-left">
                <h4 className="font-semibold text-gray-900">{section.title}</h4>
                <span className="text-sm text-gray-600">
                  {section.items?.length || 0} lessons
                </span>
              </div>
              <motion.div
                animate={{
                  rotate: expandedSections.has(section._id.toString())
                    ? 180
                    : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-5 w-5 text-gray-600" />
              </motion.div>
            </button>

            <AnimatePresence>
              {expandedSections.has(section._id.toString()) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="divide-y divide-gray-200 bg-white">
                    {section.items?.map((item, idx) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="text-gray-600">
                          {getItemIcon(item.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 truncate">
                            {item.title}
                          </p>
                          {item.videoDuration && (
                            <p className="text-xs text-gray-500">
                              {Math.floor(item.videoDuration / 60)}m
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
