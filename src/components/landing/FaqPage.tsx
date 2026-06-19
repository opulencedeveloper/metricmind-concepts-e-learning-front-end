'use client'

import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ChevronDown, BookOpen, Clock, Award, User, HelpCircle } from 'lucide-react'

interface FaqItem {
  id: string
  question: string
  answer: ReactNode
  category: 'courses' | 'enrollment' | 'certificates' | 'account' | 'general'
}

const faqs: FaqItem[] = [
  {
    id: 'enrollment-1',
    category: 'enrollment',
    question: 'How do I enroll in a course?',
    answer: (
      <>
        You can enroll in a course directly from the course page by clicking the "Enroll Now" button. You can sign up as a guest or create an account to track your progress and access certificates upon completion.
      </>
    ),
  },
  {
    id: 'enrollment-2',
    category: 'enrollment',
    question: 'Do I need to purchase courses?',
    answer:
      'Many of our courses are free to audit, while some premium courses may require a fee. All course pricing is clearly displayed on the course page before enrollment.',
  },
  {
    id: 'enrollment-3',
    category: 'enrollment',
    question: 'Can I audit a course without paying?',
    answer:
      'Yes, most courses offer free audit access. As an auditor, you can view course materials and lessons, but you may not receive a certificate of completion.',
  },
  {
    id: 'courses-1',
    category: 'courses',
    question: 'What is the course duration and time commitment?',
    answer:
      'Course duration varies. Most courses can be completed in 4-12 weeks if you dedicate 3-5 hours per week. However, you can learn at your own pace—there are no fixed deadlines.',
  },
  {
    id: 'courses-2',
    category: 'courses',
    question: 'Can I download course materials?',
    answer:
      'Yes, you can download course videos, lecture notes, and assignments for offline viewing. This allows you to learn even when you don\'t have internet access.',
  },
  {
    id: 'courses-3',
    category: 'courses',
    question: 'What happens if I don\'t complete a course?',
    answer:
      'You can keep your course enrollment indefinitely and resume whenever you\'re ready. There\'s no time limit to complete a course, so you can learn at your own pace.',
  },
  {
    id: 'certificates-1',
    category: 'certificates',
    question: 'How do I earn a certificate?',
    answer:
      'After completing all course lessons and assignments, you must pass the final assessment to earn your certificate of completion.',
  },
  {
    id: 'certificates-2',
    category: 'certificates',
    question: 'Are the certificates recognized?',
    answer:
      'Our certificates demonstrate your completion of structured courses and acquired skills. While they\'re valuable for your professional profile, employers may have different recognition levels depending on the industry.',
  },
  {
    id: 'certificates-3',
    category: 'certificates',
    question: 'Can I share my certificate?',
    answer:
      'Yes, you can download your certificate and share it on LinkedIn, your resume, or your professional portfolio to showcase your completed courses and skills.',
  },
  {
    id: 'account-1',
    category: 'account',
    question: 'Do I need an account to start learning?',
    answer:
      'You can start viewing courses without an account, but creating an account helps you track progress, save courses, and access certificates upon completion.',
  },
  {
    id: 'account-2',
    category: 'account',
    question: 'Can I update my learning goals?',
    answer:
      'Yes, you can update your profile and learning preferences anytime. This helps us recommend courses that match your interests and skill level.',
  },
  {
    id: 'general-1',
    category: 'general',
    question: 'What if I have technical issues while taking a course?',
    answer: (
      <>
        If you experience technical problems, please visit our{' '}
        <Link href="/contact" className="text-gray-800 underline-offset-2 hover:underline font-medium">
          Contact page
        </Link>{' '}
        and describe the issue. Our support team will help resolve it as quickly as possible.
      </>
    ),
  },
  {
    id: 'general-2',
    category: 'general',
    question: 'How can I provide feedback about a course?',
    answer:
      'You can rate and review courses directly on the course page. Your feedback helps us improve our content and helps other learners make informed decisions.',
  },
]

const categoryLabels: Record<FaqItem['category'], string> = {
  courses: 'Courses & Learning',
  enrollment: 'Enrollment',
  certificates: 'Certificates',
  account: 'Account & Progress',
  general: 'General Questions',
}

export default function FaqPage() {
  const [activeId, setActiveId] = useState<string | null>(faqs[0]?.id ?? null)
  const [activeCategory, setActiveCategory] = useState<FaqItem['category'] | 'all'>('all')

  const filteredFaqs = activeCategory === 'all'
    ? faqs
    : faqs.filter((item) => item.category === activeCategory)

  const handleToggle = (id: string) => {
    setActiveId((current) => (current === id ? null : id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        {/* Header */}
        <header className="mb-8 sm:mb-12 lg:mb-14 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-gray-900 text-white flex items-center justify-center overflow-hidden">
              <BookOpen className="h-8 w-8" />
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-gray-800 mb-1">
                Frequently Asked Questions
              </p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                Learning made simple and accessible
              </h1>
              <p className="mt-1 text-sm text-gray-500 max-w-xl">
                Find quick answers about courses, enrollment, certificates, and your learning journey. We're here to help you succeed.
              </p>
            </div>
          </div>

          {/* Small highlight card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-gray-100 bg-gray-50/70 px-4 py-3 shadow-sm max-w-xs sm:max-w-sm"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                <HelpCircle className="h-4 w-4 text-gray-800" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-900">
                  Can't find the answer you're looking for?
                </p>
                <p className="mt-0.5 text-[11px] text-gray-900/80 leading-relaxed">
                  Reach out to our support team through the contact page—we're happy to help with any questions.
                </p>
              </div>
            </div>
          </motion.div>
        </header>

        {/* Category filters */}
        <section className="mb-6 sm:mb-8">
          <div className="flex flex-wrap gap-2 sm:gap-3 items-center text-xs sm:text-[13px]">
            <span className="text-[11px] uppercase tracking-[0.18em] text-gray-400 mr-1 sm:mr-2">
              Browse by topic
            </span>
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 transition-colors ${
                activeCategory === 'all'
                  ? 'border-gray-700 bg-gray-50 text-gray-800'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-200 hover:text-gray-800'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>All</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('courses')}
              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 transition-colors ${
                activeCategory === 'courses'
                  ? 'border-gray-700 bg-gray-50 text-gray-800'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-200 hover:text-gray-800'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Courses</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('enrollment')}
              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 transition-colors ${
                activeCategory === 'enrollment'
                  ? 'border-gray-700 bg-gray-50 text-gray-800'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-200 hover:text-gray-800'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Enrollment</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('certificates')}
              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 transition-colors ${
                activeCategory === 'certificates'
                  ? 'border-gray-700 bg-gray-50 text-gray-800'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-200 hover:text-gray-800'
              }`}
            >
              <Award className="h-3.5 w-3.5" />
              <span>Certificates</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('account')}
              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 transition-colors ${
                activeCategory === 'account'
                  ? 'border-gray-700 bg-gray-50 text-gray-800'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-200 hover:text-gray-800'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>Account</span>
            </button>
          </div>
        </section>

        {/* FAQ list */}
        <section aria-label="Frequently asked questions" className="space-y-4 sm:space-y-5">
          {filteredFaqs.map((item) => {
            const isOpen = activeId === item.id

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <button
                  type="button"
                  onClick={() => handleToggle(item.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 sm:py-4 text-left"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-800 mb-0.5">
                      {categoryLabels[item.category]}
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-gray-900">
                      {item.question}
                    </p>
                  </div>
                  <div className="ml-3 flex-shrink-0 rounded-full border border-gray-200 bg-gray-50 p-1.5 text-gray-500">
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.span>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-4 sm:px-5 pb-3.5 sm:pb-4"
                    >
                      <div className="h-px w-full bg-gradient-to-r from-gray-100 via-gray-50 to-transparent mb-3" />
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}

          {filteredFaqs.length === 0 && (
            <p className="text-sm text-gray-500">
              No questions found for this category.
            </p>
          )}
        </section>

        {/* Bottom helper note */}
        <section className="mt-10 sm:mt-12">
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 px-4 sm:px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 text-gray-900 text-sm font-medium">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-white text-xs font-semibold">
                ?
              </span>
              <span>Still have questions about learning?</span>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-900/80 sm:ml-auto max-w-md">
              Visit the{' '}
              <Link
                href="/contact"
                className="text-gray-800 underline-offset-2 hover:underline font-medium"
              >
                Contact page
              </Link>{' '}
              to connect with our support team. We're here to help you get the most out of your learning journey.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
