'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Mail, Lock, User } from 'lucide-react';
import Alert from '@/components/ui/Alert';
import Input from '@/components/form/Input';
import TermsCheckbox from '@/components/form/TermsCheckbox';
import { useHttp } from '@/hooks/useHttp';
import { SignupInput } from '@/types/auth';
import { validateField, validateForm } from '@/lib/utils/validation';
import { validationRules } from '@/lib/utils/validation';
import { AlertType } from '@/types/ui';
import { HttpMethod } from '@/types/http';

export default function SignupPage() {
  const router = useRouter();
  const { sendHttpRequest, isLoading, error: httpError } = useHttp();

  const [formData, setFormData] = useState<SignupInput>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const signupRules = {
    fullName: validationRules.fullName,
    email: validationRules.email,
    password: validationRules.password,
    confirmPassword: validationRules.confirmPassword(formData.password),
  };

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      const fieldError = validateField(name, value, signupRules, formData as unknown as Record<string, string>);
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }));
    },
    [formData, signupRules]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!agreedToTerms) {
      setErrors((prev) => ({
        ...prev,
        terms: 'You must agree to the Terms of Service',
      }));
      return;
    }

    const newErrors = validateForm(formData as unknown as Record<string, string>, signupRules);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await sendHttpRequest({
      requestConfig: {
        url: '/auth/student/signup',
        method: HttpMethod.POST,
        body: {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        },
        isAuth: false,
      },
      successRes: () => {
        setSuccessMessage('Account created! Redirecting to email verification...');
        sessionStorage.setItem('verificationEmail', formData.email);

        setTimeout(() => {
          router.push('/auth/verify-email');
        }, 500);
      },
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation */}
      <div className="border-b border-gray-200 fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex justify-end">
          <div className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-semibold text-gray-900 link-hover">
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Welcome Section */}
          <div className="mb-12 fade-in-delayed">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Create account
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Start your learning journey with MetricMind today.
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

          {/* Signup Form */}
          <div className="fade-in-delayed-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="text"
                name="fullName"
                label="Full name"
                icon={User}
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleInputChange}
                error={errors.fullName}
                required
              />

              <Input
                type="email"
                name="email"
                label="Email address"
                icon={Mail}
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                required
              />

              <Input
                type="password"
                name="password"
                label="Password"
                icon={Lock}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
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

              {/* Terms Checkbox */}
              <TermsCheckbox
                checked={agreedToTerms}
                onChange={(checked) => {
                  setAgreedToTerms(checked);
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.terms;
                    return newErrors;
                  });
                }}
                error={errors.terms}
              />

              {/* Create Account Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 mt-8 bg-gray-900 text-white font-semibold rounded-xl button-hover active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
                {!isLoading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-600">or continue with</span>
              </div>
            </div>

            {/* Google Sign Up */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 h-12 border border-gray-200 rounded-xl text-gray-900 font-semibold link-hover active:scale-95"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </button>

            {/* Legal Footer */}
            <p className="mt-8 text-center text-xs text-gray-500 leading-relaxed">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="underline link-hover">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline link-hover">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
