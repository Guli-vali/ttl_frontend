import type { UserRecord, CardRecord, MessageRecord } from '../pocketbase';

// Типы для расширенных записей с связанными данными
export interface ExpandedUserRecord extends UserRecord {
  expand?: {
    author?: UserRecord;
  };
}

export interface ExpandedCardRecord extends CardRecord {
  expand?: {
    author?: UserRecord;
  };
}

export interface ExpandedMessageRecord extends MessageRecord {
  expand?: {
    author?: UserRecord;
    card?: CardRecord;
  };
}

// Утилиты для работы с данными
export const apiUtils = {
  // Извлечь автора из расширенной записи
  extractAuthor<T extends { expand?: { author?: UserRecord } }>(record: T): UserRecord | undefined {
    return record.expand?.author;
  },

  // Проверить, является ли пользователь автором
  isAuthor(record: { author: string }, userId: string): boolean {
    return record.author === userId;
  },

  // Форматировать дату
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Создать фильтр для поиска
  createFilter(filters: Record<string, string | number | boolean>): string {
    return Object.entries(filters)
      .map(([key, value]) => `${key} = "${value}"`)
      .join(' && ');
  }
};
