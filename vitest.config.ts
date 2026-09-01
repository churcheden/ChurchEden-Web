import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: false,
    setupFiles: ["./src/test/setup.ts"],
    env: {
      VITE_API_BASE_URL: "https://api.test.churcheden.app/api/v1",
      VITE_APP_NAME: "ChurchEden",
      VITE_APP_URL: "https://test.churcheden.app",
    },
    coverage: {
      provider: "v8",
      include: ["src/lib/**/*.ts", "src/app/auth/**/*.{ts,tsx}"],
      reporter: ["text", "html"],
    },
  },
});
