// src/components/CardItem.tsx
import { X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card } from '@/types';
import { Profile } from '@/types';

interface CardItemProps {
  card: Card;
  currentUser: Profile | null;
  onDelete?: () => void;
}

export default function CardItem({ card, currentUser, onDelete }: CardItemProps) {
  const router = useRouter();
  const { author } = card;

  // Проверяем, принадлежит ли карточка текущему пользователю
  const isOwnCard = currentUser && author.id === currentUser.id;

  const handleCardClick = (e: React.MouseEvent) => {
    // Предотвращаем навигацию при клике на кнопку удаления
    if ((e.target as HTMLElement).closest('button[aria-label="Удалить"]')) {
      return;
    }
    router.push(`/cards/${card.id}`);
  };

  return (
    <div 
      className="bg-white p-4 rounded-2xl shadow relative border border-gray-200 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
      onClick={handleCardClick}
    >
      {/* Кнопка удаления — только для карточек пользователя */}
      {isOwnCard && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Предотвращаем всплытие события
            onDelete();
          }}
          className="absolute top-2 right-2 p-1 rounded-full border-2 border-black bg-yellow-300 hover:bg-yellow-200 transition-colors z-10"
          aria-label="Удалить"
        >
          <X size={18} className="text-black" />
        </button>
      )}

      <div className="flex flex-col gap-3">
        <div>
          <div className="font-bold text-lg">{card.title}</div>
          <div className="text-gray-800">{card.text}</div>
          <div className="text-xs text-gray-500 mt-1">Язык: {card.language}</div>
        </div>

        {/* Информация об авторе */}
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
                  `Языки: ${author.nativeLanguages.join(', ')}`
                ) : (
                  `Языки: ${author.nativeLanguages.slice(0, 2).join(', ')} +${author.nativeLanguages.length - 2}`
                )
              ) : (
                'Языки не указаны'
              )}
            </div>
          </div>
        </div>
        
        {/* Индикатор того, что карточка кликабельна */}
        <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-100">
          Нажмите, чтобы присоединиться к обсуждению
        </div>
      </div>
    </div>
  );
}