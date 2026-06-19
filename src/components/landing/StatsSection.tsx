'use client'

import { motion } from 'framer-motion'
import { BookOpen, Users, Award, Globe } from 'lucide-react'

const stats = [
  {
    icon: BookOpen,
    number: '50,000+',
    label: 'Courses Available'
  },
  {
    icon: Users,
    number: '10M+',
    label: 'Active Learners'
  },
  {
    icon: Award,
    number: '2M+',
    label: 'Certificates Issued'
  },
  {
    icon: Globe,
    number: '190+',
    label: 'Countries Reached'
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
    },
  },
}

export default function StatsSection() {
  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4"
                >
                  <Icon className="h-8 w-8 text-gray-800" />
                </motion.div>
                <p className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </p>
                <p className="text-gray-600 text-lg">
                  {stat.label}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
