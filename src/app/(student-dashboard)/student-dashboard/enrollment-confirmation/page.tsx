'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import SmartImage from '@/components/common/SmartImage';
import LoadingState from '@/components/ui/LoadingState';
import ErrorUI from '@/components/error/ErrorUI';
import { LoadingStateType } from '@/types/ui';
import { useHttp } from '@/hooks/useHttp';
import { useEnrollment } from '@/hooks/useEnrollment';
import { HttpMethod } from '@/types/http';
import { Check, X, BookOpen, Award, Users, Clock } from 'lucide-react';

function EnrollmentConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { sendHttpRequest } = useHttp();
  const { pendingEnrollmentCourseId, clearPendingEnrollment } = useEnrollment();

  const courseId = searchParams.get('courseId') || pendingEnrollmentCourseId;
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [courseError, setCourseError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    } else {
      setCourseError('No course selected for enrollment');
      setIsLoading(false);
    }
  }, [courseId]);

  const fetchCourse = async () => {
    setIsLoading(true);
    setCourseError(null);

    await sendHttpRequest({
      requestConfig: {
        method: HttpMethod.GET,
        url: `/student/courses/by-id/${courseId}`,
        isAuth: true,
      },
      successRes: (data: any) => {
        // Backend returns { course, sections } - merge them
        const courseData = data.course || data;
        if (data.sections) {
          courseData.sections = data.sections;
        }
        setCourse(courseData);
        setIsLoading(false);
      },
      errorRes: (err: any) => {
        setCourseError(err?.data?.description || err?.data?.message ||  'Failed to load course');
        setIsLoading(false);
      },
    });
  };

  const handleConfirmAndPay = async () => {
    if (!courseId) return;

    setIsProcessing(true);
    setPaymentError(null);

    await sendHttpRequest({
      requestConfig: {
        method: HttpMethod.POST,
        url: `/payments/courses/${courseId}/initiate`,
        isAuth: true,
      },
      successRes: (data: any) => {
        const authorizationUrl = data.authorizationUrl || data.data?.authorizationUrl;
        if (authorizationUrl) {
          clearPendingEnrollment();
          window.location.href = authorizationUrl;
        } else {
          setPaymentError('Failed to initialize payment');
          setIsProcessing(false);
        }
      },
      errorRes: (err: any) => {
        setPaymentError(
          err?.data?.description ||
          err?.description ||
          err?.message ||
          'Payment initialization failed'
        );
        setIsProcessing(false);
      },
    });
  };

  const handleCancel = () => {
    clearPendingEnrollment();
    router.back();
  };

  if (isLoading) {
    return <LoadingState type={LoadingStateType.Skeleton} />;
  }

  if (courseError) {
    return <ErrorUI message={courseError} statusCode={0} onRetry={fetchCourse} />;
  }

  if (!course) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center p-4 bg-white"
      >
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Course not found</h1>
          <p className="text-gray-600 mb-8">The course you're looking for is no longer available.</p>
          <Link href="/courses">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-full transition-colors"
            >
              Browse Courses
            </motion.button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-white"
    >
      {/* Main Content - Wider Layout */}
      <div className="max-w-5xl mx-auto py-12 space-y-12">

        {/* Confirmation Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="text-center mb-8"
        >
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Confirm Your Enrollment</p>
          <h2 className="text-3xl font-bold text-gray-900">
            Ready to start learning?
          </h2>
          <p className="text-lg text-gray-600 mt-2">
            Review the course details below and confirm to proceed with payment
          </p>
        </motion.div>

        {/* Payment Error Message - Shows right above the button */}
        <AnimatePresence mode="wait">
          {paymentError && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="bg-red-50 border border-red-200 rounded-3xl p-6 flex items-start gap-4 overflow-hidden"
            >
              <X
                onClick={() => setPaymentError(null)}
                className="w-6 h-6 text-red-600 shrink-0 mt-1 cursor-pointer hover:text-red-700 transition-colors"
              />
              <p className="text-base text-red-700 font-semibold flex-1">{paymentError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Price Card & CTA Button - FIRST (Main Action) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-gray-50 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6"
        >
          {/* Course Thumbnail */}
          {course.thumbnail && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden shrink-0 shadow-lg"
            >
              <SmartImage
                src={course.thumbnail}
                alt={course.title}
                fill
                className="object-cover"
                useSkeleton
              />
            </motion.div>
          )}

          {/* Price Section */}
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-2">Price</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl md:text-3xl text-gray-600">{course.currency}</span>
              <span className="text-5xl md:text-6xl font-bold text-gray-900">{course.price}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">One-time payment</p>
          </div>

          {/* CTA Button - Prominent */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleConfirmAndPay}
            disabled={isProcessing}
            className="w-full md:w-auto bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold py-4 md:py-5 px-6 md:px-8 rounded-full transition-all duration-200 flex items-center justify-center md:justify-start gap-3 text-base md:text-lg shadow-xl hover:shadow-2xl whitespace-nowrap"
          >
            {isProcessing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                />
                Initializing Payment...
              </>
            ) : (
              <>
                <Check className="w-6 h-6" />
                Confirm & Pay
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Course Header - Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="space-y-3"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              {course.title}
            </h1>
            <p className="text-xl text-gray-600">by {course.instructor}</p>
          </div>
        </motion.div>

        {/* Description */}
        {course.description && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-3"
          >
            <h2 className="text-2xl font-bold text-gray-900">About this course</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {course.description}
            </p>
          </motion.div>
        )}

        {/* Course Sections / Curriculum */}
        {course.sections && course.sections.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              Course Content
            </h2>
            <div className="space-y-3">
              {course.sections.map((section: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.35 + index * 0.05 }}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-200"
                >
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    Section {index + 1}: {section.title}
                  </h3>
                  {section.items && section.items.length > 0 && (
                    <p className="text-sm text-gray-600">
                      {section.items.length} lesson{section.items.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* What You'll Get */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-gray-900">What you'll get</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { Icon: Clock, text: 'Lifetime access to all materials' },
              { Icon: Award, text: 'Certificate upon completion' },
              { Icon: Users, text: 'Expert instructor guidance' },
              { Icon: Check, text: '30-day money-back guarantee' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.45 + index * 0.05 }}
                className="flex items-start gap-4 bg-gray-50 rounded-2xl p-5"
              >
                <item.Icon className="w-6 h-6 text-gray-900 shrink-0 mt-1" />
                <span className="text-base text-gray-700">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Cancel Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCancel}
            disabled={isProcessing}
            className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 text-gray-900 font-semibold py-4 rounded-full transition-colors duration-200"
          >
            Cancel
          </motion.button>
        </motion.div>

        {/* Trust & Support */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.65 }}
          className="border-t border-gray-200 pt-8 text-center space-y-3"
        >
          <p className="text-base text-gray-600">
            🔒 Secure payment with encryption
          </p>
          <p className="text-sm text-gray-500">
            Questions? <Link href="/contact" className="text-gray-900 hover:underline font-semibold">Contact support</Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function EnrollmentConfirmationPage() {
  return (
    <Suspense fallback={<LoadingState type={LoadingStateType.Skeleton} />}>
      <EnrollmentConfirmationContent />
    </Suspense>
  );
}
