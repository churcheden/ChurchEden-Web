import { getDraft } from "@/lib/onboarding-api";
import type { ChurchOnboardingDraft } from "@/types/api";

export type OnboardingStepPath =
  | "church-basics"
  | "location-contact"
  | "service-branding"
  | "ministries"
  | "complete";

const hasStep1 = (d: ChurchOnboardingDraft | null | undefined) =>
  !!d &&
  !!d.firstName &&
  !!d.lastName &&
  !!d.churchName &&
  !!d.denomination &&
  !!d.congregationSize;

const hasStep2 = (d: ChurchOnboardingDraft | null | undefined) =>
  !!d &&
  !!d.country &&
  !!d.city &&
  !!d.address &&
  !!d.phone &&
  !!d.email &&
  !!d.primaryLanguage &&
  !!d.timeZone;

const hasStep3 = (d: ChurchOnboardingDraft | null | undefined) =>
  !!d && Array.isArray(d.serviceTimes) && d.serviceTimes.length > 0;

const UP_TO_NEEDS: Record<OnboardingStepPath, { step1: boolean; step2: boolean; step3: boolean }> = {
  "church-basics": { step1: false, step2: false, step3: false },
  "location-contact": { step1: true, step2: false, step3: false },
  "service-branding": { step1: true, step2: true, step3: false },
  ministries: { step1: true, step2: true, step3: true },
  complete: { step1: true, step2: true, step3: true },
};

export function firstMissingStep(
  draft: ChurchOnboardingDraft | null | undefined,
  upTo: OnboardingStepPath,
): OnboardingStepPath | null {
  const needs = UP_TO_NEEDS[upTo];
  if (needs.step1 && !hasStep1(draft)) return "church-basics";
  if (needs.step2 && !hasStep2(draft)) return "location-contact";
  if (needs.step3 && !hasStep3(draft)) return "service-branding";
  return null;
}

export async function ensureCachedUpTo(upTo: OnboardingStepPath): Promise<OnboardingStepPath | null> {
  const draft = await getDraft();
  return firstMissingStep(draft, upTo);
}
