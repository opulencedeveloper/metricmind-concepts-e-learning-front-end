import Card from '@/components/ui/Card';
import { StatCardProps } from '@/types/admin';

const colorClasses: Record<string, string> = {
  blue: 'bg-gray-50 border-gray-200',
  green: 'bg-green-50 border-green-200',
  purple: 'bg-purple-50 border-purple-200',
  orange: 'bg-orange-50 border-orange-200',
};

export default function AdminStatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Card className={`p-6 border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </Card>
  );
}
