import { pb } from '../pocketbase';

// Базовый класс для API операций
export abstract class BaseApi {
  protected pb = pb;

  // Проверка авторизации
  protected checkAuth(): void {
    if (!this.pb.authStore.isValid) {
      throw new Error('Необходима авторизация');
    }
  }

  // Получить ID текущего пользователя
  protected getCurrentUserId(): string {
    this.checkAuth();
    return this.pb.authStore.model?.id || '';
  }

  // Общие опции для запросов
  protected getDefaultOptions() {
    return {
      $autoCancel: false
    };
  }

  // Обработка ошибок
  protected handleError(error: unknown, operation: string): never {
    console.error(`Error in ${operation}:`, error);
    throw error;
  }
}
