import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export interface OnboardingStepMeta {
  path: string;
  label: string;
}

export const ONBOARDING_STEPS: OnboardingStepMeta[] = [
  { path: "welcome", label: "Welcome" },
  { path: "church-profile", label: "Church Profile" },
  { path: "complete", label: "Complete" },
];

interface OnboardingData {
  email: string;
  password: string;

  churchName: string;
  country: string;
  city: string;
  address: string;
  foundedYear: string;
  churchLogo: File | null;
  churchPhone: string;
  churchEmail: string;
}

const DEFAULT_ONBOARDING_DATA: OnboardingData = {
  email: "",
  password: "",

  churchName: "",
  country: "Ghana",
  city: "",
  address: "",
  foundedYear: "",
  churchLogo: null,
  churchPhone: "",
  churchEmail: "",
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
