'use client';

import { useState, useEffect } from 'react';
import { useHttp } from '@/hooks/useHttp';
import Card from '@/components/ui/Card';
import LoadingState from '@/components/ui/LoadingState';
import ErrorUI from '@/components/error/ErrorUI';
import { LoadingStateType } from '@/types/ui';
import { HttpMethod } from '@/types/http';

export default function AnalyticsPage() {
  const { isLoading, sendHttpRequest } = useHttp();
  const [analytics, setAnalytics] = useState<any>(null);
  const [error, setError] = useState<string>();

  useEffect(() => {
    fetchAnalytics();
  }, [sendHttpRequest]);

  const fetchAnalytics = async () => {
    setError(undefined);
    await sendHttpRequest({
      requestConfig: {
        method: HttpMethod.GET,
        url: '/admin/analytics',
        isAuth: true,
      },
      successRes: (data: any) => {
        setAnalytics(data.analytics || data);
      },
      errorRes: (err: any) => {
        setError(err?.data?.description || err?.data?.message ||  'Failed to load analytics');
      },
    });
  };

  if (isLoading && !analytics) {
    return <LoadingState type={LoadingStateType.Skeleton} />;
  }

  if (error && !analytics) {
    return <ErrorUI error={new Error(error)} statusCode={0} onRetry={fetchAnalytics} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">Platform performance and metrics</p>
      </div>

      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.totalUsers || 0}</p>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-gray-600">Total Courses</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{analytics.totalCourses || 0}</p>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600 mt-2">₦{analytics.totalRevenue || 0}</p>
          </Card>

          <Card className="p-6">
            <p className="text-sm text-gray-600">Avg Rating</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">{analytics.avgRating || 0}</p>
          </Card>
        </div>
      )}
    </div>
  );
}
