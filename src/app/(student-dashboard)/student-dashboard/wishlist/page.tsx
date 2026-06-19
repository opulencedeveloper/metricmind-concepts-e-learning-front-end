'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useHttp } from '@/hooks/useHttp';
import { useWishlist } from '@/hooks/useWishlist';
import CourseCard from '@/components/courses/CourseCard';
import LoadingState from '@/components/ui/LoadingState';
import ErrorUI from '@/components/error/ErrorUI';
import { HttpMethod } from '@/types/http';
import { ArrowRight, Heart } from 'lucide-react';
import { CourseCardVariant } from '@/enums/course';

export default function WishlistPage() {
  const { sendHttpRequest } = useHttp();
  const { courses, isFetched, isLoading, error, setWishlist, setError } = useWishlist();

  useEffect(() => {
    // Only fetch if not already fetched from Redux
    if (!isFetched) {
      fetchWishlist();
    }
  }, [isFetched]);

  const fetchWishlist = async () => {
    await sendHttpRequest({
      requestConfig: {
        method: HttpMethod.GET,
        url: '/student/wishlist',
        isAuth: true,
      },
      successRes: (data: any) => {
        setWishlist(data.data || data.wishlist || []);
        setError(null);
      },
      errorRes: (err: any) => {
        const errMsg = err?.data?.description || err?.data?.message || 'Failed to load wishlist';
        setError(errMsg);
      },
    });
  };

  if (isLoading && courses.length === 0) {
    return <LoadingState />;
  }

  if (error && courses.length === 0) {
    return <ErrorUI error={new Error(error)} statusCode={0} onRetry={fetchWishlist} />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-white"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight flex items-center gap-3">
          <Heart className="w-12 h-12 fill-red-500 text-red-500" />
          My Wishlist
        </h1>
        <p className="text-lg text-gray-600 mt-3 max-w-2xl">
          {courses.length === 0 ? 'No courses saved yet' : `${courses.length} course${courses.length !== 1 ? 's' : ''} saved`}
        </p>
      </motion.div>

      {courses.length === 0 ? (
        <motion.div variants={itemVariants} className="px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-gray-200 bg-linear-to-br from-gray-50 to-white p-12 sm:p-16 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
              Save courses to learn later and keep track of your favorites
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="/courses">
                <button className="inline-flex items-center gap-2 bg-gray-900 text-white font-semibold rounded-xl px-8 py-3 hover:bg-gray-800 transition-colors">
                  Explore Courses
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="px-4 sm:px-6 lg:px-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {courses.map((course, index) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ delay: 0.05 * index, duration: 0.4 }}
                >
                  <CourseCard
                    course={course as any}
                    variant={CourseCardVariant.Browse}
                    index={index}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      <div className="h-12" />
    </motion.div>
  );
}
