'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cubicBezier } from 'framer-motion';
import { useHttp } from '@/hooks/useHttp';
import { useEnrollment } from '@/hooks/useEnrollment';
import LoadingState from '@/components/ui/LoadingState';
import ErrorUI from '@/components/error/ErrorUI';
import DashboardHeader from '@/components/DashboardHeader';
import StatsGrid from '@/components/dashboard/StatsGrid';
import FeaturedCourse from '@/components/dashboard/FeaturedCourse';
import MoreCoursesGrid from '@/components/dashboard/MoreCoursesGrid';
import EmptyState from '@/components/dashboard/EmptyState';
import { HttpMethod } from '@/types/http';
import { DashboardData } from '@/types/dashboard';

export default function StudentDashboardPage() {
  const { isLoading, sendHttpRequest } = useHttp();
  const { setEnrollments } = useEnrollment();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string>();

  useEffect(() => {
    fetchDashboardData();
  }, [sendHttpRequest]);

  const fetchDashboardData = async () => {
    setError(undefined);
    await sendHttpRequest({
      requestConfig: {
        method: HttpMethod.GET,
        url: '/student/dashboard',
        isAuth: true,
      },
      successRes: (data: DashboardData) => {
        setData(data);
        // Populate Redux enrollment state
        if (data.enrollments && data.enrollments.length > 0) {
          setEnrollments(data.enrollments);
        }
      },
      errorRes: (err: any) => {
        setError(err?.data?.description || err?.data?.message ||  'Failed to load dashboard');
      },
    });
  };

  if (isLoading && !data) {
    return <LoadingState />;
  }

  if (error && !data) {
    return <ErrorUI error={new Error(error)} statusCode={0} onRetry={fetchDashboardData} />;
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: cubicBezier(0.22, 1, 0.36, 1) } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-white"
    >
      {/* Header */}
      <DashboardHeader hasEnrolledCourses={data ? data.recentCourses.length > 0 : false} />

      {/* Stats Grid */}
      {data && <StatsGrid stats={data.stats} variants={itemVariants} />}

      {/* Featured Course */}
      {data && data.recentCourses.length > 0 && (
        <FeaturedCourse course={data.recentCourses[0]} variants={itemVariants} />
      )}

      {/* More Courses Grid */}
      {data && data.recentCourses.length > 1 && (
        <MoreCoursesGrid courses={data.recentCourses} variants={itemVariants} />
      )}

      {/* Empty State */}
      {data && data.recentCourses.length === 0 && <EmptyState variants={itemVariants} />}

      <div className="h-12" />
    </motion.div>
  );
}
