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

echo "📂 Создание директорий для сертификатов..."
mkdir -p "$WEBROOT_PATH"
mkdir -p "$SSL_PATH"

echo "🚀 Запуск временного nginx на 80 порту для валидации..."
docker run --rm -d \
  --name certbot-nginx-temp \
  -v "$WEBROOT_PATH:/usr/share/nginx/html" \
  -p 80:80 \
  nginx:alpine

echo "🔐 Запрос сертификатов от Let's Encrypt..."
docker run --rm \
  -v "$SSL_PATH:/etc/letsencrypt" \
  -v "$WEBROOT_PATH:/var/www/certbot" \
  certbot/certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email $EMAIL \
  --agree-tos \
  --no-eff-email \
  -d $DOMAIN -d www.$DOMAIN

echo "🧹 Остановка временного nginx..."
docker stop certbot-nginx-temp

echo "✅ Сертификат успешно получен и сохранён в $SSL_PATH"