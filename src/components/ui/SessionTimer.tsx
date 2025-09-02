'use client';

import { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface SessionTimerProps {
  timeLeft: number; // в миллисекундах
  onExpired?: () => void;
  showWarning?: boolean;
}

export default function SessionTimer({ 
  timeLeft, 
  onExpired, 
  showWarning = true 
}: SessionTimerProps) {
  const [displayTime, setDisplayTime] = useState('');

  useEffect(() => {
    const updateDisplay = () => {
      if (timeLeft <= 0) {
        setDisplayTime('Истекла');
        onExpired?.();
        return;
      }

      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      if (hours > 0) {
        setDisplayTime(`${hours}ч ${minutes}м`);
      } else if (minutes > 0) {
        setDisplayTime(`${minutes}м ${seconds}с`);
      } else {
        setDisplayTime(`${seconds}с`);
      }
    };

    updateDisplay();
    const interval = setInterval(updateDisplay, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onExpired]);

  // Определяем цвет в зависимости от оставшегося времени
  const getColorClass = () => {
    if (timeLeft <= 0) return 'text-red-600';
    if (timeLeft <= 30 * 60 * 1000) return 'text-red-500'; // 30 минут
    if (timeLeft <= 60 * 60 * 1000) return 'text-yellow-600'; // 1 час
    return 'text-gray-600';
  };

  // Определяем иконку
  const getIcon = () => {
    if (timeLeft <= 0) return <AlertTriangle size={14} className="text-red-600" />;
    if (timeLeft <= 30 * 60 * 1000) return <AlertTriangle size={14} className="text-red-500" />;
    return <Clock size={14} className="text-gray-600" />;
  };

  // Показываем предупреждение только если включено и время истекает
  const shouldShowWarning = showWarning && timeLeft <= 60 * 60 * 1000 && timeLeft > 0;

  return (
    <div className={`flex items-center gap-1 text-xs ${getColorClass()}`}>
      {getIcon()}
      <span className="font-medium">{displayTime}</span>
      
      {shouldShowWarning && (
        <span className="text-xs opacity-75">
          {timeLeft <= 30 * 60 * 1000 ? ' - Создайте аккаунт!' : ' - Сессия истекает'}
        </span>
      )}
    </div>
  );
}
