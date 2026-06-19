import Card from '@/components/ui/Card';
import { MetricCardProps } from '@/types/admin';

export default function AdminMetricCard({ title, value, icon, trend, color }: MetricCardProps) {
  return (
    <Card className={`p-6 border ${color}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && <p className="text-xs text-green-600 font-medium mt-2">{trend} vs last month</p>}
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </Card>
  );
}
