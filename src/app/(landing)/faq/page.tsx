import type { Metadata } from 'next'
import FaqPage from '@/components/landing/FaqPage'

export const metadata: Metadata = {
  title: 'FAQ - MetricMind',
  description: 'Find answers to frequently asked questions about courses, enrollment, certificates, and your learning journey.',
}

export default function FAQPageRoute() {
  return <FaqPage />
}
