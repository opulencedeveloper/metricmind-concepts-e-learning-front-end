import { QuestionType } from '@/enums/question';

export const getQuestionTypeLabel = (type: string): string => {
  switch (type) {
    case QuestionType.MultipleChoice:
      return 'Multiple Choice';
    case QuestionType.TrueFalse:
      return 'True/False';
    default:
      return 'Question';
  }
};

export const formatTimeRemaining = (seconds?: number): string => {
  if (!seconds) return '';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

export const getScoreColor = (percentage: number): string => {
  if (percentage >= 80) return 'text-green-600';
  if (percentage >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

export const getScoreBgColor = (percentage: number): string => {
  if (percentage >= 80) return 'bg-green-100';
  if (percentage >= 60) return 'bg-yellow-100';
  return 'bg-red-100';
};

export const calculateTotalPoints = (questions: any[]): number => {
  return questions.reduce((sum, q) => sum + (q.points || 1), 0);
};
