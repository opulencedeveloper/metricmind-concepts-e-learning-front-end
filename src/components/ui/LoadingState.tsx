'use client';

import { LoadingStateProps } from '@/types/ui';
import { LoadingStateType } from '@/types/ui';

const LoadingState: React.FC<LoadingStateProps> = ({ type = LoadingStateType.Skeleton, count = 1 }) => {
  switch (type) {
    case LoadingStateType.Card:
      return (
        <div className="space-y-4">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="h-40 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      );

    case LoadingStateType.Grid:
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="h-96 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      );

    case LoadingStateType.Checkout:
      return (
        <div className="max-w-2xl mx-auto py-8 space-y-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
          <div className="h-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-32 bg-gray-200 rounded animate-pulse" />
        </div>
      );

    default: // LoadingStateType.Skeleton
      return (
        <div className="space-y-6">
          <div className="h-12 bg-gray-200 rounded animate-pulse" />
          <div className="h-80 bg-gray-200 rounded animate-pulse" />
          <div className="h-96 bg-gray-200 rounded animate-pulse" />
        </div>
      );
  }
};

export default LoadingState;
