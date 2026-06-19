'use client';

import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionItem from './SectionItem';
import { LearnSidebarProps } from '@/types/learn-page';

const LearnSidebar = memo(({
  sections,
  currentSectionId,
  expandedSectionId,
  sidebarOpen,
  onSectionSelect,
  onToggleExpand,
}: LearnSidebarProps) => {
  return (
    <AnimatePresence mode="wait">
      {sidebarOpen && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed lg:relative z-30 w-72 lg:w-auto h-screen lg:h-auto overflow-y-auto bg-white border-r border-gray-200"
        >
          <div className="sticky top-0 space-y-4 p-4 lg:pt-8 bg-white">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide px-2">
              Course Content
            </h2>
            <div className="space-y-1">
              {sections.map((section, index) => (
                <SectionItem
                  key={section._id}
                  section={section}
                  index={index}
                  isActive={currentSectionId === section._id}
                  isExpanded={expandedSectionId === section._id}
                  onSelect={onSectionSelect}
                  onToggleExpand={onToggleExpand}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

LearnSidebar.displayName = 'LearnSidebar';

export default LearnSidebar;
