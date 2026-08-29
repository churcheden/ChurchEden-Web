import { useEffect } from "react";
import { useNavigate } from "react-router";
import confetti from "canvas-confetti";
import { motion } from "motion/react";
import {
  CheckCircle2,
  Crown,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  Sparkles,
} from "lucide-react";
import { EdenButton } from "../eden-button";
import { useOnboarding } from "../onboarding-context";
import { EdenLogo } from "../eden-logo";

const AUTO_REDIRECT_MS = 6000;

export function SetupCompleteStep() {
  const navigate = useNavigate();
  const { data } = useOnboarding();

  const enterDashboard = () => navigate("/dashboard");

  useEffect(() => {
    confetti({
      particleCount: 140,
      spread: 100,
      origin: { y: 0.55 },
      colors: ["#1B2A4A", "#C8860A", "#2563EB", "#D4A628", "#ffffff"],
    });

    const timer = setTimeout(enterDashboard, AUTO_REDIRECT_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-slate-800 font-eden relative flex flex-col justify-between p-6 sm:p-10 selection:bg-blue-100">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-blue-100/40 via-amber-50/20 to-transparent blur-3xl rounded-full" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between">
        <EdenLogo iconClassName="text-[#1B2A4A]" textClassName="text-slate-900" />
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-[#E5E3DC] shadow-2xs text-xs font-medium text-slate-600">
          <ShieldCheck size={14} className="text-[#1B2A4A]" />
          <span>Provisioning Complete</span>
        </div>
      </header>

      {/* Centered Celebration Card */}
      <main className="relative z-10 w-full max-w-xl mx-auto my-auto py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-3xl border border-[#EAE7DC] bg-white shadow-2xl shadow-slate-900/5 p-8 sm:p-10 text-center relative overflow-hidden"
        >
          {/* Top subtle blue and gold shimmer border */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#1B2A4A] via-amber-500 to-[#1B2A4A]" />

          {/* Animated Success Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.15 }}
            className="relative mx-auto mb-6 inline-block"
          >
            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-[#1B2A4A] shadow-xl shadow-[#1B2A4A]/25 text-white">
              <CheckCircle2 size={42} strokeWidth={2.5} />
            </div>
          </motion.div>

          {/* Title & Description */}
          <div className="space-y-2 mb-6">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold tracking-wide uppercase">
              <Crown size={12} className="text-amber-600" />
              <span>Super Admin Active</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              You&apos;re all set!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Your church workspace is ready. You now have full access to ChurchEden’s administrative suite.
            </p>
          </div>

          {/* Church Summary Pill Card */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE7DC] text-left mb-6 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 size={16} className="text-[#1B2A4A]" />
                <span className="text-xs font-bold text-slate-900">
                  {data.churchName || "Your Church Sanctuary"}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">{data.country || "Ghana"}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 pt-1 border-t border-slate-200/60">
              <span className="flex items-center gap-1">
                <Users size={13} className="text-slate-400" />
                {data.churchSize || "51–200 members"}
              </span>
              <span>•</span>
              <span className="truncate">{data.denomination || "Charismatic"}</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="space-y-3">
            <EdenButton
              onClick={enterDashboard}
              className="w-full bg-[#1B2A4A] hover:bg-[#0F1729] text-white shadow-md shadow-[#1B2A4A]/25 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>Enter Church Dashboard</span>
              <ArrowRight size={16} />
            </EdenButton>

            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <Sparkles size={12} className="text-amber-500" />
              <span>Redirecting automatically in a few seconds...</span>
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs text-slate-400">
        © 2026 ChurchEden. Financial stewardship built for modern ministry.
      </footer>
    </div>
  );
}
