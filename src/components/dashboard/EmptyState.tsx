'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { EmptyStateProps } from '@/types/dashboard';

export default function EmptyState({ variants }: EmptyStateProps) {
  return (
    <motion.div variants={variants}>
      <div className="rounded-3xl border border-gray-200 bg-linear-to-br from-gray-50 to-white p-12 sm:p-16 text-center">
        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Start Your Learning Journey</h3>
        <p className="text-gray-600 mb-8 max-w-lg mx-auto">
          Explore our course collection and enroll in something that interests you
        </p>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link href="/courses">
            <button className="inline-flex items-center gap-2 bg-gray-900 text-white font-semibold rounded-xl px-8 py-3 hover:bg-gray-800 transition-colors">
              Explore Courses
            </button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
