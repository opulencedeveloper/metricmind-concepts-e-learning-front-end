'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useHttp } from '@/hooks/useHttp';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';
import ErrorUI from '@/components/error/ErrorUI';
import { ButtonVariant, LoadingStateType } from '@/types/ui';
import { HttpMethod } from '@/types/http';

export default function CertificatePage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const { isLoading, sendHttpRequest } = useHttp();

  const [certificate, setCertificate] = useState<any>(null);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (courseId) {
      fetchCertificate();
    }
  }, [courseId]);

  const fetchCertificate = async () => {
    setError(undefined);
    await sendHttpRequest({
      requestConfig: {
        method: HttpMethod.GET,
        url: `/student/courses/${courseId}/certificate`,
        isAuth: true,
      },
      successRes: (data: any) => {
        setCertificate(data.certificate || data);
      },
      errorRes: (err: any) => {
        setError(err?.data?.description || err?.data?.message ||  'Complete the course to earn your certificate');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    });
  };

  if (isLoading && !certificate) {
    return <LoadingState type={LoadingStateType.Skeleton} />;
  }

  if (error && !certificate) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-12 text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 text-yellow-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Certificate Not Available</h2>
          <p className="text-gray-600 mb-6">Complete the course to earn your certificate.</p>
          <div className="flex justify-center"> <Link href={`/student-dashboard/my-courses/${courseId}/learn`}>
            <Button variant={ButtonVariant.Primary}>Continue Learning</Button>
          </Link></div>
        </Card>
      </div>
    );
  }

  if (!certificate) {
    return null;
  }

  const downloadCertificate = async () => {
    if (certificate.certificateUrl) {
      const link = document.createElement('a');
      link.href = certificate.certificateUrl;
      link.download = `${certificate.studentName}-certificate.pdf`;
      link.click();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🎓 Course Certificate</h1>
        <p className="text-gray-600 mt-2">Congratulations on completing the course!</p>
      </div>

      <Card className="p-12 bg-linear-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
        <div className="text-center space-y-6">
          <div>
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Certificate of Completion</h2>
            <p className="text-gray-600 text-lg">This is to certify that</p>
          </div>

          <div>
            <p className="text-2xl font-bold text-gray-900">{certificate.studentName}</p>
            <p className="text-gray-600 mt-2">Has successfully completed</p>
            <p className="text-xl font-semibold text-gray-900 mt-2">{certificate.courseName}</p>
          </div>

          <div>
            <p className="text-gray-600">on {new Date(certificate.issuedAt).toLocaleDateString()}</p>
            <p className="text-gray-600 mt-4">Certificate ID: {certificate._id}</p>
          </div>

          {certificate.grade && (
            <div>
              <p className="text-gray-600">Grade Achieved</p>
              <p className="text-2xl font-bold text-gray-800">{certificate.grade}</p>
            </div>
          )}

          <div className="border-t-2 border-amber-300 pt-6">
            <p className="text-sm text-gray-600">This certificate verifies the bearer's achievement</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          fullWidth
          variant={ButtonVariant.Primary}
          onClick={downloadCertificate}
        >
          📥 Download Certificate
        </Button>
        <Link href={`/student-dashboard/my-courses/${courseId}`}>
          <Button fullWidth variant={ButtonVariant.Secondary}>Back to Course</Button>
        </Link>
      </div>

      <Card className="p-6 bg-gray-50 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2">Share Your Achievement</h3>
        <p className="text-sm text-gray-600">You can now share this certificate on your professional profiles to showcase your learning accomplishment.</p>
      </Card>
    </div>
  );
}
