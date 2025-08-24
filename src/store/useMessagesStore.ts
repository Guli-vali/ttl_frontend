import { create } from 'zustand';
import { messagesApi } from '@/lib/api';
import { pb } from '@/lib/pocketbase';
import type { MessageRecord } from '@/lib/pocketbase';
import { useProfileStore } from './useProfileStore';
import type { Profile } from './useProfileStore';

export type Message = {
  id: string;
  text: string;
  cardId: string;
  author: Profile;
  created: string;
  updated: string;
};

type MessagesState = {
  messages: Record<string, Message[]>; // cardId -> messages[]
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  
  // Actions
  loadMessages: (cardId: string, force?: boolean) => Promise<void>;
  sendMessage: (cardId: string, text: string) => Promise<boolean>;
  deleteMessage: (messageId: string) => Promise<boolean>;
  clearMessages: (cardId: string) => void;
  clearError: () => void;
  reset: () => void;

  // Добавляем стабильный селектор
  getMessagesByCardId: (cardId: string) => Message[];
};

export const useMessagesStore = create<MessagesState>((set, get) => ({
  messages: {},
  isLoading: false,
  error: null,
  isInitialized: false,

  loadMessages: async (cardId: string, force = false) => {
    const state = get();
    
    // Если сообщения уже загружены и не требуется принудительная загрузка
    if (!force && state.messages[cardId] && state.messages[cardId].length > 0) {
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const messageRecords = await messagesApi.getByCard(cardId);
      
      // Преобразуем записи в нужный формат
      const messages: Message[] = messageRecords.map(record => ({
        id: record.id,
        text: record.text,
        cardId: record.card,
        author: record.expand?.author ? {
          id: record.expand.author.id,
          name: record.expand.author.name,
          email: record.expand.author.email,
          bio: record.expand.author.bio,
          avatarUrl: record.expand.author.avatarUrl,
          nativeLanguages: record.expand.author.nativeLanguages || [],
          learningLanguages: record.expand.author.learningLanguages || [],
          age: record.expand.author.age,
          country: record.expand.author.country,
          city: record.expand.author.city,
          interests: record.expand.author.interests || [],
          isRegistered: record.expand.author.isRegistered,
        } : {
          id: '',
          name: 'Неизвестный автор',
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
        },
        created: record.created,
        updated: record.updated,
      }));

      set(state => ({
        messages: {
          ...state.messages,
          [cardId]: messages
        },
        isLoading: false,
        isInitialized: true
      }));
    } catch (error) {
      console.error('Error loading messages:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Ошибка загрузки сообщений', 
        isLoading: false,
        isInitialized: true
      });
    }
  },

  sendMessage: async (cardId: string, text: string) => {
    set({ isLoading: true, error: null });
    try {
      const { profile } = useProfileStore.getState();
      if (!profile) {
        set({ error: 'Необходимо войти в систему', isLoading: false });
        return false;
      }

      const messageRecord = await messagesApi.create({
        text,
        card: cardId,
        author: profile.id,
      });

      // Добавляем новое сообщение в store
      const newMessage: Message = {
        id: messageRecord.id,
        text: messageRecord.text,
        cardId: messageRecord.card,
        author: profile,
        created: messageRecord.created,
        updated: messageRecord.updated,
      };

      set(state => ({
        messages: {
          ...state.messages,
          [cardId]: [...(state.messages[cardId] || []), newMessage]
        },
        isLoading: false
      }));

      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Ошибка отправки сообщения', 
        isLoading: false 
      });
      return false;
    }
  },

  deleteMessage: async (messageId: string) => {
    set({ isLoading: true, error: null });
    try {
      await messagesApi.delete(messageId);
      
      // Удаляем сообщение из store
      set(state => {
        const newMessages = { ...state.messages };
        Object.keys(newMessages).forEach(cardId => {
          newMessages[cardId] = newMessages[cardId].filter(msg => msg.id !== messageId);
        });
        return { messages: newMessages, isLoading: false };
      });

      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Ошибка удаления сообщения', 
        isLoading: false 
      });
      return false;
    }
  },

  clearMessages: (cardId: string) => {
    set(state => ({
      messages: {
        ...state.messages,
        [cardId]: []
      }
    }));
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({ 
      messages: {}, 
      isLoading: false, 
      error: null, 
      isInitialized: false
    });
  },

  // Добавляем стабильный селектор
  getMessagesByCardId: (cardId: string) => {
    return get().messages[cardId] || [];
  },
}));

// Создаем хук для получения сообщений по cardId
export const useMessagesByCardId = (cardId: string) => {
  return useMessagesStore((state) => state.getMessagesByCardId(cardId));
};

// Realtime подписка на сообщения
export const initializeMessagesRealtime = () => {
  try {
    const unsubscribe = pb.collection('messages').subscribe('*', (e) => {
      const state = useMessagesStore.getState();
      
      if (e.action === 'create') {
        // Новое сообщение
        const messageRecord = e.record as MessageRecord;
        
        // Загружаем полную информацию о сообщении с автором
        messagesApi.getById(messageRecord.id).then(fullRecord => {
          const newMessage: Message = {
            id: fullRecord.id,
            text: fullRecord.text,
            cardId: fullRecord.card,
            author: fullRecord.expand?.author ? {
              id: fullRecord.expand.author.id,
              name: fullRecord.expand.author.name,
              email: fullRecord.expand.author.email,
              bio: fullRecord.expand.author.bio,
              avatarUrl: fullRecord.expand.author.avatarUrl,
              nativeLanguages: fullRecord.expand.author.nativeLanguages || [],
              learningLanguages: fullRecord.expand.author.learningLanguages || [],
              age: fullRecord.expand.author.age,
              country: fullRecord.expand.author.country,
              city: fullRecord.expand.author.city,
              interests: fullRecord.expand.author.interests || [],
              isRegistered: fullRecord.expand.author.isRegistered,
            } : {
              id: '',
              name: 'Неизвестный автор',
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
            },
            created: fullRecord.created,
            updated: fullRecord.updated,
          };

          // Добавляем сообщение только если его еще нет
          const currentMessages = state.messages[messageRecord.card] || [];
          if (!currentMessages.find(msg => msg.id === messageRecord.id)) {
            useMessagesStore.setState(state => ({
              messages: {
                ...state.messages,
                [messageRecord.card]: [...currentMessages, newMessage]
              }
            }));
          }
        }).catch(error => {
          console.error('Error loading message details:', error);
        });
      } else if (e.action === 'delete') {
        // Удаленное сообщение
        const messageRecord = e.record as MessageRecord;
        useMessagesStore.setState(state => {
          const newMessages = { ...state.messages };
          Object.keys(newMessages).forEach(cardId => {
            newMessages[cardId] = newMessages[cardId].filter(msg => msg.id !== messageRecord.id);
          });
          return { messages: newMessages };
        });
      }
    });

    // Проверяем, что unsubscribe действительно является функцией
    if (typeof unsubscribe !== 'function') {
      console.warn('PocketBase subscribe did not return a function');
      return () => {}; // Возвращаем пустую функцию
    }

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up realtime subscription:', error);
    return () => {}; // Возвращаем пустую функцию в случае ошибки
  }
};
