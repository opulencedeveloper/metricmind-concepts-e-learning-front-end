'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useHttp } from '@/hooks/useHttp';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';
import ErrorUI from '@/components/error/ErrorUI';
import { ButtonVariant, ButtonSize, LoadingStateType } from '@/types/ui';
import { CourseStatus } from '@/types/course';
import { HttpMethod } from '@/types/http';
import { DashboardCoursesResponse, DashboardCourse } from '@/types/admin';

export default function AdminCoursesPage() {
  const { isLoading, sendHttpRequest } = useHttp();
  const [courses, setCourses] = useState<DashboardCourse[]>([]);
  const [error, setError] = useState<string>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const fetchCourses = async (pageNum: number = 1) => {
    setError(undefined);

    await sendHttpRequest({
      requestConfig: {
        method: HttpMethod.GET,
        url: `/admin/courses?page=${pageNum}&limit=10`,
        isAuth: true,
      },
      successRes: (data: DashboardCoursesResponse) => {
        setCourses(data.courses || []);
        setTotalPages(data.pagination?.pages || 1);
        setPage(pageNum);
      },
      errorRes: (err: any) => {
        setError(err?.data?.description || err?.data?.message ||  'Failed to load courses');
      },
    });
  };

  useEffect(() => {
    fetchCourses(1);
  }, [sendHttpRequest]);

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    await sendHttpRequest({
      requestConfig: {
        method: HttpMethod.DELETE,
        url: `/admin/courses/${courseId}`,
        isAuth: true,
      },
      successRes: () => {
        setCourses(courses.filter(c => c._id !== courseId));
      },
      errorRes: (err: any) => {
        alert(err?.data?.description || err?.data?.message ||  'Failed to delete course');
      },
    });
  };

  const handlePublish = async (courseId: string) => {
    setPublishingId(courseId);

    await sendHttpRequest({
      requestConfig: {
        method: HttpMethod.POST,
        url: `/admin/courses/${courseId}/publish`,
        isAuth: true,
      },
      successRes: () => {
        setCourses(courses.map(c =>
          c._id === courseId ? { ...c, status: CourseStatus.Published } : c
        ));
        setPublishingId(null);
      },
      errorRes: (err: any) => {
        alert(err?.data?.description || err?.data?.message ||  'Failed to publish course');
        setPublishingId(null);
      },
    });
  };

  const handleUnpublish = async (courseId: string) => {
    setPublishingId(courseId);

    await sendHttpRequest({
      requestConfig: {
        method: HttpMethod.POST,
        url: `/admin/courses/${courseId}/unpublish`,
        isAuth: true,
      },
      successRes: () => {
        setCourses(courses.map(c =>
          c._id === courseId ? { ...c, status: CourseStatus.Draft } : c
        ));
        setPublishingId(null);
      },
      errorRes: (err: any) => {
        alert(err?.data?.description || err?.data?.message ||  'Failed to unpublish course');
        setPublishingId(null);
      },
    });
  };

  if (isLoading && courses.length === 0) {
    return <LoadingState type={LoadingStateType.Skeleton} />;
  }

  if (error) {
    return <ErrorUI error={new Error(error)} statusCode={0} onRetry={() => fetchCourses(1)} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600 mt-2">Manage your courses and curriculum</p>
        </div>
        <Link href="/admin/admin/coursess/create">
          <Button variant={ButtonVariant.Primary} size={ButtonSize.Large}>
            ➕ Create Course
          </Button>
        </Link>
      </div>

      {/* Courses Table */}
      {courses.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-600 mb-4">No courses yet. Create your first course to get started!</p>
          <Link href="/admin/admin/coursess/create">
            <Button variant={ButtonVariant.Primary}>Create Course</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Students</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {courses.map((course) => (
                    <tr key={course._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">{course.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{course._id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700 capitalize">{course.level}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">{course.studentsEnrolled}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">⭐ {course.rating}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            course.status === CourseStatus.Published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {course.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link href={`/admin/admin/coursess/${course._id}`}>
                            <button className="text-gray-800 hover:text-gray-800 font-medium text-sm">
                              Edit
                            </button>
                          </Link>
                          {course.status === CourseStatus.Published ? (
                            <button
                              onClick={() => handleUnpublish(course._id)}
                              disabled={publishingId === course._id}
                              className="text-orange-600 hover:text-orange-700 font-medium text-sm disabled:opacity-50"
                            >
                              {publishingId === course._id ? 'Unpublishing...' : 'Unpublish'}
                            </button>
                          ) : (
                            <button
                              onClick={() => handlePublish(course._id)}
                              disabled={publishingId === course._id}
                              className="text-green-600 hover:text-green-700 font-medium text-sm disabled:opacity-50"
                            >
                              {publishingId === course._id ? 'Publishing...' : 'Publish'}
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(course._id)}
                            className="text-red-600 hover:text-red-700 font-medium text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchCourses(page - 1)}
                  disabled={page === 1 || isLoading}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchCourses(page + 1)}
                  disabled={page === totalPages || isLoading}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
