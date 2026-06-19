'use client';

import { memo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Play, BookOpen, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { ButtonVariant, ButtonSize } from '@/types/ui';
import { CurriculumItemType } from '@/enums/curriculum';
import { ContentItemProps } from '@/types/learn-page';

const ContentItem = memo(({
  item,
  index,
  courseId,
  canAccess,
}: ContentItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 * index }}
    >
      {item.type === CurriculumItemType.Lecture && (
        <div className="bg-linear-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300">
          <div className="flex gap-6 items-start">
            <div className="shrink-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-16 h-16 bg-linear-to-br from-gray-900 to-gray-800 rounded-xl flex items-center justify-center shadow-lg"
              >
                <Play className="w-6 h-6 text-white fill-white" />
              </motion.div>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full shrink-0">
                  Lecture
                </span>
              </div>
              {item.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
              )}
              {item.videoUrl && (
                <motion.a
                  whileHover={{ x: 4 }}
                  href={item.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-700 font-semibold text-sm"
                >
                  Watch Lecture
                  <ChevronRight className="w-4 h-4" />
                </motion.a>
              )}
            </div>
          </div>
        </div>
      )}

      {item.type === CurriculumItemType.Quiz && (
        <div className="bg-linear-to-br from-blue-50 to-blue-25 rounded-2xl p-6 border border-blue-200 hover:border-blue-300 transition-all duration-300">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
              </div>
              {item.description && (
                <p className="text-gray-600 text-sm mb-4 ml-13">{item.description}</p>
              )}
            </div>
            {canAccess && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="shrink-0">
                <Link href={`/student-dashboard/my-courses/${courseId}/quiz/${item._id}`}>
                  <Button variant={ButtonVariant.Primary} size={ButtonSize.Medium}>
                    Start Quiz
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {item.type === CurriculumItemType.Article && (
        <div className="bg-linear-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-all duration-300">
          <div className="flex items-start gap-4 mb-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
          </div>
          {item.description && (
            <p className="text-gray-600 leading-relaxed ml-14">{item.description}</p>
          )}
        </div>
      )}
    </motion.div>
  );
});

ContentItem.displayName = 'ContentItem';

export default ContentItem;
