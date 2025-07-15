import withPWA from 'next-pwa';
import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  // другие опции
};

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})(config);