declare module 'next-pwa' {
  import { NextConfig } from 'next';

  const withPWA: (options: {
    dest: string;
    disable?: boolean;
    register?: boolean;
    skipWaiting?: boolean;
    // другие опции по желанию
  }) => (config: NextConfig) => NextConfig;

  export default withPWA;
}