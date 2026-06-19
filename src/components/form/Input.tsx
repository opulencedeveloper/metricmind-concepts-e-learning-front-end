'use client';

import { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { InputProps } from '@/types/form';

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon: Icon,
      required = false,
      containerClassName = '',
      labelClassName = '',
      inputClassName = '',
      errorClassName = '',
      showPasswordToggle = false,
      type = 'text',
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const hasError = !!error;
    const isPasswordField = type === 'password';

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label className={`block text-sm font-semibold text-gray-900 mb-2 ${labelClassName}`}>
            {label}
            {required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {Icon && (
            <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          )}

          <input
            ref={ref}
            type={isPasswordField && showPasswordToggle && isPasswordVisible ? 'text' : type}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`w-full ${Icon ? 'pl-12' : 'px-4'} ${
              isPasswordField && showPasswordToggle ? 'pr-12' : 'pr-4'
            } py-3 rounded-xl border text-base input-focus transition-all duration-200 ${
              isFocused
                ? 'border-gray-900 ring-2 ring-gray-900 ring-opacity-10'
                : 'border-gray-200'
            } ${hasError ? 'border-red-500' : ''} ${inputClassName}`}
            {...props}
          />

          {isPasswordField && showPasswordToggle && (
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              tabIndex={-1}
            >
              {isPasswordVisible ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              key="error"
              className={`text-sm font-medium text-red-600 ${errorClassName}`}
              initial={{ maxHeight: 0, opacity: 0, marginTop: 0 }}
              animate={{ maxHeight: 200, opacity: 1, marginTop: '0.5rem' }}
              exit={{ maxHeight: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{ overflow: 'hidden' }}
            >
              {error}
            </motion.p>
          )}

          {!hasError && helperText && (
            <motion.p
              key="helper"
              className="text-xs text-gray-500"
              initial={{ maxHeight: 0, opacity: 0, marginTop: 0 }}
              animate={{ maxHeight: 200, opacity: 1, marginTop: '0.5rem' }}
              exit={{ maxHeight: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{ overflow: 'hidden' }}
            >
              {helperText}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
