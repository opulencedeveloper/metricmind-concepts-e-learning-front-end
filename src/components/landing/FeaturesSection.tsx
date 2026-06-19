'use client'

import { motion, cubicBezier } from 'framer-motion'
import { Zap, Award, Users, Globe } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Learn at Your Pace',
    description: 'Lifetime access to all course materials. Study whenever and wherever you want.'
  },
  {
    icon: Award,
    title: 'Earn Certificates',
    description: 'Industry-recognized certificates upon course completion to boost your resume.'
  },
  {
    icon: Users,
    title: '24/7 Support',
    description: 'Expert instructors and community support available anytime to help you succeed.'
  },
  {
    icon: Globe,
    title: 'Global Community',
    description: 'Join millions of learners worldwide and connect with professionals from your field.'
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: cubicBezier(0.22, 1, 0.36, 1),
    },
  },
}

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl mb-6 shadow-sm group-hover:shadow-md transition-shadow duration-300"
                >
                  <Icon className="h-10 w-10 text-gray-800" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed font-light">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
