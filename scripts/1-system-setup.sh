#!/bin/bash
set -e

echo "🔧 Обновление системы и установка базовых пакетов..."

sudo apt update && sudo apt upgrade -y --with-new-pkgs
sudo apt install -y curl git ufw

echo "🛡️ Настройка брандмауэра (UFW)..."
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

echo "✅ Система подготовлена."