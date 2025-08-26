import { Profile } from '@/types/profile';

export const DEFAULT_AUTHOR: Profile = {
  id: '',
  name: 'Неизвестный автор',
  email: '',
  bio: '',
  avatarUrl: '',
  nativeLanguages: [],
  learningLanguages: [],
  age: undefined,
  country: '',
  city: '',
  interests: [],
  isRegistered: false,
};

export const DEFAULT_ERROR_MESSAGES = {
  LOAD_CARDS: 'Ошибка загрузки карточек',
  CREATE_CARD: 'Ошибка создания карточки',
  UPDATE_CARD: 'Ошибка обновления карточки',
  DELETE_CARD: 'Ошибка удаления карточки',
  LOAD_MESSAGES: 'Ошибка загрузки сообщений',
  SEND_MESSAGE: 'Ошибка отправки сообщения',
  DELETE_MESSAGE: 'Ошибка удаления сообщения',
  LOGIN: 'Ошибка входа',
  REGISTER: 'Ошибка регистрации',
  LOGOUT: 'Ошибка выхода',
  UPDATE_PROFILE: 'Ошибка обновления профиля',
  AUTH_REQUIRED: 'Необходимо войти в систему',
} as const;
