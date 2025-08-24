// src/components/AuthWrapper.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useProfileStore } from '@/store/useProfileStore';
import { initializeMessagesRealtime } from '@/store/useMessagesStore';

interface AuthWrapperProps {
  children: React.ReactNode;
}

// Список публичных маршрутов, которые не требуют авторизации
const publicRoutes = ['/auth', '/'];

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { checkAuth, isAuthenticated, isLoading } = useProfileStore();
  const router = useRouter();
  const pathname = usePathname();
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Проверяем авторизацию и перенаправляем при необходимости
  useEffect(() => {
    if (!isLoading) {
      const isPublicRoute = publicRoutes.includes(pathname);
      
      if (!isAuthenticated && !isPublicRoute) {
        // Перенаправляем на страницу авторизации
        router.push('/auth');
      } else if (isAuthenticated && pathname === '/auth') {
        // Если пользователь авторизован и находится на странице авторизации, перенаправляем на главную
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Инициализируем realtime подписку при аутентификации
  useEffect(() => {
    if (isAuthenticated) {
      try {
        // Очищаем предыдущую подписку, если она есть
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
        }

        const unsubscribe = initializeMessagesRealtime();
        unsubscribeRef.current = unsubscribe;
      } catch (error) {
        console.error('Error initializing realtime subscription:', error);
      }
    } else {
      // Очищаем подписку при выходе из системы
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    }

    // Очистка при размонтировании
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [isAuthenticated]);

  // Показываем загрузку пока проверяем авторизацию
  if (isLoading) {
    return (
      <div className="mx-auto max-w-md min-h-screen bg-yellow-300 shadow-lg flex flex-col items-center justify-center">
        <div className="text-black text-xl font-bold">Загрузка...</div>
      </div>
    );
  }

  // Если неавторизован и не на публичном маршруте, показываем загрузку (будет перенаправление)
  if (!isAuthenticated && !publicRoutes.includes(pathname)) {
    return (
      <div className="mx-auto max-w-md min-h-screen bg-yellow-300 shadow-lg flex flex-col items-center justify-center">
        <div className="text-black text-xl font-bold">Перенаправление...</div>
      </div>
    );
  }

  return <>{children}</>;
}