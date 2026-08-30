// src/lib/auth-storage.ts
// On web, authentication is managed via HttpOnly cookies by the browser.
// This module provides a no-op / compatibility interface so existing references do not break.

export const authStorage = {
  getAccessToken(): string | null {
    return null;
  },

  getRefreshToken(): string | null {
    return null;
  },

  setTokens(_access: string, _refresh?: string) {
    // No-op on web: HttpOnly cookies carry tokens
  },

  setAccessToken(_access: string) {
    // No-op on web: HttpOnly cookies carry tokens
  },

  clear() {
    // No-op on web
  },
};
