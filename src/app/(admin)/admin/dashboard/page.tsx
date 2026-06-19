'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useHttp } from '@/hooks/useHttp';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';
import ErrorUI from '@/components/error/ErrorUI';
import { ButtonVariant, ButtonSize, LoadingStateType } from '@/types/ui';
import { HttpMethod } from '@/types/http';
import { CardColor } from '@/types/admin';
import {
  AdminDashboardStats,
  DashboardCoursesResponse,
  StatCardProps,
  ActionButtonProps,
  DashboardCourseCardProps,
} from '@/types/admin';
import AdminStatCard from '@/components/admin/AdminStatCard';
import AdminActionButton from '@/components/admin/AdminActionButton';
import AdminCourseCard from '@/components/admin/AdminCourseCard';

export default function AdminDashboardPage() {
  const { isLoading, sendHttpRequest } = useHttp();
  const [stats, setStats] = useState<AdminDashboardStats>({
    totalCourses: 0,
    totalStudents: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
  });
  const [courses, setCourses] = useState<any[]>([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    fetchDashboardData();
  }, [sendHttpRequest]);

  const fetchDashboardData = async () => {
    setError(undefined);

    await sendHttpRequest({
      requestConfig: {
        method: HttpMethod.GET,
        url: '/admin/stats',
        isAuth: true,
      },
      successRes: (data: any) => {
        const statsData = data.data?.stats || data.stats || {};
        setStats({
          totalCourses: statsData.totalCourses || 0,
          totalStudents: statsData.totalStudents || 0,
          totalEnrollments: statsData.totalEnrollments || 0,
          totalRevenue: statsData.totalRevenue || 0,
        });
      },
      errorRes: (err: any) => {
        setError(err?.data?.description || err?.data?.message ||  'Failed to load dashboard');
      },
    });

    await sendHttpRequest({
      requestConfig: {
        method: HttpMethod.GET,
        url: '/admin/courses',
        isAuth: true,
      },
      successRes: (data: DashboardCoursesResponse) => {
        setCourses(data.courses || []);
      },
      errorRes: () => {
        // Silent fail for courses list
      },
    });
  };

  if (isLoading) {
    return <LoadingState type={LoadingStateType.Skeleton} />;
  }

  if (error) {
    return <ErrorUI error={new Error(error)} statusCode={0} onRetry={fetchDashboardData} />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your course performance overview.</p>
        </div>
        <Link href="/admin/courses/create">
          <Button variant={ButtonVariant.Primary} size={ButtonSize.Large}>
            ➕ Create Course
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard
          title="Total Courses"
          value={stats.totalCourses}
          icon="📚"
          color={CardColor.Primary}
        />
        <AdminStatCard
          title="Total Students"
          value={stats.totalStudents}
          icon="👥"
          color={CardColor.Green}
        />
        <AdminStatCard
          title="Total Enrollments"
          value={stats.totalEnrollments}
          icon="📝"
          color={CardColor.Purple}
        />
        <AdminStatCard
          title="Total Revenue"
          value={`₦${stats.totalRevenue.toLocaleString()}`}
          icon="💰"
          color={CardColor.Orange}
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <Card className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <AdminActionButton label="Create Course" href="/admin/courses/create" icon="📚" />
          <AdminActionButton label="View Courses" href="/admin/courses" icon="📋" />
          <AdminActionButton label="Analytics" href="/admin/analytics" icon="📊" />
          <AdminActionButton label="Settings" href="/admin/settings" icon="⚙️" />
        </Card>
      </div>

      {/* Recent Courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Courses</h2>
          <Link href="/admin/courses" className="text-gray-800 hover:text-gray-800 font-medium">
            View All →
          </Link>
        </div>

        {courses.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-600 mb-4">No courses yet. Create your first course to get started!</p>
            <Link href="/admin/courses/create">
              <Button variant={ButtonVariant.Primary}>Create Course</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 6).map((course) => (
              <AdminCourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
