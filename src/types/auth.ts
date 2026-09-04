export type MembershipRole = "MEMBER" | "ADMIN" | "SUPER_ADMIN";
export type MembershipStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ChurchMembership {
  id: string;
  role: MembershipRole;
  status: MembershipStatus;
  joinedAt: string;
  church: {
    id: string;
    name: string;
    logoUrl: string | null;
  };
}

export interface AuthUser {
  id: string;
  email: string;
  fullName?: string | null;
  isVerified: boolean;
  // Admin-only fields (returned by /auth/me when accountType === "ADMIN")
  accountType?: "ADMIN" | "MEMBER";
  role?: "SUPER_ADMIN" | "ADMIN";
  isActive?: boolean;
  linkedUserId?: string | null;
  church?: {
    id: string;
    name: string;
    logoUrl: string | null;
    city?: string | null;
  } | null;
  // Member-only fields
  loginProvider?: string;
  isPremium?: boolean;
  premiumExpiry?: string | null;
  lastLogin?: string | null;
  createdAt?: string;
  updatedAt?: string;
  memberships?: ChurchMembership[];
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
  accountType?: "ADMIN" | "MEMBER";
  user: AuthUser;
}

export interface LoginResponse {
  status: "success";
  message: string;
  accessToken: string;
  refreshToken: string;
  accountType?: "ADMIN" | "MEMBER";
  user: AuthUser;
}

export interface MeResponse {
  status: "success";
  accountType?: "ADMIN" | "MEMBER";
  profileComplete?: boolean;
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
