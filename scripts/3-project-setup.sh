#!/bin/bash
set -e

# Загружаем переменные из scripts/deploy.env
ENV_FILE="$(dirname "$0")/deploy.env"
if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Не найден файл переменных окружения: $ENV_FILE"
  exit 1
fi

source "$ENV_FILE"

echo "📁 Клонируем проект в $PROJECT_DIR..."
sudo git clone $GIT_REPO $PROJECT_DIR
cd $PROJECT_DIR

echo "📂 Подготовка директорий для Certbot..."
mkdir -p certbot/www nginx/ssl

echo "✅ Проект склонирован и директории созданы."