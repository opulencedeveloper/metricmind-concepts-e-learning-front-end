'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useHttp } from '@/hooks/useHttp';
import LoadingState from '@/components/ui/LoadingState';
import ErrorUI from '@/components/error/ErrorUI';
import { LoadingStateType } from '@/types/ui';
import { HttpMethod } from '@/types/http';
import LearnHeader from '@/components/learn/LearnHeader';
import LearnMainContent from '@/components/learn/LearnMainContent';
import { CourseSection, CourseData } from '@/types/learn-page';

export default function LearnPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const { isLoading, sendHttpRequest } = useHttp();

  // State
  const [courseContent, setCourseContent] = useState<CourseData | null>(null);
  const [currentSection, setCurrentSection] = useState<CourseSection | null>(null);
  const [error, setError] = useState<string>();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Refs for cleanup
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  // Fetch course content
  const fetchCourseContent = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setError(undefined);

    await sendHttpRequest({
      requestConfig: {
        method: HttpMethod.GET,
        url: `/student/courses/${courseId}/content`,
        isAuth: true,
      },
      successRes: (data: CourseData) => {
        if (!isMountedRef.current) return;

        setCourseContent(data);

        if (data.sections && data.sections.length > 0) {
          const firstSection = data.sections[0];
          setCurrentSection(firstSection);
        }
      },
      errorRes: (err: any) => {
        if (!isMountedRef.current) return;
        setError(err?.data?.description || err?.data?.message || 'Failed to load course content');
      },
    });
  }, [courseId, sendHttpRequest]);

  // Setup and cleanup
  useEffect(() => {
    isMountedRef.current = true;

    if (courseId) {
      fetchCourseContent();
    }

    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [courseId, fetchCourseContent]);

  // Memoized values
  const sections = useMemo(() => courseContent?.sections || [], [courseContent]);
  const progressPercent = useMemo(() => courseContent?.enrollment?.progress || 0, [courseContent]);
  const course = useMemo(() => courseContent?.course, [courseContent]);

  // Callbacks
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleSidebarToggle = useCallback((open: boolean) => {
    setSidebarOpen(open);
  }, []);

  // Loading state
  if (isLoading && !courseContent) {
    return <LoadingState type={LoadingStateType.Skeleton} />;
  }

  // Error state
  if (error && !courseContent) {
    return <ErrorUI error={new Error(error)} statusCode={0} onRetry={fetchCourseContent} />;
  }

  // Empty state
  if (!courseContent) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <LearnHeader
        courseTitle={course?.title || ''}
        progressPercent={progressPercent}
        sidebarOpen={sidebarOpen}
        onSidebarToggle={handleSidebarToggle}
        onBack={handleBack}
      />

      {/* Main content - Video at top, curriculum below */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LearnMainContent
          currentSection={currentSection}
          sections={sections}
          courseId={courseId}
          courseContent={courseContent}
        />
      </div>
    </div>
  );
}
