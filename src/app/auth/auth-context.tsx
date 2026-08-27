import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ApiError } from "@/lib/api-client";
import * as authApi from "@/lib/auth-api";
import { authStorage } from "@/lib/auth-storage";
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
  setSessionFromTokens: (accessToken: string, refreshToken?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hydrateUser = useCallback(async () => {
    try {
      const response = await authApi.getCurrentUser();
      setUser(response.user);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      if (!authStorage.getAccessToken()) {
        setIsLoading(false);
        return;
      }
      await hydrateUser();
      setIsLoading(false);
    };
    void bootstrap();
  }, [hydrateUser]);

  const setSessionFromTokens = useCallback(
    async (accessToken: string, refreshToken?: string) => {
      if (refreshToken) {
        authStorage.setTokens(accessToken, refreshToken);
      } else {
        authStorage.setAccessToken(accessToken);
      }
      await hydrateUser();
    },
    [hydrateUser],
  );

  const signUp = useCallback(async (email: string, password: string) => {
    const response = await authApi.register(email, password);
    authStorage.setTokens(response.accessToken, response.refreshToken);
    setUser(response.user);
    return { requiresVerification: response.requiresVerification };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    authStorage.setTokens(response.accessToken, response.refreshToken);
    setUser(response.user);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 401) {
        throw error;
      }
    } finally {
      authStorage.clear();
      setUser(null);
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const mockUser: AuthUser = {
      id: "usr_google_demo",
      email: "pastor.daniel@churcheden.com",
      fullName: "Pastor Daniel",
      isVerified: true,
      loginProvider: "google",
      isPremium: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    authStorage.setTokens("mock_google_access_token", "mock_google_refresh_token");
    setUser(mockUser);
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
