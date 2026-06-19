import { CurriculumItemType } from '@/enums/curriculum';

export interface BaseCurriculumCard {
  _id: string;
  title: string;
  description?: string;
  type: CurriculumItemType;
  isWatched: boolean;
  onSelect: () => void;
  isLastItem?: boolean;
}

export interface LectureCardProps extends BaseCurriculumCard {
  type: CurriculumItemType.Lecture;
  videoDuration: number;
  videoUrl: string;
}

export interface QuizCardProps extends BaseCurriculumCard {
  type: CurriculumItemType.Quiz;
  quizId: string;
  questionCount?: number;
}

export interface ArticleCardProps extends BaseCurriculumCard {
  type: CurriculumItemType.Article;
  content?: string;
}

export interface ResourceCardProps extends BaseCurriculumCard {
  type: CurriculumItemType.Resource;
  resourceUrl?: string;
}

export interface AssignmentCardProps extends BaseCurriculumCard {
  type: CurriculumItemType.Assignment;
  dueDate?: Date;
}

export type CurriculumCardProps =
  | LectureCardProps
  | QuizCardProps
  | ArticleCardProps
  | ResourceCardProps
  | AssignmentCardProps;
