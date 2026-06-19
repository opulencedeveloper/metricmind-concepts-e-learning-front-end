import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import SmartImage from '@/components/common/SmartImage';
import { ButtonVariant, ButtonSize } from '@/types/ui';
import { DashboardCourseCardProps } from '@/types/admin';

export default function AdminCourseCard({ course }: DashboardCourseCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition">
      {/* Thumbnail */}
      <div className="w-full h-40 bg-gradient-to-br from-gray-400 to-gray-800 relative overflow-hidden">
        <SmartImage
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-2">{course.title}</h3>
        <p className="text-xs text-gray-600 mt-1">{course.level}</p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-600">Students</p>
            <p className="font-semibold text-gray-900">{course.studentsEnrolled}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Rating</p>
            <p className="font-semibold text-gray-900">⭐ {course.rating}</p>
          </div>
        </div>

        {/* Actions */}
        <Link href={`/admin/courses/${course._id}`} className="w-full block mt-4">
          <Button variant={ButtonVariant.Secondary} size={ButtonSize.Small} fullWidth>
            Manage
          </Button>
        </Link>
      </div>
    </Card>
  );
}
