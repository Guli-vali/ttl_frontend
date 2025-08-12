import { useState } from 'react';
import { Card } from '@/types/card';

export function useCards(initialCards: Card[] = []) {
  const [cards, setCards] = useState<Card[]>(initialCards);

  const addCard = (card: Omit<Card, 'id'>) => {
    const newCard: Card = {
      ...card,
      id: cards.length ? Math.max(...cards.map(c => c.id)) + 1 : 1,
    };
    setCards([newCard, ...cards]);
  };

  const deleteCard = (id: number) => {
    setCards(cards.filter(card => card.id !== id));
  };

  return { cards, addCard, deleteCard, setCards };
}
