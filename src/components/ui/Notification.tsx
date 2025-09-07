'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
}

export default function Notification({ 
  message, 
  type, 
  duration = 5000, 
  onClose 
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300); // Ждем анимацию исчезновения
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-200',
      iconColor: 'text-green-500'
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-200',
      iconColor: 'text-red-500'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-500'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 max-w-sm w-full mx-4 z-50 transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
    }`}>
      <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 shadow-lg`}>
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 mt-0.5 ${config.iconColor}`} />
          <div className="flex-1">
            <p className={`text-sm font-medium ${config.textColor}`}>
              {message}
            </p>
          </div>
          <button
            onClick={handleClose}
            className={`${config.textColor} hover:opacity-70 transition-opacity`}
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
