export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

export const getFormattedYear = (): string => {
  return getCurrentYear().toString();
};

export const formatCertificateDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
