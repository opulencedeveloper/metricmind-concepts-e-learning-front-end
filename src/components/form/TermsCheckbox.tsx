'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { TermsCheckboxProps } from '@/types/checkbox';

export default function TermsCheckbox({ checked, onChange, error }: TermsCheckboxProps) {
  return (
    <div>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => {
            onChange(e.target.checked);
          }}
          className="w-5 h-5 mt-0.5 rounded border-gray-300 checkbox-transition cursor-pointer accent-gray-900"
        />
        <span className="text-sm text-gray-600 leading-relaxed">
          I agree to the{' '}
          <Link href="/terms" className="font-semibold text-gray-900 link-hover">
            Terms of Service
          </Link>
          {' '}and{' '}
          <Link href="/privacy" className="font-semibold text-gray-900 link-hover">
            Privacy Policy
          </Link>
        </span>
      </label>

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key="error"
            className="text-sm font-medium text-red-600"
            initial={{ maxHeight: 0, opacity: 0, marginTop: 0 }}
            animate={{ maxHeight: 200, opacity: 1, marginTop: '0.5rem' }}
            exit={{ maxHeight: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
