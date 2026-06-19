'use client';

import { useState } from 'react';
import SmartImage from '@/components/common/SmartImage';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ButtonVariant, ButtonSize } from '@/types/ui';
import { EnrollmentWithCourse } from '@/types/enrollment';
import { EnrollmentStatus } from '@/types/curriculum';
import { useHttp } from '@/hooks/useHttp';
import { HttpMethod } from '@/types/http';

interface EnrolledCourseCardProps {
  enrollment: EnrollmentWithCourse;
}

const EnrolledCourseCard: React.FC<EnrolledCourseCardProps> = ({ enrollment }) => {
  const course = enrollment.courseId;
  const isCompleted = enrollment.status === EnrollmentStatus.Completed;
  const progress = enrollment.progress || 0;
  const hasCertificate = enrollment.certificateIssued && enrollment.certificateUrl;

  const [showDropModal, setShowDropModal] = useState(false);
  const [isDropping, setIsDropping] = useState(false);
  const { sendHttpRequest } = useHttp();

  const handleDropCourse = async () => {
    setIsDropping(true);
    await sendHttpRequest({
      requestConfig: {
        method: HttpMethod.POST,
        url: `/student/enrollments/${enrollment._id}/drop`,
        isAuth: true,
      },
      successRes: () => {
        window.location.href = '/student-dashboard/courses';
      },
      errorRes: () => {
        setIsDropping(false);
        setShowDropModal(false);
      },
    });
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      {/* Thumbnail */}
      <div className="relative w-full h-40 bg-gray-200 overflow-hidden">
        <SmartImage
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover"
        />
        {isCompleted && (
          <div className="absolute inset-0 bg-green-600 bg-opacity-40 flex items-center justify-center">
            <div className="bg-white rounded-full p-3">
              <span className="text-3xl">✓</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 text-sm">
          {course.title}
        </h3>

        {/* Instructor */}
        <p className="text-gray-600 text-xs mb-3">{course.instructor}</p>

        {/* Status Badge */}
        <div className="mb-3">
          {isCompleted ? (
            <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded">
              Completed
            </span>
          ) : (
            <span className="text-xs font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded">
              In Progress
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600">Progress</span>
            <span className="text-xs font-semibold text-gray-900">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gray-900 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Last Accessed */}
        {enrollment.lastAccessedDate && (
          <p className="text-xs text-gray-500 mb-3">
            Last accessed: {new Date(enrollment.lastAccessedDate).toLocaleDateString()}
          </p>
        )}

        {/* CTA Buttons */}
        <div className="mt-auto space-y-2">
          {hasCertificate && (
            <Link href={`/student-dashboard/courses/${course._id}/certificate`} className="block">
              <Button
                fullWidth
                variant={ButtonVariant.Secondary}
                size={ButtonSize.Small}
              >
                🏆 View Certificate
              </Button>
            </Link>
          )}

          <Link href={`/student-dashboard/courses/${course._id}/learn`} className="block">
            <Button
              fullWidth
              variant={ButtonVariant.Primary}
              size={ButtonSize.Small}
            >
              {isCompleted ? 'Review' : 'Continue'}
            </Button>
          </Link>

          {!isCompleted && (
            <Button
              fullWidth
              variant={ButtonVariant.Secondary}
              size={ButtonSize.Small}
              onClick={() => setShowDropModal(true)}
              className="text-red-600 hover:bg-red-50"
            >
              Drop Course
            </Button>
          )}
        </div>
      </div>

      {/* Drop Course Modal */}
      {showDropModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-sm w-full p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Drop Course?</h2>
            <p className="text-gray-600">
              Are you sure you want to drop <strong>{course.title}</strong>? This action cannot be undone and you will lose your progress.
            </p>
            <div className="flex gap-3">
              <Button
                fullWidth
                variant={ButtonVariant.Secondary}
                onClick={() => setShowDropModal(false)}
                disabled={isDropping}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                variant={ButtonVariant.Primary}
                onClick={handleDropCourse}
                isLoading={isDropping}
                disabled={isDropping}
              >
                {isDropping ? 'Dropping...' : 'Drop Course'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
};

export default EnrolledCourseCard;
