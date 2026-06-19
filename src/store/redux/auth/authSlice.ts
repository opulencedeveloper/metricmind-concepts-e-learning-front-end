import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, Student } from '@/types/auth';

const initialState: AuthState = {
  student: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Auth actions
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    loginSuccess: (state, action: PayloadAction<{ student: Student; token: string }>) => {
      state.student = action.payload.student;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      state.isLoading = false;
    },

    signupSuccess: (state, action: PayloadAction<Student>) => {
      state.student = action.payload;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;
    },

    emailVerifySuccess: (state, action: PayloadAction<{ student: Student; token: string }>) => {
      state.student = action.payload.student;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      state.isLoading = false;
    },

    resetPasswordSuccess: (state) => {
      state.error = null;
      state.isLoading = false;
    },

    logout: (state) => {
      state.student = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },

    resetAuthError: (state) => {
      state.error = null;
    },

    // Restore auth from token
    restoreAuth: (state, action: PayloadAction<{ student: Student; token: string }>) => {
      state.student = action.payload.student;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice;
