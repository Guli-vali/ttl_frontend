'use client';

import { useState, useEffect, useCallback } from 'react';
import { authApi } from '@/lib/api/auth';
import { isGuestUser, isGuestExpired } from '@/lib/utils/guestUtils';
import type { UserRecord } from '@/lib/pocketbase';
import { ClientResponseError } from 'pocketbase';

interface UseGuestSessionReturn {
  user: UserRecord | null;
  isLoading: boolean;
  isGuest: boolean;
  isExpired: boolean;
  timeLeft: number; // в миллисекундах
  createGuest: () => Promise<void>;
  upgradeGuest: (data: any) => Promise<void>;
  refreshSession: () => Promise<void>;
}

export function useGuestSession(): UseGuestSessionReturn {
  const [user, setUser] = useState<UserRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);

  // Проверяем статус пользователя
  const checkUserStatus = useCallback(async () => {
    try {
      if (!authApi.isAuthenticated()) {
        setUser(null);
        return;
      }

      const currentUser = await authApi.getCurrentUser();
      if (!currentUser) {
        setUser(null);
        return;
      }

      // Если это гость и аккаунт истек, создаем новый
      if (isGuestUser(currentUser) && isGuestExpired(currentUser)) {
        await authApi.logout();
        setUser(null);
        return;
      }

      setUser(currentUser);
    } catch (error) {
      // Проверяем, не отменен ли запрос
      if (error instanceof ClientResponseError && error.status === 0) {
        console.log('Проверка статуса пользователя была отменена');
        return;
      }
      
      console.error('Error checking user status:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Создание гостевого пользователя
  const createGuest = useCallback(async () => {
    setIsLoading(true);
    try {
      const guestUser = await authApi.ensureGuestAccess();
      setUser(guestUser);
    } catch (error) {
      // Проверяем, не отменен ли запрос
      if (error instanceof ClientResponseError && error.status === 0) {
        console.log('Создание гостевого пользователя было отменено');
        return;
      }
      
      console.error('Error creating guest user:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Апгрейд гостевого аккаунта
  const upgradeGuest = useCallback(async (data: any) => {
    if (!user || !isGuestUser(user)) {
      throw new Error('Только гостевые пользователи могут обновить свой аккаунт');
    }

    try {
      const updatedUser = await authApi.upgradeGuest(data);
      setUser(updatedUser);
    } catch (error) {
      // Проверяем, не отменен ли запрос
      if (error instanceof ClientResponseError && error.status === 0) {
        throw new Error('Обновление гостевого аккаунта было отменено');
      }
      
      console.error('Error upgrading guest account:', error);
      throw error;
    }
  }, [user]);

  // Обновление сессии
  const refreshSession = useCallback(async () => {
    await checkUserStatus();
  }, [checkUserStatus]);

  // Вычисляем оставшееся время для гостевой сессии
  useEffect(() => {
    if (!user || !isGuestUser(user) || !user.expiresAt) {
      setTimeLeft(0);
      return;
    }

    const updateTimeLeft = () => {
      const expiresAt = new Date(user.expiresAt!);
      const now = new Date();
      const remaining = Math.max(0, expiresAt.getTime() - now.getTime());
      setTimeLeft(remaining);
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000); // Обновляем каждую минуту

    return () => clearInterval(interval);
  }, [user]);

  // Проверяем статус при монтировании
  useEffect(() => {
    checkUserStatus();
  }, [checkUserStatus]);

  // Автоматическое обновление статуса каждые 5 минут
  useEffect(() => {
    const interval = setInterval(checkUserStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkUserStatus]);

  return {
    user,
    isLoading,
    isGuest: isGuestUser(user),
    isExpired: user ? isGuestExpired(user) : false,
    timeLeft,
    createGuest,
    upgradeGuest,
    refreshSession,
  };
}
