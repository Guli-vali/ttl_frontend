import { DEFAULT_ERROR_MESSAGES } from '@/constants/defaults';

export const handleApiError = (error: unknown, defaultMessage: string): string => {
  console.error(defaultMessage, error);
  return error instanceof Error ? error.message : defaultMessage;
};

export const handleError = (error: unknown, defaultMessage: string): string => {
  if (error instanceof Error) {
    return error.message || defaultMessage;
  }
  return defaultMessage;
};

// Специализированные обработчики ошибок
export const handleCardsError = (error: unknown, operation: keyof typeof DEFAULT_ERROR_MESSAGES): string => {
  return handleApiError(error, DEFAULT_ERROR_MESSAGES[operation]);
};

export const handleMessagesError = (error: unknown, operation: keyof typeof DEFAULT_ERROR_MESSAGES): string => {
  return handleApiError(error, DEFAULT_ERROR_MESSAGES[operation]);
};

export const handleAuthError = (error: unknown, operation: keyof typeof DEFAULT_ERROR_MESSAGES): string => {
  return handleError(error, DEFAULT_ERROR_MESSAGES[operation]);
};
