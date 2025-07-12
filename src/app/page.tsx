'use client';

import { useState } from 'react';
import { PlusCircle } from "lucide-react";

export default function HomePage() {
  const [cards, setCards] = useState([
      { id: 1, title: 'Карточка 1', text: 'Содержимое карточки 1' },
      { id: 2, title: 'Карточка 2', text: 'Содержимое карточки 2' },
      { id: 3, title: 'Карточка 3', text: 'Содержимое карточки 3' },
      { id: 4, title: 'Карточка 4', text: 'Содержимое карточки 4' },
      { id: 5, title: 'Карточка 5', text: 'Содержимое карточки 5' },
      { id: 6, title: 'Карточка 6', text: 'Содержимое карточки 6' },
      { id: 7, title: 'Карточка 7', text: 'Содержимое карточки 7' },
      { id: 8, title: 'Карточка 8', text: 'Содержимое карточки 8' },
    // Добавьте больше карточек по мере необходимости
  ]);

    const addCard = () => {
        const newId = cards.length + 1;
        const newCard = {
          id: newId,
          title: `Карточка ${newId}`,
          text: `Содержимое карточки ${newId}`
        };
        setCards(cards => [...cards, newCard]);
    };
  return (
    <div className="mx-auto max-w-md min-h-screen bg-yellow-300 shadow-lg flex flex-col">
      {/* Хедер */}
      <header className="p-6 text-black text-left text-3xl font-bold">
        Activities
      </header>

      {/* Контент */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col-reverse space-y-reverse space-y-4 pb-16">
          {cards.map((card) => (
            <div key={card.id} className="p-4 bg-gray-100 rounded shadow">
              <h2 className="text-xl font-semibold">{card.title}</h2>
              <p>{card.text}</p>
            </div>
          ))}
        </div>
      </main>
      {/* Нижнее таб-меню */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50">
        <button 
        onClick={addCard}
        className="flex flex-col items-center text-gray-700 hover:text-blue-600">
          <PlusCircle size={42} />
          <span className="text-xs">Добавить</span>
        </button>
      </nav>
    </div>
  );
}