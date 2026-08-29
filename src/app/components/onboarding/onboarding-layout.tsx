import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Lock, Lightbulb } from "lucide-react";
import { OnboardingStepper } from "./onboarding-stepper";
import { EdenLogo } from "./eden-logo";

interface OnboardingLayoutProps {
  stepPath: string;
  stepNumber: number;
  totalSteps?: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer: ReactNode;
  tipText?: string;
  heroImage: string;
  quoteIcon?: ReactNode;
  quoteTitle: string;
  quoteSubtitle: string;
}

export function OnboardingLayout({
  stepPath,
  stepNumber,
  totalSteps = 4,
  title,
  subtitle,
  children,
  footer,
  tipText = "Your church size helps us suggest the right plan for your needs.",
  heroImage,
  quoteIcon,
  quoteTitle,
  quoteSubtitle,
}: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FBF9F5] text-slate-800 font-eden relative flex flex-col justify-between py-6 sm:py-8 px-4 sm:px-6 lg:px-8 selection:bg-blue-100 selection:text-blue-900">
      <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col justify-center">
        {/* Main Split Grid Card */}
        <motion.div
          key={stepPath}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-3xl bg-white border border-[#EAE7DC] shadow-xl shadow-slate-900/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]"
        >
          {/* Left Column: Form & Stepper (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div>
              {/* Logo & Stepper Bar */}
              <div className="mb-6">
                <div className="mb-5">
                  <EdenLogo iconClassName="text-[#1B2A4A]" textClassName="text-slate-900" />
                </div>
                <OnboardingStepper currentStepPath={stepPath} />
              </div>

              {/* Step Header */}
              <div className="mb-5 pt-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#1B2A4A]">
                  STEP {stepNumber} OF {totalSteps}
                </p>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                  {title}
                </h1>
                {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-1">{subtitle}</p>}
              </div>

              {/* Form Content */}
              <div className="space-y-4">{children}</div>

              {/* Tip Callout */}
              {tipText && (
                <div className="mt-5 p-3.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center gap-2.5 text-xs text-[#1E3A8A]">
                  <div className="w-5 h-5 rounded-full bg-[#DBEAFE] text-[#1B2A4A] flex items-center justify-center flex-shrink-0">
                    <Lightbulb size={13} />
                  </div>
                  <p className="leading-relaxed font-medium">{tipText}</p>
                </div>
              )}
            </div>

            {/* Footer Navigation Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              {footer}
            </div>
          </div>

          {/* Right Column: Realistic Full-Bleed Photography with Floating Quote Card (5 cols) */}
          <div className="lg:col-span-5 relative min-h-[380px] lg:min-h-full overflow-hidden flex flex-col justify-between p-6 sm:p-8 bg-slate-900">
            {/* Full-bleed Photo */}
            <img
              src={heroImage}
              alt="Church community"
              className="absolute inset-0 w-full h-full object-cover object-center brightness-90 saturate-105"
            />

            {/* Subtle dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30 pointer-events-none" />

            {/* Top Right "Secure & Private" Badge */}
            <div className="relative z-10 flex justify-end">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs font-medium shadow-xs">
                <Lock size={12} className="text-white/90" />
                <span>Secure & Private</span>
              </div>
            </div>

            {/* Floating Quote Card at Bottom */}
            <div className="relative z-10 p-5 rounded-2xl bg-black/50 backdrop-blur-md border border-white/15 text-white shadow-xl flex items-start gap-4">
              {quoteIcon && (
                <div className="w-10 h-10 rounded-xl bg-[#1B2A4A]/90 text-white flex items-center justify-center flex-shrink-0 shadow-xs border border-white/10">
                  {quoteIcon}
                </div>
              )}
              <div className="space-y-1">
                <p className="text-sm font-bold leading-snug text-white tracking-tight">
                  {quoteTitle}
                </p>
                <p className="text-xs text-white/80 leading-relaxed font-normal">
                  {quoteSubtitle}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Subtle Footer note */}
      <footer className="w-full max-w-7xl mx-auto pt-4 text-center text-xs text-slate-400">
        © 2026 ChurchEden. Financial stewardship built for modern ministry.
      </footer>
    </div>
  );
}
