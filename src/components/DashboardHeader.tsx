'use client';

import { motion } from 'framer-motion';
import { cubicBezier } from 'framer-motion';
import { DashboardHeaderProps } from '@/types/dashboard';

export default function DashboardHeader({ hasEnrolledCourses }: DashboardHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: cubicBezier(0.22, 1, 0.36, 1) }}
      className="py-8 sm:py-12"
    >
      {hasEnrolledCourses ? (
        <>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Keep Learning
          </h1>
          <p className="text-lg text-gray-600 mt-3 max-w-2xl">
            Continue where you left off or explore new skills
          </p>
        </>
      ) : (
        <>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Welcome to MetricMind
          </h1>
          <p className="text-lg text-gray-600 mt-3 max-w-2xl">
            Explore our course collection and start your learning journey today
          </p>
        </>
      )}
    </motion.div>
  );
}
