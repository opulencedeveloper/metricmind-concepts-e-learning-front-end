'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, BookOpen, Send } from 'lucide-react'
import { useHttp } from '@/hooks/useHttp'
import { HttpMethod } from '@/types/http'
import { ContactFormData } from '@/types/landing'
import { PreferredContact } from '@/enums/landing'

const initialFormData: ContactFormData = {
  fullName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  courseName: '',
  preferredContact: PreferredContact.Email,
}

export default function ContactPage() {
  const { sendHttpRequest, isLoading, error } = useHttp()
  const [formData, setFormData] = useState<ContactFormData>(initialFormData)
  const [localError, setLocalError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (localError) setLocalError(null)
  }

  const handlePreferredChange = (value: PreferredContact) => {
    setFormData((prev) => ({
      ...prev,
      preferredContact: value,
    }))
    if (localError) setLocalError(null)
  }

  const validate = (): string | null => {
    if (!formData.fullName.trim()) return 'Please enter your full name.'

    const email = formData.email.trim()
    const phone = formData.phone.trim()

    if (formData.preferredContact === PreferredContact.Email) {
      if (!email) return 'Please enter your email address.'
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) return 'Please enter a valid email address.'
    } else {
      if (!phone) return 'Please enter your phone number.'
      if (phone.length < 7) return 'Please enter a valid phone number.'
    }

    if (!formData.subject.trim()) return 'Please enter a subject.'
    if (!formData.message.trim() || formData.message.trim().length < 20) {
      return 'Please provide at least 20 characters in your message so our team can assist you properly.'
    }
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    setSuccessMessage(null)

    const validationError = validate()
    if (validationError) {
      setLocalError(validationError)
      return
    }

    const email = formData.email.trim()
    const phone = formData.phone.trim()

    sendHttpRequest({
      requestConfig: {
        method: HttpMethod.POST,
        url: '/contact',
        body: {
          fullName: formData.fullName.trim(),
          email: email || undefined,
          phone: phone || undefined,
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          courseName: formData.courseName?.trim() || undefined,
          preferredContact: formData.preferredContact,
        },
        contentType: 'application/json',
        successMessage: 'Your message has been sent to our support team.',
      },
      successRes: () => {
        setSuccessMessage(
          'Thank you for reaching out. Our team will get back to you within 1–2 business days.'
        )
        setFormData(initialFormData)
      },
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 sm:mb-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div className="flex items-start gap-4">
            <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 shadow-lg flex items-center justify-center overflow-hidden">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                Contact MetricMind Support
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Exceptional learning support for your educational journey.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-gray-800" />
              <span>Expert guidance</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-800" />
              <span>Response within 1–2 business days</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Contact details */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6 lg:col-span-1"
          >
            <div className="rounded-2xl border border-gray-100 bg-white/90 shadow-md p-6 space-y-5">
              <div>
                <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-[0.2em] mb-1">
                  Learning Support
                </h2>
                <p className="text-base font-semibold text-gray-900">
                  Let's help you succeed.
                </p>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  Share your questions, course concerns, or feedback and our team will respond with the care and attention you deserve.
                </p>
              </div>

              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-50 border border-gray-100">
                    <Mail className="h-4 w-4 text-gray-800" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">
                      We typically reply within 24 to 48 hours on business days.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-50 border border-gray-100">
                    <Phone className="h-4 w-4 text-gray-800" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-0.5">Phone (Mon-Fri)</p>
                    <p className="text-gray-600 text-sm font-normal">
                      +1 (555) 123-4567
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      For urgent learning-related issues, please include your course name in the message form.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-50 border border-gray-100">
                    <MapPin className="h-4 w-4 text-gray-800" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Headquarters</p>
                    <p className="text-gray-600 text-sm">
                      San Francisco, CA 94102
                      <br />
                      United States
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 p-5 space-y-3">
              <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Course Issues?
              </p>
              <p className="text-xs text-gray-900/80 leading-relaxed">
                If your question is about a specific course, include the{' '}
                <span className="font-semibold">course name</span> so our team can provide precise guidance and support.
              </p>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2"
          >
            <div className="rounded-2xl border border-gray-100 bg-white/95 shadow-lg p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Send a message to our learning team
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  All fields marked with * are required.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Full name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div>
                    {formData.preferredContact === 'email' ? (
                      <>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Email address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                          placeholder="you@example.com"
                        />
                      </>
                    ) : (
                      <>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Phone number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                          placeholder="+1 (555) 123-4567"
                        />
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                      placeholder="e.g. Question about course content"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Course name (optional)
                    </label>
                    <input
                      type="text"
                      name="courseName"
                      value={formData.courseName || ''}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
                      placeholder="e.g. Web Development 101"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    How should we contact you?
                  </label>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => handlePreferredChange(PreferredContact.Email)}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 border ${
                        formData.preferredContact === PreferredContact.Email
                          ? 'border-gray-700 bg-gray-50 text-gray-800'
                          : 'border-gray-200 bg-white text-gray-600'
                      }`}
                    >
                      <Mail className="h-3 w-3" />
                      <span>Email</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePreferredChange(PreferredContact.Phone)}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 border ${
                        formData.preferredContact === PreferredContact.Phone
                          ? 'border-gray-700 bg-gray-50 text-gray-800'
                          : 'border-gray-200 bg-white text-gray-600'
                      }`}
                    >
                      <Phone className="h-3 w-3" />
                      <span>Phone</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent resize-none"
                    placeholder="Tell us about your learning question or concern. The more details you share, the better we can help."
                  />
                </div>

                {localError && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-2 py-1">
                    {localError}
                  </p>
                )}
                {!localError && error && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md px-2 py-1">
                    {error}
                  </p>
                )}
                {successMessage && (
                  <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-md px-2 py-1">
                    {successMessage}
                  </p>
                )}

                <div className="pt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[11px] text-gray-400 max-w-none sm:max-w-xs">
                    By submitting this form, you agree that we may contact you regarding your learning request and related educational services.
                  </p>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto justify-center inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-900 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <span className="h-4 w-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Send message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
