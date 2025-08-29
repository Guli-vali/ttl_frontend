import { Profile } from './profile';

export type Card = {
  id: string;
  title: string;
  text: string;
  language: string;
  author: Profile;
};
