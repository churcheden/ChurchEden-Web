import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { ShieldCheck } from "lucide-react";
import { ApiError } from "@/lib/apiClient";
import { resetPassword } from "@/lib/auth-api";
import { OnboardingSplitShell } from "../onboarding/onboarding-split-shell";
import { EdenPasswordInput } from "../onboarding/eden-password-input";
import { EdenButton } from "../onboarding/eden-button";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!token) {
      setError("Reset link is invalid or expired.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(token, password);
      navigate("/onboarding/sign-in", { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reset password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingSplitShell
      visualContent={
        <div className="space-y-4 text-white">
          <ShieldCheck size={40} className="text-eden-primary" />
          <h2 className="text-3xl font-bold leading-tight">Set a new password</h2>
          <p className="text-white/70">Choose a strong password for your ChurchEden account.</p>
        </div>
      }
    >
      <header className="mb-10">
        <h1 className="mb-2 text-3xl font-bold text-eden-on-surface">Reset password</h1>
        <p className="text-eden-on-surface-variant">Enter your new password below.</p>
      </header>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="new-password" className="mb-1.5 block text-sm font-medium text-eden-on-surface-variant">
            New password*
          </label>
          <EdenPasswordInput
            id="new-password"
            placeholder="Enter new password"
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="confirm-new-password" className="mb-1.5 block text-sm font-medium text-eden-on-surface-variant">
            Confirm password*
          </label>
          <EdenPasswordInput
            id="confirm-new-password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
        </div>

        <EdenButton type="submit" className="w-full mt-2" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Reset password"}
        </EdenButton>
      </form>

      <p className="mt-6 text-center text-sm text-eden-on-surface-variant">
        <Link to="/onboarding/sign-in" className="font-bold text-eden-primary hover:underline underline-offset-4">
          Back to sign in
        </Link>
      </p>
    </OnboardingSplitShell>
  );
}
