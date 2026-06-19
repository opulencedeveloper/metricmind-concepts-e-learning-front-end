'use client';

import { motion, AnimatePresence } from 'framer-motion';
import EnrolledCourseCard from '@/components/dashboard/EnrolledCourseCard';
import { MoreCoursesGridProps } from '@/types/dashboard';

export default function MoreCoursesGrid({ courses, variants }: MoreCoursesGridProps) {
  return (
    <motion.div variants={variants} className="mb-12">
      <h2 className="text-xl font-bold text-gray-900 mb-6">More Courses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {courses.slice(1).map((enrollment, index) => {
            const course = {
              _id: enrollment._id,
              title: enrollment.courseId.title,
              instructor: enrollment.courseId.instructor,
              progress: enrollment.progress,
              thumbnail: enrollment.courseId.thumbnail,
              previewVideoUrl: enrollment.courseId.previewVideoUrl,
              courseId: { _id: enrollment.courseId._id }
            };
            return <EnrolledCourseCard key={course._id} course={course} index={index + 1} />;
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
