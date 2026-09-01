// src/lib/session-events.ts
// Lightweight event bus so the auth layer can react to a session that has
// expired (e.g. a failed token refresh) without performing a full page reload.
// Full page reloads are what caused the infinite refresh/redirect loop when
// /auth/me returned 401 for unauthenticated visitors.
type SessionExpiredListener = () => void;

let listeners: SessionExpiredListener[] = [];

export function onSessionExpired(listener: SessionExpiredListener): () => void {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function emitSessionExpired(): void {
  for (const listener of [...listeners]) {
    try {
      listener();
    } catch {
      // Ignore listener errors so one bad listener can't break the cycle.
    }
  }
}
