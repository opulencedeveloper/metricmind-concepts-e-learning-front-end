/**
 * Convert text to sentence case (first letter uppercase, rest lowercase)
 * @example toSentenceCase('ENGLISH') => 'English'
 * @example toSentenceCase('web_development') => 'Web_development'
 */
export const toSentenceCase = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Convert text to title case (each word capitalized)
 * @example toTitleCase('web development') => 'Web Development'
 */
export const toTitleCase = (text: string): string => {
  if (!text) return '';
  return text
    .split(/[\s_-]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
