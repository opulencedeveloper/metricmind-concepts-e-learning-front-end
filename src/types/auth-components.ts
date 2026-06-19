export interface ResendOTPButtonProps {
  onResend: () => Promise<void>;
  isLoading: boolean;
  countdownDuration?: number;
  startCountdownOnMount?: boolean;
}
