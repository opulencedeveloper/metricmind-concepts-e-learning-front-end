'use client';

import { memo, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Lock, Award } from 'lucide-react';
import { CurriculumItemType } from '@/enums/curriculum';
import { CourseContentProps } from '@/types/learn-page';
import CurriculumCard from '@/components/curriculum-cards/CurriculumCard';
import Button from '@/components/ui/Button';
import { ButtonVariant } from '@/types/ui';

const CourseContent = memo(({
  sections,
  expandedSections,
  onToggleSection,
  onSelectVideo,
  watchedItems,
  courseId,
  selectedItemId,
}: CourseContentProps & { selectedItemId?: string }) => {
  const router = useRouter();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      {sections.map((section) => {
        const isExpanded = expandedSections.has(section._id);
        const completedItems = section.items?.filter((item) => item.type === CurriculumItemType.Lecture).length || 0;
        const isLocked = !section.canAccess;

        return (
          <motion.div
            key={section._id}
            variants={sectionVariants}
            transition={{ duration: 0.5 }}
            className="group"
          >
            {/* Section Header - Apple Card Style */}
            <motion.button
              onClick={() => !isLocked && onToggleSection(section._id)}
              whileHover={!isLocked ? { y: -2 } : {}}
              whileTap={!isLocked ? { scale: 0.98 } : {}}
              disabled={isLocked}
              className={`w-full relative overflow-hidden rounded-2xl border transition-all duration-300 shadow-sm cursor-pointer ${
                isLocked
                  ? 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-linear-to-br from-white/0 to-white/0 group-hover:from-white/50 group-hover:to-white/20 transition-all duration-300" />

              {/* Content */}
              <div className="relative px-6 py-5 flex items-center justify-between">
                {/* Left side - Title and count */}
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-start gap-2 mb-1.5">
                    <motion.h3
                      className={`text-lg font-semibold ${isLocked ? 'text-gray-500' : 'text-gray-900'}`}
                      layout
                    >
                      {section.title}
                    </motion.h3>
                    {isLocked && <Lock className="w-4 h-4 text-gray-500 mt-1 shrink-0" />}
                  </div>
                  <div className="flex flex-col gap-2">
                    {isLocked && section.accessReason && (
                      <p className="text-xs text-red-600 font-medium">{section.accessReason}</p>
                    )}
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-700">
                        {completedItems} lesson{completedItems !== 1 ? 's' : ''}
                      </span>
                      {section.description && (
                        <p className="text-xs text-gray-500 hidden sm:block line-clamp-1">
                          {section.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side - Chevron or Lock */}
                <motion.div
                  animate={{ rotate: isExpanded && !isLocked ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="ml-4 shrink-0"
                >
                  {isLocked ? (
                    <div className="p-2 rounded-lg bg-gray-100">
                      <Lock className="w-5 h-5 text-gray-500" />
                    </div>
                  ) : (
                    <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
                      <ChevronDown className="w-5 h-5 text-gray-900" />
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.button>

            {/* Section Items - Expandable with smooth animation */}
            <AnimatePresence initial={false}>
              {isExpanded && !isLocked && section.items && section.items.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="pt-2 pl-4 pr-4 pb-0 space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <motion.div
                        key={item._id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.3, delay: itemIndex * 0.05 }}
                        className={itemIndex === section.items.length - 1 ? '' : ''}
                      >
                        <CurriculumCard
                          {...(item as any)}
                          isWatched={watchedItems.includes(item._id)}
                          isActive={item._id === selectedItemId}
                          onSelect={() => {
                            if (item.type === CurriculumItemType.Lecture && 'videoUrl' in item) {
                              onSelectVideo((item as any).videoUrl, item.title, item._id);
                            } else if (item.type === CurriculumItemType.Quiz && 'quizId' in item) {
                              router.push(`/student-dashboard/my-courses/${courseId}/quiz/${(item as any).quizId}`);
                            }
                          }}
                          isLastItem={itemIndex === section.items.length - 1}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Course Completion Certificate */}
      {sections.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <div className="text-center py-8">
            <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Course Certificate</h3>
            <p className="text-gray-600 mb-6">
              Complete all quizzes to earn your certificate of completion
            </p>
            <div className="flex justify-center">
              <Link href={`/student-dashboard/my-courses/${courseId}/certificate`}>
                <Button variant={ButtonVariant.Primary}>View Certificate</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
});

CourseContent.displayName = 'CourseContent';

export default CourseContent;
