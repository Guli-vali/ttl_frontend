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
        profile: createProfileFromUser(updatedUser),
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
      // On authentication check error just reset state
      set({ 
        profile: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    }
  },

  createGuestAccountAndJoin: async () => {
    set({ isLoading: true, error: null });
    
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      try {
        console.log(`Attempt ${retryCount + 1} of ${maxRetries}: Creating guest account...`);
        
        // Create guest account
        const registerSuccess = await authApi.guestRegister();
        
        if (registerSuccess && registerSuccess.email && registerSuccess.password) {
          // Add small delay to avoid autocancellation errors
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Login with created account
          const user = await authApi.login(registerSuccess.email, registerSuccess.password);
          
          set({ 
            profile: createProfileFromUser(user),
            isAuthenticated: true,
            isLoading: false 
          });
          return true;
        }
        
        // If we got empty data, this means autocancellation
        // Continue loop for retry
        console.log('Got empty data from guestRegister, retrying...');
        retryCount++;
        continue;
              } catch (error) {
          retryCount++;
          
          if (retryCount >= maxRetries) {
            const errorMessage = handleAuthError(error, 'GUEST_LOGIN');
            set({ error: errorMessage, isLoading: false });
            return false;
          }
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
    }

    console.log('createGuestAccountAndJoin: EXITING LOOP - returning false');
    return false;
  },

  clearError: () => {
    set({ error: null });
  },
}));