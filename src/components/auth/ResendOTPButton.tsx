'use client';

import { useState, useEffect } from 'react';
import { RotateCw } from 'lucide-react';
import { ResendOTPButtonProps } from '@/types/auth-components';

export default function ResendOTPButton({
  onResend,
  isLoading,
  countdownDuration = 60,
  startCountdownOnMount = true,
}: ResendOTPButtonProps) {
  const [countdown, setCountdown] = useState(startCountdownOnMount ? countdownDuration : 0);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleClick = async () => {
    await onResend();
    setCountdown(countdownDuration);
  };

  const isDisabled = isLoading || countdown > 0;

  return (
    <div className="text-center">
      <p className="text-sm text-gray-600 mb-3">
        {countdown > 0 ? `Resend code in ${countdown}s` : "Didn't receive the code?"}
      </p>
      <button
        type="button"
        onClick={handleClick}
        disabled={isDisabled}
        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-gray-900 font-semibold link-hover active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        <RotateCw className={`h-4 w-4 ${isLoading || countdown > 0 ? 'animate-spin' : ''}`} />
        {countdown > 0 ? `Wait ${countdown}s` : isLoading ? 'Sending...' : 'Resend code'}
      </button>
    </div>
  );
}
