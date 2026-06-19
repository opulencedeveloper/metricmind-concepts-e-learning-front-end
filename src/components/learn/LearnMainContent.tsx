'use client';

import { memo, useMemo, useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import VideoPlayerSection from './VideoPlayerSection';
import SectionHeader from './SectionHeader';
import CourseContent from './CourseContent';
import NavigationFooter from './NavigationFooter';
import { CurriculumItemType } from '@/enums/curriculum';
import { LearnMainContentProps } from '@/types/learn-page';

const LearnMainContent = memo(({
  currentSection,
  sections,
  courseId,
  courseContent,
}: LearnMainContentProps) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState<string>('Introduction');
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(sections.length > 0 ? [sections[0]._id] : [])
  );
  const reportedMilestonesRef = useRef<Set<number>>(new Set());

  // Find the first lecture in the current section
  const firstLecture = useMemo(
    () => currentSection?.items?.find((item) => item.type === CurriculumItemType.Lecture),
    [currentSection]
  );

  // Get the video to display (selected or first lecture)
  const displayVideoUrl = useMemo(
    () => selectedVideoUrl || (firstLecture?.videoUrl ?? null),
    [selectedVideoUrl, firstLecture?.videoUrl]
  );

  // Handle video selection from curriculum - with smooth scroll
  const handleSelectVideo = useCallback((videoUrl: string, videoTitle: string, itemId: string) => {
    setSelectedVideoUrl(videoUrl);
    setSelectedVideoTitle(videoTitle);
    setSelectedItemId(itemId);

    // Smooth scroll to video player
    if (videoRef.current) {
      setTimeout(() => {
        videoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    }
  }, []);

  // Handle section toggle
  const handleToggleSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }, []);

  // Video progress tracking
  const handleVideoProgress = useCallback((progress: number) => {
    const milestones = [25, 50, 75, 100];
    const currentMilestone = milestones.find(
      (m) => progress >= m && !reportedMilestonesRef.current.has(m)
    );

    if (currentMilestone) {
      reportedMilestonesRef.current.add(currentMilestone);
    }
  }, []);

  if (!currentSection) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-200"
      >
        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">No sections available in this course.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Video Player Section */}
      <VideoPlayerSection
        videoRef={videoRef}
        displayVideoUrl={displayVideoUrl}
        courseTitle={sections[0]?.title || 'Course'}
        selectedVideoTitle={selectedVideoTitle}
        courseId={courseId}
        curriculumItemId={selectedItemId || firstLecture?._id || ''}
        onProgress={handleVideoProgress}
      />

      {/* Course Curriculum Section */}
      <div className="space-y-4">
        <SectionHeader sections={sections} />
        <CourseContent
          sections={sections}
          expandedSections={expandedSections}
          onToggleSection={handleToggleSection}
          onSelectVideo={handleSelectVideo}
          watchedItems={courseContent.enrollment.watchedItems}
          courseId={courseId}
          selectedItemId={selectedItemId}
        />
      </div>

      {/* Navigation Footer */}
      <NavigationFooter />
    </motion.div>
  );
});

LearnMainContent.displayName = 'LearnMainContent';

export default LearnMainContent;
