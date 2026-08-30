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
  setSessionFromTokens: (accessToken?: string, refreshToken?: string) => Promise<void>;
  hydrateUser: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hydrateUser = useCallback(async (): Promise<boolean> => {
    try {
      const response = await authApi.getCurrentUser();
      if (response && response.user) {
        setUser(response.user);
        return true;
      }
      setUser(null);
      return false;
    } catch {
      setUser(null);
      return false;
    }
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      await hydrateUser();
      setIsLoading(false);
    };
    void bootstrap();
  }, [hydrateUser]);

  const setSessionFromTokens = useCallback(
    async (_accessToken?: string, _refreshToken?: string) => {
      await hydrateUser();
    },
    [hydrateUser],
  );

  const signUp = useCallback(async (email: string, password: string) => {
    const response = await authApi.register(email, password);
    if (response.user) {
      setUser(response.user);
    }
    return { requiresVerification: response.requiresVerification };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    if (response.user) {
      setUser(response.user);
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
