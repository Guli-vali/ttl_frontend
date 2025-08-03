import React from 'react';

interface CardProps {
  card: {
    id: number;
    title: string;
    text: string;
    language: string;
  };
}

const CardItem: React.FC<CardProps> = ({ card }) => (
  <div className="p-4 bg-gray-100 rounded shadow">
    <h2 className="text-xl font-semibold">{card.title}</h2>
    <p>{card.text}</p>
    <p className="text-sm text-gray-500 mt-1">Язык: {card.language}</p>
  </div>
);

export default CardItem;
