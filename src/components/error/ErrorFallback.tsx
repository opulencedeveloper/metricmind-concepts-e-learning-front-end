'use client';

import Link from 'next/link';
import { Frown } from 'lucide-react';
import { ErrorFallbackProps } from '@/types/error';

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  if (process.env.NODE_ENV === 'development' && error) {
    console.log('ErrorBoundary caught:', error);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        {/* Error Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Frown className="w-8 h-8 text-red-600" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Something went wrong
        </h1>
        <p className="text-center text-gray-600 mb-6">
          We apologize for the inconvenience. An unexpected error occurred. Please try again or contact support if the issue persists.
        </p>

        {/* Buttons */}
        <button
          onClick={resetError}
          className="w-full bg-gray-900 hover:bg-gray-900 active:bg-gray-900 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 mb-3"
        >
          Try Again
        </button>

        <Link
          href="/"
          className="block text-center text-gray-800 hover:text-gray-800 font-medium transition duration-200"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorFallback;
