import { Profile, RegisterData, UpdateProfileData } from './profile';
import { Card, CreateCardData, UpdateCardData } from './cards';
import { Message } from './message';

// Profile Store Types
export type ProfileState = {
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<boolean>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
};

// Cards Store Types
export type CardsState = {
  cards: Card[];
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  lastLoadTime: number;
};

export type CardsActions = {
  loadCards: (force?: boolean) => Promise<void>;
  createCard: (data: CreateCardData) => Promise<boolean>;
  updateCard: (id: string, data: UpdateCardData) => Promise<boolean>;
  deleteCard: (id: string) => Promise<boolean>;
  getCardById: (id: string) => Card | undefined;
  getCardsByLanguage: (language: string) => Card[];
  getAvailableLanguages: () => string[];
  clearError: () => void;
  reset: () => void;
};

export type CardsStore = CardsState & CardsActions;

// Messages Store Types
export type MessagesState = {
  messages: Record<string, Message[]>; // cardId -> messages[]
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  
  // Actions
  loadMessages: (cardId: string, force?: boolean) => Promise<void>;
  sendMessage: (cardId: string, text: string) => Promise<boolean>;
  deleteMessage: (messageId: string) => Promise<boolean>;
  clearMessages: (cardId: string) => void;
  clearError: () => void;
  reset: () => void;

  // Селекторы
  getMessagesByCardId: (cardId: string) => Message[];
};
