// src/components/CardItem.tsx
import { X, Share2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card } from '@/types';
import { Profile } from '@/types';
import GuestAccountCreation from '@/components/ui/GuestAccountCreation';
import Notification from '@/components/ui/Notification';

interface CardItemProps {
  card: Card;
  currentUser: Profile | null;
  onDelete?: () => void;
}

export default function CardItem({ card, currentUser, onDelete }: CardItemProps) {
  const router = useRouter();
  const { author } = card;
  const [showGuestCreation, setShowGuestCreation] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  // Проверяем, принадлежит ли карточка текущему пользователю
  const isOwnCard = currentUser && author.id === currentUser.id;

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation when clicking delete button
    if ((e.target as HTMLElement).closest('button[aria-label="Delete"]')) {
      return;
    }

    // If user is not authenticated, show guest account creation
    if (!currentUser) {
      setShowGuestCreation(true);
      return;
    }

    // Otherwise navigate to card
    router.push(`/cards/${card.id}`);
  };

  const handleGuestCreationSuccess = () => {
    setShowGuestCreation(false);
    // Navigate to card after successful account creation
    router.push(`/cards/${card.id}`);
  };

  const handleGuestCreationError = (error: string) => {
    setShowGuestCreation(false);
    setNotification({
      message: error,
      type: 'error'
    });
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    try {
      const cardUrl = `${window.location.origin}/cards/${card.id}`;
      await navigator.clipboard.writeText(cardUrl);
      setNotification({
        message: 'Link copied to clipboard!',
        type: 'success'
      });
    } catch {
      setNotification({
        message: 'Failed to copy link',
        type: 'error'
      });
    }
  };

  return (
    <>
      <div 
        className="bg-white p-4 rounded-2xl shadow relative border border-gray-200 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
        onClick={handleCardClick}
      >
        {/* Action buttons */}
        <div className="absolute top-2 right-2 flex gap-1 z-10">
          {/* Share button */}
        {isOwnCard && ( 
          <button
            onClick={handleShare}
            className="p-1 rounded-full border-2 border-black bg-yellow-300 hover:bg-yellow-200 transition-colors"
            aria-label="Share"
          >
            <Share2 size={18} className="text-black" />
          </button>)}
          
          {/* Delete button — only for user's cards */}
          {isOwnCard && onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling
                onDelete();
              }}
              className="p-1 rounded-full border-2 border-black bg-yellow-300 hover:bg-yellow-200 transition-colors"
              aria-label="Delete"
            >
              <X size={18} className="text-black" />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <div className="font-bold text-lg">{card.title}</div>
            <div className="text-gray-800">{card.text}</div>
            <div className="text-xs text-gray-500 mt-1">Language: {card.language}</div>
          </div>

          {/* Author information */}
          <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
            {author.avatarUrl ? (
              <Image
                src={author.avatarUrl}
                alt={author.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full border border-black object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm border border-black">
                {author.name[0]}
              </div>
            )}
            <div className="text-sm">
              <div className="font-medium text-black">{author.name}</div>
              <div className="text-gray-600 text-xs">
                {author.nativeLanguages && author.nativeLanguages.length > 0 ? (
                  author.nativeLanguages.length <= 3 ? (
                    `Languages: ${author.nativeLanguages.join(', ')}`
                  ) : (
                    `Languages: ${author.nativeLanguages.slice(0, 2).join(', ')} +${author.nativeLanguages.length - 2}`
                  )
                ) : (
                  'Languages not specified'
                )}
              </div>
            </div>
          </div>
          
          {/* Indicator that card is clickable */}
          <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-100">
            {currentUser ? 'Click to join the discussion' : 'Click to create account and join'}
          </div>
        </div>
      </div>

      {/* Guest account creation modal */}
      {showGuestCreation && (
        <GuestAccountCreation
          onSuccess={handleGuestCreationSuccess}
          onError={handleGuestCreationError}
        />
      )}

      {/* Notifications */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleCloseNotification}
        />
      )}
    </>
  );
}