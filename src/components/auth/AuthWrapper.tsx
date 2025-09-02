// src/components/auth/AuthWrapper.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useProfileStore } from '@/store/useProfileStore';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { isGuestAccessRoute, isPublicRoute } from '@/constants/routes';
import { authApi } from '@/lib/api/auth';
import { ClientResponseError } from 'pocketbase';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { checkAuth, isAuthenticated, isLoading, profile } = useProfileStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isCreatingGuest, setIsCreatingGuest] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Управляем realtime подпиской
  useRealtimeSubscription(isAuthenticated);

  // Проверяем авторизацию при монтировании
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Функция для создания гостевого пользователя
  const createGuestUser = async () => {
    // Отменяем предыдущий запрос, если он есть
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Создаем новый AbortController
    abortControllerRef.current = new AbortController();
    
    setIsCreatingGuest(true);
    try {
      await authApi.ensureGuestAccess();
      await checkAuth(); // Перепроверяем авторизацию
    } catch (error) {
      // Проверяем, не отменен ли запрос
      if (error instanceof ClientResponseError && error.status === 0) {
        console.log('Создание гостевого пользователя было отменено');
        return;
      }
      
      console.error('Error creating guest user:', error);
      // Если не удалось создать гостевого пользователя, редиректим на логин
      router.push('/auth');
    } finally {
      setIsCreatingGuest(false);
    }
  };

  // Логика навигации
  useEffect(() => {
    if (!isLoading) {
      const isPublic = isPublicRoute(pathname);
      const isGuestAccess = isGuestAccessRoute(pathname);
      
      if (!isAuthenticated && !isPublic) {
        if (isGuestAccess) {
          // Для маршрутов с гостевым доступом пытаемся создать гостевого пользователя
          createGuestUser();
        } else {
          // Для других защищенных маршрутов редиректим на логин
          router.push('/auth');
        }
      } else if (isAuthenticated && pathname === '/auth') {
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Проверяем, истек ли гостевой аккаунт
  useEffect(() => {
    if (isAuthenticated && profile && profile.role === 'guest') {
      const expiresAt = profile.expiresAt ? new Date(profile.expiresAt) : null;
      if (expiresAt && expiresAt < new Date()) {
        // Гостевой аккаунт истек, выходим и создаем новый
        authApi.logout();
        checkAuth();
      }
    }
  }, [isAuthenticated, profile, checkAuth]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Loading состояния
  if (isLoading || isCreatingGuest) {
    return <LoadingSpinner message={isCreatingGuest ? "Создание гостевого аккаунта..." : "Загрузка..."} />;
  }

  // Если это маршрут с гостевым доступом и пользователь не авторизован, показываем загрузку
  if (!isAuthenticated && isGuestAccessRoute(pathname)) {
    return <LoadingSpinner message="Подготовка гостевого доступа..." />;
  }

  if (!isAuthenticated && !isPublicRoute(pathname)) {
    return <LoadingSpinner message="Перенаправление..." />;
  }

  return <>{children}</>;
}