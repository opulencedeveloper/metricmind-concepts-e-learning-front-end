'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isAuthenticated, isAdminAuthenticated } from '@/lib/utils/auth';
import LoadingState from '@/components/ui/LoadingState';
import StudentHeader from '@/components/StudentHeader';

export default function StudentCoursesLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isAdmin = isAdminAuthenticated();
      const isAuth = isAuthenticated();

      if (!isAuth && !isAdmin) {
        router.push('/auth/login');
      } else {
        setIsChecking(false);
      }
    };

    // Small delay to ensure localStorage is ready
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [router]);

  if (isChecking) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-white">
      <StudentHeader />
      <main className="max-w-7xl pt-5 mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
