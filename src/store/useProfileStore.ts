import { create } from 'zustand';

export type Profile = {
  id: number;
  name: string;
  bio: string;
  avatarUrl?: string;
  language: string;
};

type ProfileState = {
  profile: Profile;
  updateProfile: (data: Partial<Profile>) => void;
};

export const useProfileStore = create<ProfileState>((set) => ({
  profile: {
    id: 1,
    name: 'Иван Иванов',
    bio: 'Люблю изучать языки и общаться с людьми.',
    avatarUrl: '', // можно добавить ссылку на аватар
    language: 'Русский',
  },
  updateProfile: (data) =>
    set((state) => ({
      profile: { ...state.profile, ...data },
    })),
}));
