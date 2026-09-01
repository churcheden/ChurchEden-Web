// src/lib/apiClient.ts
import { env } from "@/env";
import { AppError } from "./errors";
import { withRefreshMutex } from "./refreshMutex";
import { emitSessionExpired } from "./session-events";

export { AppError, ApiError, isAppError, ERROR_CODES } from "./errors";

const BASE_URL = env.apiBaseUrl;

async function parseError(res: Response): Promise<AppError> {
  const body = await res.json().catch(() => ({}));
  const code = body?.code || body?.error || 'UNKNOWN_ERROR';
  const message = body?.message || body?.error || `HTTP ${res.status}: Request failed`;
  return new AppError(code, message, body?.details, res.status);
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined>;
  auth?: boolean;
  _retry?: boolean;
  body?: unknown;
}

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${normalizedPath}`;
}

async function request<T>(path: string, options: RequestOptions = {}, isRetry = false): Promise<T> {
  const { params, auth, _retry, headers = {}, body, ...init } = options;

  let urlString = path.startsWith('http://') || path.startsWith('https://') ? path : apiUrl(path);
  if (params) {
    const url = new URL(urlString);
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined) url.searchParams.set(k, String(v));
    });
    urlString = url.toString();
  }

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const reqHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(headers as Record<string, string>),
  };

  const payload: BodyInit | undefined = isFormData
    ? (body as FormData)
    : body !== undefined && typeof body !== 'string'
    ? JSON.stringify(body)
    : (body as string | undefined);

  const res = await fetch(urlString, {
    ...init,
    headers: reqHeaders,
    credentials: 'include', // Global — do not remove or override
    body: payload,
  });

  // Handle 401 by attempting a single token refresh, then retrying the request.
  // `/auth/me` is the session probe: a 401 from it simply means "not signed in",
  // so it must NOT trigger a refresh + reload cycle (a full page reload here was
  // the cause of the infinite refresh/redirect loop on public pages for
  // unauthenticated visitors).
  const noRefreshPaths = ['/auth/login', '/auth/refresh', '/auth/me'];
  if (res.status === 401 && !isRetry && !noRefreshPaths.some((p) => path.includes(p))) {
    let refreshed = false;
    await withRefreshMutex(async () => {
      const refresh = await fetch(apiUrl('/auth/refresh'), {
        method: 'POST',
        headers: { Accept: 'application/json' },
        credentials: 'include',
        // Web: empty body — HttpOnly cookie carries the refresh token
      });
      refreshed = refresh.ok;
    });
    if (refreshed) {
      return request<T>(path, options, true);
    }
    // Refresh failed — the session is expired. Signal the auth layer so it can
    // clear state and let route guards redirect (client-side, no reload).
    emitSessionExpired();
    throw new AppError('TOKEN_EXPIRED', 'Session expired.', undefined, 401);
  }

  if (!res.ok) {
    throw await parseError(res);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

const jsonInit = (body: unknown, init?: RequestOptions): RequestOptions => ({
  ...init,
  body,
});

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { method: 'GET', ...options }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { method: 'POST', ...jsonInit(body, options) }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { method: 'PATCH', ...jsonInit(body, options) }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { method: 'PUT', ...jsonInit(body, options) }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { method: 'DELETE', ...options }),
  postForm: <T>(path: string, form: FormData, options?: RequestOptions) =>
    request<T>(path, { method: 'POST', ...options, body: form }),
  patchForm: <T>(path: string, form: FormData, options?: RequestOptions) =>
    request<T>(path, { method: 'PATCH', ...options, body: form }),
};

// Backward-compatible apiRequest export
export const apiRequest = request;
export default apiClient;
