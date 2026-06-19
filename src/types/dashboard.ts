import { EnrollmentWithCourse } from './enrollment';

export enum StatColor {
  Primary = 'primary',
  Green = 'green',
  Purple = 'purple',
  Orange = 'orange',
  Red = 'red',
}

export interface StatCardProps {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  color?: StatColor;
}

export interface DashboardStats {
  totalEnrolled: number;
  inProgress: number;
  completed: number;
  totalHours: number;
}

export interface RecentCourse {
  _id: string;
  courseId: {
    _id: string;
    title: string;
    instructor: string;
    thumbnail: string;
    previewVideoUrl: string;
    totalDuration?: number;
  };
  progress: number;
  lastAccessedDate?: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentCourses: RecentCourse[];
  enrollments?: EnrollmentWithCourse[];
}

export interface StatsGridProps {
  stats: DashboardStats;
  variants: any;
}

export interface FeaturedCourseProps {
  course: RecentCourse;
  variants: any;
}

export interface MoreCoursesGridProps {
  courses: RecentCourse[];
  variants: any;
}

export interface EmptyStateProps {
  variants: any;
}

export interface DashboardHeaderProps {
  hasEnrolledCourses: boolean;
}

export interface WelcomeSectionProps {
  firstName?: string;
  actionLabel?: string;
  actionHref?: string;
}
