'use client'

import { useState, useEffect } from 'react'
import { Share2 } from 'lucide-react'
import { ShareButtonProps } from '@/types/share'

export default function ShareButton({
  title,
  text = 'Check this out!',
  url,
  className = 'w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 active:scale-95',
}: ShareButtonProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [currentUrl, setCurrentUrl] = useState(url || '')

  useEffect(() => {
    if (!url && typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        setCurrentUrl(window.location.href)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [url])

  const handleShare = async () => {
    const shareUrl = currentUrl
    const shareData = {
      title,
      text,
      url: shareUrl,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareUrl)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err)
      }
    }
  }

  return (
    <button onClick={handleShare} className={className}>
      {isCopied ? (
        <span className="text-sm font-medium text-green-600">Copied!</span>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          Share
        </>
      )}
    </button>
  )
}
