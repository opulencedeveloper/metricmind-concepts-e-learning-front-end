'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, CheckCircle, AlertCircle, BookOpen } from 'lucide-react'

interface NewsletterSectionProps {
  source?: string
}

export default function NewsletterSection({ source = 'landing' }: NewsletterSectionProps) {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [success, setSuccess] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const validate = (): string | null => {
    if (!email.trim()) {
      return 'Please enter your email address.'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address.'
    }
    if (!consent) {
      return 'You must consent to receive email communications.'
    }
    return null
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLocalError(null)
    setSuccess(false)

    const validationError = validate()
    if (validationError) {
      setLocalError(validationError)
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setSuccess(true)
      setEmail('')
      setConsent(false)
      setIsLoading(false)
      setTimeout(() => setSuccess(false), 5000)
    }, 1000)
  }

  return (
    <section className="py-20 sm:py-24 lg:py-28 relative overflow-hidden">
      {/* Luxury blue gradient background with learning theme */}
      <div className="absolute inset-0 bg-linear-to-br from-gray-50 via-gray-50/80 to-white" />

      {/* Decorative learning elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='1'%3E%3Cpath d='M30 0l5 10 10 5-10 5-5 10-5-10-10-5 10-5z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        {/* Floating decorative circles */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-gray-200/20 rounded-full mix-blend-multiply filter blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gray-300/15 rounded-full mix-blend-multiply filter blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Logo and icon header */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 200 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="relative h-16 w-16 rounded-2xl bg-linear-to-br from-gray-800 via-gray-800 to-gray-900 shadow-xl flex items-center justify-center overflow-hidden">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div className="h-px w-12 bg-linear-to-r from-transparent via-gray-300 to-transparent"></div>
            <div className="relative h-14 w-14 rounded-xl bg-gray-100 border-2 border-gray-200 shadow-lg flex items-center justify-center">
              <Mail className="h-7 w-7 text-gray-800" />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight"
          >
            Stay Updated with MetricMind
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-base sm:text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Subscribe to receive exclusive course recommendations, learning tips, and special offers
            delivered straight to your inbox. Join our community of lifelong learners.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            onSubmit={handleSubmit}
            className="max-w-lg mx-auto space-y-4"
          >
            {/* Email input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (localError) setLocalError(null)
                  if (success) setSuccess(false)
                }}
                placeholder="Enter your email address"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 bg-white/90 backdrop-blur-sm text-base focus:outline-none focus:ring-2 focus:ring-gray-700/30 focus:border-gray-700 text-gray-900 placeholder-gray-400 shadow-sm transition-all"
                disabled={isLoading || success}
              />
            </div>

            {/* Subscribe button */}
            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-linear-to-r from-gray-800 via-gray-800 to-gray-900 text-white font-semibold rounded-xl hover:from-gray-800 hover:via-gray-900 hover:to-gray-900 disabled:opacity-60 disabled:cursor-not-allowed transition-all text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <span className="h-5 w-5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                  <span>Subscribing...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>Subscribed!</span>
                </>
              ) : (
                <>
                  <Mail className="h-5 w-5" />
                  <span>Subscribe to Newsletter</span>
                </>
              )}
            </button>

            {/* Consent checkbox */}
            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id={`newsletter-consent-${source}`}
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked)
                  if (localError) setLocalError(null)
                }}
                className="mt-0.5 h-4 w-4 text-gray-800 border-gray-300 rounded focus:ring-gray-700 focus:ring-2 shrink-0"
                disabled={isLoading || success}
              />
              <label
                htmlFor={`newsletter-consent-${source}`}
                className="text-sm text-gray-600 leading-relaxed cursor-pointer"
              >
                I consent to receive email communications about new courses, exclusive offers, and
                learning updates from MetricMind. You can unsubscribe at any time.
              </label>
            </div>

            {/* Error message */}
            {localError && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3"
              >
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{localError}</span>
              </motion.div>
            )}

            {/* Success message */}
            {success && !localError && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-3"
              >
                <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Thank you for subscribing! Check your inbox for confirmation.</span>
              </motion.div>
            )}
          </motion.form>

          {/* Decorative bottom accent */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-12 h-px w-24 mx-auto bg-linear-to-r from-transparent via-gray-300 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  )
}
