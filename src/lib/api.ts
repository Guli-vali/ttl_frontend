// api.ts
import { pb } from './pocketbase';
import type { UserRecord, CardRecord, MessageRecord } from './pocketbase';

type QueryParams = Record<string, string | number | boolean>;

// Универсальный CRUD API
function createCrudApi<T extends { id: string }>(collection: string) {
  return {
    // Получить список записей
    async getList(page = 1, perPage = 50, query: QueryParams = {}): Promise<T[]> {
      const records = await pb.collection(collection).getList(page, perPage, query);
      return records.items as unknown as T[];
    },

    // Получить одну запись по ID
    async getById(id: string, query: QueryParams = {}): Promise<T> {
      return await pb.collection(collection).getOne(id, query) as unknown as T;
    },

    // Создать новую запись
    async create(data: Omit<T, 'id' | 'created' | 'updated'>): Promise<T> {
      return await pb.collection(collection).create(data) as unknown as T;
    },

    // Обновить запись
    async update(id: string, data: Partial<T>): Promise<T> {
      return await pb.collection(collection).update(id, data) as unknown as T;
    },

    // Удалить запись
    async delete(id: string): Promise<boolean> {
      try {
        await pb.collection(collection).delete(id);
        return true;
      } catch {
        return false;
      }
    },
  };
}

// API для аутентификации пользователей
export const authApi = {
  // Регистрация
  async register(data: {
    email: string;
    password: string;
    passwordConfirm: string;
    name: string;
    bio?: string;
    nativeLanguages?: string[];
    learningLanguages?: string[];
    age?: number;
    country?: string;
    city?: string;
    interests?: string[];
  }): Promise<UserRecord> {
    return await pb.collection('users').create(data);
  },

  // Вход
  async login(email: string, password: string): Promise<UserRecord> {
    const authData = await pb.collection('users').authWithPassword(email, password);
    return authData.record as unknown as UserRecord;
  },

  // Выход
  async logout(): Promise<void> {
    pb.authStore.clear();
  },

  // Получить текущего пользователя
  async getCurrentUser(): Promise<UserRecord | null> {
    if (!pb.authStore.isValid) {
      return null;
    }
    return await pb.collection('users').getOne(pb.authStore.model?.id || '');
  },

  // Обновить профиль
  async updateProfile(id: string, data: Partial<UserRecord>): Promise<UserRecord> {
    return await pb.collection('users').update(id, data);
  },

  // Проверить валидность токена
  isAuthenticated(): boolean {
    return pb.authStore.isValid;
  },

  // Получить токен
  getToken(): string | null {
    return pb.authStore.token;
  }
};

// API для карточек
export const cardsApi = {
  // Получить все карточки с автором (требует авторизации)
  async getAll(): Promise<CardRecord[]> {
    try {
      // Проверяем авторизацию
      if (!pb.authStore.isValid) {
        throw new Error('Необходима авторизация');
      }

      const records = await pb.collection('cards').getList(1, 50, {
        expand: 'author',
        sort: '-created',
        $autoCancel: false
      });
      return records.items as unknown as CardRecord[];
    } catch (error) {
      console.error('Error fetching cards:', error);
      throw error;
    }
  },

  // Получить карточку по ID с автором (требует авторизации)
  async getById(id: string): Promise<CardRecord> {
    if (!pb.authStore.isValid) {
      throw new Error('Необходима авторизация');
    }

    return await pb.collection('cards').getOne(id, {
      expand: 'author',
      $autoCancel: false
    }) as unknown as CardRecord;
  },

  // Создать карточку (требует авторизации)
  async create(data: Omit<CardRecord, 'id' | 'created'>): Promise<CardRecord> {
    if (!pb.authStore.isValid) {
      throw new Error('Необходима авторизация');
    }

    return await pb.collection('cards').create(data, {
      $autoCancel: false
    }) as unknown as CardRecord;
  },

  // Обновить карточку (требует авторизации)
  async update(id: string, data: Partial<CardRecord>): Promise<CardRecord> {
    if (!pb.authStore.isValid) {
      throw new Error('Необходима авторизация');
    }

    return await pb.collection('cards').update(id, data, {
      $autoCancel: false
    }) as unknown as CardRecord;
  },

  // Удалить карточку (требует авторизации)
  async delete(id: string): Promise<boolean> {
    if (!pb.authStore.isValid) {
      throw new Error('Необходима авторизация');
    }

    try {
      await pb.collection('cards').delete(id, {
        $autoCancel: false
      });
      return true;
    } catch {
      return false;
    }
  }
};

// API для сообщений
export const messagesApi = {
  // Получить все сообщения для карточки
  async getByCard(cardId: string): Promise<MessageRecord[]> {
    if (!pb.authStore.isValid) {
      throw new Error('Необходима авторизация');
    }

    const records = await pb.collection('messages').getList(1, 100, {
      filter: `card = "${cardId}"`,
      sort: 'created',
      expand: 'author',
      $autoCancel: false
    });
    return records.items as unknown as MessageRecord[];
  },

  // Получить сообщение по ID
  async getById(id: string): Promise<MessageRecord> {
    if (!pb.authStore.isValid) {
      throw new Error('Необходима авторизация');
    }

    return await pb.collection('messages').getOne(id, {
      expand: 'author',
      $autoCancel: false
    }) as unknown as MessageRecord;
  },

  // Создать сообщение
  async create(data: Omit<MessageRecord, 'id' | 'created' | 'updated'>): Promise<MessageRecord> {
    if (!pb.authStore.isValid) {
      throw new Error('Необходима авторизация');
    }

    return await pb.collection('messages').create(data, {
      $autoCancel: false
    }) as unknown as MessageRecord;
  },

  // Удалить сообщение
  async delete(id: string): Promise<boolean> {
    if (!pb.authStore.isValid) {
      throw new Error('Необходима авторизация');
    }

    try {
      await pb.collection('messages').delete(id, {
        $autoCancel: false
      });
      return true;
    } catch {
      return false;
    }
  }
};
