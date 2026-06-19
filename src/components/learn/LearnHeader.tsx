'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Menu, X } from 'lucide-react';
import { LearnHeaderProps } from '@/types/learn-page';

const LearnHeader = memo(({
  courseTitle,
  progressPercent,
  sidebarOpen,
  onSidebarToggle,
  onBack,
}: LearnHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-15 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile menu button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSidebarToggle(!sidebarOpen)}
            className="lg:hidden text-gray-600 hover:text-gray-900 p-2"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </motion.button>

          {/* Back button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="hidden lg:flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </motion.button>

          {/* Course title */}
          <div className="flex-1 mx-4 lg:mx-6 min-w-0">
            <h1 className="text-sm lg:text-lg font-bold text-gray-900 truncate">
              {courseTitle}
            </h1>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 lg:gap-4 shrink-0">
            <div className="text-right">
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{progressPercent}%</p>
              <p className="text-xs text-gray-500">Complete</p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="h-full bg-gray-900"
          />
        </div>
      </div>
    </motion.div>
  );
});

LearnHeader.displayName = 'LearnHeader';

export default LearnHeader;
