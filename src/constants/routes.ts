export const ROUTES = {
  AUTH: '/auth',
  HOME: '/',
  PROFILE: '/profile',
  CARDS: '/cards',
} as const;

export const PUBLIC_ROUTES = [ROUTES.AUTH, ROUTES.HOME] as const;
