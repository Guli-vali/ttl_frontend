// src/store/useCardsStore.ts
import { create } from 'zustand';
import { useProfileStore } from './useProfileStore';
import { Card } from '@/types/card';

// Начальные карточки с обновленной структурой автора
const initialCards: Card[] = [
  {
    id: 1,
    title: 'English Practice',
    text: 'Let\'s talk about your favorite book!',
    language: 'English',
    author: {
      id: 2,
      name: 'Анна Смирнова',
      email: 'anna@example.com',
      bio: 'Изучаю английский язык уже 3 года. Люблю читать и путешествовать.',
      avatarUrl: '',
      nativeLanguages: ['Русский'],
      learningLanguages: ['English', 'Français'],
      age: 25,
      country: 'Россия',
      city: 'Москва',
      interests: ['Книги', 'Путешествия', 'Кино'],
      isRegistered: true,
    },
  },
  {
    id: 2,
    title: 'Русский разговор',
    text: 'Как прошёл твой день? Давайте поговорим о повседневной жизни!',
    language: 'Русский',
    author: {
      id: 3,
      name: 'John Smith',
      email: 'john@example.com',
      bio: 'Learning Russian for 2 years. I love the culture and literature!',
      avatarUrl: '',
      nativeLanguages: ['English'],
      learningLanguages: ['Русский', 'Español'],
      age: 28,
      country: 'США',
      city: 'New York',
      interests: ['Музыка', 'Спорт', 'История'],
      isRegistered: true,
    },
  },
  {
    id: 3,
    title: 'Deutsch lernen',
    text: 'Was ist dein Lieblingsessen? Lass uns über deutsche Küche sprechen!',
    language: 'Deutsch',
    author: {
      id: 4,
      name: 'Marie Dubois',
      email: 'marie@example.com',
      bio: 'J\'apprends l\'allemand depuis 1 an. J\'adore la culture allemande!',
      avatarUrl: '',
      nativeLanguages: ['Français'],
      learningLanguages: ['Deutsch', 'Italiano'],
      age: 23,
      country: 'Франция',
      city: 'Paris',
      interests: ['Искусство', 'Кулинария', 'Музыка'],
      isRegistered: true,
    },
  },
  {
    id: 4,
    title: 'Spanish Chat',
    text: '¿Cuál es tu ciudad favorita? ¡Hablemos de viajes y lugares increíbles!',
    language: 'Spanish',
    author: {
      id: 5,
      name: 'Carlos Rodriguez',
      email: 'carlos@example.com',
      bio: '¡Hola! Soy de México y me encanta ayudar a la gente a aprender español.',
      avatarUrl: '',
      nativeLanguages: ['Español'],
      learningLanguages: ['English', 'Português'],
      age: 30,
      country: 'Мексика',
      city: 'Mexico City',
      interests: ['Путешествия', 'Фотография', 'Природа'],
      isRegistered: true,
    },
  },
];

type CardsState = {
  cards: Card[];
  addCard: (data: { title: string; text: string; language: string }) => void;
  removeCard: (id: number) => void;
  getCardsByLanguage: (language: string) => Card[];
};

export const useCardsStore = create<CardsState>((set, get) => ({
  cards: initialCards,

  addCard: (data) =>
    set((state) => {
      const profile = useProfileStore.getState().profile;
      return {
        cards: [
          {
            id: Date.now(),
            ...data,
            author: profile,
          },
          ...state.cards,
        ],
      };
    }),

  removeCard: (id) =>
    set((state) => ({
      cards: state.cards.filter((card) => card.id !== id),
    })),

  getCardsByLanguage: (language) => {
    const state = get();
    return state.cards.filter((card) => card.language === language);
  },
}));