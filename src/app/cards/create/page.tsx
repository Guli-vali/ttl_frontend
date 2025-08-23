// app/create-card/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CardForm from '@/components/CardForm';
import { useCardsStore } from '@/store/useCardsStore';
import { useProfileStore } from '@/store/useProfileStore';

export default function CreateCardPage() {
  const addCard = useCardsStore((state) => state.addCard);
  const profile = useProfileStore((state) => state.profile);
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('English');

  const handleAddCard = () => {
    if (!title.trim()) return;
    addCard({ title, text, language }, profile);
    router.push('/cards');
  };

  return (
    <div className="mx-auto max-w-md min-h-screen bg-yellow-300 shadow-lg flex flex-col">
      <header className="p-6 text-black text-left text-3xl font-bold">Создать карточку</header>
      <main className="flex-1 p-4">
        <CardForm
          title={title}
          text={text}
          language={language}
          onChangeTitle={setTitle}
          onChangeText={setText}
          onChangeLanguage={setLanguage}
          onSubmit={handleAddCard}
        />
      </main>
    </div>
  );
}