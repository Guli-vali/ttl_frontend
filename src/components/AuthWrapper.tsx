// src/components/AuthWrapper.tsx
'use client';

import { useEffect, useState } from 'react';
import { useProfileStore } from '@/store/useProfileStore';
import AuthPage from '@/app/auth/page';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const isAuthenticated = useProfileStore((state) => state.isAuthenticated);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Имитируем проверку авторизации при загрузке
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-yellow-300 flex items-center justify-center">
        <div className="text-black text-xl font-bold">Загрузка...</div>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: isAuthenticated ? 'none' : 'block' }}>
        <AuthPage />
      </div>
      <div style={{ display: isAuthenticated ? 'block' : 'none' }}>
        {children}
      </div>
    </>
  );
}