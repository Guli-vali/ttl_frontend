// src/components/AuthWrapper.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useProfileStore } from '@/store/useProfileStore';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { isPublicRoute } from '@/constants/routes';

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
      const isPublic = isPublicRoute(pathname);
      
      if (!isAuthenticated && !isPublic) {
        router.push('/auth');
      } else if (isAuthenticated && pathname === '/auth') {
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Loading состояния
  if (isLoading) {
    return <LoadingSpinner message="Loading..." />;
  }

  if (!isAuthenticated && !isPublicRoute(pathname)) {
    return <LoadingSpinner message="Redirecting..." />;
  }

  return <>{children}</>;
}