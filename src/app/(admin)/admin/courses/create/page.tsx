'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useHttp } from '@/hooks/useHttp';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/form/Input';
import Alert from '@/components/ui/Alert';
import { ButtonVariant, ButtonSize, AlertType } from '@/types/ui';
import { CourseLevel } from '@/types/course';
import { Language } from '@/types/curriculum';
import { HttpMethod } from '@/types/http';
import { CURRENCY_OPTIONS, CURRENCY_LABELS } from '@/constants/currency';

export default function CreateCoursePage() {
  const router = useRouter();
  const { isLoading, sendHttpRequest } = useHttp();
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
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
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    setSuccess(undefined);
    setIsSaving(true);

    await sendHttpRequest({
      requestConfig: {
        method: HttpMethod.POST,
        url: '/admin/courses',
        body: formData,
        isAuth: true,
      },
      successRes: (data: any) => {
        setSuccess('Course created successfully!');
        setTimeout(() => router.push('/admin/courses'), 1500);
      },
      errorRes: (err: any) => {
        setError(err?.data?.description || err?.data?.message ||  'Failed to create course');
        setIsSaving(false);
      },
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Course</h1>
        <p className="text-gray-600 mt-2">Add a new course to your platform</p>
      </div>

      {error && <Alert type={AlertType.Error} message={error} dismissible />}
      {success && <Alert type={AlertType.Success} message={success} dismissible={false} />}

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-900 mb-4">Basic Information</legend>

            <Input
              label="Course Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
              />
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

          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-900 mb-4">Course Details</legend>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value={CourseLevel.Beginner}>Beginner</option>
                  <option value={CourseLevel.Intermediate}>Intermediate</option>
                  <option value={CourseLevel.Advanced}>Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value={Language.English}>English</option>
                  <option value={Language.French}>French</option>
                  <option value={Language.Spanish}>Spanish</option>
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

          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-900 mb-4">Pricing</legend>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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

          <div className="flex gap-4 pt-8 border-t border-gray-200">
            <Link href="/admin/courses" className="flex-1">
              <Button fullWidth variant={ButtonVariant.Secondary}>Cancel</Button>
            </Link>
            <Button
              type="submit"
              variant={ButtonVariant.Primary}
              size={ButtonSize.Large}
              disabled={isSaving}
              isLoading={isSaving}
              className="flex-1"
            >
              Create Course
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
