import PocketBase from 'pocketbase';
import type { RecordService } from 'pocketbase';

// Создаем экземпляр PocketBase
export const pb = new PocketBase(
  process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'
);

// Типы для PocketBase
export interface UserRecord {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  avatarUrl?: string;
  bio?: string;
  nativeLanguages?: string[];
  learningLanguages?: string[];
  age?: number;
  country?: string;
  city?: string;
  interests?: string[];
  isRegistered?: boolean;
  verified?: boolean;
  emailVisibility?: boolean;
  created: string;
  updated: string;
}

export interface CardRecord {
  id: string;
  title: string;
  text: string;
  language: string;
  author: string; // ID пользователя
  created: string;
  // Нет поля updated в вашей коллекции
}

export interface MessageRecord {
  id: string;
  text: string;
  card: string; // ID карточки
  author: string; // ID пользователя
  created: string;
  updated: string;
}

// Определяем типизированный интерфейс клиента
export interface TypedPB extends PocketBase {
  collection(idOrName: 'users'): RecordService<UserRecord>;
  collection(idOrName: 'cards'): RecordService<CardRecord>;
  collection(idOrName: 'messages'): RecordService<MessageRecord>;
}

// Экспортируем экземпляр с типами
export const typedPb = pb as TypedPB;
