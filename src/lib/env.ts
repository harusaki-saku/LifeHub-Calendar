function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

export const env = {
  cognitoClientId: requireEnv(
    'NEXT_PUBLIC_COGNITO_CLIENT_ID',
    process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
  ),
  apiUrl: requireEnv('NEXT_PUBLIC_API_URL', process.env.NEXT_PUBLIC_API_URL),
  authDomain: requireEnv('NEXT_PUBLIC_AUTH_DOMAIN', process.env.NEXT_PUBLIC_AUTH_DOMAIN),
  appUrl: requireEnv('NEXT_PUBLIC_APP_URL', process.env.NEXT_PUBLIC_APP_URL),
};
