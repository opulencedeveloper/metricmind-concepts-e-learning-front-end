'use client';

import { memo, useMemo } from 'react';
import { CurriculumItemType } from '@/enums/curriculum';
import { SectionHeaderProps } from '@/types/learn-page';

const SectionHeader = memo(({ sections }: SectionHeaderProps) => {
  const stats = useMemo(() => {
    let totalLectures = 0;
    let totalDurationSeconds = 0;

    sections.forEach((section) => {
      section.items?.forEach((item: any) => {
        if (item.type === CurriculumItemType.Lecture) {
          totalLectures++;
          totalDurationSeconds += item.videoDuration || 0;
        }
      });
    });

    // Format duration
    const hours = Math.floor(totalDurationSeconds / 3600);
    const minutes = Math.round((totalDurationSeconds % 3600) / 60);
    const durationText = hours > 0
      ? `${hours}h ${minutes}m`
      : `${minutes}m`;

    return { totalLectures, durationText };
  }, [sections]);

  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Content</h2>
        <p className="text-gray-600 text-sm">
          {stats.totalLectures} lesson{stats.totalLectures !== 1 ? 's' : ''} • {stats.durationText} total
        </p>
      </div>
    </div>
  );
});

SectionHeader.displayName = 'SectionHeader';

export default SectionHeader;
