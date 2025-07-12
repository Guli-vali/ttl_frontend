#!/bin/bash
set -e

# Загружаем переменные из scripts/deploy.env
ENV_FILE="$(dirname "$0")/deploy.env"
if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Не найден файл переменных окружения: $ENV_FILE"
  exit 1
fi

source "$ENV_FILE"

cd $PROJECT_DIR

echo "🚀 Сборка и запуск приложения в фоне..."
docker compose up --build -d

echo "✅ Приложение запущено."