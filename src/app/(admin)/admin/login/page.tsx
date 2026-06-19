'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/form/Input';
import Alert from '@/components/ui/Alert';
import { useHttp } from '@/hooks/useHttp';
import { AdminLoginForm } from '@/types/admin';
import { validateField } from '@/lib/utils/validation';
import { validationRules } from '@/lib/utils/validation';
import { saveAuthToken, saveAdminData } from '@/lib/utils/auth';
import { authActions } from '@/store/redux/auth/authSlice';
import { AlertType, ButtonVariant } from '@/types/ui';
import { UserType } from '@/types/auth';
import { HttpMethod } from '@/types/http';

export default function AdminLoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { sendHttpRequest, isLoading, error: httpError } = useHttp();

  const [formData, setFormData] = useState<AdminLoginForm>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      const loginValidationRules = {
        email: validationRules.email,
        password: validationRules.password,
      };

      const fieldError = validateField(name, value, loginValidationRules);
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const loginValidationRules = {
      email: validationRules.email,
      password: validationRules.password,
    };

    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof AdminLoginForm], loginValidationRules);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await sendHttpRequest({
      requestConfig: {
        url: '/auth/admin/login',
        method: HttpMethod.POST,
        body: formData,
        isAuth: false,
      },
      successRes: (data) => {
        saveAuthToken(data.data.token, UserType.Admin);
        saveAdminData(data.data.admin);

        dispatch(
          authActions.loginSuccess({
            student: data.data.admin,
            token: data.data.token,
          })
        );

        setSuccessMessage('Login successful! Redirecting...');

        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 500);
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-gray-900 rounded-lg mb-4">
            <span className="text-2xl">📚</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">MetricMind</h1>
          <p className="text-gray-600 mt-2">Creator Dashboard</p>
        </div>

        {/* Alert Messages */}
        {httpError && (
          <div className="mb-6">
            <Alert type={AlertType.Error} message={httpError} dismissible />
          </div>
        )}

        {successMessage && (
          <div className="mb-6">
            <Alert type={AlertType.Success} message={successMessage} dismissible={false} />
          </div>
        )}

        {/* Login Form Card */}
        <Card className="p-8 sm:p-12">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 text-sm mt-1">Sign in to your creator account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="creator@example.com"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              required
            />

            {/* Password Field */}
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              required
            />

            {/* Login Button */}
            <Button
              type="submit"
              variant={ButtonVariant.Primary}
              fullWidth
              isLoading={isLoading}
              disabled={isLoading}
            >
              Sign In
            </Button>
          </form>

          {/* Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              © 2024 MetricMind Concepts. All rights reserved.
            </p>
          </div>
        </Card>

        {/* Demo Info */}
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-xs text-gray-800">
            💡 <strong>Admin Only:</strong> Use your registered creator credentials to access the dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
