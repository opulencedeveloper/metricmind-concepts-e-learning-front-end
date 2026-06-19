'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import SmartImage from '@/components/common/SmartImage';
import { useHttp } from '@/hooks/useHttp';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';
import ErrorUI from '@/components/error/ErrorUI';
import { ButtonVariant, ButtonSize, LoadingStateType } from '@/types/ui';
import { HttpMethod } from '@/types/http';

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const { isLoading, sendHttpRequest } = useHttp();

  const [course, setCourse] = useState<any>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (courseId) {
      fetchCourseDetail();
    }
  }, [courseId]);

  const fetchCourseDetail = async () => {
    setError(undefined);
    await sendHttpRequest({
      requestConfig: {
        method: HttpMethod.GET,
        url: `/student/courses/${courseId}`,
        isAuth: false,
      },
      successRes: (data: any) => {
        setCourse(data.course || data);
        if (data.enrollment) {
          setEnrollment(data.enrollment);
        }
      },
      errorRes: (err: any) => {
        setError(err?.data?.description || err?.data?.message ||  'Failed to load course');
      },
    });
  };

  if (isLoading && !course) {
    return <LoadingState type={LoadingStateType.Skeleton} />;
  }

  if (error && !course) {
    return <ErrorUI error={new Error(error)} statusCode={0} onRetry={fetchCourseDetail} />;
  }

  if (!course) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative h-80 bg-linear-to-r from-gray-800 to-gray-900 rounded-lg overflow-hidden">
        {course.thumbnail && (
          <SmartImage
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
            <p className="text-lg">{course.instructor}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About this course</h2>
            <p className="text-gray-600 leading-relaxed">{course.description}</p>
          </Card>

          {/* Learning Objectives */}
          {course.learningObjectives && course.learningObjectives.length > 0 && (
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What you'll learn</h2>
              <ul className="space-y-2">
                {course.learningObjectives.map((objective: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Requirements */}
          {course.requirements && course.requirements.length > 0 && (
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
              <ul className="space-y-2">
                {course.requirements.map((req: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="p-6">
            <div className="mb-6">
              {course.thumbnail && (
                <SmartImage
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  className="object-cover rounded"
                  containerClassName="relative h-40 mb-4"
                />
              )}

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="text-2xl font-bold text-gray-900">₦{course.price?.toLocaleString() || 'Free'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Level</p>
                  <p className="text-gray-900 font-medium">{course.level}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Language</p>
                  <p className="text-gray-900 font-medium">{course.language}</p>
                </div>

                {course.totalDuration && (
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="text-gray-900 font-medium">{course.totalDuration} hours</p>
                  </div>
                )}

                {course.studentsEnrolled && (
                  <div>
                    <p className="text-sm text-gray-600">Students Enrolled</p>
                    <p className="text-gray-900 font-medium">{course.studentsEnrolled.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>

            {enrollment ? (
              <Link href={`/student-dashboard/courses/${courseId}/learn`}>
                <Button fullWidth variant={ButtonVariant.Primary} size={ButtonSize.Large}>
                  Continue Learning
                </Button>
              </Link>
            ) : (
              <Link href={`/student-dashboard/checkout?courseId=${courseId}`}>
                <Button fullWidth variant={ButtonVariant.Primary} size={ButtonSize.Large}>
                  Enroll Now
                </Button>
              </Link>
            )}

            <Link href="/browse" className="block mt-3">
              <Button fullWidth variant={ButtonVariant.Secondary}>Back to Courses</Button>
            </Link>
          </Card>

          {/* Instructor Info */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-2">About the instructor</h3>
            <p className="text-sm text-gray-600">{course.instructorBio || 'Professional instructor'}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
