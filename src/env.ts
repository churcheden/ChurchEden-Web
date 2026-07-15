export const env = {
  appName: import.meta.env.VITE_APP_NAME ?? "ChurchEden",
  appUrl: import.meta.env.VITE_APP_URL ?? "https://churcheden.app",
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "https://api.churcheden.app/api/v1",
} as const;
