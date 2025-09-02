import PocketBase from 'pocketbase';
import type { RecordService } from 'pocketbase';
import type { UserRole } from '@/types/profile';

// Создаем экземпляр PocketBase
export const pb = new PocketBase(
  process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090'
);

// Типы для PocketBase
export interface UserRecord {
  id: string;
  email: string;
  name: string;
  avatar?: string; // ID файла
  avatarUrl?: string; // URL (устаревшее поле)
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
  role?: UserRole; // Добавляем роль пользователя
  expiresAt?: string; // Дата истечения для гостевых аккаунтов
  created: string;
  updated: string;
}

export interface CardRecord {
  id: string;
  title: string;
  text: string;
  language: string;
  author: string;
  created: string;
  updated: string;
}

export interface MessageRecord {
  id: string;
  text: string;
  card: string;
  author: string;
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
