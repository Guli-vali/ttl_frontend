// src/store/useProfileStore.ts
import { create } from 'zustand';

export type Profile = {
  id: number;
  name: string;
  email: string;
  bio: string;
  avatarUrl?: string;
  nativeLanguages: string[]; // Языки, которыми владеет
  learningLanguages: string[]; // Языки, которые изучает
  age?: number;
  country: string;
  city?: string;
  interests: string[];
  isRegistered: boolean;
};

type ProfileState = {
  profile: Profile;
  isAuthenticated: boolean;
  updateProfile: (data: Partial<Profile>) => void;
  login: (profile: Profile) => void;
  logout: () => void;
};

const defaultProfile: Profile = {
  id: 0,
  name: '',
  email: '',
  bio: '',
  avatarUrl: '',
  nativeLanguages: [],
  learningLanguages: [],
  age: undefined,
  country: '',
  city: '',
  interests: [],
  isRegistered: false,
};

export const useProfileStore = create<ProfileState>((set) => ({
  profile: defaultProfile,
  isAuthenticated: false,
  
  updateProfile: (data) =>
    set((state) => ({
      profile: { ...state.profile, ...data },
    })),
    
  login: (profile) =>
    set(() => ({
      profile,
      isAuthenticated: true,
    })),
    
  logout: () =>
    set(() => ({
      profile: defaultProfile,
      isAuthenticated: false,
    })),
}));