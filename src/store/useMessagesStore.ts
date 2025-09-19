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
    
    // If messages already loaded and no force load required
    if (!force && state.messages[cardId] && state.messages[cardId].length > 0) {
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const messageRecords = await messagesApi.getByCard(cardId);
      
      // Transform records to required format
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
        set({ error: 'Authentication required', isLoading: false });
        return false;
      }

      const messageRecord = await messagesApi.create({
        text,
        card: cardId,
        author: profile.id,
      });

      // Add new message to store
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
      
      // Remove message from store
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

  // Add stable selector
  getMessagesByCardId: (cardId: string) => {
    return get().messages[cardId] || [];
  },
}));

// Create hook for getting messages by cardId
export const useMessagesByCardId = (cardId: string) => {
  return useMessagesStore((state) => state.getMessagesByCardId(cardId));
};

// Realtime subscription to messages
export const initializeMessagesRealtime = () => {
  try {
    const unsubscribe = pb.collection('messages').subscribe('*', (e) => {
      const state = useMessagesStore.getState();
      
      if (e.action === 'create') {
        // New message
        const messageRecord = e.record as MessageRecord;
        
        // Load full message info with author
        messagesApi.getById(messageRecord.id).then(fullRecord => {
          const newMessage = transformMessageRecord(fullRecord);

          // Add message only if not already present
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
        // Deleted message
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

    // Check that unsubscribe is actually a function
    if (typeof unsubscribe !== 'function') {
      console.warn('PocketBase subscribe did not return a function');
      return () => {}; // Return empty function
    }

    return unsubscribe;
  } catch (error) {
    console.error('Error setting up realtime subscription:', error);
    return () => {}; // Return empty function in case of error
  }
};