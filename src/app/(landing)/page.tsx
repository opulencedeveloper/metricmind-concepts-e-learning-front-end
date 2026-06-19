import type { Metadata } from 'next'
import { Suspense } from 'react'
import HeroSection from '@/components/landing/HeroSection'
import FeaturedCoursesSection from '@/components/landing/FeaturedCoursesSection'
import CategoriesSection from '@/components/landing/CategoriesSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import StatsSection from '@/components/landing/StatsSection'
import NewsletterSection from '@/components/landing/NewsletterSection'
import CTASection from '@/components/landing/CTASection'
import { FeaturedCoursesSkeleton } from '@/components/skeletons/FeaturedCoursesSkeleton'
import { CategoriesSkeleton } from '@/components/skeletons/CategoriesSkeleton'

export const metadata: Metadata = {
  title: 'MetricMind - Learn, Grow, Succeed',
  description:
    'Master new skills with thousands of courses in programming, design, business, and more. Learn at your own pace from industry experts.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'MetricMind - Learn, Grow, Succeed',
    description:
      'Master new skills with thousands of courses. Learn at your own pace from industry experts.',
    url: '/',
    type: 'website',
  },
  twitter: {
    title: 'MetricMind - Learn, Grow, Succeed',
    description: 'Master new skills with thousands of courses. Learn at your own pace from industry experts.',
  },
}

export default function LandingPage() {
  return (
    <main className="w-full bg-white">
      <HeroSection />

      <Suspense fallback={<FeaturedCoursesSkeleton />}>
        <FeaturedCoursesSection />
      </Suspense>

      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoriesSection />
      </Suspense>

      <FeaturesSection />
      <StatsSection />
      <NewsletterSection source="landing" />
      <CTASection />
    </main>
  )
}
