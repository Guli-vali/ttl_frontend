declare module 'next-pwa' {
  import { NextConfig } from 'next';

  const withPWA: (options: {
    dest: string;
    disable?: boolean;
    register?: boolean;
    skipWaiting?: boolean;
    // добавь другие поля по необходимости
  }) => (config: NextConfig) => NextConfig;

  export default withPWA;
}