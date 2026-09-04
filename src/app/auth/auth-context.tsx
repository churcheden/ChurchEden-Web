import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as authApi from "@/lib/auth-api";
import { env } from "@/env";
import { onSessionExpired } from "@/lib/session-events";
import type { AuthUser } from "@/types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<{ requiresVerification: boolean }>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  verifyEmail: (email: string, otp: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  setSessionFromTokens: (accessToken?: string, refreshToken?: string) => Promise<AuthUser | null>;
  hydrateUser: () => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hydrateUser = useCallback(async (): Promise<AuthUser | null> => {
    try {
      const response = await authApi.getCurrentUser();
      if (response && response.user) {
        const authedUser: AuthUser = {
          ...response.user,
          accountType: response.accountType ?? response.user.accountType ?? "ADMIN",
        };
        setUser(authedUser);
        return authedUser;
      }
      setUser(null);
      return null;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      await hydrateUser();
      setIsLoading(false);
    };
    void bootstrap();
  }, [hydrateUser]);

  // When a protected API call fails to refresh the session (expired session),
  // clear the user so route guards can redirect to sign-in client-side. This is
  // intentionally NOT a full page reload, which would remount the provider and
  // re-run /auth/me, causing an infinite refresh/redirect loop.
  useEffect(() => {
    const unsubscribe = onSessionExpired(() => setUser(null));
    return unsubscribe;
  }, []);

  // Active session preservation:
  // 1. Refresh token silently every 8 minutes while user is logged in
  // 2. Refresh token silently when user returns / switches back to the tab
  useEffect(() => {
    if (!user) return;

    const silentRefresh = async () => {
      try {
        await authApi.refreshTokens();
      } catch {
        // Silent catch — request retries handle 401 via mutex
      }
    };

    // Heartbeat every 8 minutes (480,000 ms)
    const interval = setInterval(() => {
      void silentRefresh();
    }, 8 * 60 * 1000);

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void silentRefresh();
      }
    };

    window.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [user]);

  const setSessionFromTokens = useCallback(
    async (_accessToken?: string, _refreshToken?: string): Promise<AuthUser | null> => {
      return await hydrateUser();
    },
    [hydrateUser],
  );

  const signUp = useCallback(async (email: string, password: string) => {
    const response = await authApi.register(email, password);
    if (response.user) {
      setUser({
        ...response.user,
        accountType: response.accountType ?? response.user.accountType ?? "ADMIN",
      });
    }
    return { requiresVerification: response.requiresVerification };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    if (response.user) {
      setUser({
        ...response.user,
        accountType: response.accountType ?? response.user.accountType ?? "ADMIN",
      });
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout error
    } finally {
      setUser(null);
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      const response = await authApi.getGoogleAuthUrl();
      if (response && response.url) {
        window.location.href = response.url;
      } else {
        window.location.href = `${env.apiBaseUrl}/auth/google`;
      }
    } catch {
      window.location.href = `${env.apiBaseUrl}/auth/google`;
    }
  }, []);

  const verifyEmail = useCallback(
    async (email: string, otp: string) => {
      await authApi.verifyEmail(email, otp);
      await hydrateUser();
    },
    [hydrateUser],
  );

  const resendVerification = useCallback(async () => {
    await authApi.resendVerification();
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      signUp,
      signIn,
      signOut,
      signInWithGoogle,
      verifyEmail,
      resendVerification,
      setSessionFromTokens,
      hydrateUser,
    }),
    [
      user,
      isLoading,
      signUp,
      signIn,
      signOut,
      signInWithGoogle,
      verifyEmail,
      resendVerification,
      setSessionFromTokens,
      hydrateUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
