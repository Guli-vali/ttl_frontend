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

export type RegisterData = {
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
};

export type UpdateProfileData = Partial<Profile>;
