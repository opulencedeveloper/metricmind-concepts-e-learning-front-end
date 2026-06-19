'use client';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { ButtonVariant, ButtonSize } from '@/types/ui';
import { CertificateData } from '@/types/enrollment';
import { formatCertificateDate } from '@/lib/utils/date';

interface CertificateDisplayProps {
  certificate: CertificateData;
}

const CertificateDisplay: React.FC<CertificateDisplayProps> = ({ certificate }) => {
  const formattedDate = formatCertificateDate(certificate.completionDate);
  const certificateId = certificate.certificateUrl.split('/').pop() || 'CERT001';

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = certificate.certificateUrl;
    link.download = `${certificate.studentName}-certificate.pdf`;
    link.click();
  };

  const handlePrint = () => {
    const printWindow = window.open(certificate.certificateUrl, '_blank');
    if (printWindow) {
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Certificate of Completion</h1>
        <p className="text-gray-600 mt-2">{certificate.courseTitle}</p>
      </div>

      {/* Certificate Preview Card */}
      <Card className="p-12 bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 border-2 border-gray-200 space-y-8">
        {/* Certificate Header */}
        <div className="text-center space-y-2 border-b-2 border-gray-200 pb-6">
          <div className="text-5xl">🏆</div>
          <h2 className="text-3xl font-bold text-gray-900">Certificate of Completion</h2>
          <p className="text-gray-800">This certifies that the bearer has successfully completed</p>
        </div>

        {/* Course Title */}
        <div className="text-center space-y-2">
          <p className="text-gray-600 mb-2 uppercase text-sm font-semibold">The Course</p>
          <h3 className="text-2xl font-bold text-gray-900">{certificate.courseTitle}</h3>
        </div>

        {/* Student Name */}
        <div className="text-center space-y-2 border-t-2 border-b-2 border-gray-300 py-6">
          <p className="text-gray-600 text-sm uppercase font-semibold">Has Been Awarded To</p>
          <p className="text-3xl font-bold text-gray-900">{certificate.studentName}</p>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-6 text-center">
          <div>
            <p className="text-gray-600 text-sm uppercase font-semibold mb-1">Instructor</p>
            <p className="font-semibold text-gray-900">{certificate.instructorName}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm uppercase font-semibold mb-1">Date of Completion</p>
            <p className="font-semibold text-gray-900">{formattedDate}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 pt-6 border-t border-gray-300">
          <p>Certificate ID: {certificateId}</p>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-4 justify-center flex-wrap">
        <Button
          variant={ButtonVariant.Primary}
          size={ButtonSize.Large}
          onClick={handleDownload}
        >
          Download Certificate
        </Button>

        <Button
          variant={ButtonVariant.Secondary}
          size={ButtonSize.Large}
          onClick={handlePrint}
        >
          Print Certificate
        </Button>
      </div>

      {/* Share Section */}
      <Card className="p-6 bg-gray-50 border-gray-200 space-y-4">
        <h3 className="font-semibold text-gray-900">Share Your Achievement</h3>
        <p className="text-sm text-gray-600 mb-4">
          Celebrate your learning journey by sharing this certificate with your network.
        </p>
        <Button
          variant={ButtonVariant.Secondary}
          size={ButtonSize.Medium}
          onClick={() => {
            const text = `I just completed "${certificate.courseTitle}" and earned a certificate on MetricMind! 🎓`;
            if (navigator.share) {
              navigator.share({
                title: 'MetricMind Certificate',
                text,
              });
            } else {
              // Fallback: copy to clipboard
              navigator.clipboard.writeText(text);
              alert('Copied to clipboard!');
            }
          }}
        >
          Share Achievement
        </Button>
      </Card>
    </div>
  );
};

export default CertificateDisplay;
