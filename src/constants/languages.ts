export const LANGUAGES = [
  'Русский', 'English', 'Español', 'Français', 'Deutsch', 'Italiano',
  '中文', '日本語', '한국어', 'العربية', 'Português', 'Nederlands',
  'Svenska', 'Polski', 'Türkçe', 'हिन्दी'
] as const;

export type Language = typeof LANGUAGES[number];
