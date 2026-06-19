import { CurriculumItemType } from '@/types/curriculum';

export const getCurriculumItemIcon = (type: string): string => {
  switch (type) {
    case CurriculumItemType.Lecture:
      return '🎥';
    case CurriculumItemType.Article:
      return '📄';
    case CurriculumItemType.Resource:
      return '📎';
    case CurriculumItemType.Quiz:
      return '✓';
    case CurriculumItemType.Assignment:
      return '✏️';
    default:
      return '📌';
  }
};

export const getCurriculumItemLabel = (type: string): string => {
  switch (type) {
    case CurriculumItemType.Lecture:
      return 'Lecture';
    case CurriculumItemType.Article:
      return 'Article';
    case CurriculumItemType.Resource:
      return 'Resource';
    case CurriculumItemType.Quiz:
      return 'Quiz';
    case CurriculumItemType.Assignment:
      return 'Assignment';
    default:
      return 'Item';
  }
};

export const formatDuration = (minutes?: number): string => {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};
