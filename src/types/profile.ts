'use client';

export type UserRole = 'user' | 'guest';

export type Profile = {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string; // ID файла в PocketBase
  avatarUrl?: string; // URL для отображения
  nativeLanguages?: string[];
  learningLanguages?: string[];
  age?: number;
  country?: string;
  city?: string;
  interests?: string[];
  isRegistered?: boolean;
  role?: UserRole; // Добавляем роль пользователя
  expiresAt?: string; // Дата истечения для гостевых аккаунтов
};

export type RegisterData = {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  bio?: string;
  avatar?: File; // Добавляем поддержку файла
  nativeLanguages?: string[];
  learningLanguages?: string[];
  age?: number;
  country?: string;
  city?: string;
  interests?: string[];
};

export type UpdateProfileData = Partial<Profile> & {
  avatar?: File; // Добавляем поддержку файла
};

export type GuestUpgradeData = {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
};
