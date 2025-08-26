import { create } from 'zustand';
import { messagesApi } from '@/lib/api/messages';
import { pb } from '@/lib/pocketbase';
import { MessagesState } from '@/types/store';
import { MessageRecord } from '@/types/message';
import { useProfileStore } from './useProfileStore';
import { transformMessageRecord } from '@/lib/utils/transformers';
import { handleMessagesError } from '@/lib/utils/errorHandlers';

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
      const messages = messageRecords.map(transformMessageRecord);

      set(state => ({
        messages: {
          ...state.messages,
          [cardId]: messages
        },
        isLoading: false,
        isInitialized: true
      }));
    } catch (error) {
      const errorMessage = handleMessagesError(error, 'LOAD_MESSAGES');
      set({ 
        error: errorMessage, 
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
      const newMessage = transformMessageRecord(messageRecord);

      set(state => ({
        messages: {
          ...state.messages,
          [cardId]: [...(state.messages[cardId] || []), newMessage]
        },
        isLoading: false
      }));

      return true;
    } catch (error) {
      const errorMessage = handleMessagesError(error, 'SEND_MESSAGE');
      set({ 
        error: errorMessage, 
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
      const errorMessage = handleMessagesError(error, 'DELETE_MESSAGE');
      set({ 
        error: errorMessage, 
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
          const newMessage = transformMessageRecord(fullRecord);

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