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
import { CurriculumItemType } from '@/types/curriculum';
import { HttpMethod } from '@/types/http';
import { CurriculumItem, CreateCurriculumItemInput, CourseContent, SectionWithItems } from '@/types/admin';

export default function SectionItemsPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const sectionId = params.sectionId as string;
  const { isLoading, sendHttpRequest } = useHttp();

  const [courseContent, setCourseContent] = useState<CourseContent | null>(null);
  const [section, setSection] = useState<SectionWithItems | null>(null);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [showAddItem, setShowAddItem] = useState(false);
  const [itemFormData, setItemFormData] = useState<CreateCurriculumItemInput>({
    title: '',
    description: '',
    type: CurriculumItemType.Lecture,
    order: 1,
    videoUrl: '',
    content: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchCourseContent();
  }, [courseId, sectionId, sendHttpRequest]);

  const fetchCourseContent = async () => {
    setError(undefined);
    await sendHttpRequest({
      requestConfig: {
        method: HttpMethod.GET,
        url: `/admin/courses/${courseId}/content`,
        isAuth: true,
      },
      successRes: (data: any) => {
        const content = data.data || data;
        setCourseContent(content);
        const foundSection = content.sections?.find((s: SectionWithItems) => s._id === sectionId);
        setSection(foundSection || null);
        if (!foundSection) {
          setError('Section not found');
        }
      },
      errorRes: (err: any) => {
        setError(err?.data?.description || err?.data?.message ||  'Failed to load course content');
      },
    });
  };

  const validateItemForm = (): string | null => {
    if (!itemFormData.title.trim()) {
      return 'Item title is required';
    }
    if (itemFormData.title.length < 3) {
      return 'Title must be at least 3 characters';
    }
    if (itemFormData.title.length > 200) {
      return 'Title cannot exceed 200 characters';
    }
    if (itemFormData.description && itemFormData.description.length > 500) {
      return 'Description cannot exceed 500 characters';
    }
    if (itemFormData.type === CurriculumItemType.Lecture && itemFormData.videoUrl) {
      try {
        new URL(itemFormData.videoUrl);
      } catch {
        return 'Video URL must be valid';
      }
    }
    return null;
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setSuccess(undefined);

    const validationError = validateItemForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);

    const order = (section?.items?.length || 0) + 1;

    await sendHttpRequest({
      requestConfig: {
        method: HttpMethod.POST,
        url: `/admin/courses/${courseId}/sections/${sectionId}/items`,
        body: {
          title: itemFormData.title,
          description: itemFormData.description || undefined,
          type: itemFormData.type,
          order,
          videoUrl: itemFormData.videoUrl || undefined,
          content: itemFormData.content || undefined,
        },
        isAuth: true,
      },
      successRes: () => {
        setSuccess('Item created successfully');
        setItemFormData({
          title: '',
          description: '',
          type: CurriculumItemType.Lecture,
          order: 1,
          videoUrl: '',
          content: '',
        });
        setShowAddItem(false);
        fetchCourseContent();
      },
      errorRes: (err: any) => {
        setError(err?.data?.description || err?.data?.message ||  'Failed to create item');
        setIsSaving(false);
      },
    });
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    await sendHttpRequest({
      requestConfig: {
        method: HttpMethod.DELETE,
        url: `/admin/courses/${courseId}/sections/${sectionId}/items/${itemId}`,
        isAuth: true,
      },
      successRes: () => {
        setSuccess('Item deleted successfully');
        fetchCourseContent();
      },
      errorRes: (err: any) => {
        setError(err?.data?.description || err?.data?.message ||  'Failed to delete item');
      },
    });
  };

  if (isLoading && !section) {
    return <LoadingState type={LoadingStateType.Skeleton} />;
  }

  if (error && !section) {
    return <ErrorUI error={new Error(error)} statusCode={0} onRetry={fetchCourseContent} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href={`/admin/admin/coursess/${courseId}/curriculum`}>
            <button className="text-gray-800 hover:text-gray-800 text-sm mb-2">← Back to Curriculum</button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{section?.title}</h1>
          <p className="text-gray-600 mt-2">Manage section lessons and content</p>
        </div>
        <Button
          variant={ButtonVariant.Primary}
          size={ButtonSize.Large}
          onClick={() => setShowAddItem(!showAddItem)}
        >
          + Add Item
        </Button>
      </div>

      {/* Alerts */}
      {error && <Alert type={AlertType.Error} message={error} dismissible />}
      {success && <Alert type={AlertType.Success} message={success} dismissible />}

      {/* Add Item Form */}
      {showAddItem && (
        <Card className="p-6 bg-gray-50 border border-gray-200">
          <form onSubmit={handleAddItem} className="space-y-4">
            <h3 className="font-semibold text-gray-900">Add New Item</h3>

            <Input
              label="Item Title"
              value={itemFormData.title}
              onChange={(e) => setItemFormData({ ...itemFormData, title: e.target.value })}
              placeholder="e.g., Introduction Lecture"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={itemFormData.description}
                onChange={(e) => setItemFormData({ ...itemFormData, description: e.target.value })}
                rows={3}
                placeholder="Optional item description"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
              />
              <p className="text-xs text-gray-500 mt-1">
                {(itemFormData.description || '').length}/500
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
              <select
                value={itemFormData.type}
                onChange={(e) => setItemFormData({ ...itemFormData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
              >
                <option value={CurriculumItemType.Lecture}>Lecture</option>
                <option value={CurriculumItemType.Article}>Article</option>
                <option value={CurriculumItemType.Resource}>Resource</option>
                <option value={CurriculumItemType.Quiz}>Quiz</option>
                <option value={CurriculumItemType.Assignment}>Assignment</option>
              </select>
            </div>

            {itemFormData.type === CurriculumItemType.Lecture && (
              <Input
                label="Video URL"
                type="url"
                value={itemFormData.videoUrl}
                onChange={(e) => setItemFormData({ ...itemFormData, videoUrl: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
              />
            )}

            {(itemFormData.type === CurriculumItemType.Article || itemFormData.type === CurriculumItemType.Resource) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={itemFormData.content}
                  onChange={(e) => setItemFormData({ ...itemFormData, content: e.target.value })}
                  rows={4}
                  placeholder="Enter article or resource content..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
                />
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="submit"
                variant={ButtonVariant.Primary}
                disabled={isSaving}
                isLoading={isSaving}
              >
                Create Item
              </Button>
              <Button
                type="button"
                variant={ButtonVariant.Secondary}
                onClick={() => {
                  setShowAddItem(false);
                  setItemFormData({
                    title: '',
                    description: '',
                    type: CurriculumItemType.Lecture,
                    order: 1,
                    videoUrl: '',
                    content: '',
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Items List */}
      <div className="space-y-4">
        {section?.items && section.items.length > 0 ? (
          section.items.map((item: CurriculumItem, idx: number) => (
            <Card key={item._id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-full text-indigo-700 font-semibold text-sm">
                      {idx + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <span className="text-xs bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-medium">
                      {item.type}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-600 ml-11">{item.description}</p>
                  )}
                  {item.videoUrl && (
                    <p className="text-sm text-gray-500 ml-11 mt-2">
                      📹 <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline">
                        {item.videoUrl}
                      </a>
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg font-medium text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center">
            <p className="text-gray-600 mb-4">No items yet. Add your first lesson to this section!</p>
            <Button
              variant={ButtonVariant.Primary}
              onClick={() => setShowAddItem(true)}
            >
              Add Item
            </Button>
          </Card>
        )}
      </div>

      {/* Quiz Requirement Info */}
      {section && (
        <Card className="p-6 bg-amber-50 border border-amber-200">
          <p className="text-sm text-gray-700">
            <strong>Important:</strong> This section must have at least one Quiz item before the course can be published.
            {!section.items?.some((item) => item.type === CurriculumItemType.Quiz) && (
              <span className="text-amber-700 font-medium"> ⚠️ No quiz found in this section yet.</span>
            )}
          </p>
        </Card>
      )}
    </div>
  );
}
