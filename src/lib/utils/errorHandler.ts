import { HttpError } from '@/types/http';

export const getErrorMessage = (error: any): HttpError => {
  const isDev = process.env.NODE_ENV === 'development';

  // Log for developers only
  if (isDev) {
    console.log('[HTTP Error]', error);
  }

  // Network errors (no internet)
  if (error?.code === 'ERR_NETWORK' || error?.message?.includes('Network')) {
    return {
      userMessage: 'No internet connection. Please check your connection and try again.',
      statusCode: 0,
      originalError: error,
    };
  }

  // Timeout errors
  if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
    return {
      userMessage: 'Request timed out. The server is taking too long to respond. Please try again.',
      statusCode: 408,
      originalError: error,
    };
  }

  // Server response errors (HTTP response received with error message)
  if (error?.response?.data) {
    const { data } = error.response;
    const status = error.response.status;

    // Use API response message
    const apiResponseMessage = data?.description || data?.message;

    // Handle specific HTTP status codes with user-friendly messages
    if (status === 400) {
      return {
        userMessage: apiResponseMessage || 'Please check your input and try again.',
        statusCode: 400,
        originalError: error,
      };
    }

    if (status === 401) {
      return {
        userMessage: apiResponseMessage || 'Your session has expired. Please log in again.',
        statusCode: 401,
        originalError: error,
      };
    }

    if (status === 403) {
      return {
        userMessage: apiResponseMessage || 'You do not have permission to perform this action.',
        statusCode: 403,
        originalError: error,
      };
    }

    if (status === 404) {
      return {
        userMessage: apiResponseMessage || 'The resource you are looking for does not exist.',
        statusCode: 404,
        originalError: error,
      };
    }

    if (status === 409) {
      return {
        userMessage: apiResponseMessage || 'This action conflicts with existing data.',
        statusCode: 409,
        originalError: error,
      };
    }

    if (status >= 400 && status < 500) {
      return {
        userMessage: apiResponseMessage || 'Please check your input and try again.',
        statusCode: status,
        originalError: error,
      };
    }

    if (status >= 500) {
      return {
        userMessage: apiResponseMessage || 'Server error. Our team has been notified. Please try again later.',
        statusCode: status,
        originalError: error,
      };
    }
  }

  // Generic fallback
  return {
    userMessage: 'Something went wrong. Please try again.',
    originalError: error,
  };
};
