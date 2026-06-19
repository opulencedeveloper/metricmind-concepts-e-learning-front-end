'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useHttp } from '@/hooks/useHttp';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';
import ErrorUI from '@/components/error/ErrorUI';
import { ButtonVariant, LoadingStateType } from '@/types/ui';
import { HttpMethod } from '@/types/http';

export default function PaymentsPage() {
  const { isLoading, sendHttpRequest } = useHttp();
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    fetchPayments();
  }, [sendHttpRequest]);

  const fetchPayments = async () => {
    setError(undefined);
    await sendHttpRequest({
      requestConfig: {
        method: HttpMethod.GET,
        url: '/payments/history',
        isAuth: true,
      },
      successRes: (data: any) => {
        setPayments(data.payments || []);
      },
      errorRes: (err: any) => {
        setError(err?.data?.description || err?.data?.message ||  'Failed to load payments');
      },
    });
  };

  if (isLoading && payments.length === 0) {
    return <LoadingState type={LoadingStateType.Skeleton} />;
  }

  if (error && payments.length === 0) {
    return <ErrorUI error={new Error(error)} statusCode={0} onRetry={fetchPayments} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
        <p className="text-gray-600 mt-2">View your transaction history</p>
      </div>

      {payments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Course</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment: any) => (
                <tr key={payment._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 text-gray-900">{payment.courseId?.title}</td>
                  <td className="py-4 px-4 text-gray-900">₦{payment.amount.toLocaleString()}</td>
                  <td className="py-4 px-4 text-gray-600">{new Date(payment.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      payment.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : payment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-gray-600 mb-4">No payments yet.</p>
          <Link href="/browse">
            <Button variant={ButtonVariant.Primary}>Start Learning</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
