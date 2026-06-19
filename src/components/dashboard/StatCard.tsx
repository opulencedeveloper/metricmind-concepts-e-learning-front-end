'use client';

import Card from '@/components/ui/Card';
import { StatCardProps } from '@/types/dashboard';
import { StatColor } from '@/types/dashboard';

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  color = StatColor.Primary,
}) => {
  const colorStyles = {
    [StatColor.Primary]: 'text-gray-800',
    [StatColor.Green]: 'text-green-600',
    [StatColor.Purple]: 'text-purple-600',
    [StatColor.Orange]: 'text-orange-600',
    [StatColor.Red]: 'text-red-600',
  };

  return (
    <Card className="p-6">
      <div className="text-center">
        {icon && <div className="text-4xl mb-3">{icon}</div>}
        <div className={`text-4xl font-bold ${colorStyles[color]} mb-2`}>
          {value}
        </div>
        <p className="text-gray-600 text-sm font-medium">{label}</p>
      </div>
    </Card>
  );
};

export default StatCard;
