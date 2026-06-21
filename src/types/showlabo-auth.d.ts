declare module 'showlabo-auth' {
  export interface ShowlaboAuthConfig {
    domain: string;
    clientId: string;
    redirectUri: string;
    scopes: string[];
    region?: string;
  }

  export interface ShowlaboUser {
    sub: string;
    email?: string;
    name?: string;
    picture?: string;
    provider: string;
  }

  export interface ShowlaboAuth {
    login(options?: { returnUrl?: string }): Promise<void>;
    logout(options?: { returnUrl?: string }): void;
    isAuthenticated(): boolean;
    getUser(): ShowlaboUser | null;
    getIdToken(): string | null;
    getAccessToken(): string | null;
    refreshToken(): Promise<boolean>;
  }

  export function createShowlaboAuth(config: ShowlaboAuthConfig): ShowlaboAuth;
}
