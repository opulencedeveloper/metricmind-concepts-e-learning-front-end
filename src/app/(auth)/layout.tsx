'use client';

import { getFormattedYear } from '@/lib/utils/date';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-gray-100 to-gray-200 flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Auth Container */}
      <div className="w-full max-w-md">
        {children}
      </div>

    </div>
  );
}
