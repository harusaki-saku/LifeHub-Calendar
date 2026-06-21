import { createShowlaboAuth } from 'showlabo-auth';
import { env } from './env';

export const auth = createShowlaboAuth({
  domain: env.authDomain,
  clientId: env.cognitoClientId,
  redirectUri: `${env.appUrl}/auth/callback`,
  scopes: ['openid', 'email', 'profile'],
  region: 'ap-northeast-1',
});

export interface CurrentUser {
  email: string;
  displayName: string;
}

export function getCurrentUser(): CurrentUser | null {
  const user = auth.getUser();
  if (!user) return null;
  const email = user.email ?? '';
  const displayName = (user.name ?? (email ? email.split('@')[0] : '')) || 'ユーザー';
  return { email: email || 'ユーザー', displayName };
}
