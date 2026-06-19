'use client';

import Card from '@/components/ui/Card';
import { CourseLevel } from '@/types/course';
import { CourseFilterProps } from '@/types/course';

const CourseFilter: React.FC<CourseFilterProps> = ({
  selectedLevel,
  selectedCategory,
  onLevelChange,
  onCategoryChange,
  onReset,
  categories,
}) => {
  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        {(selectedLevel || selectedCategory) && (
          <button
            onClick={onReset}
            className="text-gray-800 hover:text-gray-800 text-sm font-medium transition"
          >
            Reset
          </button>
        )}
      </div>

      {/* Category Filter */}
      <Card className="p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Category</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategory === category}
                onChange={() => onCategoryChange?.(category)}
                className="w-4 h-4 rounded border-gray-300 text-gray-800"
              />
              <span className="text-gray-700 text-sm">{category}</span>
            </label>
          ))}
        </div>
      </Card>

      {/* Level Filter */}
      <Card className="p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Level</h4>
        <div className="space-y-2">
          {Object.values(CourseLevel).map((level) => (
            <label key={level} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="level"
                checked={selectedLevel === level}
                onChange={() => onLevelChange?.(level)}
                className="w-4 h-4 border-gray-300 text-gray-800"
              />
              <span className="text-gray-700 text-sm">{level}</span>
            </label>
          ))}
        </div>
      </Card>

      {/* Price Filter Info */}
      <Card className="p-6 bg-gray-50 border-gray-200">
        <p className="text-sm text-gray-600">
          💡 <span className="font-medium">Tip:</span> Filter results to find courses that match your budget and skill level.
        </p>
      </Card>
    </div>
  );
};

export default CourseFilter;
