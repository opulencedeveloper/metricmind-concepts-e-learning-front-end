'use client';

import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Play, BookOpen, CheckCircle2 } from 'lucide-react';
import { CurriculumItemType } from '@/enums/curriculum';
import { SectionItemProps } from '@/types/learn-page';

const SectionItem = memo(({
  section,
  index,
  isActive,
  isExpanded,
  onSelect,
  onToggleExpand,
}: SectionItemProps) => {
  const itemCount = section.items?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <motion.button
        onClick={() => {
          onSelect(section);
          if (!isExpanded) {
            onToggleExpand(section._id);
          }
        }}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between ${
          isActive
            ? 'bg-gray-900 text-white shadow-md'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="font-semibold text-sm truncate">{section.title}</span>
          {itemCount > 0 && (
            <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${
              isActive ? 'bg-white/20' : 'bg-gray-200 text-gray-700'
            }`}>
              {itemCount}
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronRight className="w-4 h-4" />
        </motion.div>
      </motion.button>

      <AnimatePresence mode="wait">
        {isExpanded && section.items && section.items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-1 ml-2 mt-1 pb-2">
              {section.items.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="px-3 py-2 rounded-lg text-xs text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center gap-2 group cursor-pointer"
                >
                  {item.type === CurriculumItemType.Lecture && (
                    <Play className="w-3 h-3 shrink-0 text-gray-400 group-hover:text-gray-600" />
                  )}
                  {item.type === CurriculumItemType.Quiz && (
                    <BookOpen className="w-3 h-3 shrink-0 text-gray-400 group-hover:text-gray-600" />
                  )}
                  {item.type === CurriculumItemType.Article && (
                    <CheckCircle2 className="w-3 h-3 shrink-0 text-gray-400 group-hover:text-gray-600" />
                  )}
                  <span className="truncate font-medium">{item.title}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

SectionItem.displayName = 'SectionItem';

export default SectionItem;
