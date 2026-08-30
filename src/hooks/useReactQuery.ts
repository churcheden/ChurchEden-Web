// src/hooks/useReactQuery.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryKeys";
import { authService } from "@/lib/auth-api";
import { onboardingService, type ServiceTimeInput } from "@/lib/onboarding-api";
import { membersService } from "@/lib/profile-api";
import type {
  User,
  MemberProfile,
  ChurchMembership,
  ChurchOnboardingDraft,
  CongregationSize,
  ChurchLanguage,
  MembershipStatus,
  CustomMinistry,
} from "@/types/api";

// ---------------- AUTH HOOKS ----------------

export function useMe() {
  return useQuery<User, Error>({
    queryKey: queryKeys.user(),
    queryFn: async () => {
      const res = await authService.me();
      return (res as any).user || (res as any).data?.user || res;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

// Backward-compatible alias
export const useAuthQuery = useMe;

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authService.login,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.user() }),
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => qc.clear(),
  });
}

export const useRegister = () => useMutation({ mutationFn: authService.register });
export const useVerifyEmail = () => useMutation({ mutationFn: authService.verifyEmail });
export const useResendVerification = () => useMutation({ mutationFn: authService.resendVerification });
export const useForgotPassword = () => useMutation({ mutationFn: authService.forgotPassword });
export const useResetPassword = () => useMutation({ mutationFn: authService.resetPassword });

// ---------------- ONBOARDING HOOKS ----------------

export function useOnboardingDraft() {
  return useQuery<ChurchOnboardingDraft | null, Error>({
    queryKey: queryKeys.onboardingDraft(),
    queryFn: onboardingService.getDraft,
    staleTime: 60_000,
    retry: false,
  });
}

export const useOnboardingDraftQuery = useOnboardingDraft;

export function useOnboardingStep1() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      firstName: string;
      lastName: string;
      churchName: string;
      denomination: string;
      congregationSize: CongregationSize;
      foundedYear?: number;
    }) => onboardingService.step1(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.onboardingDraft() }),
  });
}

export const useSaveStep1Mutation = useOnboardingStep1;

export function useOnboardingStep2() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      country: string;
      city: string;
      address: string;
      phone: string;
      email: string;
      primaryLanguage: ChurchLanguage;
      timeZone: string;
    }) => onboardingService.step2(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.onboardingDraft() }),
  });
}

export const useSaveStep2Mutation = useOnboardingStep2;

export function useOnboardingStep3() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      serviceTimes: ServiceTimeInput[];
      logoFile?: File | null;
    }) => onboardingService.step3(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.onboardingDraft() }),
  });
}

export const useSaveStep3Mutation = useOnboardingStep3;

export function useOnboardingStep4() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      ministryIds: string[];
      customMinistries: CustomMinistry[];
    }) => onboardingService.step4(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.onboardingDraft() }),
  });
}

export const useSaveStep4Mutation = useOnboardingStep4;

export function useCompleteOnboarding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: onboardingService.complete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.user() });
      qc.removeQueries({ queryKey: queryKeys.onboardingDraft() });
    },
  });
}

export const useCompleteOnboardingMutation = useCompleteOnboarding;

// ---------------- MEMBER PROFILE HOOKS ----------------

export function useMemberProfile() {
  return useQuery<MemberProfile | null, Error>({
    queryKey: queryKeys.memberProfile(),
    queryFn: membersService.getProfile,
    staleTime: 60_000,
    retry: false,
  });
}

export const useMemberProfileQuery = useMemberProfile;

export function useCompleteProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ photo, fields }: { photo: File | null; fields: any }) =>
      membersService.completeProfile(photo, fields),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.memberProfile() }),
  });
}

// ---------------- JOIN REQUEST HOOKS ----------------

export function useJoinRequests(filters?: { status?: MembershipStatus; churchId?: string }) {
  return useQuery<ChurchMembership[], Error>({
    queryKey: queryKeys.joinRequests(filters),
    queryFn: async () => {
      const res = await membersService.getJoinRequests(filters);
      return res || [];
    },
    staleTime: 60_000,
    retry: false,
  });
}

export const useJoinRequestsQuery = useJoinRequests;

export function useSubmitJoinRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (churchId: string) => membersService.submitJoinRequest(churchId),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.joinRequests() }),
  });
}

export function useApproveJoinRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { membershipId: string }) => membersService.approveJoinRequest(vars.membershipId),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.joinRequests() }),
  });
}

export const useApproveMutation = useApproveJoinRequest;

export function useRejectJoinRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { membershipId: string; rejectionReason?: string }) =>
      membersService.rejectJoinRequest(vars.membershipId, vars.rejectionReason),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.joinRequests() }),
  });
}

export const useRejectMutation = useRejectJoinRequest;

export function useBanMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { membershipId: string; banReason?: string }) =>
      membersService.banMember(vars.membershipId, vars.banReason),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.joinRequests() }),
  });
}

export const useBanMutation = useBanMember;

export function useUnbanMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { membershipId: string }) => membersService.unbanMember(vars.membershipId),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.joinRequests() }),
  });
}

export const useUnbanMutation = useUnbanMember;