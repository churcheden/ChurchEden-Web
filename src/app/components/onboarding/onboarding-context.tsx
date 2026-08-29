import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export interface OnboardingStepMeta {
  path: string;
  label: string;
}

export const ONBOARDING_STEPS: OnboardingStepMeta[] = [
  { path: "welcome", label: "Welcome" },
  { path: "church-basics", label: "Church Basics" },
  { path: "location-contact", label: "Location & Contact" },
  { path: "service-branding", label: "Service & Branding" },
  { path: "complete", label: "Complete" },
];

export interface ServiceTimeItem {
  id: string;
  label: string;
  day: string;
  time: string;
}

export interface OnboardingData {
  email: string;
  password: string;

  // Step 1: Church Basics
  churchName: string;
  denomination: string;
  churchSize: string;
  foundedYear: string;

  // Step 2: Location & Contact
  country: string;
  city: string;
  address: string;
  churchPhone: string;
  churchEmail: string;
  primaryLanguage: string;
  timezone: string;

  // Step 3: Service Schedule & Branding
  serviceTimes: ServiceTimeItem[];
  churchLogo: File | null;
  brandColor: string;
}

const DEFAULT_ONBOARDING_DATA: OnboardingData = {
  email: "",
  password: "",

  // Step 1: Church Basics
  churchName: "",
  denomination: "",
  churchSize: "",
  foundedYear: "",

  // Step 2: Location & Contact
  country: "Ghana",
  city: "",
  address: "",
  churchPhone: "",
  churchEmail: "",
  primaryLanguage: "English",
  timezone: "UTC+00:00 (Africa/Accra)",

  // Step 3: Service Schedule & Branding
  serviceTimes: [
    { id: "1", label: "Sunday Service", day: "Sunday", time: "09:00" },
    { id: "2", label: "Midweek Service", day: "Wednesday", time: "18:30" },
  ],
  churchLogo: null,
  brandColor: "#F59E0B",
};

interface OnboardingContextValue {
  data: OnboardingData;
  updateData: (patch: Partial<OnboardingData>) => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>(DEFAULT_ONBOARDING_DATA);

  const updateData = (patch: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  };

  const value = useMemo(() => ({ data, updateData }), [data]);

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return ctx;
}
