import { Navigate, Route, Routes } from "react-router";
import { OnboardingProvider } from "./onboarding-context";
import { WelcomeStep } from "./steps/welcome-step";
import { SignInStep } from "./steps/signin-step";
import { VerifyEmailStep } from "./steps/verify-email-step";
import { ChurchBasicsStep } from "./steps/church-basics-step";
import { LocationContactStep } from "./steps/location-contact-step";
import { ServiceBrandingStep } from "./steps/service-branding-step";
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
        
        {/* 3-Step Church Profile Setup */}
        <Route path="church-basics" element={<ChurchBasicsStep />} />
        <Route path="location-contact" element={<LocationContactStep />} />
        <Route path="service-branding" element={<ServiceBrandingStep />} />
        
        {/* Backward compatibility redirect for old link */}
        <Route path="church-profile" element={<Navigate to="/onboarding/church-basics" replace />} />
        
        <Route path="complete" element={<SetupCompleteStep />} />
        <Route path="*" element={<Navigate to="/onboarding/welcome" replace />} />
      </Routes>
    </OnboardingProvider>
  );
}
