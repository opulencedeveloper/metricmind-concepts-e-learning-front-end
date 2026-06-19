'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EnrollmentReduxState, EnrollmentWithCourse } from '@/types/enrollment';

const initialState: EnrollmentReduxState = {
  enrolledCourseIds: [],
  enrollments: [],
  isLoading: false,
  error: null,
  totalEnrolled: 0,
  pendingEnrollmentCourseId: null,
};

const enrollmentSlice = createSlice({
  name: 'enrollment',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Initialize enrollments from API response
    setEnrollments: (state, action: PayloadAction<EnrollmentWithCourse[]>) => {
      state.enrollments = action.payload;
      state.enrolledCourseIds = action.payload.map((e) => typeof e.courseId === 'string' ? e.courseId : e.courseId._id);
      state.totalEnrolled = action.payload.length;
      state.error = null;
      state.isLoading = false;
    },

    // Add single enrollment after successful payment
    addEnrollment: (state, action: PayloadAction<EnrollmentWithCourse>) => {
      const courseId = typeof action.payload.courseId === 'string' ? action.payload.courseId : action.payload.courseId._id;
      if (!state.enrolledCourseIds.includes(courseId)) {
        state.enrollments.push(action.payload);
        state.enrolledCourseIds.push(courseId);
        state.totalEnrolled += 1;
      }
      state.error = null;
    },

    // Update progress for an enrollment
    updateProgress: (state, action: PayloadAction<{ courseId: string; progress: number }>) => {
      const enrollment = state.enrollments.find(
        (e) => (typeof e.courseId === 'string' ? e.courseId : e.courseId._id) === action.payload.courseId
      );
      if (enrollment) {
        enrollment.progress = action.payload.progress;
      }
    },

    // Clear enrollments on logout
    clearEnrollments: (state) => {
      state.enrolledCourseIds = [];
      state.enrollments = [];
      state.totalEnrolled = 0;
      state.error = null;
      state.isLoading = false;
      state.pendingEnrollmentCourseId = null;
    },

    // Set pending enrollment course when unauthenticated user clicks enroll
    setPendingEnrollment: (state, action: PayloadAction<string>) => {
      state.pendingEnrollmentCourseId = action.payload;
    },

    // Clear pending enrollment after confirmation or cancel
    clearPendingEnrollment: (state) => {
      state.pendingEnrollmentCourseId = null;
    },

    resetError: (state) => {
      state.error = null;
    },
  },
});

export const enrollmentActions = enrollmentSlice.actions;
export default enrollmentSlice;
