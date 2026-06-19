'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WishlistReduxState, WishlistCourse } from './interface';

const initialState: WishlistReduxState = {
  courses: [],
  isLoading: false,
  error: null,
  isFetched: false,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setWishlist: (state, action: PayloadAction<WishlistCourse[]>) => {
      state.courses = action.payload;
      state.isFetched = true;
      state.error = null;
      state.isLoading = false;
    },

    toggleWishlistItem: (state, action: PayloadAction<WishlistCourse>) => {
      const courseId = action.payload._id;
      const index = state.courses.findIndex((c) => c._id === courseId);

      if (index > -1) {
        state.courses.splice(index, 1);
      } else {
        state.courses.push(action.payload);
      }
    },

    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.courses = state.courses.filter((c) => c._id !== action.payload);
    },

    clearWishlist: (state) => {
      state.courses = [];
      state.isFetched = false;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const wishlistActions = wishlistSlice.actions;
export default wishlistSlice;
