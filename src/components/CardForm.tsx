import React from 'react';

interface CardFormProps {
  title: string;
  text: string;
  language: string;
  onChangeTitle: (value: string) => void;
  onChangeText: (value: string) => void;
  onChangeLanguage: (value: string) => void;
  onSubmit: () => void;
}

const CardForm: React.FC<CardFormProps> = ({
  title,
  text,
  language,
  onChangeTitle,
  onChangeText,
  onChangeLanguage,
  onSubmit
}) => {
  return (
    <div className="p-4 bg-yellow-300 shadow rounded-lg mb-4 border-2 border-black">
      <input
        className="w-full border-2 border-black rounded-lg p-2 mb-3 bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        placeholder="Название темы"
        value={title}
        onChange={(e) => onChangeTitle(e.target.value)}
      />
      <textarea
        className="w-full border-2 border-black rounded-lg p-2 mb-3 bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        placeholder="Описание"
        value={text}
        onChange={(e) => onChangeText(e.target.value)}
        rows={4}
      />
      <select
        className="w-full border-2 border-black rounded-lg p-2 mb-3 bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        value={language}
        onChange={(e) => onChangeLanguage(e.target.value)}
      >
        <option value="English">English</option>
        <option value="Русский">Русский</option>
        <option value="Deutsch">Deutsch</option>
        <option value="Spanish">Spanish</option>
      </select>
      <button
        className="bg-black text-yellow-300 px-4 py-3 rounded-lg hover:bg-gray-800 w-full font-bold border-2 border-black transition-colors"
        onClick={onSubmit}
      >
        Добавить карточку
      </button>
    </div>
  );
};

export default CardForm;