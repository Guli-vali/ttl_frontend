// src/store/useProfileStore.ts
import { create } from 'zustand';
import { authApi } from '@/lib/api/auth';
import { ProfileState } from '@/types/store';
import { createProfileFromUser } from '@/lib/utils/transformers';
import { handleAuthError } from '@/lib/utils/errorHandlers';

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
        profile: createProfileFromUser(user),
        isAuthenticated: true,
        isLoading: false 
      });
      return true;
    } catch (error) {
      const errorMessage = handleAuthError(error, 'LOGIN');
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authApi.register(data);
      set({ 
        profile: createProfileFromUser(user),
        isAuthenticated: true,
        isLoading: false 
      });
      return true;
    } catch (error) {
      const errorMessage = handleAuthError(error, 'REGISTER');
      set({ error: errorMessage, isLoading: false });
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
      const errorMessage = handleAuthError(error, 'LOGOUT');
      set({ error: errorMessage, isLoading: false });
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
      const errorMessage = handleAuthError(error, 'UPDATE_PROFILE');
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const user = await authApi.getCurrentUser();
      if (user) {
        set({ 
          profile: createProfileFromUser(user),
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
    } catch {
      // При ошибке проверки аутентификации просто сбрасываем состояние
      set({ 
        profile: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));