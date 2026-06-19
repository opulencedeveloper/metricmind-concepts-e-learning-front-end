'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import Button from '@/components/ui/Button';
import SmartImage from '@/components/common/SmartImage';
import PlayButton from '@/components/courses/PlayButton';
import VideoModal from '@/components/courses/VideoModal';
import { ButtonVariant, ButtonSize } from '@/types/ui';
import { EnrolledCourseCardProps } from '@/types/enrolled-course';

export default function EnrolledCourseCard({ course, index = 0 }: EnrolledCourseCardProps) {
  const courseId = course.courseId?._id || course._id;
  const progress = course.progress || 0;
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const handlePlayClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (course.previewVideoUrl) {
        setIsVideoOpen(true);
      }
    },
    [course.previewVideoUrl]
  );

  const handleCloseVideo = useCallback(() => {
    setIsVideoOpen(false);
  }, []);

  return (
    <>
      <motion.div
        key={course._id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * index, duration: 0.4 }}
        whileHover={{ scale: 1.01, y: -2 }}
        className="rounded-2xl bg-white border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-300"
      >
        {/* Image Header */}
        <div className="relative h-32 bg-linear-to-br from-gray-800 to-gray-900 overflow-hidden flex items-center justify-center group">
          {course.thumbnail ? (
            <>
              <SmartImage
                src={course.thumbnail}
                alt={course.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
            </>
          ) : (
            <BookOpen className="w-8 h-8 text-white opacity-40" />
          )}
          <PlayButton
            onClick={handlePlayClick}
            ariaLabel={`Play preview for ${course.title}`}
            show={!!course.previewVideoUrl}
          />
        </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-3">
          {course.title}
        </h3>

        {course.instructor && (
          <p className="text-xs text-gray-600 mb-4">by {course.instructor}</p>
        )}

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-600">Progress</span>
            <span className="text-xs font-medium text-gray-900">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="bg-gray-900 h-full rounded-full"
            />
          </div>
        </div>

        {/* CTA Button */}
        <Link href={`/student-dashboard/my-courses/${courseId}/learn`}>
          <Button
            fullWidth
            variant={ButtonVariant.Primary}
            size={ButtonSize.Small}
          >
            {progress > 0 ? 'Continue Learning' : 'Start Learning'}
          </Button>
        </Link>
      </div>
    </motion.div>

      {isVideoOpen && course.previewVideoUrl && (
        <VideoModal
          videoUrl={course.previewVideoUrl}
          courseTitle={course.title}
          onClose={handleCloseVideo}
        />
      )}
    </>
  );
}
