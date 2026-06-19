'use client';

import { motion } from 'framer-motion';
import { ErrorUIProps } from '@/types/error';

const ErrorUI: React.FC<ErrorUIProps> = ({
  onRetry,
  message,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-center py-16"
    >
      {/* Minimalist icon - Apple style */}
      <div className="flex justify-center mb-8">
        <div className="p-4 bg-gray-100 rounded-full">
          <svg
            className="h-7 w-7 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4v2m0 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-semibold text-gray-900 mb-3 tracking-tight">
        Unable to Load
      </h3>

      {/* Message */}
      <p className="text-gray-600 max-w-md mx-auto font-light mb-8 leading-relaxed">
        {message || 'Something went wrong. Please check your connection and try again.'}
      </p>

      {/* Actions - Apple style buttons */}
      <div className="flex flex-col gap-3 justify-center items-center sm:flex-row sm:gap-4">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-8 py-3 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 active:bg-gray-950 transition-all duration-200"
          >
            Try Again
          </button>
        )}
        <button
          onClick={() => (window.location.href = '/')}
          className="px-8 py-3 text-gray-600 font-medium hover:text-gray-900 transition-colors duration-200"
        >
          Go Home
        </button>
      </div>
    </motion.div>
  );
};

export default ErrorUI;
