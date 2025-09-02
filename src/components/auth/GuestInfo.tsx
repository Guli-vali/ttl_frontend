'use client';

import { useState } from 'react';
import { UserPlus, Clock, AlertTriangle } from 'lucide-react';
import { isGuestUser, isGuestExpired } from '@/lib/utils/guestUtils';
import { useGuestSession } from '@/hooks/useGuestSession';
import SessionTimer from '@/components/ui/SessionTimer';
import type { UserRecord } from '@/lib/pocketbase';
import type { GuestUpgradeData } from '@/types/profile';

interface GuestInfoProps {
  user: UserRecord;
  onUserUpdate?: (user: UserRecord) => void;
}

export default function GuestInfo({ user, onUserUpdate }: GuestInfoProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeData, setUpgradeData] = useState<GuestUpgradeData>({
    email: '',
    password: '',
    passwordConfirm: '',
    name: user.name || ''
  });
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { timeLeft, upgradeGuest } = useGuestSession();

  // Проверяем, является ли пользователь гостем
  if (!isGuestUser(user)) {
    return null;
  }

  // Проверяем, не истек ли срок действия
  const expired = isGuestExpired(user);

  const handleUpgradeGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Валидация
    if (upgradeData.password !== upgradeData.passwordConfirm) {
      setError('Пароли не совпадают');
      return;
    }

    if (upgradeData.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setIsUpgrading(true);
    try {
      await upgradeGuest(upgradeData);
      setShowUpgradeModal(false);
      setUpgradeData({ email: '', password: '', passwordConfirm: '', name: '' });
      onUserUpdate?.(user); // Обновляем пользователя в родительском компоненте
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Не удалось обновить аккаунт');
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleSessionExpired = () => {
    // Можно добавить логику для обработки истечения сессии
    console.log('Гостевой сессия истекла');
  };

  return (
    <>
      <div className={`p-4 rounded-lg border ${
        expired 
          ? 'bg-red-50 border-red-200 text-red-800' 
          : 'bg-yellow-50 border-yellow-200 text-yellow-800'
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {expired ? (
                <AlertTriangle size={16} className="text-red-600" />
              ) : (
                <Clock size={16} className="text-yellow-600" />
              )}
              <span className="font-medium text-sm">
                {expired ? 'Гостевой аккаунт истек' : 'Гостевой аккаунт'}
              </span>
            </div>
            
            <p className="text-sm mb-2">
              Вы вошли как: <span className="font-medium">{user.name}</span>
            </p>
            
            {!expired && (
              <div className="mb-2">
                <SessionTimer 
                  timeLeft={timeLeft} 
                  onExpired={handleSessionExpired}
                  showWarning={true}
                />
              </div>
            )}
            
            {expired && (
              <p className="text-xs opacity-75">
                Для продолжения работы создайте постоянный аккаунт
              </p>
            )}
          </div>
          
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            <UserPlus size={14} />
            {expired ? 'Создать аккаунт' : 'Апгрейд'}
          </button>
        </div>
      </div>

      {/* Модальное окно для обновления */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Создать постоянный аккаунт</h3>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleUpgradeGuest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Имя *</label>
                <input
                  type="text"
                  value={upgradeData.name}
                  onChange={(e) => setUpgradeData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  value={upgradeData.email}
                  onChange={(e) => setUpgradeData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Пароль *</label>
                <input
                  type="password"
                  value={upgradeData.password}
                  onChange={(e) => setUpgradeData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">Минимум 6 символов</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Подтвердите пароль *</label>
                <input
                  type="password"
                  value={upgradeData.passwordConfirm}
                  onChange={(e) => setUpgradeData(prev => ({ ...prev, passwordConfirm: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
                  required
                  minLength={6}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowUpgradeModal(false);
                    setError(null);
                    setUpgradeData({ email: '', password: '', passwordConfirm: '', name: user.name || '' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isUpgrading}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={isUpgrading || upgradeData.password !== upgradeData.passwordConfirm || upgradeData.password.length < 6}
                  className="flex-1 px-4 py-2 bg-yellow-300 text-black rounded-lg border-2 border-black hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isUpgrading ? 'Создание...' : 'Создать аккаунт'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
