'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/form/Input';
import Alert from '@/components/ui/Alert';
import LoadingState from '@/components/ui/LoadingState';
import ErrorUI from '@/components/error/ErrorUI';
import { useHttp } from '@/hooks/useHttp';
import { ButtonVariant, ButtonSize, AlertType, LoadingStateType } from '@/types/ui';
import { HttpMethod } from '@/types/http';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading, sendHttpRequest } = useHttp();

  const courseId = searchParams.get('courseId');
  const [course, setCourse] = useState<any>(null);
  const [error, setError] = useState<string>();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    setError(undefined);
    await sendHttpRequest({
      requestConfig: {
        method: HttpMethod.GET,
        url: `/student/courses/by-id/${courseId}`,
        isAuth: true,
      },
      successRes: (data: any) => {
        setCourse(data.course || data);
      },
      errorRes: (err: any) => {
        setError(err?.data?.description || err?.data?.message ||  'Failed to load course');
      },
    });
  };

  const handleCheckout = async () => {
    if (!courseId) return;

    setIsProcessing(true);
    setError(undefined);

    await sendHttpRequest({
      requestConfig: {
        method: HttpMethod.POST,
        url: `/payments/courses/${courseId}/initiate`,
        isAuth: true,
      },
      successRes: (data: any) => {
        // Redirect to Paystack payment page
        const authorizationUrl = data.authorizationUrl || data.data?.authorizationUrl;
        if (authorizationUrl) {
          window.location.href = authorizationUrl;
        } else {
          setError('Failed to initialize payment. Please try again.');
          setIsProcessing(false);
        }
      },
      errorRes: (err: any) => {
        setError(
          err?.data?.description || err?.data?.message || 
          err?.message ||
          'Payment initialization failed. Please try again.'
        );
        setIsProcessing(false);
      },
    });
  };

  if (isLoading && !course) {
    return <LoadingState type={LoadingStateType.Skeleton} />;
  }

  if (error && !course) {
    return <ErrorUI message={error} statusCode={0} onRetry={fetchCourse} />;
  }

  if (!course) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-600">No course selected for checkout</p>
        <Link href="/browse">
          <Button variant={ButtonVariant.Primary} className="mt-4">Back to Courses</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        <p className="text-gray-600 mt-2">Complete your course purchase</p>
      </div>

      {error && <Alert type={AlertType.Error} message={error} dismissible />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">{course.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Instructor: {course.instructor}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing Information</h2>
            <div className="space-y-4">
              <Input label="Email" type="email" required />
              <Input label="Full Name" required />
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-6 sticky top-6">
            <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{course.title}</span>
                <span className="font-medium">₦{course.price.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between mb-6 text-lg font-bold">
              <span>Total:</span>
              <span>₦{course.price.toLocaleString()}</span>
            </div>

            <Button
              fullWidth
              variant={ButtonVariant.Primary}
              size={ButtonSize.Large}
              onClick={handleCheckout}
              disabled={isProcessing}
              isLoading={isProcessing}
            >
              Complete Purchase
            </Button>

            <Link href="/browse" className="block mt-3">
              <Button fullWidth variant={ButtonVariant.Secondary}>Continue Shopping</Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<LoadingState type={LoadingStateType.Skeleton} />}>
      <CheckoutContent />
    </Suspense>
  );
}
