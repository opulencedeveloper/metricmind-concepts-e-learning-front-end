import type { Metadata } from 'next'
import ContactPage from '@/components/landing/ContactPage'

export const metadata: Metadata = {
  title: 'Contact Us - MetricMind',
  description: 'Get in touch with our learning support team. We\'re here to help with any questions about courses, enrollment, or your learning journey.',
}

export default function ContactPageRoute() {
  return <ContactPage />
}
