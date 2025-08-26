import { Profile } from '@/types/profile';
import { Card, CardRecord } from '@/types/cards';
import { Message, MessageRecord } from '@/types/message';
import { DEFAULT_AUTHOR } from '@/constants/defaults';

// Трансформация профиля
export const createProfileFromUser = (user: Record<string, any>): Profile => ({
  id: user.id,
  name: user.name,
  email: user.email,
  bio: user.bio,
  avatarUrl: user.avatarUrl,
  nativeLanguages: user.nativeLanguages,
  learningLanguages: user.learningLanguages,
  age: user.age,
  country: user.country,
  city: user.city,
  interests: user.interests,
  isRegistered: user.isRegistered,
});

// Трансформация карточки
export const transformCardRecord = (record: CardRecord & { expand?: { author?: Profile } }): Card => ({
  id: record.id,
  title: record.title,
  text: record.text,
  language: record.language,
  author: record.expand?.author || DEFAULT_AUTHOR,
});

// Трансформация сообщения
export const transformMessageRecord = (record: MessageRecord): Message => ({
  id: record.id,
  text: record.text,
  cardId: record.card,
  author: record.expand?.author || DEFAULT_AUTHOR,
  created: record.created,
  updated: record.updated,
});
