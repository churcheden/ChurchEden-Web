import { Navigate, useLocation } from "react-router";
import { useAuth } from "@/app/auth/auth-context";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-eden-surface font-eden text-eden-on-surface-variant">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/onboarding/sign-in" state={{ from: location }} replace />;
  }

  return children;
}
