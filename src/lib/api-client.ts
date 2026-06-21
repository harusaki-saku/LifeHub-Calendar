import { auth } from './auth';
import { env } from './env';

type ApiEnvelope<T> = { data: T } | { error: { code: string; message: string; details?: unknown } };

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  retried = false,
): Promise<T> {
  const token = auth.getAccessToken();
  const res = await fetch(`${env.apiUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (res.status === 401 && !retried) {
    const refreshed = await auth.refreshToken();
    if (refreshed) {
      return request<T>(method, path, body, true);
    }
    await auth.login({ returnUrl: window.location.href });
  }

  const payload = (await res.json()) as ApiEnvelope<T>;
  if (!res.ok || 'error' in payload) {
    const message = 'error' in payload ? payload.error.message : `HTTP ${res.status}`;
    throw new Error(message);
  }
  return payload.data;
}

export const apiClient = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body: unknown) => request<T>('PUT', path, body),
  delete: (path: string) => request<unknown>('DELETE', path),
};
