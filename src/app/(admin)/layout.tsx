'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { isAdminAuthenticated, clearAuth } from '@/lib/utils/auth';
import AdminNavLink from '@/components/admin/AdminNavLink';
import { AdminLayoutProps } from '@/types/layoutTypes';

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAdminAuthenticated() && pathname !== '/(admin)/login') {
      router.push('/(admin)/login');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    clearAuth();
    router.push('/(admin)/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <nav className="p-4 space-y-1">
          {/* Logo */}
          <div className="px-4 py-6 border-b border-gray-200 mb-6">
            <h1 className="text-2xl font-bold text-gray-800">📚 MetricMind</h1>
            <p className="text-xs text-gray-600 mt-1">Creator Dashboard</p>
          </div>

          {/* Navigation Items */}
          <AdminNavLink href="/admin/dashboard" label="Dashboard" icon="📊" />
          <AdminNavLink href="/admin/courses" label="Courses" icon="📚" />
          <AdminNavLink href="/admin/students" label="Students" icon="👥" />
          <AdminNavLink href="/admin/analytics" label="Analytics" icon="📈" />
          <AdminNavLink href="/admin/settings" label="Settings" icon="⚙️" />

          {/* Divider */}
          <div className="border-t border-gray-200 my-4" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition"
          >
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
