// components/CardItem.tsx
import { X } from 'lucide-react';
import Image from 'next/image';
import { Card } from '@/types/card';

interface CardItemProps {
  card: Card;
  onDelete?: () => void;
}

export default function CardItem({ card, onDelete }: CardItemProps) {
  const { author } = card;

  return (
    <div className="bg-white p-4 rounded-2xl shadow relative border border-gray-200">
      {/* Кнопка удаления — в правом верхнем углу */}
      {onDelete && (
        <button
          onClick={onDelete}
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
            <div className="text-gray-600">Язык: {author.language}</div>
          </div>
        </div>
      </div>
    </div>
  );
}