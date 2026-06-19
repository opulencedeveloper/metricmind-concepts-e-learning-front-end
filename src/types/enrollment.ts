import { Course, Section, Enrollment } from './course';

export interface EnrolledCourseResponse {
  course: Course;
  sections: SectionWithAccess[];
  enrollment: Enrollment;
}

export interface SectionWithAccess extends Section {
  canAccess: boolean;
  accessReason?: string;
}

export interface EnrollmentsListResponse {
  enrollments: EnrollmentWithCourse[];
  total: number;
}

export interface EnrollmentWithCourse {
  _id: string;
  studentId: string;
  courseId: Course;
  status: string;
  progress: number;
  enrollmentDate: string;
  lastAccessedDate?: string;
  completionDate?: string;
  certificateIssued: boolean;
  certificateUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProgressInput {
  progress: number;
}

export interface CertificateData {
  certificateUrl: string;
  certificateIssued: boolean;
  courseTitle: string;
  instructorName: string;
  studentName: string;
  completionDate: string;
}

// Redux enrollment state
export interface EnrollmentReduxState {
  enrolledCourseIds: string[]; // List of enrolled course IDs for quick lookup
  enrollments: EnrollmentWithCourse[];
  isLoading: boolean;
  error: string | null;
  totalEnrolled: number;
  pendingEnrollmentCourseId: string | null; // Track courseId during auth flow for new enrollments
}
