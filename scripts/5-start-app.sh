#!/bin/bash
set -e

# Загружаем переменные окружения из scripts/deploy.env
ENV_FILE="$(dirname "$0")/deploy.env"
if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Не найден файл переменных окружения: $ENV_FILE"
  exit 1
fi

source "$ENV_FILE"

echo "📂 Переход в директорию проекта: $PROJECT_DIR"
cd "$PROJECT_DIR"

echo "🐳 Сборка и запуск контейнеров (Next.js, Nginx, Certbot)..."
docker compose up --build -d

echo "🔄 Перезапуск nginx для применения существующих SSL-сертификатов..."
docker compose restart nginx

echo "✅ Приложение успешно развернуто по адресу: https://$DOMAIN"