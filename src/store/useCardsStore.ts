// store/useCardsStore.ts
import { create } from 'zustand';
import { useProfileStore } from './useProfileStore';
import { Card } from '@/types/card'; // Импортируем тип из единого источника

// Начальные карточки — теперь с author
const initialCards: Card[] = [
  {
    id: 1,
    title: 'English Practice',
    text: 'Let’s talk about your favorite book!',
    language: 'English',
    author: {
      id: 1,
      name: 'Иван Иванов',
      bio: 'Люблю изучать языки и общаться с людьми.',
      avatarUrl: '',
      language: 'Русский',
    },
  },
  {
    id: 2,
    title: 'Русский разговор',
    text: 'Как прошёл твой день?',
    language: 'Русский',
    author: {
      id: 1,
      name: 'Иван Иванов',
      bio: 'Люблю изучать языки и общаться с людьми.',
      avatarUrl: '',
      language: 'Русский',
    },
  },
  {
    id: 3,
    title: 'Deutsch lernen',
    text: 'Was ist dein Lieblingsessen?',
    language: 'Deutsch',
    author: {
      id: 1,
      name: 'Иван Иванов',
      bio: 'Люблю изучать языки и общаться с людьми.',
      avatarUrl: '',
      language: 'Русский',
    },
  },
  {
    id: 4,
    title: 'Spanish Chat',
    text: '¿Cuál es tu ciudad favorita?',
    language: 'Spanish',
    author: {
      id: 1,
      name: 'Иван Иванов',
      bio: 'Люблю изучать языки и общаться с людьми.',
      avatarUrl: '',
      language: 'Русский',
    },
  },
];

type CardsState = {
  cards: Card[];
  addCard: (data: { title: string; text: string; language: string }) => void;
  removeCard: (id: number) => void;
};

export const useCardsStore = create<CardsState>((set) => ({
  cards: initialCards,

  addCard: (data) =>
    set((state) => {
      const profile = useProfileStore.getState().profile;
      return {
        cards: [
          ...state.cards,
          {
            id: Date.now(),
            ...data,
            author: profile, // автоматически подставляем автора
          },
        ],
      };
    }),

  removeCard: (id) =>
    set((state) => ({
      cards: state.cards.filter((card) => card.id !== id),
    })),
}));