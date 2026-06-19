'use client'

import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { PlayButtonProps } from '@/types/course'

export default function PlayButton({ onClick, ariaLabel, show = true }: PlayButtonProps) {
  if (!show) return null

  return (
    <motion.button
      onClick={onClick}
      className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors duration-300 cursor-pointer"
      aria-label={ariaLabel}
      type="button"
    >
      {/* Pulse Ring Animation - Apple style */}
      <motion.div
        className="absolute w-16 h-16 rounded-full border-2 border-white/30"
        animate={{ scale: [1, 1.3], opacity: [1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Play Button */}
      <motion.div
        className="bg-white/95 p-3 rounded-full shadow-lg relative z-10"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
      >
        <Play className="h-5 w-5 text-gray-800 fill-gray-800" />
      </motion.div>
    </motion.button>
  )
}
