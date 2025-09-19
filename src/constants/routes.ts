export const ROUTES = {
    AUTH: '/auth',
    HOME: '/',
    PROFILE: '/profile',
    CARDS: '/cards',
    LANDING: '/landing'
  } as const;
  
  export const PUBLIC_ROUTES = [
    ROUTES.AUTH, 
    ROUTES.HOME, 
    ROUTES.LANDING, 
    ROUTES.CARDS
  ] as const;
  
  // Функция для проверки, является ли роут публичным
  export const isPublicRoute = (pathname: string): boolean => {
    // Проверяем точные совпадения
    if (PUBLIC_ROUTES.includes(pathname as any)) {
      return true;
    }
    
    // Проверяем динамические роуты
    if (pathname.startsWith('/cards/') && pathname !== '/cards/create') {
      return true; // Детальный вид карточек публичный, но создание карточек - нет
    }
    
    return false;
  };
  
  export const NO_BOTTOM_NAV_ROUTES = [ROUTES.AUTH, ROUTES.HOME, ROUTES.LANDING] as const;