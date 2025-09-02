import { BaseApi } from './base';
import type { UserRecord } from '../pocketbase';
import type { GuestUpgradeData } from '@/types/profile';
import { 
  createGuestUser, 
  authGuestUser, 
  isGuestUser, 
  isGuestExpired,
  upgradeGuestAccount 
} from '../utils/guestUtils';
import { ClientResponseError } from 'pocketbase';

export interface RegisterData {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  bio?: string;
  avatar?: File;
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
      const formData = new FormData();
      
      // Добавляем все поля кроме файла
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'avatar') {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (value !== undefined) {
            formData.append(key, String(value));
          }
        }
      });

      // Добавляем файл аватарки, если есть
      if (data.avatar) {
        formData.append('avatar', data.avatar);
      }

      return await this.pb.collection('users').create(formData);
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

  // Гостевой вход
  async guestLogin(): Promise<UserRecord> {
    try {
      // Создаем нового гостевого пользователя
      const guestUser = await createGuestUser();
      
      // Авторизуем его
      const authData = await authGuestUser(guestUser.email, guestUser.password || '');
      return authData;
    } catch (error) {
      this.handleError(error, 'guestLogin');
    }
  }

  // Проверка и создание гостевого пользователя при необходимости
  async ensureGuestAccess(): Promise<UserRecord> {
    try {
      // Если пользователь уже авторизован, проверяем его статус
      if (this.pb.authStore.isValid) {
        const currentUser = await this.getCurrentUser();
        if (currentUser) {
          // Если это гость, проверяем не истек ли срок
          if (isGuestUser(currentUser) && isGuestExpired(currentUser)) {
            // Гостевой аккаунт истек, выходим и создаем новый
            await this.logout();
          } else {
            // Пользователь валиден, возвращаем его
            return currentUser;
          }
        }
      }

      // Создаем нового гостевого пользователя
      return await this.guestLogin();
    } catch (error) {
      this.handleError(error, 'ensureGuestAccess');
    }
  }

  // Обновление гостевого аккаунта на обычный
  async upgradeGuest(data: GuestUpgradeData): Promise<UserRecord> {
    try {
      if (!this.pb.authStore.isValid) {
        throw new Error('Пользователь не авторизован');
      }

      const currentUser = await this.getCurrentUser();
      if (!currentUser || !isGuestUser(currentUser)) {
        throw new Error('Только гостевые пользователи могут обновить свой аккаунт');
      }

      if (isGuestExpired(currentUser)) {
        throw new Error('Гостевой аккаунт истек');
      }

      return await upgradeGuestAccount(currentUser.id, data);
    } catch (error) {
      this.handleError(error, 'upgradeGuest');
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
      const userId = this.getCurrentUserId();
      if (!userId) {
        return null;
      }

      return await this.pb.collection('users').getOne(userId);
    } catch (error) {
      // Проверяем, не отменен ли запрос
      if (error instanceof ClientResponseError && error.status === 0) {
        // Запрос был отменен - это нормально при быстрой навигации
        console.log('Запрос получения пользователя был отменен');
        return null;
      }
      
      // Другие ошибки обрабатываем как обычно
      this.handleError(error, 'getCurrentUser');
      return null;
    }
  }

  // Обновить профиль
  async updateProfile(id: string, data: Partial<UserRecord> & { avatar?: File }): Promise<UserRecord> {
    try {
      const formData = new FormData();
      
      // Добавляем все поля кроме файла
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'avatar') {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (value !== undefined) {
            formData.append(key, String(value));
          }
        }
      });

      // Добавляем файл аватарки, если есть
      if (data.avatar) {
        formData.append('avatar', data.avatar);
      }

      return await this.pb.collection('users').update(id, formData);
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

  // Проверить, является ли текущий пользователь гостем
  async isCurrentUserGuest(): Promise<boolean> {
    try {
      const currentUser = await this.getCurrentUser();
      return isGuestUser(currentUser);
    } catch (error) {
      // Если не удалось получить пользователя, считаем что это не гость
      return false;
    }
  }
}

// Экспорт экземпляра
export const authApi = new AuthApi();
