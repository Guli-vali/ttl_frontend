// src/store/useCardsStore.ts
import { create } from 'zustand';
import { cardsApi } from '@/lib/api';
import { useProfileStore } from './useProfileStore';
import type { Profile } from './useProfileStore';

export type Card = {
  id: string;
  title: string;
  text: string;
  language: string;
  author: Profile;
};

type CardsState = {
  cards: Card[];
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  lastLoadTime: number; // Добавляем время последней загрузки
  
  // Actions
  loadCards: (force?: boolean) => Promise<void>;
  createCard: (data: { title: string; text: string; language: string }) => Promise<boolean>;
  updateCard: (id: string, data: Partial<Card>) => Promise<boolean>;
  deleteCard: (id: string) => Promise<boolean>;
  getCardById: (id: string) => Card | undefined;
  getCardsByLanguage: (language: string) => Card[];
  getAvailableLanguages: () => string[];
  clearError: () => void;
  reset: () => void;
};

export const useCardsStore = create<CardsState>((set, get) => ({
  cards: [],
  isLoading: false,
  error: null,
  isInitialized: false,
  lastLoadTime: 0,

  loadCards: async (force = false) => {
    const state = get();
    const now = Date.now();
    
    // Предотвращаем повторные запросы, если не принудительная загрузка
    if (state.isLoading && !force) {
      return;
    }

    // Дебаунсинг: не загружаем чаще чем раз в 2 секунды
    if (!force && state.isInitialized && (now - state.lastLoadTime) < 2000) {
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const cardRecords = await cardsApi.getAll();
      
      // Преобразуем записи в нужный формат
      const cards: Card[] = cardRecords.map(record => ({
        id: record.id,
        title: record.title,
        text: record.text,
        language: record.language,
        author: record.expand?.author ? {
          id: record.expand.author.id,
          name: record.expand.author.name,
          email: record.expand.author.email,
          bio: record.expand.author.bio,
          avatarUrl: record.expand.author.avatarUrl,
          nativeLanguages: record.expand.author.nativeLanguages || [],
          learningLanguages: record.expand.author.learningLanguages || [],
          age: record.expand.author.age,
          country: record.expand.author.country,
          city: record.expand.author.city,
          interests: record.expand.author.interests || [],
          isRegistered: record.expand.author.isRegistered,
        } : {
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
        }
      }));

      set({ 
        cards, 
        isLoading: false, 
        isInitialized: true, 
        lastLoadTime: now 
      });
    } catch (error) {
      console.error('Error loading cards:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Ошибка загрузки карточек', 
        isLoading: false,
        isInitialized: true,
        lastLoadTime: now
      });
    }
  },

  createCard: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const { profile } = useProfileStore.getState();
      if (!profile) {
        set({ error: 'Необходимо войти в систему', isLoading: false });
        return false;
      }

      await cardsApi.create({
        ...data,
        author: profile.id,
      });

      // Принудительно перезагружаем карточки
      await get().loadCards(true);
      return true;
    } catch (error) {
      console.error('Error creating card:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Ошибка создания карточки', 
        isLoading: false 
      });
      return false;
    }
  },

  updateCard: async (id: string, data) => {
    set({ isLoading: true, error: null });
    try {
      await cardsApi.update(id, data);
      await get().loadCards(true);
      return true;
    } catch (error) {
      console.error('Error updating card:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Ошибка обновления карточки', 
        isLoading: false 
      });
      return false;
    }
  },

  deleteCard: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await cardsApi.delete(id);
      await get().loadCards(true);
      return true;
    } catch (error) {
      console.error('Error deleting card:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Ошибка удаления карточки', 
        isLoading: false 
      });
      return false;
    }
  },

  getCardById: (id: string) => {
    return get().cards.find(card => card.id === id);
  },

  getCardsByLanguage: (language: string) => {
    const state = get();
    return state.cards.filter((card) => card.language === language);
  },

  getAvailableLanguages: () => {
    const state = get();
    const languages = [...new Set(state.cards.map(card => card.language))];
    return languages.sort();
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({ 
      cards: [], 
      isLoading: false, 
      error: null, 
      isInitialized: false,
      lastLoadTime: 0
    });
  },
}));