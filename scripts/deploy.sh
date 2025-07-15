#!/bin/bash
set -e

# Загружаем переменные окружения
ENV_FILE="$(dirname "$0")/deploy.env"
if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Не найден файл переменных окружения: $ENV_FILE"
  exit 1
fi

source "$ENV_FILE"

echo "📂 Переход в директорию проекта: $PROJECT_DIR"
cd "$PROJECT_DIR"

echo "🔄 Получаем последние изменения из Git..."
git pull origin master

echo "🐳 Пересобираем только контейнер nextjs..."
docker compose build nextjs

echo "🚀 Перезапускаем nextjs без остановки других сервисов..."
docker compose up -d nextjs

echo "✅ Обновление nextjs завершено! Сайт: https://$DOMAIN"