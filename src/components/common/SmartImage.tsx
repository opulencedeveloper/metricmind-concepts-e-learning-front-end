'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SmartImageProps } from '@/types/image'

export default function SmartImage({
  src,
  alt,
  className = '',
  containerClassName = '',
  preload = false,
  blurDataURL,
  useSkeleton = false,
  eager = false,
  ...props
}: SmartImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  const isExternalString = typeof src === 'string' && src.startsWith('http')
  const isAlreadyOptimized =
    (isExternalString && (src.includes('img.youtube.com') || src.includes('images.unsplash.com'))) ||
    (typeof src === 'string' && src.includes('/assets/blogs/'))

  const unoptimized = props.unoptimized ?? isAlreadyOptimized

  const isStatic = typeof src === 'object' && src !== null
  const hasExplicitBlur = !!blurDataURL
  const hasStaticBlur = isStatic && 'blurDataURL' in src && !!(src as any).blurDataURL

  const shouldUseNextBlur = (hasExplicitBlur || hasStaticBlur) && !useSkeleton

  const isFill = props.fill === true
  const wrapperClasses = `relative overflow-hidden ${isFill ? 'w-full h-full' : ''} ${containerClassName}`

  return (
    <div className={wrapperClasses}>
      <AnimatePresence>
        {!isLoaded && !shouldUseNextBlur && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-gray-200/80 z-10"
          >
            <div
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent w-full h-full animate-[shimmer_1.5s_infinite]"
              style={{ transform: 'skewX(-20deg)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Image
        src={src}
        alt={alt}
        className={`transition-opacity duration-700 ease-in-out ${
          !isLoaded && !shouldUseNextBlur && !isStatic ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        onLoad={() => setIsLoaded(true)}
        placeholder={shouldUseNextBlur ? 'blur' : undefined}
        blurDataURL={blurDataURL}
        unoptimized={unoptimized}
        loading={eager ? 'eager' : 'lazy'}
        {...props}
      />

      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-150%) skewX(-20deg);
          }
          50% {
            transform: translateX(150%) skewX(-20deg);
          }
          100% {
            transform: translateX(150%) skewX(-20deg);
          }
        }
      `}</style>
    </div>
  )
}
