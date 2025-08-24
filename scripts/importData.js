// Script for initial PocketBase data

import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function main() {
  // Авторизация под админом
  await pb.admins.authWithPassword('maslievilya1@gmail.com', 'maslievilya1');

  // Данные для пользователей
  const usersData = [
    {
      name: "Анна Смирнова",
      email: "anna@example.com",
      password: "defaultPass123",
      passwordConfirm: "defaultPass123",
      nativeLanguages: ["Русский"],
      learningLanguages: ["English", "Français"],
      age: 25,
      country: "Россия",
      city: "Москва",
      interests: ["Книги", "Путешествия", "Кино"],
      isRegistered: true
    },
    {
      name: "John Smith",
      email: "john@example.com",
      password: "defaultPass123",
      passwordConfirm: "defaultPass123",
      nativeLanguages: ["English"],
      learningLanguages: ["Русский", "Español"],
      age: 28,
      country: "США",
      city: "New York",
      interests: ["Музыка", "Спорт", "История"],
      isRegistered: true
    }
  ];

  // Создаём пользователей и сохраняем их id для привязки карточек
  const usersMap = {};
  for (const user of usersData) {
    const record = await pb.collection('users').create(user);
    usersMap[user.email] = record.id;
  }

  // Карточки
  const cardsData = [
    {
      title: "English Practice",
      text: "Let's talk about your favorite book!",
      language: "English",
      author: usersMap["anna@example.com"]
    },
    {
      title: "Русский разговор",
      text: "Как прошёл твой день?",
      language: "Русский",
      author: usersMap["john@example.com"]
    }
  ];

  const cardsMap = {};
  for (const card of cardsData) {
    const record = await pb.collection('cards').create(card);
    cardsMap[card.title] = record.id;
  }

  // Сообщения
  const messagesData = [
    {
      text: "Hi everyone! Let's start practicing English here!",
      author: usersMap["anna@example.com"],
      card: cardsMap["English Practice"]
    },
    {
      text: "Всем привет! Как у вас настроение сегодня?",
      author: usersMap["john@example.com"],
      card: cardsMap["Русский разговор"]
    }
  ];

  for (const message of messagesData) {
    await pb.collection('messages').create(message);
  }

  console.log('Импорт завершен');
}

main().catch(err => console.error(err));
