import { Profile } from '@/types/profile';
import { Card, CardRecord } from '@/types/cards';
import { Message, MessageRecord } from '@/types/message';
import { DEFAULT_AUTHOR } from '@/constants/defaults';
import { pb } from '../pocketbase';

// Трансформация профиля
export const createProfileFromUser = (user: Record<string, any>): Profile => {
  // Получаем URL аватарки из PocketBase
  let avatarUrl: string | undefined;
  if (user.avatar) {
    avatarUrl = pb.files.getUrl(user, user.avatar);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    bio: user.bio,
    avatar: user.avatar,
    avatarUrl,
    nativeLanguages: user.nativeLanguages,
    learningLanguages: user.learningLanguages,
    age: user.age,
    country: user.country,
    city: user.city,
    interests: user.interests,
    isRegistered: user.isRegistered,
  };
};

// Трансформация карточки
export const transformCardRecord = (record: CardRecord & { expand?: { author?: any } }): Card => {
  let author = DEFAULT_AUTHOR;
  
  if (record.expand?.author) {
    author = createProfileFromUser(record.expand.author);
  }

  return {
    id: record.id,
    title: record.title,
    text: record.text,
    language: record.language,
    author,
  };
};

// Трансформация сообщения
export const transformMessageRecord = (record: MessageRecord): Message => {
  let author = DEFAULT_AUTHOR;
  
  if (record.expand?.author) {
    author = createProfileFromUser(record.expand.author);
  }

  return {
    id: record.id,
    text: record.text,
    cardId: record.card,
    author,
    created: record.created,
    updated: record.updated,
  };
};
