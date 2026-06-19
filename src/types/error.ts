export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export interface ErrorFallbackProps {
  error: Error | null;
  resetError: () => void;
}

export interface ErrorUIProps {
  error?: Error | null;
  onRetry?: () => void;
  message?: string;
  statusCode?: number;
}
