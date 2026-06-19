'use client';

import { memo, useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Maximize2, Minimize2 } from 'lucide-react';
import { useHttp } from '@/hooks/useHttp';
import { HttpMethod } from '@/types/http';

// Vimeo Player SDK type
declare global {
  interface Window {
    Vimeo?: {
      Player: new (element: HTMLIFrameElement | string, options?: any) => any;
    };
  }
}

interface VideoPlayerProps {
  videoUrl: string;
  courseTitle: string;
  lectureTitle: string;
  courseId: string;
  curriculumItemId: string;
  onProgress?: (progress: number) => void;
  onVideoEnded?: () => void;
}

const VideoPlayer = memo(({
  videoUrl,
  courseTitle,
  lectureTitle,
  courseId,
  curriculumItemId,
  onProgress,
  onVideoEnded,
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const vimeoPlayerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markedAsWatchedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { sendHttpRequest } = useHttp();

  // Extract Vimeo ID from URL
  const isVimeoUrl = videoUrl?.includes('vimeo.com');
  const getVimeoId = (url: string) => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : null;
  };
  const vimeoId = isVimeoUrl ? getVimeoId(videoUrl) : null;

  // Detect touch device on mount
  useEffect(() => {
    const isTouchScreen = () => {
      return (
        (typeof window !== 'undefined' && 'ontouchstart' in window) ||
        (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0)
      );
    };

    setIsTouchDevice(isTouchScreen());
  }, []);

  // Handle video ended - mark as watched
  const handleVideoEnded = useCallback(() => {
    if (markedAsWatchedRef.current) return;

    markedAsWatchedRef.current = true;

    console.log('✅ Video watched - Marking item as watched:', { courseId, curriculumItemId });

    // Send request to backend to mark item as watched
    sendHttpRequest({
      requestConfig: {
        method: HttpMethod.POST,
        url: `/student/courses/${courseId}/curriculum-items/${curriculumItemId}/mark-watched`,
        isAuth: true,
      },
      successRes: () => {
        // Trigger callback if provided
        if (onVideoEnded) {
          onVideoEnded();
        }
      },
      errorRes: (err: any) => {
        // Silently fail - don't disrupt user experience
        console.error('Failed to mark video as watched:', err);
      },
    });
  }, [courseId, curriculumItemId, sendHttpRequest, onVideoEnded]);

  // Initialize Vimeo Player and listen to events
  useEffect(() => {
    if (!isVimeoUrl || !vimeoId || typeof window === 'undefined') return;

    let cleanup: (() => void) | null = null;

    const setupPlayer = () => {
      if (!iframeRef.current || !window.Vimeo) return;

      try {
        const player = new window.Vimeo.Player(iframeRef.current);
        vimeoPlayerRef.current = player;

        player.on('ended', handleVideoEnded);

        cleanup = () => {
          if (vimeoPlayerRef.current) {
            vimeoPlayerRef.current.off('ended', handleVideoEnded);
            vimeoPlayerRef.current = null;
          }
        };
      } catch (error) {
        console.error('Failed to initialize Vimeo player:', error);
      }
    };

    if (!window.Vimeo) {
      const script = document.createElement('script');
      script.src = 'https://player.vimeo.com/api/player.js';
      script.async = true;

      script.onload = () => {
        setupPlayer();
      };

      script.onerror = () => {
        console.error('Failed to load Vimeo SDK');
      };

      document.body.appendChild(script);
    } else {
      setupPlayer();
    }

    return () => {
      if (cleanup) cleanup();
    };
  }, [isVimeoUrl, vimeoId, handleVideoEnded]);

  // Track video progress and playing state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (onProgress) {
        const progress = (video.currentTime / video.duration) * 100;
        onProgress(progress);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleVideoEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleVideoEnded);
    };
  }, [onProgress, handleVideoEnded]);

  // Monitor fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
    };
  }, []);

  const togglePlayPause = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, []);

  const handleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else if (container.requestFullscreen) {
      container.requestFullscreen().catch(() => {});
    }
  }, []);

  // Desktop: show controls on mouse move
  const handleMouseMove = useCallback(() => {
    if (isTouchDevice) return;

    setShowControls(true);

    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }

    if (isPlaying) {
      hideControlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying, isTouchDevice]);

  const handleMouseLeave = useCallback(() => {
    if (isTouchDevice) return;

    setShowControls(false);
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }
  }, [isTouchDevice]);

  // Mobile: show controls on tap
  const handleTap = useCallback(() => {
    if (!isTouchDevice) return;

    setShowControls(true);

    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }

    if (isPlaying) {
      hideControlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying, isTouchDevice]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      {/* Video Player Container */}
      <div
        ref={containerRef}
        className="bg-black rounded-2xl overflow-hidden shadow-xl aspect-video group relative select-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTap}
      >
        {isVimeoUrl && vimeoId ? (
          <iframe
            ref={iframeRef}
            src={`https://player.vimeo.com/video/${vimeoId}`}
            className="w-full h-full border-0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            className="w-full h-full"
            onClick={togglePlayPause}
            controlsList="nodownload"
            poster={undefined}
          >
            <source src={videoUrl} type="video/mp4" />
            <p className="text-white text-center p-8">
              Your browser doesn't support HTML5 video. Please use a modern browser.
            </p>
          </video>
        )}

        {/* Center Play/Pause Button - Shows when paused (HTML5 video only) */}
        {!isVimeoUrl && (
          <AnimatePresence>
            {!isPlaying && (
              <motion.button
                onClick={togglePlayPause}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors duration-300"
                type="button"
                aria-label="Play video"
              >
                {/* Pulse Ring Animation */}
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
            )}
          </AnimatePresence>
        )}

        {/* Bottom Control Bar - Always visible on mobile, hover on desktop */}
        <AnimatePresence>
          {(isTouchDevice || (showControls && isPlaying)) && isPlaying && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/95 via-black/70 to-transparent p-3 sm:p-4 flex items-center justify-between gap-2"
            >
              {/* Play/Pause Button */}
              <button
                onClick={togglePlayPause}
                className="text-white hover:text-blue-400 transition-colors p-1.5 sm:p-2 hover:bg-white/10 rounded shrink-0"
                type="button"
                aria-label={isPlaying ? 'Pause' : 'Play'}
                title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
                )}
              </button>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Fullscreen Button */}
              <button
                onClick={handleFullscreen}
                className="text-white hover:text-blue-400 transition-colors p-1.5 sm:p-2 hover:bg-white/10 rounded shrink-0"
                type="button"
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <Maximize2 className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Video Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-4 space-y-2"
      >
        <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">
          {courseTitle}
        </p>
        <h2 className="text-2xl font-bold text-gray-900">
          {lectureTitle}
        </h2>
      </motion.div>
    </motion.div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
