'use client';

import { BadgeProps } from '@/types/ui';
import { BadgeVariant } from '@/types/ui';

const getVariantStyles = (variant: BadgeVariant): string => {
  const baseStyles = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold';

  switch (variant) {
    case BadgeVariant.Default:
      return `${baseStyles} bg-gray-100 text-gray-900`;
    case BadgeVariant.Success:
      return `${baseStyles} bg-green-100 text-green-800`;
    case BadgeVariant.Warning:
      return `${baseStyles} bg-yellow-100 text-yellow-800`;
    case BadgeVariant.Error:
      return `${baseStyles} bg-red-100 text-red-800`;
    default:
      return `${baseStyles} bg-gray-100 text-gray-800`;
  }
};

const Badge: React.FC<BadgeProps> = ({ children, variant = BadgeVariant.Default, className = '' }) => {
  return <span className={`${getVariantStyles(variant)} ${className}`}>{children}</span>;
};

export default Badge;
