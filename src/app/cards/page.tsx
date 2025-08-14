'use client';

import { useState } from 'react';
import CardItem from '@/components/CardItem';
import CardForm from '@/components/CardForm';
import BottomNav from '@/components/BottomNav';
import { useCards } from '@/hooks/useCards';


export default function HomePage() {
  const { cards, addCard, deleteCard } = useCards([
    { id: 1, title: 'Карточка 1', text: 'Содержимое карточки 1', language: 'English' },
    { id: 2, title: 'Карточка 2', text: 'Содержимое карточки 2', language: 'Русский' },
    { id: 3, title: 'Карточка 3', text: 'Содержимое карточки 3', language: 'Deutsch' },
    { id: 4, title: 'Карточка 4', text: 'Содержимое карточки 4', language: 'Русский' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [language, setLanguage] = useState<string>('English');
  const [filterLanguage, setFilterLanguage] = useState<string>('');

  const handleAddCard = () => {
    if (!title.trim()) return;
    addCard({ title, text, language });
    setTitle('');
    setText('');
    setLanguage('English');
    setShowForm(false);
  };

  const handleDeleteCard = (id: number) => {
    deleteCard(id);
  };

  const filteredCards = cards.filter((card) =>
    filterLanguage ? card.language === filterLanguage : true
  );

  const uniqueLanguages = Array.from(new Set(cards.map((card) => card.language)));

  return (
    <div className="mx-auto max-w-md min-h-screen bg-yellow-300 shadow-lg flex flex-col">
      {/* Хедер */}
      <header className="p-6 text-black text-left text-3xl font-bold">Activities</header>

      {/* Контент */}
      <main className="flex-1 overflow-y-auto p-4">
        {/* Форма создания карточки */}
        {showForm && (
          <CardForm
            title={title}
            text={text}
            language={language}
            onChangeTitle={setTitle}
            onChangeText={setText}
            onChangeLanguage={setLanguage}
            onSubmit={handleAddCard}
          />
        )}

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
            <CardItem key={card.id} card={card} onDelete={() => handleDeleteCard(card.id)} />
          ))}
        </div>
      </main>
    </div>
  );
}