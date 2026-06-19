import { BadgeVariant } from '@/types/ui';
import { PaymentStatus } from '@/types/payment';

export const getStatusBadgeVariant = (status: string): BadgeVariant => {
  switch (status) {
    case PaymentStatus.Success:
      return BadgeVariant.Success
    case PaymentStatus.Pending:
      return BadgeVariant.Warning
    case PaymentStatus.Failed:
    case PaymentStatus.Cancelled:
      return BadgeVariant.Error
    default:
      return BadgeVariant.Default
  }
}

export const formatPaymentDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getStatusLabel = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};
