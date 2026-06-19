'use client'

import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SearchBarProps } from '@/types/course'

export default function SearchBar({ onSearchChange, placeholder = 'Search courses, skills, topics...' }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearchChange(searchQuery)
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery, onSearchChange])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="flex justify-center px-4 pb-10"
    >
      <div className="relative w-full max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-base bg-gray-50 transition-colors"
          aria-label="Search courses"
        />
      </div>
    </motion.div>
  )
}
