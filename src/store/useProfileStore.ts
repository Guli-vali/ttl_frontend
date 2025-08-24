// src/store/useProfileStore.ts
import { create } from 'zustand';
import { authApi } from '@/lib/api';
import type { UserRecord } from '@/lib/pocketbase';

export type Profile = {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  nativeLanguages?: string[];
  learningLanguages?: string[];
  age?: number;
  country?: string;
  city?: string;
  interests?: string[];
  isRegistered?: boolean;
};

type ProfileState = {
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: {
    email: string;
    password: string;
    passwordConfirm: string;
    name: string;
    bio?: string;
    nativeLanguages?: string[];
    learningLanguages?: string[];
    age?: number;
    country?: string;
    city?: string;
    interests?: string[];
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<boolean>;
  checkAuth: () => Promise<void>;
};

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authApi.login(email, password);
      set({ 
        profile: {
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
        },
        isAuthenticated: true,
        isLoading: false 
      });
      return true;
    } catch (error) {
      set({ error: 'Ошибка входа', isLoading: false });
      return false;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authApi.register(data);
      set({ 
        profile: {
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
        },
        isAuthenticated: true,
        isLoading: false 
      });
      return true;
    } catch (error) {
      set({ error: 'Ошибка регистрации', isLoading: false });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authApi.logout();
      set({ 
        profile: null, 
        isAuthenticated: false, 
        error: null,
        isLoading: false 
      });
    } catch (error) {
      set({ error: 'Ошибка выхода', isLoading: false });
    }
  },

  updateProfile: async (data) => {
    const { profile } = get();
    if (!profile) return false;

    set({ isLoading: true, error: null });
    try {
      const updatedUser = await authApi.updateProfile(profile.id, data);
      set({ 
        profile: {
          ...profile,
          ...updatedUser,
        },
        isLoading: false 
      });
      return true;
    } catch (error) {
      set({ error: 'Ошибка обновления профиля', isLoading: false });
      return false;
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const user = await authApi.getCurrentUser();
      if (user) {
        set({ 
          profile: {
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
          },
          isAuthenticated: true,
          isLoading: false 
        });
      } else {
        set({ 
          profile: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
      }
    } catch (error) {
      set({ 
        profile: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    }
  },
}));