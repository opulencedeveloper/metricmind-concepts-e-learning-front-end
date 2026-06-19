import Link from 'next/link';
import { ActionButtonProps } from '@/types/admin';

export default function AdminActionButton({ label, href, icon }: ActionButtonProps) {
  return (
    <Link href={href}>
      <button className="w-full p-4 text-center rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition">
        <span className="text-2xl block mb-2">{icon}</span>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </button>
    </Link>
  );
}
