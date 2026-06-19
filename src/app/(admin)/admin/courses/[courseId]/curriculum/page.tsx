'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useHttp } from '@/hooks/useHttp';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/form/Input';
import Alert from '@/components/ui/Alert';
import LoadingState from '@/components/ui/LoadingState';
import ErrorUI from '@/components/error/ErrorUI';
import { ButtonVariant, ButtonSize, AlertType, LoadingStateType } from '@/types/ui';
import { HttpMethod } from '@/types/http';
import { Section, CourseContent, SectionWithItems } from '@/types/admin';

export default function CurriculumPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const { isLoading, sendHttpRequest } = useHttp();

  const [courseContent, setCourseContent] = useState<CourseContent | null>(null);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [showAddSection, setShowAddSection] = useState(false);
  const [sectionTitle, setSectionTitle] = useState('');
  const [sectionDescription, setSectionDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchCourseContent();
  }, [courseId, sendHttpRequest]);

  const fetchCourseContent = async () => {
    setError(undefined);
    await sendHttpRequest({
      requestConfig: {
        method: HttpMethod.GET,
        url: `/admin/courses/${courseId}/content`,
        isAuth: true,
      },
      successRes: (data: any) => {
        setCourseContent(data.data || data);
      },
      errorRes: (err: any) => {
        setError(err?.data?.description || err?.data?.message ||  'Failed to load course content');
      },
    });
  };

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setSuccess(undefined);

    if (!sectionTitle.trim()) {
      setError('Section title is required');
      return;
    }

    if (sectionTitle.length < 3) {
      setError('Section title must be at least 3 characters');
      return;
    }

    if (sectionTitle.length > 150) {
      setError('Section title cannot exceed 150 characters');
      return;
    }

    if (sectionDescription && sectionDescription.length > 500) {
      setError('Description cannot exceed 500 characters');
      return;
    }

    setIsSaving(true);

    const order = (courseContent?.sections?.length || 0) + 1;

    await sendHttpRequest({
      requestConfig: {
        method: HttpMethod.POST,
        url: `/admin/courses/${courseId}/sections`,
        body: {
          title: sectionTitle,
          description: sectionDescription || undefined,
          order,
        },
        isAuth: true,
      },
      successRes: () => {
        setSuccess('Section created successfully');
        setSectionTitle('');
        setSectionDescription('');
        setShowAddSection(false);
        fetchCourseContent();
      },
      errorRes: (err: any) => {
        setError(err?.data?.description || err?.data?.message ||  'Failed to create section');
        setIsSaving(false);
      },
    });
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm('Are you sure you want to delete this section and all its items?')) return;

    await sendHttpRequest({
      requestConfig: {
        method: HttpMethod.DELETE,
        url: `/admin/courses/${courseId}/sections/${sectionId}`,
        isAuth: true,
      },
      successRes: () => {
        setSuccess('Section deleted successfully');
        fetchCourseContent();
      },
      errorRes: (err: any) => {
        setError(err?.data?.description || err?.data?.message ||  'Failed to delete section');
      },
    });
  };

  if (isLoading && !courseContent) {
    return <LoadingState type={LoadingStateType.Skeleton} />;
  }

  if (error && !courseContent) {
    return <ErrorUI error={new Error(error)} statusCode={0} onRetry={fetchCourseContent} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href={`/admin/admin/coursess/${courseId}`}>
            <button className="text-gray-800 hover:text-gray-800 text-sm mb-2">← Back to Course</button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Course Curriculum</h1>
          <p className="text-gray-600 mt-2">Manage sections and lessons</p>
        </div>
        <Button
          variant={ButtonVariant.Primary}
          size={ButtonSize.Large}
          onClick={() => setShowAddSection(!showAddSection)}
        >
          + Add Section
        </Button>
      </div>

      {/* Alerts */}
      {error && <Alert type={AlertType.Error} message={error} dismissible />}
      {success && <Alert type={AlertType.Success} message={success} dismissible />}

      {/* Add Section Form */}
      {showAddSection && (
        <Card className="p-6 bg-gray-50 border border-gray-200">
          <form onSubmit={handleAddSection} className="space-y-4">
            <h3 className="font-semibold text-gray-900">Create New Section</h3>

            <Input
              label="Section Title"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              placeholder="e.g., Introduction to Basics"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={sectionDescription}
                onChange={(e) => setSectionDescription(e.target.value)}
                rows={3}
                placeholder="Optional section description"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
              />
              <p className="text-xs text-gray-500 mt-1">{sectionDescription.length}/500</p>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                variant={ButtonVariant.Primary}
                disabled={isSaving}
                isLoading={isSaving}
              >
                Create Section
              </Button>
              <Button
                type="button"
                variant={ButtonVariant.Secondary}
                onClick={() => {
                  setShowAddSection(false);
                  setSectionTitle('');
                  setSectionDescription('');
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Sections List */}
      <div className="space-y-4">
        {courseContent?.sections && courseContent.sections.length > 0 ? (
          courseContent.sections.map((section: SectionWithItems, idx: number) => (
            <Card key={section._id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-gray-800 font-semibold text-sm">
                      {idx + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                  </div>
                  {section.description && (
                    <p className="text-sm text-gray-600 ml-11">{section.description}</p>
                  )}
                  <div className="mt-3 ml-11 flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      {section.items?.length || 0} lesson{(section.items?.length || 0) !== 1 ? 's' : ''}
                    </span>
                    {section.items && section.items.length === 0 && (
                      <span className="text-sm text-orange-600 font-medium">⚠️ No items yet</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/admin/admin/coursess/${courseId}/curriculum/${section._id}`}>
                    <Button variant={ButtonVariant.Secondary} size={ButtonSize.Small}>
                      Manage Items
                    </Button>
                  </Link>
                  <button
                    onClick={() => handleDeleteSection(section._id)}
                    className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg font-medium text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Items Preview */}
              {section.items && section.items.length > 0 && (
                <div className="mt-4 ml-11 pt-4 border-t border-gray-200">
                  <ul className="space-y-2">
                    {section.items.slice(0, 3).map((item, itemIdx) => (
                      <li key={item._id} className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                          {item.type}
                        </span>
                        {itemIdx + 1}. {item.title}
                      </li>
                    ))}
                    {(section.items?.length || 0) > 3 && (
                      <li className="text-sm text-gray-500">
                        ... and {(section.items?.length || 0) - 3} more
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center">
            <p className="text-gray-600 mb-4">No sections yet. Create your first section to get started!</p>
            <Button
              variant={ButtonVariant.Primary}
              onClick={() => setShowAddSection(true)}
            >
              Create Section
            </Button>
          </Card>
        )}
      </div>

      {/* Publish Info */}
      {courseContent?.sections && courseContent.sections.length > 0 && (
        <Card className="p-6 bg-gray-50 border border-gray-200">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> Each section must have at least one quiz before you can publish this course.
          </p>
        </Card>
      )}
    </div>
  );
}
