// next.config.ts
import withPWA from 'next-pwa';
import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  // любые другие настройки
};

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})(config);