#!/bin/bash
set -e
source "$(dirname "$0")/deploy.env"

cd "$PROJECT_DIR"
echo "📥 Обновляем репозиторий..."
git pull

echo "🔨 Собираем и запускаем контейнеры..."
docker compose build frontend
docker compose up -d

echo "✅ Деплой завершён!"