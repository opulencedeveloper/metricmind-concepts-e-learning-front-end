'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Suspense } from 'react';
import LoadingState from '@/components/ui/LoadingState';
import ErrorUI from '@/components/error/ErrorUI';
import { LoadingStateType } from '@/types/ui';
import { useHttp } from '@/hooks/useHttp';
import { useEnrollment } from '@/hooks/useEnrollment';
import { HttpMethod } from '@/types/http';
import { ArrowRight } from 'lucide-react';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { sendHttpRequest } = useHttp();
  const { addEnrollment } = useEnrollment();

  const reference = searchParams.get('reference');
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (reference) {
      verifyPayment();
    } else {
      setError(new Error('No payment reference found. Please contact support.'));
      setIsVerifying(false);
    }
  }, [reference]);

  // Countdown timer
  useEffect(() => {
    if (!isSuccess) return;

    const interval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [isSuccess]);

  // Redirect when countdown reaches 0
  useEffect(() => {
    if (countdown === 0 && isSuccess) {
      router.replace('/student-dashboard');
    }
  }, [countdown, isSuccess, router]);

  const verifyPayment = async () => {
    setIsVerifying(true);
    setError(null);

    await sendHttpRequest({
      requestConfig: {
        method: HttpMethod.GET,
        url: `/payments/verify?reference=${reference}`,
        isAuth: true,
      },
      successRes: (data: any) => {
        if (data.enrollmentCreated) {
          setIsSuccess(true);
          if (data.enrollment) {
            addEnrollment(data.enrollment);
          }
        } else {
          setError(new Error('Payment verified but enrollment could not be completed. Please contact support.'));
        }
        setIsVerifying(false);
      },
      errorRes: (err: any) => {
        setError(
          new Error(
            err?.data?.description || err?.data?.message || 
            err?.message ||
            'Payment verification failed. Please try again.'
          )
        );
        setIsVerifying(false);
      },
    });
  };

  const handleDashboardClick = () => {
    router.replace('/student-dashboard');
  };

  if (isVerifying) {
    return <LoadingState type={LoadingStateType.Skeleton} />;
  }

  if (error) {
    return <ErrorUI message={error.message} onRetry={verifyPayment} />;
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-white flex items-center justify-center p-4"
      >
        <div className="max-w-md w-full">
          {/* Animated Checkmark Circle */}
          <motion.div
            className="flex justify-center mb-12"
          >
            <div className="relative w-28 h-28">
              {/* Outer circle with gradient effect */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1, type: 'spring', stiffness: 100, damping: 12 }}
                className="absolute inset-0 bg-green-50 rounded-full border-2 border-green-100"
              />

              {/* Inner circle background */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="absolute inset-2 bg-green-100 rounded-full"
              />

              {/* Checkmark SVG */}
              <svg
                className="absolute inset-0 w-28 h-28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <motion.path
                  d="M5 13l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  stroke="#16a34a"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
                />
              </svg>
            </div>
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="text-center mb-10 space-y-3"
          >
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Payment Successful
            </h1>
            <p className="text-base text-gray-600 font-light leading-relaxed">
              Welcome! You now have full access to your course. Start learning today.
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDashboardClick}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-full transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Animated Countdown Progress */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="space-y-4"
          >
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: `${(countdown / 5) * 100}%` }}
                  transition={{ duration: 0.1, ease: 'linear' }}
                  className="h-full bg-gray-900 rounded-full"
                />
              </div>

              {/* Countdown Numbers */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 font-medium">
                  Auto-redirecting in
                </span>
                <motion.div
                  key={countdown}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="text-lg font-bold text-gray-900"
                >
                  {countdown}s
                </motion.div>
              </div>
            </div>

            {/* Info Text */}
            <p className="text-xs text-gray-500 text-center">
              Or click the button above to go to your dashboard now
            </p>
          </motion.div>

          {/* Reference Number - Apple Style */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="mt-12 pt-8 border-t border-gray-200 space-y-2 text-center"
          >
            <p className="text-xs text-gray-600 font-medium">
              REFERENCE NUMBER
            </p>
            <p className="font-mono text-sm text-gray-500 break-all tracking-wide">
              {reference}
            </p>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return null;
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingState type={LoadingStateType.Skeleton} />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
