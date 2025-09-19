// src/app/cards/[id]/page.tsx
'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, Share2 } from 'lucide-react';
import Image from 'next/image';
import { useCardsStore } from '@/store/useCardsStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useMessagesStore, initializeMessagesRealtime } from '@/store/useMessagesStore';
import MessageItem from '@/components/messages/MessageItem';
import GuestAccountCreation from '@/components/ui/GuestAccountCreation';
import Notification from '@/components/ui/Notification';

export default function CardPage() {
  const params = useParams();
  const router = useRouter();
  const cardId = params.id as string;
  
  const cards = useCardsStore((state) => state.cards);
  const loadCards = useCardsStore((state) => state.loadCards);
  const isInitialized = useCardsStore((state) => state.isInitialized);
  const profile = useProfileStore((state) => state.profile);
  
  // Use entire store and filter messages locally
  const messagesStore = useMessagesStore();
  const messages = useMemo(() => messagesStore.messages[cardId] || [], [messagesStore.messages, cardId]);
  
  const loadMessages = useMessagesStore((state) => state.loadMessages);
  const sendMessage = useMessagesStore((state) => state.sendMessage);
  const deleteMessage = useMessagesStore((state) => state.deleteMessage);
  const isLoading = useMessagesStore((state) => state.isLoading);
  const error = useMessagesStore((state) => state.error);
  
  const card = useMemo(() => cards.find((c) => c.id === cardId), [cards, cardId]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showGuestCreation, setShowGuestCreation] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if user can participate in chat
  const canParticipate = useMemo(() => {
    return profile && card && (
      profile.id === card.author.id || // Card author
      card.author.id !== profile.id // Not card author (other participant)
    );
  }, [profile, card]);

  // Check if user is authenticated
  const isAuthenticated = useMemo(() => {
    return !!profile;
  }, [profile]);

  // Check if user is the card owner
  const isCardOwner = useMemo(() => {
    return profile && card && profile.id === card.author.id;
  }, [profile, card]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Load cards if not yet loaded
  useEffect(() => {
    if (!isInitialized) {
      loadCards();
    }
  }, [isInitialized, loadCards]);

  // Check authentication when card is loaded
  useEffect(() => {
    if (card && !isAuthenticated) {
      setShowGuestCreation(true);
    }
  }, [card, isAuthenticated]);

  // Load messages for card
  useEffect(() => {
    if (cardId && canParticipate) {
      loadMessages(cardId);
    }
  }, [cardId, canParticipate, loadMessages]);

  // Initialize realtime subscription
  useEffect(() => {
    if (canParticipate) {
      try {
        const unsubscribe = initializeMessagesRealtime();
        return () => {
          if (typeof unsubscribe === 'function') {
            unsubscribe();
          }
        };
      } catch (error) {
        console.error('Error initializing realtime subscription:', error);
      }
    }
  }, [canParticipate]);

  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending || !canParticipate) return;

    setIsSending(true);
    const success = await sendMessage(cardId, newMessage.trim());
    if (success) {
      setNewMessage('');
    }
    setIsSending(false);
  }, [newMessage, isSending, canParticipate, sendMessage, cardId]);

  const handleDeleteMessage = useCallback(async (messageId: string) => {
    await deleteMessage(messageId);
  }, [deleteMessage]);

  const handleGuestCreationSuccess = useCallback(() => {
    setShowGuestCreation(false);
    // Page will automatically refresh with new user data
  }, []);

  const handleGuestCreationError = useCallback((error: string) => {
    setShowGuestCreation(false);
    setNotification({
      message: error,
      type: 'error'
    });
  }, []);

  const handleCloseNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const handleShare = useCallback(async () => {
    try {
      const cardUrl = `${window.location.origin}/cards/${cardId}`;
      await navigator.clipboard.writeText(cardUrl);
      setNotification({
        message: 'Link copied to clipboard',
        type: 'success'
      });
    } catch {
      setNotification({
        message: 'Failed to copy link',
        type: 'error'
      });
    }
  }, [cardId]);

  if (!isInitialized) {
    return (
      <div className="mx-auto max-w-md min-h-screen bg-yellow-300 shadow-lg flex flex-col items-center justify-center">
        <p className="text-black font-bold text-xl">Loading...</p>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="mx-auto max-w-md min-h-screen bg-yellow-300 shadow-lg flex flex-col items-center justify-center">
        <p className="text-black font-bold text-xl">Card not found</p>
      </div>
    );
  }

  if (!canParticipate && isAuthenticated) {
    return (
      <div className="mx-auto max-w-md min-h-screen bg-yellow-300 shadow-lg flex flex-col">
        <header className="p-4 border-b border-black bg-white">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-black hover:text-gray-600 transition-colors"
          >
            <ArrowLeft size={24} />
            <span className="font-medium">Back</span>
          </button>
        </header>
        
        <main className="flex-1 p-4 flex items-center justify-center">
          <div className="text-center">
            <p className="text-black font-bold text-lg mb-2">Access denied</p>
            <p className="text-gray-600">You cannot participate in this chat</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md min-h-screen bg-yellow-300 shadow-lg flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-black bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-black hover:text-gray-600 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-lg text-black truncate">{card.title}</h1>
            <p className="text-sm text-gray-600 truncate">{card.text}</p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Share button — only for card owner */}
            {isCardOwner && (
              <button
                onClick={handleShare}
                className="p-2 rounded-full border-2 border-black bg-yellow-300 hover:bg-yellow-200 transition-colors"
                aria-label="Share"
              >
                <Share2 size={20} className="text-black" />
              </button>
            )}
            
            <div className="flex flex-col items-center gap-1">
              {card.author.avatarUrl ? (
                <Image
                  src={card.author.avatarUrl}
                  alt={card.author.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full border border-black object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm border border-black">
                  {card.author.name[0]}
                </div>
              )}
              <div className="text-xs text-center">
                <div className="font-medium text-black truncate max-w-[80px]">{card.author.name}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Messages area */}
      <main className="flex-1 overflow-y-auto p-4 pb-32">
        {error && (
          <div className="text-red-600 text-center mb-4 p-2 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {isLoading && messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Start the conversation first!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageItem 
                key={message.id} 
                message={message}
                onDelete={() => handleDeleteMessage(message.id)}
              />
            ))}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </main>

      {/* Message sending form - fixed at bottom */}
      <footer className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-black p-4 z-40">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Enter message..."
            className="flex-1 px-3 py-2 border-2 border-black rounded-lg focus:outline-none focus:border-yellow-500 bg-white"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="px-4 py-2 bg-yellow-300 text-black rounded-lg border-2 border-black hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center font-medium"
          >
            <Send size={20} />
          </button>
        </form>
      </footer>

      {/* Guest account creation modal */}
      {showGuestCreation && (
        <GuestAccountCreation
          onSuccess={handleGuestCreationSuccess}
          onError={handleGuestCreationError}
        />
      )}

      {/* Notifications */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleCloseNotification}
        />
      )}
    </div>
  );
}