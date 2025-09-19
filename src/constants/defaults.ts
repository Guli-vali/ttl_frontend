import { Profile } from '@/types/profile';

export const DEFAULT_AUTHOR: Profile = {
  id: '',
  name: 'Unknown Author',
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
  LOAD_CARDS: 'Error loading cards',
  CREATE_CARD: 'Error creating card',
  UPDATE_CARD: 'Error updating card',
  DELETE_CARD: 'Error deleting card',
  LOAD_MESSAGES: 'Error loading messages',
  SEND_MESSAGE: 'Error sending message',
  DELETE_MESSAGE: 'Error deleting message',
  LOGIN: 'Login error',
  REGISTER: 'Registration error',
  LOGOUT: 'Logout error',
  UPDATE_PROFILE: 'Error updating profile',
  AUTH_REQUIRED: 'Authentication required',
  GUEST_LOGIN: 'Error creating guest account',
} as const;
