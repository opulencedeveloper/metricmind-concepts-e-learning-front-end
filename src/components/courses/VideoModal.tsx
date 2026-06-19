'use client'

import { useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { VideoModalProps } from '@/types/course'

export default function VideoModal({
  videoUrl,
  courseTitle,
  onClose,
}: VideoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Extract Vimeo ID from URL
  const getVimeoEmbedUrl = useCallback((url: string): string => {
    const vimeoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/)
    const vimeoId = vimeoIdMatch?.[1]

    if (!vimeoId) {
      console.warn('Invalid Vimeo URL:', url)
      return ''
    }

    return `https://player.vimeo.com/video/${vimeoId}?h=4d96bf1f5f&badge=0&autopause=0&player_id=0&app_id=58479`
  }, [])

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    // Prevent body scroll when modal is open
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = originalOverflow
    }
  }, [onClose])

  // Handle click outside modal
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (modalRef.current && e.target === modalRef.current) {
        onClose()
      }
    },
    [onClose]
  )

  const embedUrl = getVimeoEmbedUrl(videoUrl)

  if (!embedUrl) {
    return null
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        ref={modalRef}
        onClick={handleBackdropClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-modal-title"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full max-w-4xl bg-black rounded-lg overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-black px-6 py-4 border-b border-gray-800">
            <h2
              id="video-modal-title"
              className="text-white font-semibold truncate flex-1 mr-4"
            >
              {courseTitle}
            </h2>
            <button
              onClick={onClose}
              className="flex-shrink-0 text-gray-400 hover:text-white transition-colors p-1"
              aria-label="Close video modal"
              type="button"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Video Container - 16:9 Aspect Ratio */}
          <div className="aspect-video bg-black">
            <iframe
              ref={iframeRef}
              src={embedUrl}
              title={courseTitle}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
              loading="lazy"
              sandbox="allow-autoplay allow-fullscreen allow-same-origin allow-scripts allow-presentation"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
