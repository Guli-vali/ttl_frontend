'use client';

import { useEffect, useCallback, useRef, useState, useMemo } from 'react';
import CardItem from '@/components/cards/CardItem';
import LanguageFilter from '@/components/LanguageFilter';
import { useCardsStore } from '@/store/useCardsStore';
import { useProfileStore } from '@/store/useProfileStore';

export default function CardsPage() {
  const { cards, loadCards, deleteCard, isLoading, error, isInitialized, clearError } = useCardsStore();
  const currentUser = useProfileStore((state) => state.profile);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('all');

  // Get unique languages from cards
  const availableLanguages = useMemo(() => {
    const languages = [...new Set(cards.map(card => card.language))];
    return languages.sort();
  }, [cards]);

  // Filter cards by selected language
  const filteredCards = useMemo(() => {
    if (selectedLanguage === 'all') {
      return cards;
    }
    return cards.filter(card => card.language === selectedLanguage);
  }, [cards, selectedLanguage]);

  const handleLoadCards = useCallback(async () => {
    // Cancel previous timeout
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }

    // Add small delay to prevent rapid requests
    loadTimeoutRef.current = setTimeout(async () => {
      clearError();
      await loadCards(true);
    }, 300);
  }, [loadCards, clearError]);

  useEffect(() => {
    // Load cards on first render
    if (!isInitialized) {
      handleLoadCards();
    }
  }, [isInitialized, handleLoadCards]);

  // Clear timeout on unmount
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
        <div className="text-black text-xl font-bold">Loading cards...</div>
      </div>
    );
  }

  if (error && !isInitialized) {
    return (
      <div className="mx-auto max-w-md min-h-screen bg-yellow-300 shadow-lg flex flex-col items-center justify-center p-4">
        <div className="text-red-600 text-center">
          <p className="text-lg font-bold mb-2">Loading Error</p>
          <p className="text-sm mb-4">{error}</p>
          <button 
            onClick={handleLoadCards}
            className="bg-black text-yellow-300 px-4 py-2 rounded-lg border-2 border-black hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md min-h-screen bg-yellow-300 shadow-lg flex flex-col">
      <header className="p-6 text-black text-left text-3xl font-bold">
        Cards
      </header>
      
      <main className="flex-1 p-4 space-y-4 pb-20">
        {/* Language filter */}
        <div className="mb-4">
          <LanguageFilter
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            availableLanguages={availableLanguages}
          />
        </div>

        {isLoading && (
          <div className="text-center py-4">
            <div className="text-black text-sm">Updating...</div>
          </div>
        )}

        {filteredCards.length === 0 && !isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">
              {selectedLanguage === 'all' 
                ? 'No cards found' 
                : `No cards found in "${selectedLanguage}" language`
              }
            </p>
          </div>
        ) : (
          filteredCards.map((card) => (
            <CardItem 
              key={card.id} 
              card={card}
              currentUser={currentUser}
              onDelete={() => deleteCard(card.id)}
            />
          ))
        )}
      </main>
    </div>
  );
}