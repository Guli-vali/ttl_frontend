import { Profile } from '@/store/useProfileStore';

export type Card = {
  id: number;
  title: string;
  text: string;
  language: string;
  author: Profile; // Добавляем автора
};
