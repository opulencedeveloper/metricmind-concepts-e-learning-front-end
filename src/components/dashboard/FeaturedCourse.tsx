'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight } from 'lucide-react';
import SmartImage from '@/components/common/SmartImage';
import PlayButton from '@/components/courses/PlayButton';
import VideoModal from '@/components/courses/VideoModal';
import { FeaturedCourseProps } from '@/types/dashboard';

export default function FeaturedCourse({ course, variants }: FeaturedCourseProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const handlePlayClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (course.courseId.previewVideoUrl) {
        setIsVideoOpen(true);
      }
    },
    [course.courseId.previewVideoUrl]
  );

  const handleCloseVideo = useCallback(() => {
    setIsVideoOpen(false);
  }, []);

  return (
    <motion.div variants={variants} className="mb-12">
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {(course.progress || 0) > 0 ? 'Continue Learning' : 'Start Learning'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {(course.progress || 0) > 0 ? 'Pick up where you left off' : 'Begin your learning journey'}
          </p>
        </div>
      </div>

      <motion.div
        whileHover={{ scale: 1.01 }}
        className="rounded-3xl overflow-hidden bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="relative h-48 md:h-64 bg-linear-to-br from-gray-900 to-gray-800 flex items-center justify-center overflow-hidden group"
          >
            {course.courseId.thumbnail ? (
              <>
                <SmartImage
                  src={course.courseId.thumbnail}
                  alt={course.courseId.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
              </>
            ) : (
              <>
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 left-4 w-32 h-32 bg-white rounded-full blur-3xl" />
                </div>
                <BookOpen className="w-12 h-12 text-white opacity-40 relative" />
              </>
            )}
            <PlayButton
              onClick={handlePlayClick}
              ariaLabel={`Play preview for ${course.courseId.title}`}
              show={!!course.courseId.previewVideoUrl}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="p-6 md:p-8 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{course.courseId.title}</h3>

              <div className="mb-8">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20">
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#1f2937"
                        strokeWidth="8"
                        strokeDasharray={`${2 * Math.PI * 45}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                        animate={{
                          strokeDashoffset: 2 * Math.PI * 45 * (1 - (course.progress || 0) / 100),
                        }}
                        transition={{ delay: 0.4, duration: 0.8, ease: 'easeInOut' }}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-900">
                        {course.progress || 0}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Your Progress</p>
                    <p className="text-sm font-medium text-gray-900">
                      {course.progress || 0}% complete
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href={`/student-dashboard/my-courses/${course.courseId._id}/learn`}>
                <button className="w-full bg-gray-900 text-white font-semibold rounded-xl px-6 py-3 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                  {(course.progress || 0) > 0 ? 'Continue Learning' : 'Start Learning'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {isVideoOpen && course.courseId.previewVideoUrl && (
        <VideoModal
          videoUrl={course.courseId.previewVideoUrl}
          courseTitle={course.courseId.title}
          onClose={handleCloseVideo}
        />
      )}
    </motion.div>
  );
}
