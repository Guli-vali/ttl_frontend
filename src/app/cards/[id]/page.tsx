// src/app/cards/[id]/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, User } from 'lucide-react';
import Image from 'next/image';
import { useCardsStore } from '@/store/useCardsStore';
import { useProfileStore } from '@/store/useProfileStore';

interface Message {
  id: number;
  text: string;
  authorId: number;
  authorName: string;
  authorAvatar?: string;
  timestamp: Date;
  isOwn: boolean;
}

export default function CardPage() {
  const params = useParams();
  const router = useRouter();
  const cardId = parseInt(params.id as string);
  
  const cards = useCardsStore((state) => state.cards);
  const profile = useProfileStore((state) => state.profile);
  
  const card = cards.find((c) => c.id === cardId);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Привет! Эта тема очень интересная, давайте обсудим!",
      authorId: 2,
      authorName: "Мария Петрова",
      authorAvatar: "",
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      isOwn: false,
    },
    {
      id: 2,
      text: "Согласен! Мне нравится эта тема для изучения языка",
      authorId: profile.id,
      authorName: profile.name,
      authorAvatar: profile.avatarUrl,
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isOwn: true,
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!card) {
    return (
      <div className="mx-auto max-w-md min-h-screen bg-yellow-300 shadow-lg flex flex-col items-center justify-center">
        <p className="text-black font-bold text-xl">Карточка не найдена</p>
        <button 
          onClick={() => router.back()}
          className="mt-4 bg-black text-yellow-300 px-4 py-2 rounded-lg border-2 border-black"
        >
          Вернуться назад
        </button>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now(),
      text: newMessage.trim(),
      authorId: profile.id,
      authorName: profile.name,
      authorAvatar: profile.avatarUrl,
      timestamp: new Date(),
      isOwn: true,
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="mx-auto max-w-md min-h-screen bg-yellow-300 shadow-lg flex flex-col">
      {/* Хедер с информацией о карточке */}
      <header className="bg-white border-b-2 border-black p-4 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-yellow-100 transition-colors"
        >
          <ArrowLeft size={24} className="text-black" />
        </button>
        
        <div className="flex-1 min-w-0 pr-2">
          <h1 className="font-bold text-lg text-black truncate">{card.title}</h1>
          <p className="text-sm text-gray-600 line-clamp-2 leading-tight">{card.text}</p>
          <span className="inline-block mt-1 px-2 py-1 bg-yellow-300 rounded-full text-xs font-medium border border-black">
            {card.language}
          </span>
        </div>
        
        {/* Информация об авторе карточки */}
        <div className="flex items-center gap-2 flex-shrink-0">
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
      </header>

      {/* Область сообщений */}
      <main className="flex-1 overflow-y-auto p-4 pb-20">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.isOwn ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Аватар */}
              {message.authorAvatar ? (
                <Image
                  src={message.authorAvatar}
                  alt={message.authorName}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full border border-black object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm border border-black flex-shrink-0">
                  <User size={16} />
                </div>
              )}
              
              {/* Сообщение */}
              <div className={`max-w-[70%] ${message.isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                <div
                  className={`p-3 rounded-lg border-2 border-black ${
                    message.isOwn 
                      ? 'bg-black text-yellow-300' 
                      : 'bg-white text-black'
                  }`}
                >
                  <p className="break-words">{message.text}</p>
                </div>
                <div className="text-xs text-gray-600 mt-1 px-1">
                  {message.authorName} • {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Поле ввода сообщения */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t-2 border-black p-4">
        <div className="flex gap-2 items-end">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Напишите сообщение..."
            className="flex-1 border-2 border-black rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none min-h-[44px] max-h-[120px]"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`p-3 rounded-lg border-2 border-black transition-all ${
              newMessage.trim()
                ? 'bg-black text-yellow-300 hover:bg-gray-800' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}