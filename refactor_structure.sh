#!/bin/bash
set -e

echo "🔄 Начинаем миграцию структуры проекта..."

# === 1. Создаём нужные папки ===
mkdir -p src/components/{cards,messages,layout,auth}
mkdir -p src/lib/{api,utils}
mkdir -p docker

# === 2. Переносим конфиги для Nginx в docker ===
if [ -f nginx/nginx.conf ]; then
  mv nginx/nginx.conf docker/nginx.conf
  echo "✅ Перенесён nginx.conf → docker/"
fi

# === 3. Переносим компоненты по папкам ===
if [ -f src/components/CardItem.tsx ]; then
  mv src/components/CardItem.tsx src/components/cards/
  echo "✅ CardItem.tsx → components/cards/"
fi

if [ -f src/components/CardForm.tsx ]; then
  mv src/components/CardForm.tsx src/components/cards/
  echo "✅ CardForm.tsx → components/cards/"
fi

if [ -f src/components/MessageItem.tsx ]; then
  mv src/components/MessageItem.tsx src/components/messages/
  echo "✅ MessageItem.tsx → components/messages/"
fi

if [ -f src/components/BottomNav.tsx ]; then
  mv src/components/BottomNav.tsx src/components/layout/
  echo "✅ BottomNav.tsx → components/layout/"
fi

if [ -f src/components/AuthWrapper.tsx ]; then
  mv src/components/AuthWrapper.tsx src/components/auth/
  echo "✅ AuthWrapper.tsx → components/auth/"
fi

# === 4. Переносим утилиты ===
if [ -f src/lib/utils.ts ]; then
  mv src/lib/utils.ts src/lib/utils/index.ts
  echo "✅ utils.ts → lib/utils/index.ts"
fi

# === 5. Переносим типы ===
if [ -f types/next-pwa.d.ts ]; then
  mv types/next-pwa.d.ts src/types/
  echo "✅ next-pwa.d.ts → src/types/"
fi

# === 6. Бэкапим старую папку types, если она пустая ===
if [ -d types ]; then
  echo "ℹ️ Проверка папки types..."
  if [ -z "$(ls -A types)" ]; then
    rm -rf types
    echo "🗑 Папка types удалена (пустая)"
  fi
fi

# === 7. Очистка от лишних файлов в public ===
for demo_icon in public/vercel.svg public/next.svg; do
  if [ -f "$demo_icon" ]; then
    rm "$demo_icon"
    echo "🗑 Удалён демо-файл: $(basename $demo_icon)"
  fi
done

echo "🎉 Миграция завершена!"
echo "Не забудь обновить импорты в проекте, если пути изменились."