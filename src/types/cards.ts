import { Profile } from './profile';

export type Card = {
  id: string;
  title: string;
  text: string;
  language: string;
  author: Profile;
};

export type CreateCardData = {
  title: string;
  text: string;
  language: string;
};

export type UpdateCardData = Partial<Omit<Card, 'id' | 'author'>>;

export type CardRecord = {
  id: string;
  title: string;
  text: string;
  language: string;
  author: string;
  expand?: {
    author?: Profile;
  };
};
