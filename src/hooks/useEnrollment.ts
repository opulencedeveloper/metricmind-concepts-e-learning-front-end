'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/redux';
import { enrollmentActions } from '@/store/redux/enrollment/enrollmentSlice';
import { EnrollmentWithCourse } from '@/types/enrollment';

export const useEnrollment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const enrollment = useSelector((state: RootState) => state.enrollment);

  const isEnrolled = (courseId: string): boolean => {
    return enrollment.enrolledCourseIds.includes(courseId);
  };

  const getEnrollmentByCourse = (courseId: string): EnrollmentWithCourse | undefined => {
    return enrollment.enrollments.find(
      (e) => (e.courseId._id || e.courseId) === courseId
    );
  };

  const setEnrollments = (enrollments: EnrollmentWithCourse[]) => {
    dispatch(enrollmentActions.setEnrollments(enrollments));
  };

  const addEnrollment = (enrollment: EnrollmentWithCourse) => {
    dispatch(enrollmentActions.addEnrollment(enrollment));
  };

  const updateProgress = (courseId: string, progress: number) => {
    dispatch(enrollmentActions.updateProgress({ courseId, progress }));
  };

  const clearEnrollments = () => {
    dispatch((enrollmentActions.clearEnrollments as any)());
  };

  const setPendingEnrollment = (courseId: string) => {
    dispatch(enrollmentActions.setPendingEnrollment(courseId));
  };

  const clearPendingEnrollment = () => {
    dispatch((enrollmentActions.clearPendingEnrollment as any)());
  };

  return {
    enrolledCourseIds: enrollment.enrolledCourseIds,
    enrollments: enrollment.enrollments,
    totalEnrolled: enrollment.totalEnrolled,
    isLoading: enrollment.isLoading,
    error: enrollment.error,
    pendingEnrollmentCourseId: enrollment.pendingEnrollmentCourseId,
    isEnrolled,
    getEnrollmentByCourse,
    setEnrollments,
    addEnrollment,
    updateProgress,
    clearEnrollments,
    setPendingEnrollment,
    clearPendingEnrollment,
  };
};
