'use client';

import { useEffect, useCallback, useRef, useState, useMemo } from 'react';
import CardItem from '@/components/cards/CardItem';
import LanguageFilter from '@/components/LanguageFilter';
import { useCardsStore } from '@/store/useCardsStore';
import { useProfileStore } from '@/store/useProfileStore';

export default function CardsPage() {
  const { cards, loadCards, isLoading, error, isInitialized, clearError } = useCardsStore();
  const currentUser = useProfileStore((state) => state.profile);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('all');

  // Получаем уникальные языки из карточек
  const availableLanguages = useMemo(() => {
    const languages = [...new Set(cards.map(card => card.language))];
    return languages.sort();
  }, [cards]);

  // Фильтруем карточки по выбранному языку
  const filteredCards = useMemo(() => {
    if (selectedLanguage === 'all') {
      return cards;
    }
    return cards.filter(card => card.language === selectedLanguage);
  }, [cards, selectedLanguage]);

  const handleLoadCards = useCallback(async () => {
    // Отменяем предыдущий таймаут
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }

    // Добавляем небольшую задержку для предотвращения быстрых запросов
    loadTimeoutRef.current = setTimeout(async () => {
      clearError();
      await loadCards(true);
    }, 300);
  }, [loadCards, clearError]);

  useEffect(() => {
    // Загружаем карточки при первом рендере
    if (!isInitialized) {
      handleLoadCards();
    }
  }, [isInitialized, handleLoadCards]);

  // Очищаем таймаут при размонтировании
  useEffect(() => {
    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, []);

  if (isLoading && !isInitialized) {
    return (
      <div className="mx-auto max-w-md min-h-screen bg-yellow-300 shadow-lg flex flex-col items-center justify-center">
        <div className="text-black text-xl font-bold">Загрузка карточек...</div>
      </div>
    );
  }

  if (error && !isInitialized) {
    return (
      <div className="mx-auto max-w-md min-h-screen bg-yellow-300 shadow-lg flex flex-col items-center justify-center p-4">
        <div className="text-red-600 text-center">
          <p className="text-lg font-bold mb-2">Ошибка загрузки</p>
          <p className="text-sm mb-4">{error}</p>
          <button 
            onClick={handleLoadCards}
            className="bg-black text-yellow-300 px-4 py-2 rounded-lg border-2 border-black hover:bg-gray-800 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md min-h-screen bg-yellow-300 shadow-lg flex flex-col">
      <header className="p-6 text-black text-left text-3xl font-bold">
        Карточки
      </header>
      
      <main className="flex-1 p-4 space-y-4 pb-20">
        {/* Фильтр по языкам */}
        <div className="mb-4">
          <LanguageFilter
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            availableLanguages={availableLanguages}
          />
        </div>

        {isLoading && (
          <div className="text-center py-4">
            <div className="text-black text-sm">Обновление...</div>
          </div>
        )}

        {filteredCards.length === 0 && !isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">
              {selectedLanguage === 'all' 
                ? 'Карточки не найдены' 
                : `Карточки на языке "${selectedLanguage}" не найдены`
              }
            </p>
          </div>
        ) : (
          filteredCards.map((card) => (
            <CardItem 
              key={card.id} 
              card={card}
              currentUser={currentUser}
              onDelete={() => useCardsStore.getState().deleteCard(card.id)}
            />
          ))
        )}
      </main>
    </div>
  );
}