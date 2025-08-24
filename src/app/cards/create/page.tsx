// app/create-card/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useCardsStore } from '@/store/useCardsStore';

const LANGUAGES = [
  'Русский', 'English', 'Español', 'Français', 'Deutsch', 'Italiano',
  '中文', '日本語', '한국어', 'العربية', 'Português', 'Nederlands',
  'Svenska', 'Polski', 'Türkçe', 'हिन्दी'
];

export default function CreateCardPage() {
  const router = useRouter();
  const { createCard, isLoading, error } = useCardsStore();

  const [formData, setFormData] = useState({
    title: '',
    text: '',
    language: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Введите заголовок';
    if (!formData.text.trim()) newErrors.text = 'Введите текст';
    if (!formData.language) newErrors.language = 'Выберите язык';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const success = await createCard(formData);
    if (success) {
      router.push('/cards');
    }
  };

  return (
    <div className="mx-auto max-w-md min-h-screen bg-yellow-300 shadow-lg flex flex-col">
      <header className="p-6 text-black text-left text-3xl font-bold flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-yellow-200 transition-colors"
        >
          <ArrowLeft size={24} className="text-black" />
        </button>
        <span>Создать карточку</span>
      </header>
      
      <main className="flex-1 p-4 space-y-4 pb-20">
        <div className="bg-white rounded-lg p-6 shadow border-2 border-black">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Заголовок
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full border-2 border-black rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Введите заголовок карточки"
              />
              {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Текст
              </label>
              <textarea
                value={formData.text}
                onChange={(e) => setFormData({...formData, text: e.target.value})}
                className="w-full border-2 border-black rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-black"
                rows={4}
                placeholder="Введите текст карточки"
              />
              {errors.text && <p className="text-red-600 text-sm mt-1">{errors.text}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Язык
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({...formData, language: e.target.value})}
                className="w-full border-2 border-black rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Выберите язык</option>
                {LANGUAGES.map(language => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
              {errors.language && <p className="text-red-600 text-sm mt-1">{errors.language}</p>}
            </div>
          </div>

          {/* Ошибка */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-black text-yellow-300 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors border-2 border-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Создание...' : 'Создать карточку'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}