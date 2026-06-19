'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/redux';
import Link from 'next/link';
import { ArrowRight, Smartphone, ArrowLeft } from 'lucide-react';
import Alert from '@/components/ui/Alert';
import Input from '@/components/form/Input';
import ResendOTPButton from '@/components/auth/ResendOTPButton';
import { useHttp } from '@/hooks/useHttp';
import { EmailVerifyInput } from '@/types/auth';
import { setAuthToken, setAuthStudent } from '@/lib/utils/auth';
import { authActions } from '@/store/redux/auth/authSlice';
import { AlertType } from '@/types/ui';
import { HttpMethod } from '@/types/http';

export default function VerifyEmailPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { sendHttpRequest, isLoading, error: httpError } = useHttp();
  const pendingEnrollmentCourseId = useSelector((state: RootState) => state?.enrollment?.pendingEnrollmentCourseId);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState('');
  const [resendError, setResendError] = useState('');

  useEffect(() => {
    const sessionEmail = sessionStorage.getItem('verificationEmail');
    if (sessionEmail) {
      setEmail(sessionEmail);
    }
  }, []);

  const handleOtpChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    if (value.length === 6) {
      setOtpError('');
    }
  }, []);

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!email) {
      setOtpError('Email is required');
      return;
    }

    if (otp.length !== 6) {
      setOtpError('OTP must be 6 digits');
      return;
    }

    const payload: EmailVerifyInput = { email, otp };

    await sendHttpRequest({
      requestConfig: {
        url: '/auth/student/verify-email',
        method: HttpMethod.POST,
        body: payload,
        isAuth: false,
      },
      successRes: (data) => {
        setAuthToken(data.token);
        setAuthStudent(data.student);

        dispatch(
          authActions.emailVerifySuccess({
            student: data.student,
            token: data.token,
          })
        );

        setSuccessMessage('Email verified! Redirecting...');
        sessionStorage.removeItem('verificationEmail');

        setTimeout(() => {
          // If user has pending enrollment from clicking "Enroll Now", go to confirmation page
          if (pendingEnrollmentCourseId) {
            router.push(`/student-dashboard/enrollment-confirmation?courseId=${pendingEnrollmentCourseId}`);
          } else {
            router.push('/student-dashboard');
          }
        }, 500);
      },
    });
  };

  const handleResendOTP = async () => {
    if (!email) {
      setResendError('Email is required');
      return;
    }

    setResendLoading(true);
    setResendError('');
    setResendSuccess('');

    await sendHttpRequest({
      requestConfig: {
        url: '/auth/student/resend-verification',
        method: HttpMethod.POST,
        body: { email },
        isAuth: false,
      },
      successRes: () => {
        setResendSuccess('Code sent to your email');
        setOtp('');
      },
      errorRes: () => {
        setResendError('Failed to resend code. Try again.');
      },
    });

    setResendLoading(false);
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
              Verify email
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              We sent a 6-digit code to <span className="font-semibold">{email || 'your email'}</span>
            </p>
          </div>

          {/* Alerts */}
          {httpError && (
            <div className="mb-6 fade-in">
              <Alert type={AlertType.Error} message={httpError} dismissible />
            </div>
          )}

          {resendSuccess && (
            <div className="mb-6 fade-in">
              <Alert type={AlertType.Success} message={resendSuccess} dismissible />
            </div>
          )}

          {resendError && (
            <div className="mb-6 fade-in">
              <Alert type={AlertType.Error} message={resendError} dismissible />
            </div>
          )}

          {successMessage && (
            <div className="mb-6 fade-in">
              <Alert type={AlertType.Success} message={successMessage} dismissible={false} />
            </div>
          )}

          {/* Form */}
          <div className="fade-in-delayed-2">
            <form onSubmit={handleVerify} className="space-y-6">
              <Input
                type="text"
                inputMode="numeric"
                maxLength={6}
                label="Verification code"
                icon={Smartphone}
                placeholder="000000"
                value={otp}
                onChange={handleOtpChange}
                error={otpError}
                inputClassName="font-mono tracking-widest text-center"
              />

              {/* Verify Button */}
              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full h-12 mt-8 bg-gray-900 text-white font-semibold rounded-xl button-hover active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? 'Verifying...' : 'Verify email'}
                {!isLoading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            {/* Resend OTP Section */}
            <div className="mt-8 space-y-4">
              <ResendOTPButton onResend={handleResendOTP} isLoading={resendLoading} />

              {/* Change Email Link */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Wrong email?</p>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center gap-1 font-semibold text-gray-900 link-hover"
                >
                  Use a different email
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
