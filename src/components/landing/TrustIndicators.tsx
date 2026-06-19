'use client'

import { motion } from 'framer-motion'
import { trustIndicators } from './constants/trustIndicators'

export default function TrustIndicators() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
      },
    },
  }

  return (
    <div className="bg-linear-to-b from-white to-gray-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {trustIndicators.map((indicator) => {
            const Icon = indicator.icon
            return (
              <motion.div
                key={indicator.text}
                variants={itemVariants}
                className="flex flex-col items-center text-center"
              >
                <div className={`shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${indicator.iconBg}`}>
                  <Icon className={`h-8 w-8 ${indicator.iconColor}`} />
                </div>
                <div className="font-bold text-xl text-gray-900 mb-1">{indicator.text}</div>
                <div className="text-sm text-gray-600">{indicator.subtext}</div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
