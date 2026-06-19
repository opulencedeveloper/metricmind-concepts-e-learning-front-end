'use client';

import { CurriculumItemRowProps } from '@/types/course';
import { getCurriculumItemIcon, getCurriculumItemLabel, formatDuration } from '@/lib/utils/curriculum';

const CurriculumItemRow: React.FC<CurriculumItemRowProps> = ({ item, sectionIndex, itemIndex }) => {
  const label = getCurriculumItemLabel(item.type);
  const icon = getCurriculumItemIcon(item.type);
  const duration = formatDuration(item.videoDuration);

  return (
    <div className="px-6 py-4 border-b last:border-b-0 hover:bg-white transition flex items-center justify-between group">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <span className="text-xl flex-shrink-0">{icon}</span>
        <div className="min-w-0 flex-1">
          <p className="text-gray-900 font-medium truncate">{item.title}</p>
          {item.description && (
            <p className="text-sm text-gray-600 truncate">{item.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 flex-shrink-0 ml-4">
        {duration && <span className="text-sm text-gray-600">{duration}</span>}
        <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2 py-1 rounded">
          {label}
        </span>
        {item.type === 'lecture' && (
          <button
            onClick={() => window.open(item.videoUrl, '_blank')}
            className="text-gray-800 hover:text-gray-800 opacity-0 group-hover:opacity-100 transition"
            title="Watch video"
          >
            ▶
          </button>
        )}
      </div>
    </div>
  );
};

export default CurriculumItemRow;
