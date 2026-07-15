const ACCESS_KEY = "ce_access_token";
const REFRESH_KEY = "ce_refresh_token";

let accessTokenMem: string | null = null;
let refreshTokenMem: string | null = null;

export const authStorage = {
  getAccessToken(): string | null {
    return accessTokenMem ?? sessionStorage.getItem(ACCESS_KEY);
  },

  getRefreshToken(): string | null {
    return refreshTokenMem ?? sessionStorage.getItem(REFRESH_KEY);
  },

  setTokens(access: string, refresh: string) {
    accessTokenMem = access;
    refreshTokenMem = refresh;
    sessionStorage.setItem(ACCESS_KEY, access);
    sessionStorage.setItem(REFRESH_KEY, refresh);
  },

  setAccessToken(access: string) {
    accessTokenMem = access;
    sessionStorage.setItem(ACCESS_KEY, access);
  },

  clear() {
    accessTokenMem = null;
    refreshTokenMem = null;
    sessionStorage.removeItem(ACCESS_KEY);
    sessionStorage.removeItem(REFRESH_KEY);
  },
};
