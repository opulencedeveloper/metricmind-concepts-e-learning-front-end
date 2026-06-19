export enum CourseLevel {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
}

export enum Currency {
  NGN = 'NGN',
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
}

export enum CourseStatus {
  Draft = 'draft',
  Published = 'published',
  Archived = 'archived',
}

export enum Language {
  English = 'english',
  French = 'french',
  Spanish = 'spanish',
  Yoruba = 'yoruba',
  Igbo = 'igbo',
  Hausa = 'hausa',
}

export enum CurriculumItemType {
  Lecture = 'lecture',
  Article = 'article',
  Resource = 'resource',
  Quiz = 'quiz',
  Assignment = 'assignment',
}

export enum EnrollmentStatus {
  Active = 'active',
  Completed = 'completed',
  Dropped = 'dropped',
}

export interface Course {
  _id: string;
  id?: string;
  adminId: string;
  title: string;
  description: string;
  slug: string;
  instructor: string;
  instructorBio?: string;
  instructorImage?: string;
  category: string;
  subcategory?: string;
  level: string;
  language: string;
  price: number;
  currency: string;
  thumbnail: string;
  previewVideoUrl?: string;
  rating?: number;
  reviewCount?: number;
  studentsEnrolled?: number;
  totalDuration?: number;
  learningObjectives?: string[];
  requirements?: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CurriculumItem {
  _id: string;
  sectionId: string;
  title: string;
  description?: string;
  type: string;
  order: number;
  videoUrl?: string;
  videoDuration?: number;
  content?: string;
  resources?: Array<{ name: string; url: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface Section {
  _id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  items: CurriculumItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseDetailResponse {
  course: Course;
  sections: Section[];
}

export interface Enrollment {
  _id: string;
  studentId: string;
  courseId: string;
  status: string;
  enrollmentDate: string;
  completionDate?: string;
  progress: number;
  lastAccessedDate?: string;
  certificateIssued: boolean;
  certificateUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseListResponse {
  courses: Course[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CourseFilters {
  category?: string;
  level?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  search?: string;
}

export interface EnrollmentData {
  courseId: string;
  studentId: string;
  status: string;
  enrolledAt: string;
  progress: number;
}

export interface CourseFilterProps {
  selectedLevel?: string;
  selectedCategory?: string;
  priceRange?: { min: number; max: number };
  onLevelChange?: (level: string) => void;
  onCategoryChange?: (category: string) => void;
  onPriceChange?: (range: { min: number; max: number }) => void;
  onReset?: () => void;
  categories: string[];
}

export interface CourseCardProps {
  course: Course
  variant?: string
  variants?: any
}

export interface CourseCurriculumProps {
  sections: Section[];
}

export interface CurriculumItemRowProps {
  item: CurriculumItem;
  sectionIndex: number;
  itemIndex: number;
}

export interface CourseDetailHeroProps {
  course: Course;
  enrollment?: Enrollment;
}

export interface CourseStatsProps {
  course: Course;
}

export interface VideoModalProps {
  videoUrl: string
  courseTitle: string
  onClose: () => void
}

export interface PlayButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  ariaLabel: string
  show?: boolean
}

export interface BrowseCoursesContentProps {
  courses: Course[]
}

export interface SearchPageContentProps {
  categories: string[]
  initialCourses?: Course[]
  initialTotal?: number
}

export interface SearchBarProps {
  onSearchChange: (query: string) => void
  placeholder?: string
}

export interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
}

export interface CourseDetailRouteProps {
  params: { slug: string }
}

export interface CourseDetailPageProps {
  course: Course
  sections: Section[]
}

export interface CourseDetailHeroProps {
  course: Course
}

export interface CourseAboutProps {
  course: Course
}

export interface CourseCurriculumProps {
  sections: Section[]
  totalLessons: number
}

export interface CourseReviewsProps {
  course: Course
}

export interface CourseEnrollmentProps {
  course: Course
  isSticky?: boolean
}

export interface CourseInstructorProps {
  course: Course
}

export interface FeatureProps {
  text: string
}

export interface CourseRatingProps {
  course: Course
  variant?: string
  itemVariants?: any
}
