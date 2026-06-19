import { CurriculumItemType } from '@/enums/curriculum';

export interface CourseSection {
  _id: string;
  title: string;
  description?: string;
  items: CurriculumItem[];
  canAccess: boolean;
  accessReason?: string;
}

// Base interface with common fields
interface BaseCurriculumItem {
  _id: string;
  title: string;
  description: string;
  type: CurriculumItemType;
}

// Lecture must have videoUrl
export interface LectureCurriculumItem extends BaseCurriculumItem {
  type: CurriculumItemType.Lecture;
  videoUrl: string;
}

// Quiz must have quizId
export interface QuizCurriculumItem extends BaseCurriculumItem {
  type: CurriculumItemType.Quiz;
  quizId: string;
}

// Article has description and content
export interface ArticleCurriculumItem extends BaseCurriculumItem {
  type: CurriculumItemType.Article;
  content?: string;
}

// Discriminated union type for type-safe handling
export type CurriculumItem = LectureCurriculumItem | QuizCurriculumItem | ArticleCurriculumItem;

export interface CourseEnrollment {
  progress: number;
  watchedItems: string[];
  lastAccessedDate?: string;
}

export interface CourseData {
  course: {
    _id: string;
    title: string;
    description?: string;
    instructor?: string;
    thumbnail?: string;
  };
  sections: CourseSection[];
  enrollment: CourseEnrollment;
}

export interface SectionItemProps {
  section: CourseSection;
  index: number;
  isActive: boolean;
  isExpanded: boolean;
  onSelect: (section: CourseSection) => void;
  onToggleExpand: (sectionId: string) => void;
}

export interface ContentItemProps {
  item: CurriculumItem;
  index: number;
  courseId: string;
  canAccess: boolean;
}

export interface LearnHeaderProps {
  courseTitle: string;
  progressPercent: number;
  sidebarOpen: boolean;
  onSidebarToggle: (open: boolean) => void;
  onBack: () => void;
}

export interface LearnSidebarProps {
  sections: CourseSection[];
  currentSectionId: string | null;
  expandedSectionId: string | null;
  sidebarOpen: boolean;
  onSectionSelect: (section: CourseSection) => void;
  onToggleExpand: (sectionId: string) => void;
}

export interface LearnMainContentProps {
  currentSection: CourseSection | null;
  sections: CourseSection[];
  courseContent: CourseData;
  courseId: string;
}

export interface VideoPlayerSectionProps {
  videoRef: React.RefObject<HTMLDivElement | null>;
  displayVideoUrl: string | null;
  courseTitle: string;
  selectedVideoTitle: string;
  courseId: string;
  curriculumItemId: string;
  onProgress: (progress: number) => void;
}

export interface CourseContentProps {
  sections: CourseSection[];
  expandedSections: Set<string>;
  onToggleSection: (sectionId: string) => void;
  onSelectVideo: (videoUrl: string, videoTitle: string, itemId: string) => void;
  watchedItems: string[];
  courseId: string;
}

export interface SectionHeaderProps {
  sections: CourseSection[];
}
