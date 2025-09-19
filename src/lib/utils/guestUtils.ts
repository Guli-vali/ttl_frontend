import { pb } from '../pocketbase';
import type { UserRecord } from '../pocketbase';
import type { GuestUpgradeData } from '@/types/profile';
import { ClientResponseError } from 'pocketbase';
import { RegisterData } from './profile';


/**
 * Generates random username for guest
 */
export function generateGuestUsername(): string {
  const adjectives = ['Happy', 'Smart', 'Friendly', 'Creative', 'Active', 'Kind', 'Interesting', 'Unique'];
  const nouns = ['Guest', 'Traveler', 'Explorer', 'Adventurer', 'Visitor', 'Newcomer', 'Friend', 'Chatter'];
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 999) + 1;
  
  return `${adjective}${noun}${number}`;
}

/**
 * Generates random password for guest
 */
export function generateGuestPassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

/**
 * Generates random email for guest
 */
export function generateGuestEmail(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `guest_${timestamp}_${random}@temp.ttl.local`;
}

/**
 * Calculates expiration date for guest account (24 hours)
 */
export function getGuestExpirationDate(): string {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);
  return expiresAt.toISOString();
}

/**
 * Создает нового гостевого пользователя
 */
export function prepareGuestUser(): RegisterData {
  const username = generateGuestUsername();
  const password = generateGuestPassword();
  const email = generateGuestEmail();
  const expiresAt = getGuestExpirationDate();

  const guestData = {
    email,
    password,
    passwordConfirm: password,
    name: username,
    role: 'guest' as const,
    expiresAt,
    isRegistered: false,
    verified: false,
    emailVisibility: false,
  };



  return guestData;
}

/**
 * Авторизует гостевого пользователя
 */
export async function authGuestUser(email: string, password: string): Promise<UserRecord> {
  try {
    const authData = await pb.collection('users').authWithPassword(email, password);
    return authData.record as UserRecord;
  } catch (error) {
    // Проверяем, не отменен ли запрос
    if (error instanceof ClientResponseError && error.status === 0) {
      throw new Error('Авторизация гостевого пользователя была отменена');
    }
    
    console.error('Error authenticating guest user:', error);
    throw new Error('Не удалось авторизовать гостевой аккаунт');
  }
}

/**
 * Проверяет, является ли пользователь гостем
 */
export function isGuestUser(user: UserRecord | null): boolean {
  return user?.role === 'guest';
}

/**
 * Проверяет, истек ли срок действия гостевого аккаунта
 */
export function isGuestExpired(user: UserRecord): boolean {
  if (!user.expiresAt) return false;
  return new Date(user.expiresAt) < new Date();
}

/**
 * Обновляет гостевой аккаунт на обычный пользовательский
 */
export async function upgradeGuestAccount(userId: string, upgradeData: GuestUpgradeData): Promise<UserRecord> {
  try {
    const updateData = {
      email: upgradeData.email,
      name: upgradeData.name,
      role: 'user' as const,
      isRegistered: true,
      verified: false,
      emailVisibility: true,
    };

    // Обновляем данные пользователя
    const updatedUser = await pb.collection('users').update(userId, updateData);

    // Обновляем пароль отдельно
    await pb.collection('users').update(userId, {
      password: upgradeData.password,
      passwordConfirm: upgradeData.passwordConfirm,
    });

    return updatedUser as UserRecord;
  } catch (error) {
    // Проверяем, не отменен ли запрос
    if (error instanceof ClientResponseError && error.status === 0) {
      throw new Error('Обновление гостевого аккаунта было отменено');
    }
    
    console.error('Error upgrading guest account:', error);
    throw new Error('Не удалось обновить гостевой аккаунт');
  }
}

/**
 * Удаляет просроченные гостевые аккаунты
 */
export async function cleanupExpiredGuests(): Promise<number> {
  try {
    const now = new Date().toISOString();
    
    // Находим всех просроченных гостей
    const expiredGuests = await pb.collection('users').getList(1, 1000, {
      filter: `role = "guest" && expiresAt < "${now}"`,
    });

    // Удаляем их
    let deletedCount = 0;
    for (const guest of expiredGuests.items) {
      try {
        await pb.collection('users').delete(guest.id);
        deletedCount++;
      } catch (error) {
        // Проверяем, не отменен ли запрос
        if (error instanceof ClientResponseError && error.status === 0) {
          console.log(`Удаление гостевого аккаунта ${guest.id} было отменено`);
          continue;
        }
        
        console.error(`Error deleting expired guest ${guest.id}:`, error);
      }
    }

    return deletedCount;
  } catch (error) {
    // Проверяем, не отменен ли запрос
    if (error instanceof ClientResponseError && error.status === 0) {
      throw new Error('Очистка просроченных гостевых аккаунтов была отменена');
    }
    
    console.error('Error cleaning up expired guests:', error);
    throw new Error('Не удалось очистить просроченные гостевые аккаунты');
  }
}