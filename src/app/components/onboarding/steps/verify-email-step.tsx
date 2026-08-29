import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, ShieldCheck } from "lucide-react";
import { ApiError } from "@/lib/api-client";
import { useAuth } from "@/app/auth/auth-context";
import { useOnboarding } from "../onboarding-context";
import { OnboardingSplitShell } from "../onboarding-split-shell";
import { EdenField } from "../eden-field";
import { EdenButton } from "../eden-button";

export function VerifyEmailStep() {
  const navigate = useNavigate();
  const { data } = useOnboarding();
  const { verifyEmail, resendVerification } = useAuth();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const email = data.email;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!email) {
      navigate("/onboarding/welcome", { replace: true });
      return;
    }

    setIsSubmitting(true);
    try {
      await verifyEmail(email, otp);
      navigate("/onboarding/church-basics");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Verification failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setMessage(null);
    setIsResending(true);
    try {
      await resendVerification();
      setMessage("A new verification code has been sent to your email.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not resend code.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <OnboardingSplitShell
      visualContent={
        <div className="space-y-4 text-white">
          <ShieldCheck size={40} className="text-eden-primary" />
          <h2 className="text-3xl font-bold leading-tight">Verify your email</h2>
          <p className="text-white/70">We sent a 6-digit code to confirm your account.</p>
        </div>
      }
    >
      <header className="mb-10">
        <h1 className="mb-2 text-3xl font-bold text-eden-on-surface">Check your inbox</h1>
        <p className="text-eden-on-surface-variant">
          Enter the verification code sent to {email || "your email"}.
        </p>
      </header>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {message && (
          <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </p>
        )}

        <EdenField
          label="Verification code"
          type="text"
          inputMode="numeric"
          pattern="[0-9]{6}"
          maxLength={6}
          placeholder="123456"
          icon={<Mail size={18} />}
          value={otp}
          onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
          required
        />

        <EdenButton type="submit" className="w-full mt-2" disabled={isSubmitting}>
          {isSubmitting ? "Verifying..." : "Verify email"}
        </EdenButton>
      </form>

      <div className="mt-6 space-y-3 text-center text-sm text-eden-on-surface-variant">
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="font-bold text-eden-primary hover:underline underline-offset-4 disabled:opacity-60 cursor-pointer"
        >
          {isResending ? "Sending..." : "Resend code"}
        </button>
        <p>
          <Link to="/onboarding/sign-in" className="font-bold text-eden-primary hover:underline underline-offset-4">
            Back to sign in
          </Link>
        </p>
      </div>
    </OnboardingSplitShell>
  );
}
