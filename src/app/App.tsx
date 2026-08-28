import { Navigate, Route, Routes } from "react-router";
import { ProtectedRoute } from "@/app/auth/protected-route";
import { AuthCallback } from "@/app/components/auth/auth-callback";
import { ResetPasswordPage } from "@/app/components/auth/reset-password";
import { LandingPage } from "@/app/components/landing/landing-page";
import { PricingPage } from "@/app/components/landing/pricing-page";
import { AboutPage } from "@/app/components/about/about-page";
import { OnboardingFlow } from "@/app/components/onboarding";
import { Dashboard } from "@/app/components/dashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/onboarding/*" element={<OnboardingFlow />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
