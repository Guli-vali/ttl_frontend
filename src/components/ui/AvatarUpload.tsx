'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Camera, X, User } from 'lucide-react';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  onAvatarChange: (file: File | null) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarUpload({ 
  currentAvatarUrl, 
  onAvatarChange, 
  className = "",
  size = 'md' 
}: AvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Очищаем previewUrl при изменении currentAvatarUrl
  useEffect(() => {
    if (currentAvatarUrl) {
      setPreviewUrl(null);
    }
  }, [currentAvatarUrl]);

  // Очищаем URL при размонтировании компонента
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const iconSizes = {
    sm: 20,
    md: 24,
    lg: 32
  };

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onAvatarChange(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleRemoveAvatar = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onAvatarChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayUrl = previewUrl || currentAvatarUrl;

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          ${sizeClasses[size]} 
          relative 
          rounded-full 
          border-2 
          border-black 
          bg-white 
          overflow-hidden 
          cursor-pointer
          transition-all 
          duration-200
          ${isDragOver ? 'border-yellow-400 bg-yellow-50' : ''}
          ${displayUrl ? '' : 'hover:bg-gray-50'}
        `}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {displayUrl ? (
          <Image
            src={displayUrl}
            alt="Аватар"
            fill
            className="object-cover"
            unoptimized // Добавляем для локальных URL
            onError={() => {
              // При ошибке загрузки изображения очищаем URL
              if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User size={iconSizes[size]} className="text-gray-400" />
          </div>
        )}

        {/* Overlay для загрузки - показываем только когда нет изображения */}
        {!displayUrl && (
          <div className="absolute inset-0 bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center pointer-events-none">
            <Camera size={iconSizes[size] * 0.6} className="text-white opacity-0 hover:opacity-100 transition-opacity" />
          </div>
        )}

        {/* Кнопка удаления */}
        {displayUrl && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveAvatar();
            }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X size={12} />
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
}
