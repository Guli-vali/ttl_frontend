// next.config.ts
import withPWA from 'next-pwa';
import type { NextConfig } from 'next';

// Получаем URL из переменной окружения
const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

// Парсим URL для получения компонентов
let pbHostname = '127.0.0.1';
let pbPort = '8090';
let pbProtocol = 'http';

try {
  const url = new URL(pbUrl);
  pbHostname = url.hostname;
  pbPort = url.port || (url.protocol === 'https:' ? '443' : '80');
  pbProtocol = url.protocol.replace(':', '');
} catch (error) {
  console.warn('Invalid POCKETBASE_URL, using default config');
}

const config: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: pbProtocol as 'http' | 'https',
        hostname: pbHostname,
        port: pbPort,
        pathname: '/api/files/**',
      },
    ],
  },
  // любые другие настройки
};

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})(config);