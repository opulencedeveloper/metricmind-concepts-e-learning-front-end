'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ShoppingCart, CheckCircle } from 'lucide-react'
import { useEnrollment } from '@/hooks/useEnrollment'
import { isAuthenticated } from '@/lib/utils/auth'
import { CourseEnrollmentProps } from '@/types/course'
import Feature from './Feature'
import ShareButton from '@/components/common/ShareButton'

export default function CourseEnrollment({
  course,
  isSticky = false,
}: CourseEnrollmentProps) {
  const router = useRouter()
  const { isEnrolled, setPendingEnrollment } = useEnrollment()

  const courseId = course._id
  const userIsAuthenticated = isAuthenticated()
  const enrolled = userIsAuthenticated && isEnrolled(courseId)

  const handleEnrollClick = () => {
    if (!isAuthenticated()) {
      // Store course for confirmation after login/signup
      setPendingEnrollment(courseId)
      router.push('/auth/login')
      return
    }
    if (enrolled) {
      router.push(`/student-dashboard/courses/${courseId}/learn`)
      return
    }
    router.push(`/student-dashboard/checkout?courseId=${courseId}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`space-y-4 p-6 bg-white rounded-2xl border border-gray-200 ${
        isSticky ? 'shadow-2xl' : 'shadow-lg'
      } transition-shadow duration-300`}
    >
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-gray-900">
            {course.currency}
          </span>
          <span className="text-4xl font-bold text-gray-900">
            {course.price}
          </span>
        </div>
        <p className="text-xs text-gray-600">30-day money-back guarantee</p>
      </div>

      <button
        onClick={handleEnrollClick}
        className={`w-full flex items-center justify-center gap-2 px-6 py-3 text-white rounded-lg font-semibold transition-colors duration-200 active:scale-95 ${
          enrolled
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-gray-900 hover:bg-gray-800'
        }`}
      >
        {enrolled ? (
          <>
            <CheckCircle className="h-5 w-5" />
            Continue Learning
          </>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5" />
            Enroll Now
          </>
        )}
      </button>

      <ShareButton
        title={course.title}
        text={`Check out this amazing course on MetricMind: ${course.title}. Start learning today!`}
      />

      <div className="space-y-3 pt-6 border-t border-gray-200">
        <Feature text="Full lifetime access" />
        <Feature text="Certificate of completion" />
        <Feature text="30-day money-back guarantee" />
        <Feature text="Access on mobile & desktop" />
      </div>
    </motion.div>
  )
}
