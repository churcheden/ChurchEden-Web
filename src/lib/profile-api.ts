// src/lib/profile-api.ts
import { apiClient } from "@/lib/apiClient";
import type { MemberProfile, ChurchMembership, Gender, MaritalStatus, MembershipStatus } from "@/types/api";

export interface CompleteProfileInput {
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  phoneNumber: string;
  contactEmail: string;
  city: string;
  address: string;
  maritalStatus: MaritalStatus;
  occupation?: string;
  profilePhoto?: File | null;
}

export async function completeMemberProfile(input: CompleteProfileInput): Promise<MemberProfile> {
  const formData = new FormData();
  formData.append("fullName", input.fullName);
  formData.append("dateOfBirth", input.dateOfBirth);
  formData.append("gender", input.gender);
  formData.append("phoneNumber", input.phoneNumber);
  formData.append("contactEmail", input.contactEmail);
  formData.append("city", input.city);
  formData.append("address", input.address);
  formData.append("maritalStatus", input.maritalStatus);
  if (input.occupation) {
    formData.append("occupation", input.occupation);
  }
  if (input.profilePhoto) {
    formData.append("profilePhoto", input.profilePhoto);
  }
  return apiClient.postForm<MemberProfile>("/members/profile/complete", formData);
}

export async function getMemberProfile(): Promise<MemberProfile | null> {
  try {
    return await apiClient.get<MemberProfile>("/members/profile");
  } catch {
    return null;
  }
}

export async function submitJoinRequest(churchId: string): Promise<ChurchMembership> {
  return apiClient.post<ChurchMembership>("/join-requests", { churchId });
}

export async function getJoinRequests(filters?: { status?: MembershipStatus; churchId?: string }): Promise<ChurchMembership[]> {
  return apiClient.get<ChurchMembership[]>("/join-requests", { params: filters });
}

export async function approveJoinRequest(membershipId: string) {
  return apiClient.post<{ status: string; message: string }>("/join-requests/approve", { membershipId });
}

export async function rejectJoinRequest(membershipId: string, rejectionReason?: string) {
  return apiClient.post<{ status: string; message: string }>("/join-requests/reject", {
    membershipId,
    rejectionReason,
  });
}

export async function banMember(membershipId: string, banReason?: string) {
  return apiClient.post<{ status: string; message: string; membership: ChurchMembership }>("/join-requests/ban", {
    membershipId,
    banReason,
  });
}

export async function unbanMember(membershipId: string) {
  return apiClient.post<{ status: string; message: string; membership: ChurchMembership }>("/join-requests/unban", {
    membershipId,
  });
}

export const membersService = {
  getProfile: getMemberProfile,
  completeProfile: (photo: File | null, fields: Omit<CompleteProfileInput, 'profilePhoto'>) =>
    completeMemberProfile({ ...fields, profilePhoto: photo }),
  getJoinRequests,
  submitJoinRequest,
  approveJoinRequest,
  rejectJoinRequest,
  banMember,
  unbanMember,
};
