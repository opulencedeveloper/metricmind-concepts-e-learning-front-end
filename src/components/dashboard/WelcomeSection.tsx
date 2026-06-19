'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';
import { WelcomeSectionProps } from '@/types/dashboard';
import { ButtonVariant } from '@/types/ui';

const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  firstName,
  actionLabel = 'Browse Courses',
  actionHref = '/student/browse',
}) => {
  return (
    <div className="bg-gradient-to-r from-gray-800 to-indigo-600 rounded-lg p-8 text-white">
      <h1 className="text-4xl font-bold mb-2">
        Welcome back, {firstName}! 👋
      </h1>
      <p className="text-gray-100 mb-6">
        Continue your learning journey and explore new courses
      </p>
      <Link href={actionHref}>
        <Button variant={ButtonVariant.Secondary} className="bg-white text-gray-800 hover:bg-gray-50">
          {actionLabel}
        </Button>
      </Link>
    </div>
  );
};

export default WelcomeSection;
