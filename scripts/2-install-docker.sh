#!/bin/bash
set -e

echo "🐳 Установка Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

echo "⚙️ Установка Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/download/2.24.6/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

echo "✅ Docker и Compose установлены:"
docker -v
docker compose -v