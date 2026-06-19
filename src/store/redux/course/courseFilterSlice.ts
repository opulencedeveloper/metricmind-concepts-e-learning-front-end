import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CourseFilterState } from '@/types/context';

const initialState: CourseFilterState = {
  selectedLevel: undefined,
  selectedCategory: undefined,
  currentPage: 1,
};

const courseFilterSlice = createSlice({
  name: 'courseFilter',
  initialState,
  reducers: {
    setSelectedLevel: (state, action: PayloadAction<string | undefined>) => {
      state.selectedLevel = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | undefined>) => {
      state.selectedCategory = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    resetFilters: (state) => {
      state.selectedLevel = undefined;
      state.selectedCategory = undefined;
      state.currentPage = 1;
    },
  },
});

export const courseFilterActions = courseFilterSlice.actions;
export default courseFilterSlice.reducer;
