export const formatPrice = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatCurrency = (value: number, currencyCode: string = 'NGN'): string => {
  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    // Fallback for invalid currency codes
    return `${currencyCode} ${value.toLocaleString()}`;
  }
};
