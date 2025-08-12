import { X } from 'lucide-react'; // Добавьте импорт иконки
import { Card } from '../types/card';


interface CardItemProps {
  card: Card;
  onDelete?: () => void;
}

export default function CardItem({ card, onDelete }: CardItemProps) {
  return (
    <div className="bg-white p-4 rounded shadow flex justify-between items-center">
      <div>
        <div className="font-bold">{card.title}</div>
        <div>{card.text}</div>
        <div className="text-xs text-gray-500">{card.language}</div>
      </div>
      {onDelete && (
        <button
          onClick={onDelete}
          className="ml-2 p-1 rounded-full border-2 border-black bg-yellow-300 hover:bg-yellow-200 transition-colors flex items-center justify-center"
          aria-label="Удалить"
        >
          <X size={18} className="text-black" />
        </button>
      )}
    </div>
  );
}