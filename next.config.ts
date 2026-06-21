import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/calendar',
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_COGNITO_CLIENT_ID:
      process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID ?? '5k246nqu6p30f9lfnbpatlutvf',
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ?? 'https://api.showlabo.com/v1',
    NEXT_PUBLIC_AUTH_DOMAIN:
      process.env.NEXT_PUBLIC_AUTH_DOMAIN ?? 'auth.showlabo.com',
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.showlabo.com',
  },
};

export default nextConfig;
