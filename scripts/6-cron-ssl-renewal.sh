#!/bin/bash
set -e

# Загружаем переменные из scripts/deploy.env
ENV_FILE="$(dirname "$0")/deploy.env"
if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Не найден файл переменных окружения: $ENV_FILE"
  exit 1
fi

source "$ENV_FILE"

# === Установка cron, если нужно ===
if ! command -v crontab >/dev/null 2>&1; then
  echo "📦 Установка cron..."
  sudo apt update
  sudo apt install -y cron
fi

# === Запуск cron, если не активен ===
if ! sudo systemctl is-active --quiet cron; then
  echo "🚀 Запуск службы cron..."
  sudo systemctl enable cron
  sudo systemctl start cron
fi

# === Команда для продления SSL ===
CRON_COMMAND="docker run --rm -v \"$PROJECT_DIR/nginx/ssl:/etc/letsencrypt\" certbot/certbot renew --quiet --no-self-upgrade && docker compose -f $PROJECT_DIR/docker-compose.yml exec nginx nginx -s reload >> $LOG_FILE 2>&1"

# === Проверка и добавление задачи ===
if crontab -l 2>/dev/null | grep -F "$CRON_COMMAND" >/dev/null; then
  echo "ℹ️ Cron-задача уже существует. Ничего не добавлено."
else
  ( crontab -l 2>/dev/null; echo "0 4 * * * $CRON_COMMAND" ) | crontab -
  echo "✅ Задача добавлена в crontab: ежедневное продление SSL в 04:00"
fi
