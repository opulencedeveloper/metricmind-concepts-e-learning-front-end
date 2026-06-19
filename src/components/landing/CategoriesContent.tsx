'use client'

import { motion, cubicBezier } from 'framer-motion'
import Link from 'next/link'
import SmartImage from '@/components/common/SmartImage'
import { ArrowRight } from 'lucide-react'
import { getCategoryLabel } from '@/enums/category'
import { CategoriesContentProps } from '@/types/landing'
import { categoryImages } from '@/constants/category'

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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: cubicBezier(0.22, 1, 0.36, 1),
    },
  },
}

export default function CategoriesContent({ categories }: CategoriesContentProps) {
  const displayCategories = categories.slice(0, 6)

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4 tracking-tight">
            Explore Learning Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
            Discover our diverse collection of courses organized by category for easy browsing.
          </p>
          {categories.length > 6 && (
            <Link
              href="/courses"
              className="group inline-flex items-center px-8 py-3.5 border-2 border-gray-300 text-gray-900 font-medium rounded-full hover:bg-gray-50 transition-all duration-300"
            >
              View All Categories
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          )}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {displayCategories.map((category) => (
            <motion.div
              key={category}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <Link href={`/courses?category=${encodeURIComponent(category)}`}>
                <div className="aspect-4/3 relative">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative h-full w-full"
                  >
                    <SmartImage
                      src={categoryImages[category] || 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=500&h=375&fit=crop'}
                      alt={category}
                      fill
                      className="object-cover"
                      unoptimized
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=500&h=375&fit=crop'
                      }}
                    />
                    <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-all duration-500" />
                  </motion.div>
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-end p-8">
                  <motion.div
                    initial={{ opacity: 1 }}
                    whileHover={{ opacity: 0.95 }}
                    className="text-center text-white w-full"
                  >
                    <h3 className="text-3xl font-semibold mb-2">
                      {getCategoryLabel(category as any)}
                    </h3>
                    <p className="text-base mb-6 max-w-xs mx-auto font-normal">
                      Learn new skills and advance your career
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 border border-white/30"
                    >
                      <span className="text-sm font-medium">Explore</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </motion.div>
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
