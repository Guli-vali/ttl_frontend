'use client';

import { useState } from 'react';
import CardItem from '@/components/CardItem';
import { useCardsStore } from '@/store/useCardsStore';



export default function HomePage() {
  const cards = useCardsStore((state) => state.cards);
  const removeCard = useCardsStore((state) => state.removeCard);


  const [filterLanguage, setFilterLanguage] = useState<string>('');


  const filteredCards = cards.filter((card) =>
    filterLanguage ? card.language === filterLanguage : true
  );

  const uniqueLanguages = Array.from(new Set(cards.map((card) => card.language)));

  return (
    <div className="mx-auto max-w-md min-h-screen bg-yellow-300 shadow-lg flex flex-col">
      {/* Хедер */}
      <header className="p-6 text-black text-left text-3xl font-bold">Карточки</header>

      {/* Контент */}
      <main className="flex-1 overflow-y-auto p-4">
        {/* Фильтр по языкам */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setFilterLanguage('')}
            className={`px-3 py-1 rounded-full border-2 border-black text-sm font-medium ${
              filterLanguage === '' ? 'bg-black text-yellow-300' : 'bg-yellow-300 text-black hover:bg-yellow-200'
            } transition-colors`}
          >
            Все языки
          </button>
          {uniqueLanguages.map((lang) => (
            <button
              key={lang}
              onClick={() => setFilterLanguage(lang)}
              className={`px-3 py-1 rounded-full border-2 border-black text-sm font-medium ${
                filterLanguage === lang ? 'bg-black text-yellow-300' : 'bg-yellow-300 text-black hover:bg-yellow-200'
              } transition-colors`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Фид карточек */}
        <div className="flex flex-col-reverse space-y-reverse space-y-4 pb-16">
          {filteredCards.map((card) => (
            <CardItem key={card.id} card={card} onDelete={() => removeCard(card.id)} />
          ))}
        </div>
      </main>
    </div>
  );
}