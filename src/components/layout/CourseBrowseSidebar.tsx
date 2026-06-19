'use client';

import { useDispatch, useSelector } from 'react-redux';
import CourseFilter from '@/components/course/CourseFilter';
import { courseFilterActions } from '@/store/redux/course/courseFilterSlice';
import { RootState } from '@/store/redux';
import { CourseBrowseSidebarProps } from '@/types/layoutTypes';

const CourseBrowseSidebar: React.FC<CourseBrowseSidebarProps> = ({ categories }) => {
  const dispatch = useDispatch();
  const { selectedLevel, selectedCategory } = useSelector((state: RootState) => state.courseFilter);

  return (
    <aside className="lg:col-span-1">
      <CourseFilter
        selectedLevel={selectedLevel}
        selectedCategory={selectedCategory}
        onLevelChange={(level) => {
          dispatch(courseFilterActions.setSelectedLevel(level));
          dispatch(courseFilterActions.setCurrentPage(1));
        }}
        onCategoryChange={(category) => {
          dispatch(courseFilterActions.setSelectedCategory(category));
          dispatch(courseFilterActions.setCurrentPage(1));
        }}
        onReset={() => dispatch(courseFilterActions.resetFilters())}
        categories={categories}
      />
    </aside>
  );
};

export default CourseBrowseSidebar;
