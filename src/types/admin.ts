export enum CardColor {
  Primary = 'primary',
  Green = 'green',
  Purple = 'purple',
  Orange = 'orange',
  Red = 'red',
}

export interface AdminLoginForm {
  email: string;
  password: string;
}

export interface Admin {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

export interface AdminDashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalEnrollments: number;
  totalRevenue: number;
}

export interface DashboardCourse {
  _id: string;
  title: string;
  level: string;
  status: string;
  studentsEnrolled: number;
  rating: number;
  reviewCount: number;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardCoursesResponse {
  courses: DashboardCourse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: string;
}

export interface ActionButtonProps {
  label: string;
  href: string;
  icon: string;
}

export interface DashboardCourseCardProps {
  course: DashboardCourse;
}

export interface AdminStudent {
  _id: string;
  fullName: string;
  email: string;
  enrollmentCount: number;
  completedCourses: number;
  joinDate: string;
}

export interface CreateCourseFormData {
  title: string;
  description: string;
  instructor: string;
  instructorBio: string;
  category: string;
  subcategory: string;
  level: string;
  language: string;
  price: number;
  currency: string;
  thumbnail: string;
  previewVideoUrl: string;
  learningObjectives: string[];
  requirements: string[];
}

export interface TopCourse {
  title: string;
  students: number;
}

export interface AnalyticsData {
  totalRevenue: number;
  averageRating: number;
  totalEnrollments: number;
  completionRate: number;
  topCourse: TopCourse | null;
}

export interface MetricCardProps {
  title: string;
  value: string;
  icon: string;
  trend?: string;
  color: string;
}

export interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
}

export interface Section {
  _id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSectionInput {
  title: string;
  description?: string;
  order: number;
}

export interface CurriculumItem {
  _id: string;
  sectionId: string;
  title: string;
  description?: string;
  type: string;
  order: number;
  videoUrl?: string;
  content?: string;
  questions?: Quiz[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCurriculumItemInput {
  title: string;
  description?: string;
  type: string;
  order: number;
  videoUrl?: string;
  content?: string;
  questions?: Quiz[];
}

export interface Quiz {
  _id?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface CourseContent {
  _id: string;
  title: string;
  sections: SectionWithItems[];
}

export interface SectionWithItems extends Section {
  items: CurriculumItem[];
}
