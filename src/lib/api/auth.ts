import { BaseApi } from './base';
import type { UserRecord } from '../pocketbase';
import type { GuestUpgradeData, RegisterData} from '@/types/profile';
import { 
  prepareGuestUser, 
  authGuestUser, 
  isGuestUser, 
  isGuestExpired,
  upgradeGuestAccount 
} from '../utils/guestUtils';
import { ClientResponseError } from 'pocketbase';


export class AuthApi extends BaseApi {
  // Registration
  async register(data: RegisterData): Promise<UserRecord> {
    try {
      const formData = new FormData();
      
      // Add all fields except file
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'avatar') {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (value !== undefined) {
            formData.append(key, String(value));
          }
        }
      });

      // Add avatar file if exists
      if (data.avatar) {
        formData.append('avatar', data.avatar);
      }

      return await this.pb.collection('users').create(formData);
    } catch (error) {
      // Проверяем, не отменен ли запрос
      if (error instanceof ClientResponseError && error.status === 0) {
        console.log('Registration request was cancelled - this is normal during fast navigation');
        // For autocancellation throw special error
        throw new Error('REQUEST_CANCELLED');
      }
      
      // For other errors use standard handling
      this.handleError(error, 'register');
    }
  }

  // Login
  async login(email: string, password: string): Promise<UserRecord> {
    try {
      const authData = await this.pb.collection('users').authWithPassword(email, password);
      return authData.record as unknown as UserRecord;
    } catch (error) {
      // Проверяем, не отменен ли запрос
      if (error instanceof ClientResponseError && error.status === 0) {
        console.log('Login request was cancelled - this is normal during fast navigation');
        // For autocancellation throw special error
        throw new Error('REQUEST_CANCELLED');
      }
      
      // For other errors use standard handling
      this.handleError(error, 'login');
    }
  }

  // Guest login
  async guestRegister(): Promise<{ email: string; password: string }> {
    try {
      // Create new guest user
      const guestUserRaw = prepareGuestUser();
      await this.register(guestUserRaw);
      const result = {
        email: guestUserRaw.email,
        password: guestUserRaw.password
      };
      
      console.log('guestRegister: Successfully created guest user:', {
        email: result.email,
        name: guestUserRaw.name
      });
      
      return result;
    } catch (error) {
      console.error('guestRegister: Error creating guest user:', error);
      
      // Проверяем, не является ли это ошибкой autocancellation
      if (error instanceof Error && error.message === 'REQUEST_CANCELLED') {
        console.log('guestRegister: Request was cancelled, returning empty data');
        return { email: '', password: '' };
      }
      
      this.handleError(error, 'guestRegister');
      // Return empty object to avoid undefined
      return { email: '', password: '' };
    }
  }



  // // Проверка и создание гостевого пользователя при необходимости
  // async ensureGuestAccess(): Promise<UserRecord> {
  //   try {
  //     // Если пользователь уже авторизован, проверяем его статус
  //     if (this.pb.authStore.isValid) {
  //       const currentUser = await this.getCurrentUser();
  //       if (currentUser) {
  //         // Если это гость, проверяем не истек ли срок
  //         if (isGuestUser(currentUser) && isGuestExpired(currentUser)) {
  //           // Гостевой аккаунт истек, выходим и создаем новый
  //           await this.logout();
  //         } else {
  //           // Пользователь валиден, возвращаем его
  //           return currentUser;
  //         }
  //       }
  //     }

  //     // Создаем нового гостевого пользователя
  //     return await this.guestLogin();
  //   } catch (error) {
  //     this.handleError(error, 'ensureGuestAccess');
  //   }
  // }

  // // Обновление гостевого аккаунта на обычный
  // async upgradeGuest(data: GuestUpgradeData): Promise<UserRecord> {
  //   try {
  //     if (!this.pb.authStore.isValid) {
  //       throw new Error('Пользователь не авторизован');
  //     }

  //     const currentUser = await this.getCurrentUser();
  //     if (!currentUser || !isGuestUser(currentUser)) {
  //       throw new Error('Только гостевые пользователи могут обновить свой аккаунт');
  //     }

  //     if (isGuestExpired(currentUser)) {
  //       throw new Error('Гостевой аккаунт истек');
  //     }

  //     return await upgradeGuestAccount(currentUser.id, data);
  //   } catch (error) {
  //     this.handleError(error, 'upgradeGuest');
  //   }
  // }

  // Logout
  async logout(): Promise<void> {
    this.pb.authStore.clear();
  }

  // Get current user
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
        console.log('Get user request was cancelled');
        return null;
      }
      
      // Другие ошибки обрабатываем как обычно
      this.handleError(error, 'getCurrentUser');
      return null;
    }
  }

  // Update profile
  async updateProfile(id: string, data: Partial<UserRecord> & { avatar?: File }): Promise<UserRecord> {
    try {
      const formData = new FormData();
      
      // Add all fields except file
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'avatar') {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (value !== undefined) {
            formData.append(key, String(value));
          }
        }
      });

      // Add avatar file if exists
      if (data.avatar) {
        formData.append('avatar', data.avatar);
      }

      return await this.pb.collection('users').update(id, formData);
    } catch (error) {
      this.handleError(error, 'updateProfile');
    }
  }

  // Check token validity
  isAuthenticated(): boolean {
    return this.pb.authStore.isValid;
  }

  // Get token
  getToken(): string | null {
    return this.pb.authStore.token;
  }

  // Check if current user is guest
  async isCurrentUserGuest(): Promise<boolean> {
    try {
      const currentUser = await this.getCurrentUser();
      return isGuestUser(currentUser);
    } catch (error) {
      // If unable to get user, consider it not a guest
      return false;
    }
  }
}

// Export instance
export const authApi = new AuthApi();