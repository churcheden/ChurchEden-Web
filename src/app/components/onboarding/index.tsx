import { Navigate, Route, Routes } from "react-router";
import { OnboardingProvider } from "./onboarding-context";
import { WelcomeStep } from "./steps/welcome-step";
import { SignInStep } from "./steps/signin-step";
import { VerifyEmailStep } from "./steps/verify-email-step";
import { ChurchProfileStep } from "./steps/church-profile-step";
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
        <Route path="church-profile" element={<ChurchProfileStep />} />
        <Route path="complete" element={<SetupCompleteStep />} />
        <Route path="*" element={<Navigate to="/onboarding/welcome" replace />} />
      </Routes>
    </OnboardingProvider>
  );
}
