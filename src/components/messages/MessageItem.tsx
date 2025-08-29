import { User, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Message } from '@/store/useMessagesStore';
import { useProfileStore } from '@/store/useProfileStore';

interface MessageItemProps {
  message: Message;
  onDelete?: () => void;
}

export default function MessageItem({ message, onDelete }: MessageItemProps) {
  const currentUser = useProfileStore((state) => state.profile);
  const isOwnMessage = currentUser && message.author.id === currentUser.id;

  return (
    <div className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Аватар */}
      {message.author.avatarUrl ? (
        <Image
          src={message.author.avatarUrl}
          alt={message.author.name}
          width={32}
          height={32}
          className="w-8 h-8 rounded-full border border-black object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm border border-black flex-shrink-0">
          <User size={16} />
        </div>
      )}
      
      {/* Сообщение */}
      <div className={`max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-gray-600 font-medium">
            {message.author.name}
          </span>
          {isOwnMessage && onDelete && (
            <button
              onClick={onDelete}
              className="p-1 hover:bg-red-100 rounded transition-colors"
              aria-label="Удалить сообщение"
            >
              <Trash2 size={12} className="text-red-500" />
            </button>
          )}
        </div>
        
        <div
          className={`p-3 rounded-lg border-2 border-black ${
            isOwnMessage 
              ? 'bg-yellow-300 text-black' 
              : 'bg-white text-black'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
        </div>
        
        <span className="text-xs text-gray-500 mt-1">
          {new Date(message.created).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
    </div>
  );
}
