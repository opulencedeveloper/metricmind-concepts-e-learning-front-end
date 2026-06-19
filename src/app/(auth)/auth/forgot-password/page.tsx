'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Mail, ArrowLeft } from 'lucide-react';
import Alert from '@/components/ui/Alert';
import Input from '@/components/form/Input';
import { useHttp } from '@/hooks/useHttp';
import { validateField } from '@/lib/utils/validation';
import { validationRules } from '@/lib/utils/validation';
import { AlertType } from '@/types/ui';
import { HttpMethod } from '@/types/http';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { sendHttpRequest, isLoading, error: httpError } = useHttp();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const emailRules = { email: validationRules.email };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    const fieldError = validateField('email', value, emailRules);
    setError(fieldError);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage('');

    const fieldError = validateField('email', email, emailRules);
    if (fieldError) {
      setError(fieldError);
      return;
    }

    await sendHttpRequest({
      requestConfig: {
        url: '/auth/student/forgot-password',
        method: HttpMethod.POST,
        body: { email },
        isAuth: false,
      },
      successRes: () => {
        setSuccessMessage('Check your email for password reset instructions');
        sessionStorage.setItem('resetPasswordEmail', email);

        setTimeout(() => {
          router.push('/auth/reset-password');
        }, 1500);
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
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Welcome Section */}
          <div className="mb-12 fade-in-delayed">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Reset password
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Enter your email and we'll send you instructions to reset your password.
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
                type="email"
                name="email"
                label="Email address"
                icon={Mail}
                placeholder="your@email.com"
                value={email}
                onChange={handleInputChange}
                error={error}
                required
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !!error}
                className="w-full h-12 mt-8 bg-gray-900 text-white font-semibold rounded-xl button-hover active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? 'Sending...' : 'Send reset link'}
                {!isLoading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            {/* Back to Login Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 mb-2">Remember your password?</p>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1 font-semibold text-gray-900 link-hover"
              >
                Sign in instead
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
