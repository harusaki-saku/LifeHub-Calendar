'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/auth';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      if (!auth.isAuthenticated()) {
        await auth.login({ returnUrl: window.location.href });
        return;
      }
      if (!cancelled) setReady(true);
    }

    bootstrap().catch((error) => {
      console.error('Failed to initialize calendar app:', error);
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        読み込み中...
      </div>
    );
  }

  return <>{children}</>;
}
