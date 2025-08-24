// src/app/cards/[id]/page.tsx
'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, User } from 'lucide-react';
import Image from 'next/image';
import { useCardsStore } from '@/store/useCardsStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useMessagesStore, initializeMessagesRealtime } from '@/store/useMessagesStore';
import MessageItem from '@/components/MessageItem';

export default function CardPage() {
  const params = useParams();
  const router = useRouter();
  const cardId = params.id as string;
  
  const cards = useCardsStore((state) => state.cards);
  const loadCards = useCardsStore((state) => state.loadCards);
  const isInitialized = useCardsStore((state) => state.isInitialized);
  const profile = useProfileStore((state) => state.profile);
  
  // Используем весь store и фильтруем сообщения локально
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Проверяем, может ли пользователь участвовать в чате
  const canParticipate = useMemo(() => {
    return profile && card && (
      profile.id === card.author.id || // Автор карточки
      card.author.id !== profile.id // Не автор карточки (другой участник)
    );
  }, [profile, card]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Загружаем карточки, если они еще не загружены
  useEffect(() => {
    if (!isInitialized) {
      loadCards();
    }
  }, [isInitialized, loadCards]);

  // Загружаем сообщения для карточки
  useEffect(() => {
    if (cardId && canParticipate) {
      loadMessages(cardId);
    }
  }, [cardId, canParticipate, loadMessages]);

  // Инициализируем realtime подписку
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

  if (!isInitialized) {
    return (
      <div className="mx-auto max-w-md min-h-screen bg-yellow-300 shadow-lg flex flex-col items-center justify-center">
        <p className="text-black font-bold text-xl">Загрузка...</p>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="mx-auto max-w-md min-h-screen bg-yellow-300 shadow-lg flex flex-col items-center justify-center">
        <p className="text-black font-bold text-xl">Карточка не найдена</p>
      </div>
    );
  }

  if (!canParticipate) {
    return (
      <div className="mx-auto max-w-md min-h-screen bg-yellow-300 shadow-lg flex flex-col">
        <header className="p-4 border-b border-black bg-white">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-black hover:text-gray-600 transition-colors"
          >
            <ArrowLeft size={24} />
            <span className="font-medium">Назад</span>
          </button>
        </header>
        
        <main className="flex-1 p-4 flex items-center justify-center">
          <div className="text-center">
            <p className="text-black font-bold text-lg mb-2">Доступ запрещен</p>
            <p className="text-gray-600">Вы не можете участвовать в этом чате</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md min-h-screen bg-yellow-300 shadow-lg flex flex-col">
      {/* Заголовок */}
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
            <div className="text-xs min-w-0">
              <div className="font-medium text-black truncate max-w-[80px]">{card.author.name}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Область сообщений */}
      <main className="flex-1 overflow-y-auto p-4 pb-32">
        {error && (
          <div className="text-red-600 text-center mb-4 p-2 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {isLoading && messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Загрузка сообщений...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Начните общение первым!</p>
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

      {/* Форма отправки сообщения - фиксированная внизу */}
      <footer className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-black p-4 z-40">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Введите сообщение..."
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
    </div>
  );
}