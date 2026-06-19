'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/redux';
import { wishlistActions } from '@/store/redux/wishlist/wishlistSlice';

export const useWishlist = () => {
  const dispatch = useDispatch<AppDispatch>();
  const wishlistState = useSelector((state: RootState) => state.wishlist) || {
    courses: [],
    isFetched: false,
    isLoading: false,
    error: null,
  };

  const courses = Array.isArray(wishlistState?.courses) ? wishlistState.courses : [];
  const isFetched = wishlistState?.isFetched ?? false;
  const isLoading = wishlistState?.isLoading ?? false;
  const error = wishlistState?.error ?? null;

  const isInWishlist = (courseId: string): boolean => {
    return courses.some((c) => c._id === courseId);
  };

  const setWishlist = (wishlistCourses: any[]) => {
    dispatch(wishlistActions.setWishlist(wishlistCourses));
  };

  const toggleWishlistItem = (course: any) => {
    dispatch(wishlistActions.toggleWishlistItem(course));
  };

  const removeFromWishlist = (courseId: string) => {
    dispatch(wishlistActions.removeFromWishlist(courseId));
  };

  const clearWishlist = () => {
    dispatch(wishlistActions.clearWishlist());
  };

  const setLoading = (loading: boolean) => {
    dispatch(wishlistActions.setLoading(loading));
  };

  const setError = (error: string | null) => {
    dispatch(wishlistActions.setError(error));
  };

  return {
    courses,
    isFetched,
    isLoading,
    error,
    isInWishlist,
    setWishlist,
    toggleWishlistItem,
    removeFromWishlist,
    clearWishlist,
    setLoading,
    setError,
  };
};
