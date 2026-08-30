// src/lib/onboarding-api.ts
import { apiClient } from "@/lib/apiClient";
import type { ChurchOnboardingDraft, CongregationSize, ChurchLanguage, CustomMinistry } from "@/types/api";

export interface Step1Payload {
  firstName: string;
  lastName: string;
  churchName: string;
  denomination: string;
  congregationSize: CongregationSize;
  foundedYear?: number;
}

export interface Step2Payload {
  country: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  primaryLanguage: ChurchLanguage;
  timeZone: string;
}

export interface ServiceTimeInput {
  label: string;
  dayOfWeek: number;
  time: string;
}

export interface Step4Payload {
  ministryIds: string[];
  customMinistries: CustomMinistry[];
}

export async function saveStep1(payload: Step1Payload) {
  return apiClient.patch<{ status: string }>("/onboarding/church/step-1", payload);
}

export async function saveStep2(payload: Step2Payload) {
  return apiClient.patch<{ status: string }>("/onboarding/church/step-2", payload);
}

export async function saveStep3(serviceTimes: ServiceTimeInput[], logoFile?: File | null) {
  const formData = new FormData();
  formData.append("serviceTimes", JSON.stringify(serviceTimes));
  if (logoFile) {
    formData.append("logo", logoFile);
  }
  return apiClient.patchForm<{ status: string }>("/onboarding/church/step-3", formData);
}

export async function saveStep4(payload: Step4Payload) {
  return apiClient.patch<{ status: string }>("/onboarding/church/step-4", payload);
}

export async function getDraft(): Promise<ChurchOnboardingDraft | null> {
  try {
    return await apiClient.get<ChurchOnboardingDraft>("/onboarding/church/draft");
  } catch {
    return null;
  }
}

export async function completeOnboarding() {
  return apiClient.post<{ status: string; message: string; data?: { churchId: string } }>("/onboarding/church/complete");
}

export const onboardingService = {
  step1: saveStep1,
  step2: saveStep2,
  step3: ({ serviceTimes, logoFile }: { serviceTimes: ServiceTimeInput[]; logoFile?: File | null }) =>
    saveStep3(serviceTimes, logoFile),
  step4: saveStep4,
  getDraft,
  complete: completeOnboarding,
};
