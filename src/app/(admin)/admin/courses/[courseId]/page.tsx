'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useHttp } from '@/hooks/useHttp';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/form/Input';
import Alert from '@/components/ui/Alert';
import LoadingState from '@/components/ui/LoadingState';
import ErrorUI from '@/components/error/ErrorUI';
import { ButtonVariant, ButtonSize, AlertType, LoadingStateType } from '@/types/ui';
import { CourseLevel } from '@/types/course';
import { Language } from '@/types/curriculum';
import { HttpMethod } from '@/types/http';
import { CURRENCY_OPTIONS, CURRENCY_LABELS } from '@/constants/currency';
import { CreateCourseFormData, DashboardCourse } from '@/types/admin';

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const { isLoading, sendHttpRequest } = useHttp();

  const [formData, setFormData] = useState<CreateCourseFormData>({
    title: '',
    description: '',
    instructor: '',
    instructorBio: '',
    category: '',
    subcategory: '',
    level: CourseLevel.Beginner,
    language: Language.English,
    price: 0,
    currency: 'NGN',
    thumbnail: '',
    previewVideoUrl: '',
    learningObjectives: [],
    requirements: [],
  });

  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [objectiveInput, setObjectiveInput] = useState('');
  const [requirementInput, setRequirementInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      setError(undefined);

      await sendHttpRequest({
        requestConfig: {
          method: HttpMethod.GET,
          url: `/admin/courses/${courseId}`,
          isAuth: true,
        },
        successRes: (data: any) => {
          const course = data.course || data;
          setFormData({
            title: course.title || '',
            description: course.description || '',
            instructor: course.instructor || '',
            instructorBio: course.instructorBio || '',
            category: course.category || '',
            subcategory: course.subcategory || '',
            level: course.level || CourseLevel.Beginner,
            language: course.language || Language.English,
            price: course.price || 0,
            currency: course.currency || 'NGN',
            thumbnail: course.thumbnail || '',
            previewVideoUrl: course.previewVideoUrl || '',
            learningObjectives: course.learningObjectives || [],
            requirements: course.requirements || [],
          });
        },
        errorRes: (err: any) => {
          setError(err?.data?.description || err?.data?.message ||  'Failed to load course');
        },
      });
    };

    fetchCourse();
  }, [courseId, sendHttpRequest]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(undefined);
  };

  const addObjective = () => {
    if (objectiveInput.trim()) {
      setFormData(prev => ({
        ...prev,
        learningObjectives: [...prev.learningObjectives, objectiveInput.trim()],
      }));
      setObjectiveInput('');
    }
  };

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.filter((_, i) => i !== index),
    }));
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()],
      }));
      setRequirementInput('');
    }
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): string | null => {
    if (formData.title && formData.title.length < 5) {
      return 'Course title must be at least 5 characters';
    }
    if (formData.title && formData.title.length > 200) {
      return 'Course title cannot exceed 200 characters';
    }

    if (formData.description && formData.description.length < 20) {
      return 'Course description must be at least 20 characters';
    }
    if (formData.description && formData.description.length > 2000) {
      return 'Course description cannot exceed 2000 characters';
    }

    if (formData.instructor && formData.instructor.length < 2) {
      return 'Instructor name must be at least 2 characters';
    }
    if (formData.instructor && formData.instructor.length > 100) {
      return 'Instructor name cannot exceed 100 characters';
    }

    if (formData.category && formData.category.length < 2) {
      return 'Category must be at least 2 characters';
    }
    if (formData.category && formData.category.length > 100) {
      return 'Category cannot exceed 100 characters';
    }

    if (formData.instructorBio && formData.instructorBio.length > 500) {
      return 'Instructor bio cannot exceed 500 characters';
    }

    if (formData.subcategory && formData.subcategory.length > 100) {
      return 'Subcategory cannot exceed 100 characters';
    }

    if (formData.thumbnail) {
      try {
        new URL(formData.thumbnail);
      } catch {
        return 'Thumbnail must be a valid URL';
      }
    }

    if (formData.previewVideoUrl) {
      try {
        new URL(formData.previewVideoUrl);
      } catch {
        return 'Preview video URL must be valid';
      }
    }

    if (formData.price < 0) {
      return 'Price cannot be negative';
    }

    for (let i = 0; i < formData.learningObjectives.length; i++) {
      const obj = formData.learningObjectives[i];
      if (obj.length < 5) {
        return `Learning objective ${i + 1} must be at least 5 characters`;
      }
      if (obj.length > 200) {
        return `Learning objective ${i + 1} cannot exceed 200 characters`;
      }
    }

    if (formData.learningObjectives.length > 10) {
      return 'Maximum 10 learning objectives allowed';
    }

    for (let i = 0; i < formData.requirements.length; i++) {
      const req = formData.requirements[i];
      if (req.length < 5) {
        return `Requirement ${i + 1} must be at least 5 characters`;
      }
      if (req.length > 200) {
        return `Requirement ${i + 1} cannot exceed 200 characters`;
      }
    }

    if (formData.requirements.length > 10) {
      return 'Maximum 10 requirements allowed';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    setSuccess(undefined);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);

    await sendHttpRequest({
      requestConfig: {
        method: HttpMethod.PUT,
        url: `/admin/courses/${courseId}`,
        body: formData,
        isAuth: true,
      },
      successRes: () => {
        setSuccess('Course updated successfully!');
        setTimeout(() => router.push('/admin/admin/coursess'), 1500);
      },
      errorRes: (err: any) => {
        setError(err?.data?.description || err?.data?.message ||  'Failed to update course');
        setIsSaving(false);
      },
    });
  };

  if (isLoading && Object.values(formData).every(v => !v)) {
    return <LoadingState type={LoadingStateType.Skeleton} />;
  }

  if (error && Object.values(formData).every(v => !v)) {
    return <ErrorUI error={new Error(error)} statusCode={0} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
          <p className="text-gray-600 mt-2">Update course details</p>
        </div>
        <Link href={`/admin/admin/coursess/${courseId}/curriculum`}>
          <Button variant={ButtonVariant.Secondary} size={ButtonSize.Large}>
            📚 Manage Curriculum
          </Button>
        </Link>
      </div>

      {/* Alerts */}
      {error && (
        <Alert type={AlertType.Error} message={error} dismissible />
      )}
      {success && (
        <Alert type={AlertType.Success} message={success} dismissible={false} />
      )}

      {/* Form */}
      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-900 mb-4">📋 Basic Information</legend>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Course Title *
                </label>
                <span className="text-xs text-gray-500">
                  {formData.title.length}/200
                </span>
              </div>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Min 5 characters</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <span className="text-xs text-gray-500">
                  {formData.description.length}/2000
                </span>
              </div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
              />
              <p className="text-xs text-gray-500 mt-1">Min 20 characters</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Instructor Name"
                name="instructor"
                value={formData.instructor}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              />
            </div>
          </fieldset>

          {/* Course Details */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-900 mb-4">🎓 Course Details</legend>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level *</label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
                >
                  <option value={CourseLevel.Beginner}>Beginner</option>
                  <option value={CourseLevel.Intermediate}>Intermediate</option>
                  <option value={CourseLevel.Advanced}>Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language *</label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
                >
                  <option value={Language.English}>English</option>
                  <option value={Language.French}>French</option>
                  <option value={Language.Spanish}>Spanish</option>
                  <option value={Language.Yoruba}>Yoruba</option>
                  <option value={Language.Igbo}>Igbo</option>
                  <option value={Language.Hausa}>Hausa</option>
                </select>
              </div>
            </div>

            <Input
              label="Thumbnail URL"
              name="thumbnail"
              type="url"
              value={formData.thumbnail}
              onChange={handleInputChange}
              required
            />
          </fieldset>

          {/* Pricing */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-900 mb-4">💰 Pricing</legend>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price *"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency *</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
                >
                  {CURRENCY_OPTIONS.map(curr => (
                    <option key={curr.value} value={curr.value}>
                      {curr.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          {/* Actions */}
          <div className="flex gap-4 pt-8 border-t border-gray-200">
            <Button
              type="button"
              variant={ButtonVariant.Secondary}
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={ButtonVariant.Primary}
              size={ButtonSize.Large}
              disabled={isSaving}
              isLoading={isSaving}
              className="flex-1"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
