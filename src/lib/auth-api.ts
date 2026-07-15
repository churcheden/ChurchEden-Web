import { apiRequest } from "@/lib/api-client";
import { authStorage } from "@/lib/auth-storage";
import type {
  GoogleAuthUrlResponse,
  LoginResponse,
  MeResponse,
  MessageResponse,
  RefreshResponse,
  RegisterResponse,
} from "@/types/auth";

export function register(email: string, password: string) {
  return apiRequest<RegisterResponse>("/auth/register", {
    method: "POST",
    body: { email, password },
  });
}

export function login(email: string, password: string) {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export function verifyEmail(email: string, otp: string) {
  return apiRequest<MessageResponse>("/auth/verify-email", {
    method: "POST",
    body: { email, otp },
  });
}

export function resendVerification() {
  return apiRequest<MessageResponse>("/auth/resend-verification", {
    method: "POST",
    auth: true,
  });
}

export function getCurrentUser() {
  return apiRequest<MeResponse>("/auth/me", { auth: true });
}

export async function refreshTokens() {
  const refreshToken = authStorage.getRefreshToken();
  const response = await apiRequest<RefreshResponse>("/auth/refresh", {
    method: "POST",
    body: refreshToken ? { refreshToken } : {},
  });
  authStorage.setTokens(response.data.newAccessToken, response.data.newRefreshToken);
  return response;
}

export function logout() {
  return apiRequest<MessageResponse>("/auth/logout", {
    method: "POST",
    auth: true,
  });
}

export function forgotPassword(email: string) {
  return apiRequest<MessageResponse>("/auth/forgot-password", {
    method: "POST",
    body: { email },
  });
}

export function resetPassword(token: string, newPassword: string) {
  return apiRequest<MessageResponse>("/auth/reset-password", {
    method: "POST",
    body: { token, newPassword },
  });
}

export function getGoogleAuthUrl() {
  return apiRequest<GoogleAuthUrlResponse>("/auth/google/url");
}
