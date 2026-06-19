'use client';

import { configureStore } from '@reduxjs/toolkit';
import authSlice from './auth/authSlice';
import courseFilterSlice from './course/courseFilterSlice';
import enrollmentSlice from './enrollment/enrollmentSlice';
import wishlistSlice from './wishlist/wishlistSlice';
import { ReduxActionType } from '@/enums/redux';

const initialCombinedState = {
  auth: undefined,
  courseFilter: undefined,
  enrollment: undefined,
  wishlist: undefined,
};

// Root reducer with reset capability - clears ALL state on RESET_STORE action
const rootReducer = (state: any, action: any) => {
  if (action.type === ReduxActionType.RESET_STORE) {
    return combinedReducer(initialCombinedState, action);
  }
  return combinedReducer(state, action);
};

const combinedReducer = (state: any, action: any) => ({
  auth: authSlice.reducer(state?.auth, action),
  courseFilter: courseFilterSlice(state?.courseFilter, action),
  enrollment: enrollmentSlice.reducer(state?.enrollment, action),
  wishlist: wishlistSlice.reducer(state?.wishlist, action),
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
