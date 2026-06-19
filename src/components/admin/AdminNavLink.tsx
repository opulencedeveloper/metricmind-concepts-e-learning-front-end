'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavLinkProps } from '@/types/layoutTypes';

export default function AdminNavLink({ href, label, icon }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={`block px-4 py-2 rounded-lg font-medium transition ${
        isActive
          ? 'bg-gray-50 text-gray-800 border-l-4 border-gray-800'
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      {icon} {label}
    </Link>
  );
}
