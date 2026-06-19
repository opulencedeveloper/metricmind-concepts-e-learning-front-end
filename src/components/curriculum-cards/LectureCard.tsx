'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle2 } from 'lucide-react';
import { LectureCardProps } from '@/types/curriculum-cards';

const LectureCard = memo(({
  title,
  description,
  videoDuration,
  isWatched,
  onSelect,
  isLastItem,
}: LectureCardProps) => {
  const minutes = Math.floor(videoDuration / 60);
  const seconds = videoDuration % 60;

  return (
    <motion.button
      onClick={onSelect}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`w-full text-left py-3 px-4 ${!isLastItem ? 'border-b border-gray-100' : ''} hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 group cursor-pointer`}
    >
      <div className="flex items-start gap-3">
        {/* Icon - Large and prominent like Apple */}
        <div className="relative shrink-0 pt-0.5">
          <motion.div
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.15 }}
            className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center"
          >
            <Play className="w-6 h-6 text-gray-900 fill-gray-900" />
          </motion.div>
          {isWatched && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute -top-1 -right-1"
            >
              <CheckCircle2 className="w-5 h-5 text-green-600 fill-green-600 drop-shadow-sm" />
            </motion.div>
          )}
        </div>

        {/* Text content - Clean and minimal */}
        <div className="flex-1 min-w-0 pt-0.5">
          <h3 className="text-base font-medium text-gray-900 line-clamp-1">
            {title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-gray-500">
              Lesson
            </p>
            <span className="text-gray-300">•</span>
            <p className="text-sm text-gray-500">
              {minutes}m {seconds}s
            </p>
          </div>
          {description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-1">
              {description}
            </p>
          )}
        </div>
      </div>
    </motion.button>
  );
});

LectureCard.displayName = 'LectureCard';
export default LectureCard;
