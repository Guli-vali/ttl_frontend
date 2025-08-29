// src/store/useCardsStore.ts
import { create } from 'zustand';
import { cardsApi } from '@/lib/api/cards';
import { useProfileStore } from './useProfileStore';
import { CardsStore } from '@/types/store';
import { transformCardRecord } from '@/lib/utils/transformers';
import { handleCardsError } from '@/lib/utils/errorHandlers';
import { DEBOUNCE_TIME } from '@/constants/timing';

// Store
export const useCardsStore = create<CardsStore>((set, get) => ({
  // Начальное состояние
  cards: [],
  isLoading: false,
  error: null,
  isInitialized: false,
  lastLoadTime: 0,

  // Действия
  loadCards: async (force = false) => {
    const state = get();
    const now = Date.now();
    
    // Предотвращаем повторные запросы
    if (state.isLoading && !force) return;

    // Дебаунсинг
    if (!force && state.isInitialized && (now - state.lastLoadTime) < DEBOUNCE_TIME) {
      return;
    }

    set({ isLoading: true, error: null });
    
    try {
      const cardRecords = await cardsApi.getAll();
      const cards = cardRecords.map(transformCardRecord);

      set({ 
        cards, 
        isLoading: false, 
        isInitialized: true, 
        lastLoadTime: now 
      });
    } catch (error) {
      const errorMessage = handleCardsError(error, 'LOAD_CARDS');
      set({ 
        error: errorMessage, 
        isLoading: false,
        isInitialized: true,
        lastLoadTime: now
      });
    }
  },

  createCard: async (data) => {
    const { profile } = useProfileStore.getState();
    if (!profile) {
      set({ error: 'Необходимо войти в систему' });
      return false;
    }

    set({ isLoading: true, error: null });
    
    try {
      await cardsApi.create(data);
      await get().loadCards(true);
      return true;
    } catch (error) {
      const errorMessage = handleCardsError(error, 'CREATE_CARD');
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  updateCard: async (id, data) => {
    set({ isLoading: true, error: null });
    
    try {
      await cardsApi.update(id, data);
      await get().loadCards(true);
      return true;
    } catch (error) {
      const errorMessage = handleCardsError(error, 'UPDATE_CARD');
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  deleteCard: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      await cardsApi.delete(id);
      await get().loadCards(true);
      return true;
    } catch (error) {
      const errorMessage = handleCardsError(error, 'DELETE_CARD');
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  getCardById: (id) => {
    return get().cards.find(card => card.id === id);
  },

  getCardsByLanguage: (language) => {
    return get().cards.filter(card => card.language === language);
  },

  getAvailableLanguages: () => {
    const languages = [...new Set(get().cards.map(card => card.language))];
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