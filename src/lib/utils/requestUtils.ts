import { ClientResponseError } from 'pocketbase';

/**
 * Проверяет, был ли запрос отменен
 */
export function isRequestCancelled(error: any): boolean {
  return error instanceof ClientResponseError && error.status === 0;
}

/**
 * Безопасно выполняет асинхронную функцию с проверкой на отмену запроса
 */
export async function safeRequest<T>(
  requestFn: () => Promise<T>,
  onCancelled?: () => void,
  onError?: (error: Error) => void
): Promise<T | null> {
  try {
    return await requestFn();
  } catch (error) {
    if (isRequestCancelled(error)) {
      console.log('Запрос был отменен');
      onCancelled?.();
      return null;
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
    console.error('Request error:', errorMessage);
    onError?.(new Error(errorMessage));
    throw error;
  }
}

/**
 * Создает AbortController для отмены запросов
 */
export function createAbortController(): AbortController {
  return new AbortController();
}

/**
 * Проверяет, активен ли AbortController
 */
export function isAbortControllerActive(controller: AbortController): boolean {
  return !controller.signal.aborted;
}

/**
 * Безопасно отменяет AbortController
 */
export function safeAbort(controller: AbortController | null): void {
  if (controller && !controller.signal.aborted) {
    try {
      controller.abort();
    } catch (error) {
      console.log('Error aborting controller:', error);
    }
  }
}
