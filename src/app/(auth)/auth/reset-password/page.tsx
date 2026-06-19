'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Lock, ArrowLeft, Smartphone } from 'lucide-react';
import Alert from '@/components/ui/Alert';
import Input from '@/components/form/Input';
import { useHttp } from '@/hooks/useHttp';
import { ResetPasswordInput } from '@/types/auth';
import { validateField } from '@/lib/utils/validation';
import { validationRules } from '@/lib/utils/validation';
import { AlertType } from '@/types/ui';
import { HttpMethod } from '@/types/http';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { sendHttpRequest, isLoading, error: httpError } = useHttp();

  const [formData, setFormData] = useState<ResetPasswordInput>({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const sessionEmail = sessionStorage.getItem('resetPasswordEmail');
    if (sessionEmail) {
      setFormData((prev) => ({ ...prev, email: sessionEmail }));
    }
  }, []);

  const resetPasswordRules = {
    otp: [
      {
        validate: (value: string) => value.length === 6 && /^\d+$/.test(value),
        message: 'OTP must be 6 digits',
      },
    ],
    newPassword: validationRules.password,
    confirmPassword: validationRules.confirmPassword(formData.newPassword),
  };

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      if (name === 'otp') {
        const numericValue = value.replace(/\D/g, '').slice(0, 6);
        setFormData((prev) => ({ ...prev, [name]: numericValue }));
        const fieldError = validateField(name, numericValue, resetPasswordRules);
        setErrors((prev) => ({ ...prev, [name]: fieldError }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
        const fieldError = validateField(name, value, resetPasswordRules, formData as unknown as Record<string, string>);
        setErrors((prev) => ({ ...prev, [name]: fieldError }));
      }
    },
    [formData, resetPasswordRules]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage('');

    const newErrors: Record<string, string> = {};
    Object.keys(resetPasswordRules).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof resetPasswordRules], resetPasswordRules, formData as unknown as Record<string, string>);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await sendHttpRequest({
      requestConfig: {
        url: '/auth/student/reset-password',
        method: HttpMethod.POST,
        body: formData,
        isAuth: false,
      },
      successRes: () => {
        setSuccessMessage('Password reset successfully! Redirecting to login...');
        sessionStorage.removeItem('resetPasswordEmail');

        setTimeout(() => {
          router.push('/auth/login');
        }, 500);
      },
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation */}
      <div className="border-b border-gray-200 fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex justify-start">
          <Link
            href="/auth/login"
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 link-hover"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Welcome Section */}
          <div className="mb-12 fade-in-delayed">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Create new password
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Enter the verification code from your email and set a new password.
            </p>
          </div>

          {/* Alerts */}
          {httpError && (
            <div className="mb-6 fade-in">
              <Alert type={AlertType.Error} message={httpError} dismissible />
            </div>
          )}

          {successMessage && (
            <div className="mb-6 fade-in">
              <Alert type={AlertType.Success} message={successMessage} dismissible={false} />
            </div>
          )}

          {/* Form */}
          <div className="fade-in-delayed-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="text"
                inputMode="numeric"
                maxLength={6}
                name="otp"
                label="Verification code"
                icon={Smartphone}
                placeholder="000000"
                value={formData.otp}
                onChange={handleInputChange}
                error={errors.otp}
                helperText="Check your email for the 6-digit code"
                inputClassName="font-mono tracking-widest"
              />

              <Input
                type="password"
                name="newPassword"
                label="New password"
                icon={Lock}
                placeholder="••••••••"
                value={formData.newPassword}
                onChange={handleInputChange}
                error={errors.newPassword}
                helperText="At least 8 characters with uppercase, lowercase, number, and symbol"
                required
                showPasswordToggle
              />

              <Input
                type="password"
                name="confirmPassword"
                label="Confirm password"
                icon={Lock}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
                required
                showPasswordToggle
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 mt-8 bg-gray-900 text-white font-semibold rounded-xl button-hover active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? 'Resetting password...' : 'Reset password'}
                {!isLoading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            {/* Back to Login Link */}
            <div className="mt-8 text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1 font-semibold text-gray-900 link-hover"
              >
                Back to sign in
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
