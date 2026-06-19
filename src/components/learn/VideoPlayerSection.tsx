'use client';

import { memo } from 'react';
import VideoPlayer from './VideoPlayer';
import { VideoPlayerSectionProps } from '@/types/learn-page';

const VideoPlayerSection = memo(({
  videoRef,
  displayVideoUrl,
  courseTitle,
  selectedVideoTitle,
  courseId,
  curriculumItemId,
  onProgress,
}: VideoPlayerSectionProps) => {
  return (
    <div ref={videoRef}>
      {displayVideoUrl && (
        <VideoPlayer
          videoUrl={displayVideoUrl}
          courseTitle={courseTitle}
          lectureTitle={selectedVideoTitle}
          courseId={courseId}
          curriculumItemId={curriculumItemId}
          onProgress={onProgress}
        />
      )}
    </div>
  );
});

VideoPlayerSection.displayName = 'VideoPlayerSection';

export default VideoPlayerSection;
