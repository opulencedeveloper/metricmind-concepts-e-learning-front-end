export interface CourseFilterContextType {
  selectedLevel?: string;
  selectedCategory?: string;
  currentPage: number;
  setSelectedLevel: (level?: string) => void;
  setSelectedCategory: (category?: string) => void;
  setCurrentPage: (page: number) => void;
  resetFilters: () => void;
}

export interface CourseFilterState {
  selectedLevel?: string;
  selectedCategory?: string;
  currentPage: number;
}
