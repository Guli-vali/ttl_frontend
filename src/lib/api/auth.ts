import { BaseApi } from './base';
import type { UserRecord } from '../pocketbase';

export interface RegisterData {
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
}

export class AuthApi extends BaseApi {
  // Регистрация
  async register(data: RegisterData): Promise<UserRecord> {
    try {
      return await this.pb.collection('users').create(data);
    } catch (error) {
      this.handleError(error, 'register');
    }
  }

  // Вход
  async login(email: string, password: string): Promise<UserRecord> {
    try {
      const authData = await this.pb.collection('users').authWithPassword(email, password);
      return authData.record as unknown as UserRecord;
    } catch (error) {
      this.handleError(error, 'login');
    }
  }

  // Выход
  async logout(): Promise<void> {
    this.pb.authStore.clear();
  }

  // Получить текущего пользователя
  async getCurrentUser(): Promise<UserRecord | null> {
    if (!this.pb.authStore.isValid) {
      return null;
    }
    
    try {
      return await this.pb.collection('users').getOne(this.getCurrentUserId());
    } catch (error) {
      this.handleError(error, 'getCurrentUser');
    }
  }

  // Обновить профиль
  async updateProfile(id: string, data: Partial<UserRecord>): Promise<UserRecord> {
    try {
      return await this.pb.collection('users').update(id, data);
    } catch (error) {
      this.handleError(error, 'updateProfile');
    }
  }

  // Проверить валидность токена
  isAuthenticated(): boolean {
    return this.pb.authStore.isValid;
  }

  // Получить токен
  getToken(): string | null {
    return this.pb.authStore.token;
  }
}

// Экспорт экземпляра
export const authApi = new AuthApi();
