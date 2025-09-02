export const ROUTES = {
  AUTH: '/auth',
  HOME: '/',
  PROFILE: '/profile',
  CARDS: '/cards',
  LANDING: '/landing'
} as const;

// Публичные маршруты (доступны без авторизации)
export const PUBLIC_ROUTES = [ROUTES.AUTH, ROUTES.HOME, ROUTES.LANDING] as const;

// Маршруты с гостевым доступом (автоматически создается гостевой пользователь)
export const GUEST_ACCESS_ROUTES = ['/cards'] as const;

// Маршруты без нижней навигации
export const NO_BOTTOM_NAV_ROUTES = [ROUTES.AUTH, ROUTES.HOME, ROUTES.LANDING] as const;

// Проверка, является ли маршрут доступным для гостей
export const isGuestAccessRoute = (pathname: string): boolean => {
  return GUEST_ACCESS_ROUTES.some(route => pathname.startsWith(route));
};

// Проверка, является ли маршрут публичным
export const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.includes(pathname as any);
};
