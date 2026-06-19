'use client';

import { motion } from 'framer-motion';
import { BookOpen, Flame, Award } from 'lucide-react';
import { formatHoursToReadable } from '@/utils/formatTime';
import { StatsGridProps } from '@/types/dashboard';

export default function StatsGrid({ stats, variants }: StatsGridProps) {
  return (
    <motion.div variants={variants} className="mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Enrolled */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="group rounded-2xl bg-linear-to-br from-gray-50 to-white border border-gray-200 p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-600">Courses Enrolled</p>
            <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-all flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-gray-900" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalEnrolled}</p>
          <p className="text-xs text-gray-500 mt-2">Active learning journey</p>
        </motion.div>

        {/* In Progress */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="group rounded-2xl bg-linear-to-br from-blue-50 to-white border border-blue-100 p-6 hover:border-blue-200 hover:shadow-sm transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-600">In Progress</p>
            <div className="w-10 h-10 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-all flex items-center justify-center">
              <Flame className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
          <p className="text-xs text-gray-500 mt-2">Keep the streak going</p>
        </motion.div>

        {/* Completed */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="group rounded-2xl bg-linear-to-br from-green-50 to-white border border-green-100 p-6 hover:border-green-200 hover:shadow-sm transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-600">Completed</p>
            <div className="w-10 h-10 rounded-full bg-green-100 group-hover:bg-green-200 transition-all flex items-center justify-center">
              <Award className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
          <p className="text-xs text-gray-500 mt-2">Accomplishments unlocked</p>
        </motion.div>

        {/* Total Hours */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="group rounded-2xl bg-linear-to-br from-purple-50 to-white border border-purple-100 p-6 hover:border-purple-200 hover:shadow-sm transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-600">Total Hours</p>
            <div className="w-10 h-10 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-all flex items-center justify-center">
              <span className="text-sm font-bold text-purple-600">⏱</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-purple-600">{formatHoursToReadable(stats.totalHours)}</p>
          <p className="text-xs text-gray-500 mt-2">Time invested in growth</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
