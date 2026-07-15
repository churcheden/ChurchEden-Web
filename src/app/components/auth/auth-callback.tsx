import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "@/app/auth/auth-context";

export function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setSessionFromTokens } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const authError = searchParams.get("error");

    if (authError) {
      setError("Google sign-in failed. Please try again.");
      return;
    }

    if (!accessToken) {
      setError("Missing access token from authentication callback.");
      return;
    }

    const complete = async () => {
      try {
        await setSessionFromTokens(accessToken);
        navigate("/dashboard", { replace: true });
      } catch {
        setError("Could not complete sign-in. Please try again.");
      }
    };

    void complete();
  }, [navigate, searchParams, setSessionFromTokens]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-eden-surface px-6 font-eden text-eden-on-surface">
        <p className="text-center text-eden-on-surface-variant">{error}</p>
        <button
          type="button"
          onClick={() => navigate("/onboarding/sign-in")}
          className="font-medium text-eden-primary hover:underline"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-eden-surface font-eden text-eden-on-surface-variant">
      Completing sign-in...
    </div>
  );
}
