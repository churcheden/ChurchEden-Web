import { Navigate, Route, Routes } from "react-router";
import { OnboardingProvider } from "./onboarding-context";
import { OnboardingSetupGuard } from "./onboarding-setup-guard";
import { WelcomeStep } from "./steps/welcome-step";
import { SignInStep } from "./steps/signin-step";
import { VerifyEmailStep } from "./steps/verify-email-step";
import { ChurchBasicsStep } from "./steps/church-basics-step";
import { LocationContactStep } from "./steps/location-contact-step";
import { ServiceBrandingStep } from "./steps/service-branding-step";
import { MinistriesStep } from "./steps/ministries-step";
import { SetupCompleteStep } from "./steps/setup-complete-step";

export function OnboardingFlow() {
  return (
    <OnboardingProvider>
      <Routes>
        <Route index element={<Navigate to="/onboarding/welcome" replace />} />
        <Route path="welcome" element={<WelcomeStep />} />
        <Route path="sign-in" element={<SignInStep />} />
        <Route path="signin" element={<SignInStep />} />
        <Route path="verify-email" element={<VerifyEmailStep />} />
        
        {/* 4-Step Church Profile Setup (guarded: not reachable once onboarded) */}
        <Route
          path="church-basics"
          element={
            <OnboardingSetupGuard>
              <ChurchBasicsStep />
            </OnboardingSetupGuard>
          }
        />
        <Route
          path="location-contact"
          element={
            <OnboardingSetupGuard>
              <LocationContactStep />
            </OnboardingSetupGuard>
          }
        />
        <Route
          path="service-branding"
          element={
            <OnboardingSetupGuard>
              <ServiceBrandingStep />
            </OnboardingSetupGuard>
          }
        />
        <Route
          path="ministries"
          element={
            <OnboardingSetupGuard>
              <MinistriesStep />
            </OnboardingSetupGuard>
          }
        />

        {/* Backward compatibility redirect for old link */}
        <Route
          path="church-profile"
          element={
            <OnboardingSetupGuard>
              <Navigate to="/onboarding/church-basics" replace />
            </OnboardingSetupGuard>
          }
        />

        <Route
          path="complete"
          element={
            <OnboardingSetupGuard>
              <SetupCompleteStep />
            </OnboardingSetupGuard>
          }
        />
        <Route path="*" element={<Navigate to="/onboarding/welcome" replace />} />
      </Routes>
    </OnboardingProvider>
  );
}
