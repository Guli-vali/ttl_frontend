// src/app/profile/page.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';
import { LogOut, MapPin, Globe, Heart, Edit, Save, X } from 'lucide-react';
import { useProfileStore } from '@/store/useProfileStore';
import { AvatarUpload } from '@/components/ui/AvatarUpload';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function ProfilePage() {
  const { profile, logout, updateProfile, isLoading, error } = useProfileStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: profile?.name || '',
    bio: profile?.bio || '',
    age: profile?.age?.toString() || '',
    country: profile?.country || '',
    city: profile?.city || '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const handleSave = async () => {
    if (!profile) return;

    setIsUpdating(true);
    try {
      const updateData: any = {
        name: editData.name,
        bio: editData.bio,
        country: editData.country,
        city: editData.city,
      };

      if (editData.age) {
        updateData.age = parseInt(editData.age);
      }

      if (avatarFile) {
        updateData.avatar = avatarFile;
      }

      const success = await updateProfile(updateData);
      if (success) {
        setIsEditing(false);
        setAvatarFile(null);
      }
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      name: profile?.name || '',
      bio: profile?.bio || '',
      age: profile?.age?.toString() || '',
      country: profile?.country || '',
      city: profile?.city || '',
    });
    setAvatarFile(null);
    setIsEditing(false);
  };

  // Показываем загрузку
  if (isLoading) {
    return <LoadingSpinner message="Загрузка профиля..." />;
  }

  // Показываем ошибку
  if (error) {
    return (
      <div className="mx-auto max-w-md min-h-screen bg-yellow-300 shadow-lg flex flex-col items-center justify-center p-4">
        <div className="text-red-600 text-center">
          <p className="text-lg font-bold mb-2">Ошибка загрузки профиля</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Проверяем наличие профиля
  if (!profile) {
    return <LoadingSpinner message="Профиль не найден" />;
  }

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
          {isEditing ? (
            // В режиме редактирования - аватарка сверху по центру, поля под ней
            <div className="mb-4">
              <div className="flex justify-center mb-4">
                <AvatarUpload
                  currentAvatarUrl={profile.avatarUrl}
                  onAvatarChange={setAvatarFile}
                  size="lg"
                />
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  placeholder="Имя"
                  className="w-full p-3 border border-gray-300 rounded text-lg font-bold"
                />
                <input
                  type="number"
                  value={editData.age}
                  onChange={(e) => setEditData({ ...editData, age: e.target.value })}
                  placeholder="Возраст"
                  className="w-full p-3 border border-gray-300 rounded text-lg"
                />
              </div>
            </div>
          ) : (
            // В обычном режиме - аватарка слева, информация справа
            <div className="flex items-center gap-4 mb-4">
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
              
              <div className="flex-1">
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
          )}

          {/* Кнопки редактирования/сохранения */}
          <div className="flex justify-end gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isUpdating}
                  className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors disabled:opacity-50"
                  title="Сохранить"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isUpdating}
                  className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors disabled:opacity-50"
                  title="Отменить"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 bg-white rounded-full border-2 border-black hover:bg-gray-100 transition-colors"
                title="Редактировать"
              >
                <Edit size={16} className="text-black" />
              </button>
            )}
          </div>

          {/* Био */}
          {isEditing ? (
            <textarea
              value={editData.bio}
              onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
              placeholder="Расскажите о себе..."
              className="w-full p-3 border border-gray-300 rounded resize-none mt-4"
              rows={3}
            />
          ) : (
            profile.bio && (
              <p className="text-gray-700 mb-4 mt-4">{profile.bio}</p>
            )
          )}

          {/* Местоположение */}
          {isEditing && (
            <div className="space-y-2 mt-4">
              <input
                type="text"
                value={editData.country}
                onChange={(e) => setEditData({ ...editData, country: e.target.value })}
                placeholder="Страна"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                value={editData.city}
                onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                placeholder="Город"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
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
              {profile.nativeLanguages && profile.nativeLanguages.length > 0 ? (
                profile.nativeLanguages.map((language) => (
                  <span
                    key={language}
                    className="px-3 py-1 bg-black text-yellow-300 rounded-full text-sm font-medium border-2 border-black"
                  >
                    {language}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Не указаны</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <Heart size={20} className="text-black" />
              Изучаю языки
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.learningLanguages && profile.learningLanguages.length > 0 ? (
                profile.learningLanguages.map((language) => (
                  <span
                    key={language}
                    className="px-3 py-1 bg-yellow-300 text-black rounded-full text-sm font-medium border-2 border-black"
                  >
                    {language}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Не указаны</p>
              )}
            </div>
          </div>
        </div>

        {/* Интересы */}
        {profile.interests && profile.interests.length > 0 && (
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