export const ROUTES = {
  AUTH: '/auth',
  HOME: '/',
  PROFILE: '/profile',
  CARDS: '/cards',
  LANDING: '/landing'
} as const;

export const PUBLIC_ROUTES = [ROUTES.AUTH, ROUTES.HOME, ROUTES.LANDING] as const;

export const NO_BOTTOM_NAV_ROUTES = [ROUTES.AUTH, ROUTES.HOME, ROUTES.LANDING] as const;
