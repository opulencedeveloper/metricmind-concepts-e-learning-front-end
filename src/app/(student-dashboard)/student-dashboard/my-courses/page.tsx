'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, cubicBezier } from 'framer-motion';
import { useHttp } from '@/hooks/useHttp';
import EnrolledCourseCard from '@/components/dashboard/EnrolledCourseCard';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';
import ErrorUI from '@/components/error/ErrorUI';
import { ButtonVariant, ButtonSize, LoadingStateType } from '@/types/ui';
import { HttpMethod } from '@/types/http';
import { BookOpen, Sparkles, ArrowRight } from 'lucide-react';

export default function StudentCoursesPage() {
  const { isLoading, sendHttpRequest } = useHttp();
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    fetchCourses();
  }, [sendHttpRequest]);

  const fetchCourses = async () => {
    setError(undefined);
    await sendHttpRequest({
      requestConfig: {
        method: HttpMethod.GET,
        url: '/student/enrollments',
        isAuth: true,
      },
      successRes: (data: any) => {
        setCourses(data.enrollments || []);
      },
      errorRes: (err: any) => {
        setError(err?.data?.description || err?.data?.message ||  'Failed to load courses');
      },
    });
  };

  if (isLoading && courses.length === 0) {
    return <LoadingState type={LoadingStateType.Skeleton} />;
  }

  if (error && courses.length === 0) {
    return <ErrorUI error={new Error(error)} statusCode={0} onRetry={fetchCourses} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        <p className="text-gray-600 mt-2">Continue your learning journey</p>
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((enrollment: any, index: number) => {
            const course = {
              _id: enrollment._id,
              title: enrollment.courseId?.title || '',
              instructor: enrollment.courseId?.instructor || '',
              progress: enrollment.progress || 0,
              thumbnail: enrollment.courseId?.thumbnail || '',
              previewVideoUrl: enrollment.courseId?.previewVideoUrl || '',
              courseId: { _id: enrollment.courseId?._id || '' }
            };
            return <EnrolledCourseCard key={course._id} course={course} index={index} />;
          })}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: cubicBezier(0.22, 1, 0.36, 1) }}
          className="flex items-center justify-center min-h-125"
        >
          <div className="w-full max-w-md px-6">
            {/* Icon with animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1, ease: cubicBezier(0.22, 1, 0.36, 1) }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: cubicBezier(0.22, 1, 0.36, 1) }}
                  className="absolute top-0 right-0 w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center"
                >
                  <Sparkles className="w-3 h-3 text-white" strokeWidth={2} />
                </motion.div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2, ease: cubicBezier(0.22, 1, 0.36, 1) }}
              className="text-center space-y-4"
            >
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Start Your Journey</h2>
                <p className="text-gray-600 mt-2 text-base leading-relaxed">
                  Explore our collection of courses and start learning something new today.
                </p>
              </div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3, ease: cubicBezier(0.22, 1, 0.36, 1) }}
                className="flex flex-col gap-3 pt-4"
              >
                <Link href="/courses" className="w-full">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full"
                  >
                    <Button variant={ButtonVariant.Primary} size={ButtonSize.Medium} fullWidth>
                      <span className="flex items-center justify-center gap-2">
                        Browse Courses
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </Button>
                  </motion.div>
                </Link>

                <Link href="/student-dashboard" className="w-full">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full"
                  >
                    <Button variant={ButtonVariant.Secondary} size={ButtonSize.Medium} fullWidth>
                      Back to Dashboard
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>

            {/* Bottom accent */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4, ease: cubicBezier(0.22, 1, 0.36, 1) }}
              className="mt-8 pt-6 border-t border-gray-100 text-center"
            >
              <p className="text-xs text-gray-500">
                Join thousands of learners achieving their goals
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
