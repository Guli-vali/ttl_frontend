// src/app/profile/page.tsx
'use client';

import Image from 'next/image';
import { LogOut, MapPin, Globe, Heart, Edit } from 'lucide-react';
import { useProfileStore } from '@/store/useProfileStore';

export default function ProfilePage() {
  const { profile, logout } = useProfileStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="mx-auto max-w-md min-h-screen bg-yellow-300 shadow-lg flex flex-col">
      <header className="p-6 text-black text-left text-3xl font-bold flex items-center justify-between">
        <span>Профиль</span>
        <button
          onClick={handleLogout}
          className="p-2 bg-white rounded-full border-2 border-black hover:bg-gray-100 transition-colors"
          title="Выйти"
        >
          <LogOut size={20} className="text-black" />
        </button>
      </header>
      
      <main className="flex-1 p-4 space-y-4 pb-20">
        {/* Основная информация */}
        <div className="bg-white rounded-lg p-6 shadow border-2 border-black">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              {profile.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={profile.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full border-2 border-black object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl border-2 border-black">
                  {profile.name[0]}
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-black">{profile.name}</h2>
                {profile.age && (
                  <p className="text-gray-600">{profile.age} лет</p>
                )}
                <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
                  <MapPin size={14} />
                  <span>{profile.country}{profile.city ? `, ${profile.city}` : ''}</span>
                </div>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Edit size={16} className="text-gray-500" />
            </button>
          </div>
          
          {profile.bio && (
            <p className="text-gray-700 mb-4">{profile.bio}</p>
          )}
        </div>

        {/* Языки */}
        <div className="bg-white rounded-lg p-4 shadow border-2 border-black">
          <div className="mb-4">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <Globe size={20} className="text-black" />
              Владею языками
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.nativeLanguages.map((language) => (
                <span
                  key={language}
                  className="px-3 py-1 bg-black text-yellow-300 rounded-full text-sm font-medium border-2 border-black"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <Heart size={20} className="text-black" />
              Изучаю языки
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.learningLanguages.map((language) => (
                <span
                  key={language}
                  className="px-3 py-1 bg-yellow-300 text-black rounded-full text-sm font-medium border-2 border-black"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Интересы */}
        {profile.interests.length > 0 && (
          <div className="bg-white rounded-lg p-4 shadow border-2 border-black">
            <h3 className="font-bold text-lg mb-3">Интересы</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 bg-gray-100 text-black rounded-full text-sm border border-gray-300"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Статистика */}
        <div className="bg-white rounded-lg p-4 shadow border-2 border-black">
          <h3 className="font-bold text-lg mb-3">Активность</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-black">12</div>
              <div className="text-sm text-gray-600">Карточек создано</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-black">248</div>
              <div className="text-sm text-gray-600">Сообщений отправлено</div>
            </div>
          </div>
        </div>

        {/* Настройки */}
        <div className="bg-white rounded-lg p-4 shadow border-2 border-black">
          <h3 className="font-bold text-lg mb-3">Настройки</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
              Редактировать профиль
            </button>
            <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
              Настройки уведомлений
            </button>
            <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
              Конфиденциальность
            </button>
            <button 
              onClick={handleLogout}
              className="w-full text-left p-3 hover:bg-red-50 rounded-lg transition-colors border border-red-200 text-red-600"
            >
              Выйти из аккаунта
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}