import { Profile } from './profile';

export type Message = {
  id: string;
  text: string;
  cardId: string;
  author: Profile;
  created: string;
  updated: string;
};

export type CreateMessageData = {
  text: string;
  card: string;
  author: string;
};

export type MessageRecord = {
  id: string;
  text: string;
  card: string;
  author: string;
  created: string;
  updated: string;
  expand?: {
    author?: Profile;
  };
};
