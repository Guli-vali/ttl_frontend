// src/components/AuthWrapper.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useProfileStore } from '@/store/useProfileStore';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PUBLIC_ROUTES } from '@/constants/routes';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { checkAuth, isAuthenticated, isLoading } = useProfileStore();
  const router = useRouter();
  const pathname = usePathname();

  // Управляем realtime подпиской
  useRealtimeSubscription(isAuthenticated);

  // Проверяем авторизацию при монтировании
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Логика навигации
  useEffect(() => {
    if (!isLoading) {
      const isPublicRoute = PUBLIC_ROUTES.includes(pathname as any);
      
      if (!isAuthenticated && !isPublicRoute) {
        router.push('/auth');
      } else if (isAuthenticated && pathname === '/auth') {
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Loading состояния
  if (isLoading) {
    return <LoadingSpinner message="Загрузка..." />;
  }

  if (!isAuthenticated && !PUBLIC_ROUTES.includes(pathname as any)) {
    return <LoadingSpinner message="Перенаправление..." />;
  }

  return <>{children}</>;
}