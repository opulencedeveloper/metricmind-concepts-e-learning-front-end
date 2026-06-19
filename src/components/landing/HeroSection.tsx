'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { heroSlides } from './constants/heroSlides'

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const resumeAutoplayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const pauseAutoplay = (ms: number = 10000) => {
    setIsAutoPlaying(false)
    if (resumeAutoplayTimeoutRef.current) clearTimeout(resumeAutoplayTimeoutRef.current)
    resumeAutoplayTimeoutRef.current = setTimeout(() => {
      setIsAutoPlaying(true)
    }, ms)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    pauseAutoplay()
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    pauseAutoplay()
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    pauseAutoplay()
  }

  return (
    <div className="relative w-full bg-white">
      <div
        className="relative h-100 md:h-112.5 lg:h-125 overflow-hidden"
        role="region"
        aria-label="Hero carousel"
      >
        <AnimatePresence mode="wait">
          {heroSlides.map((slide, index) => {
            if (index !== currentSlide) return null

            return (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <div className="absolute inset-0" style={{ background: slide.gradient }} />
                <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-black/30" />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="max-w-2xl text-white"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className={`inline-block px-3 py-1.5 rounded-lg mb-4 ${slide.badgeClass}`}
                    >
                      <span className="text-xs font-bold tracking-wide">{slide.badge}</span>
                    </motion.div>

                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 leading-tight"
                    >
                      {slide.title}
                    </motion.h1>

                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className="text-xl md:text-2xl lg:text-3xl font-semibold mb-3 text-white/90"
                    >
                      {slide.subtitle}
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                      className="text-base md:text-lg mb-6 text-white/80 max-w-xl leading-relaxed"
                    >
                      {slide.description}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.6 }}
                    >
                      <Link
                        href={slide.ctaLink}
                        className="group inline-flex items-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base"
                      >
                        {slide.ctaText}
                        <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="hidden md:inline-flex absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200 text-white"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="hidden md:inline-flex absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200 text-white"
        >
          <ArrowRight className="h-6 w-6" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide ? 'true' : 'false'}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
