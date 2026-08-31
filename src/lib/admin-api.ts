// src/lib/admin-api.ts
import { apiClient } from "@/lib/apiClient";

export interface AdminRow {
  id: string;
  email: string;
  fullName: string | null;
  role: "SUPER_ADMIN" | "ADMIN";
  isActive: boolean;
  loginProvider: string | null;
  createdAt: string;
  linkedUserId: string | null;
  linkedUser: {
    id: string;
    fullName: string | null;
    email: string | null;
    lastLogin: string | null;
  } | null;
}

export interface GetChurchAdminsResponse {
  status: "success";
  admins: AdminRow[];
}

export function getChurchAdmins(churchId: string) {
  return apiClient.get<GetChurchAdminsResponse>(`/churches/${churchId}/admins`);
}
