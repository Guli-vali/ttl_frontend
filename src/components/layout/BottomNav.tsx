'use client';

import { PlusCircle, User, Home } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { NO_BOTTOM_NAV_ROUTES } from '@/constants/routes';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  // Не показываем нижнее меню на странице авторизации
  if (NO_BOTTOM_NAV_ROUTES.includes(pathname as typeof NO_BOTTOM_NAV_ROUTES[number])) {
    return null;
  }

  return (
    <nav 
    className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50"
    style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <button
        onClick={() => router.push('/')}
        className="flex flex-col items-center text-gray-700 hover:text-black"
      >
        <Home size={42} />
        <span className="text-xs">Фид</span>
      </button>
      <button
        onClick={() => router.push('/cards/create')}
        className="flex flex-col items-center text-gray-700 hover:text-black"
      >
        <PlusCircle size={42} />
        <span className="text-xs">Добавить</span>
      </button>
      <button
        onClick={() => router.push('/profile')}
        className="flex flex-col items-center text-gray-700 hover:text-black"
      >
        <User size={42} />
        <span className="text-xs">Профиль</span>
      </button>
    </nav>
  );
}