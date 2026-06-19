import { ValidationRules, FormErrors, FormState } from '@/types/form';

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

export const validationRules = {
  email: [
    {
      validate: (value: string) => value.trim().length > 0,
      message: 'Email is required',
    },
    {
      validate: (value: string) => emailRegex.test(value),
      message: 'Please enter a valid email address',
    },
  ],
  password: [
    {
      validate: (value: string) => value.length > 0,
      message: 'Password is required',
    },
    {
      validate: (value: string) => value.length >= 8,
      message: 'Password must be at least 8 characters',
    },
    {
      validate: (value: string) => /[A-Z]/.test(value),
      message: 'Password must contain at least one uppercase letter',
    },
    {
      validate: (value: string) => /[a-z]/.test(value),
      message: 'Password must contain at least one lowercase letter',
    },
    {
      validate: (value: string) => /\d/.test(value),
      message: 'Password must contain at least one number',
    },
  ],
  fullName: [
    {
      validate: (value: string) => value.trim().length > 0,
      message: 'Full name is required',
    },
    {
      validate: (value: string) => value.trim().length >= 2,
      message: 'Full name must be at least 2 characters',
    },
  ],
  confirmPassword: (password: string) => [
    {
      validate: (value: string) => value.length > 0,
      message: 'Please confirm your password',
    },
    {
      validate: (value: string) => value === password,
      message: 'Passwords do not match',
    },
  ],
};

export const validateField = (
  name: string,
  value: string,
  rules?: ValidationRules,
  allFormData?: FormState
): string => {
  const fieldRules = rules?.[name] || validationRules[name as keyof typeof validationRules];

  if (!fieldRules) {
    return '';
  }

  // Handle dynamic rules (like confirmPassword)
  let applicableRules: any[] = [];
  if (typeof fieldRules === 'function') {
    applicableRules = fieldRules(allFormData?.password || '');
  } else {
    applicableRules = fieldRules as any[];
  }

  for (const rule of applicableRules) {
    if (!rule.validate(value)) {
      return rule.message;
    }
  }

  return '';
};

export const validateForm = (
  formData: FormState,
  rules: ValidationRules
): FormErrors => {
  const errors: FormErrors = {};

  Object.keys(rules).forEach((fieldName) => {
    const error = validateField(fieldName, formData[fieldName] || '', rules, formData as unknown as Record<string, string>);
    if (error) {
      errors[fieldName] = error;
    }
  });

  return errors;
};
