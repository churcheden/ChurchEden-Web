// src/lib/auth-api.ts
import { apiClient } from "@/lib/apiClient";
import type {
  GoogleAuthUrlResponse,
  LoginResponse,
  MeResponse,
  MessageResponse,
  RefreshResponse,
  RegisterResponse,
} from "@/types/auth";

export function register(email: string, password: string) {
  return apiClient.post<RegisterResponse>("/auth/register", {
    email,
    password,
  });
}

export function login(email: string, password: string) {
  return apiClient.post<LoginResponse>("/auth/login", {
    email,
    password,
  });
}

export function verifyEmail(email: string, otp: string) {
  return apiClient.post<MessageResponse>("/auth/verify-email", {
    email,
    otp,
  });
}

export function resendVerification(email?: string) {
  return apiClient.post<MessageResponse>("/auth/resend-verification", {
    ...(email ? { email } : {}),
  });
}

export function getCurrentUser() {
  return apiClient.get<MeResponse>("/auth/me");
}

export function refreshTokens() {
  return apiClient.post<RefreshResponse>("/auth/refresh");
}

export function logout() {
  return apiClient.post<MessageResponse>("/auth/logout");
}

export function forgotPassword(email: string) {
  return apiClient.post<MessageResponse>("/auth/forgot-password", {
    email,
  });
}

export function resetPassword(token: string, newPassword: string) {
  return apiClient.post<MessageResponse>("/auth/reset-password", {
    token,
    newPassword,
  });
}

export function getGoogleAuthUrl() {
  return apiClient.get<GoogleAuthUrlResponse>("/auth/google/url");
}

export const authService = {
  register: (vars: { email: string; password: string }) => register(vars.email, vars.password),
  login: (vars: { email: string; password: string }) => login(vars.email, vars.password),
  verifyEmail: (vars: { email: string; otp: string }) => verifyEmail(vars.email, vars.otp),
  resendVerification: (vars?: { email?: string }) => resendVerification(vars?.email),
  me: getCurrentUser,
  refresh: refreshTokens,
  logout,
  forgotPassword: (vars: { email: string }) => forgotPassword(vars.email),
  resetPassword: (vars: { token: string; newPassword: string }) => resetPassword(vars.token, vars.newPassword),
  getGoogleAuthUrl,
};
