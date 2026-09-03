import { Navigate } from "react-router";
import { useAuth } from "@/app/auth/auth-context";
import type { ReactNode } from "react";

/**
 * Guards the church-setup / "complete profile" wizard steps. A user who has
 * already completed onboarding (their church is provisioned) must not be able
 * to return to these pages — e.g. from the dashboard — since their profile has
 * already been set up. Redirect them to the dashboard instead.
 */
export function OnboardingSetupGuard({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  // A SuperAdmin whose church already exists has completed onboarding.
  if (user && user.church) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
