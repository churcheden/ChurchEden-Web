export interface AuthUser {
  id: string;
  email: string;
  fullName?: string | null;
  isVerified: boolean;
  loginProvider?: string;
  isPremium?: boolean;
  premiumExpiry?: string | null;
  lastLogin?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiErrorResponse {
  status: "error";
  code?: string;
  message: string;
}

export interface RegisterResponse {
  status: "success";
  message: string;
  requiresVerification: boolean;
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface LoginResponse {
  status: "success";
  message: string;
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface MeResponse {
  status: "success";
  user: AuthUser;
}

export interface RefreshResponse {
  status: "success";
  data: {
    newAccessToken: string;
    newRefreshToken: string;
  };
}

export interface GoogleAuthUrlResponse {
  status: "success";
  url: string;
}

export interface MessageResponse {
  status?: "success";
  message: string;
}
