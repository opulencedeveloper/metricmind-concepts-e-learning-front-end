'use client';

import SmartImage from '@/components/common/SmartImage';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import { CourseCardProps } from '@/types/course';
import { formatPrice } from '@/lib/utils/currency';

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Link href={`/student-dashboard/courses/${course.id}`}>
      <Card hoverable className="overflow-hidden h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative w-full h-40 bg-gray-200 overflow-hidden">
          <SmartImage
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-semibold">
            {course.level}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 text-sm md:text-base">
            {course.title}
          </h3>

          {/* Instructor */}
          <p className="text-gray-600 text-xs md:text-sm mb-3">
            {course.instructor}
          </p>

          {/* Rating */}
          {course.rating && (
            <div className="flex items-center gap-1 mb-3">
              <div className="flex text-yellow-400">
                {'★'.repeat(Math.floor(course.rating))}
                {'☆'.repeat(5 - Math.floor(course.rating))}
              </div>
              <span className="text-xs text-gray-600">
                {course.rating.toFixed(1)}
              </span>
              {course.reviewCount && (
                <span className="text-xs text-gray-500">
                  ({course.reviewCount.toLocaleString()})
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="mt-auto pt-3 border-t border-gray-200">
            <p className="text-lg font-bold text-gray-900">
              {formatPrice(course.price, course.currency)}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default CourseCard;
