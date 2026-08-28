import { useState } from "react";
import { Check, Shield, CreditCard, Headphones, Lock, Star } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { LandingNav } from "./landing-nav";
import { LandingFooter } from "./landing-footer";

// ─── Design tokens ────────────────────────────────────────────────────────────
const NAVY   = "#0F172A";
const AMBER  = "#C8860A";
const AMBER2 = "#D4A017";

// ─── Feature lists ────────────────────────────────────────────────────────────
const FREE_FEATURES = [
  "Essential member management",
  "Basic attendance tracking",
  "Basic events",
  "Limited giving/payment features",
];
const PRO_FEATURES = [
  "Advanced member management",
  "Attendance analytics",
  "Giving & donation management",
  "Events & registrations",
  "Groups & ministries",
  "Reports and insights",
  "More integrations",
];
const MAX_FEATURES = [
  "Advanced analytics",
  "Unlimited members",
  "Advanced financial reporting",
  "Multi-ministry management",
  "Priority support",
  "Premium integrations",
  "Advanced administration controls",
];

const TRUST_ITEMS = [
  { icon: Shield,     title: "Secure & Reliable",   sub: "Your data is safe with us"  },
  { icon: CreditCard, title: "Easy to Use",          sub: "Designed for church teams"  },
  { icon: Headphones, title: "Support That Cares",   sub: "We're here to help"         },
  { icon: Lock,       title: "Cancel Anytime",       sub: "No long-term contracts"     },
];

// ─── Feature row ──────────────────────────────────────────────────────────────
function FeatureCheck({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2.5">
      {/* Amber circle with check — matches reference exactly */}
      <span
        className="flex-shrink-0 flex items-center justify-center rounded-full"
        style={{ width: 18, height: 18, background: "rgba(200,134,10,0.13)", minWidth: 18 }}
      >
        <Check size={9} style={{ color: AMBER, strokeWidth: 2.5 }} />
      </span>
      <span style={{ fontSize: "13px", color: "#4B5563", lineHeight: 1.5 }}>{text}</span>
    </li>
  );
}

// ─── Custom botanical SVG icons — thin-line node style ────────────────────────
const SW = 1.35;
const R  = 2;

/** Free — simple sprout */
function IconSprout() {
  return (
    <svg width="26" height="28" viewBox="0 0 26 28" fill="none">
      <line x1="13" y1="26" x2="13" y2="7"  stroke={AMBER2} strokeWidth={SW} strokeLinecap="round" />
      <circle cx="13" cy="5"  r={R}   stroke={AMBER2} strokeWidth={SW} fill="none" />
      <line x1="13" y1="17" x2="6"  y2="12" stroke={AMBER2} strokeWidth={SW} strokeLinecap="round" />
      <circle cx="5"  cy="11" r={R}   stroke={AMBER2} strokeWidth={SW} fill="none" />
      <line x1="13" y1="17" x2="20" y2="12" stroke={AMBER2} strokeWidth={SW} strokeLinecap="round" />
      <circle cx="21" cy="11" r={R}   stroke={AMBER2} strokeWidth={SW} fill="none" />
    </svg>
  );
}

/** Pro — flower: stem + top node + upper branches (with sub-nodes) + lower branches */
function IconFlower() {
  return (
    <svg width="30" height="32" viewBox="0 0 30 32" fill="none">
      {/* Stem */}
      <line x1="15" y1="30" x2="15" y2="7" stroke={AMBER2} strokeWidth={SW} strokeLinecap="round" />
      {/* Top */}
      <circle cx="15" cy="5" r={R} stroke={AMBER2} strokeWidth={SW} fill="none" />
      {/* Upper-left */}
      <line x1="15" y1="17" x2="6" y2="12" stroke={AMBER2} strokeWidth={SW} strokeLinecap="round" />
      <circle cx="5" cy="11" r={R} stroke={AMBER2} strokeWidth={SW} fill="none" />
      {/* UL sub */}
      <line x1="6" y1="12" x2="3" y2="17" stroke={AMBER2} strokeWidth={SW} strokeLinecap="round" />
      <circle cx="2.5" cy="18.5" r={1.5} stroke={AMBER2} strokeWidth={SW} fill="none" />
      {/* Upper-right */}
      <line x1="15" y1="17" x2="24" y2="12" stroke={AMBER2} strokeWidth={SW} strokeLinecap="round" />
      <circle cx="25" cy="11" r={R} stroke={AMBER2} strokeWidth={SW} fill="none" />
      {/* UR sub */}
      <line x1="24" y1="12" x2="27" y2="17" stroke={AMBER2} strokeWidth={SW} strokeLinecap="round" />
      <circle cx="27.5" cy="18.5" r={1.5} stroke={AMBER2} strokeWidth={SW} fill="none" />
      {/* Lower-left */}
      <line x1="15" y1="24" x2="9" y2="20" stroke={AMBER2} strokeWidth={SW} strokeLinecap="round" />
      <circle cx="8" cy="19" r={1.5} stroke={AMBER2} strokeWidth={SW} fill="none" />
      {/* Lower-right */}
      <line x1="15" y1="24" x2="21" y2="20" stroke={AMBER2} strokeWidth={SW} strokeLinecap="round" />
      <circle cx="22" cy="19" r={1.5} stroke={AMBER2} strokeWidth={SW} fill="none" />
    </svg>
  );
}

/** Max — tree: stem + top + two levels of spread branches */
function IconTree() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      {/* Stem */}
      <line x1="17" y1="32" x2="17" y2="7" stroke={AMBER2} strokeWidth={SW} strokeLinecap="round" />
      {/* Top */}
      <circle cx="17" cy="5" r={R} stroke={AMBER2} strokeWidth={SW} fill="none" />
      {/* Upper-left */}
      <line x1="17" y1="14" x2="8" y2="9" stroke={AMBER2} strokeWidth={SW} strokeLinecap="round" />
      <circle cx="7" cy="8" r={R} stroke={AMBER2} strokeWidth={SW} fill="none" />
      {/* Upper-right */}
      <line x1="17" y1="14" x2="26" y2="9" stroke={AMBER2} strokeWidth={SW} strokeLinecap="round" />
      <circle cx="27" cy="8" r={R} stroke={AMBER2} strokeWidth={SW} fill="none" />
      {/* Mid-left */}
      <line x1="17" y1="21" x2="6" y2="16" stroke={AMBER2} strokeWidth={SW} strokeLinecap="round" />
      <circle cx="5" cy="15" r={R} stroke={AMBER2} strokeWidth={SW} fill="none" />
      {/* ML sub */}
      <line x1="6" y1="16" x2="3" y2="21" stroke={AMBER2} strokeWidth={SW} strokeLinecap="round" />
      <circle cx="2.5" cy="22.5" r={1.5} stroke={AMBER2} strokeWidth={SW} fill="none" />
      {/* Mid-right */}
      <line x1="17" y1="21" x2="28" y2="16" stroke={AMBER2} strokeWidth={SW} strokeLinecap="round" />
      <circle cx="29" cy="15" r={R} stroke={AMBER2} strokeWidth={SW} fill="none" />
      {/* MR sub */}
      <line x1="28" y1="16" x2="31" y2="21" stroke={AMBER2} strokeWidth={SW} strokeLinecap="round" />
      <circle cx="31.5" cy="22.5" r={1.5} stroke={AMBER2} strokeWidth={SW} fill="none" />
      {/* Lower-left */}
      <line x1="17" y1="27" x2="11" y2="23" stroke={AMBER2} strokeWidth={SW} strokeLinecap="round" />
      <circle cx="10" cy="22" r={1.5} stroke={AMBER2} strokeWidth={SW} fill="none" />
      {/* Lower-right */}
      <line x1="17" y1="27" x2="23" y2="23" stroke={AMBER2} strokeWidth={SW} strokeLinecap="round" />
      <circle cx="24" cy="22" r={1.5} stroke={AMBER2} strokeWidth={SW} fill="none" />
    </svg>
  );
}

/** Icon badge wrapper — warm cream, rounded-xl, centered */
function PlanIcon({ variant }: { variant: "sprout" | "flower" | "tree" }) {
  return (
    <div
      className="flex items-center justify-center rounded-xl mb-4"
      style={{ width: "54px", height: "54px", background: "#FEF3E2" }}
    >
      {variant === "sprout" && <IconSprout />}
      {variant === "flower" && <IconFlower />}
      {variant === "tree"   && <IconTree />}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "annually">("monthly");
  const navigate = useNavigate();

  const proPrice = billing === "monthly" ? "£49.99" : "£39.99";
  const maxPrice = billing === "monthly" ? "£99.99" : "£79.99";

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white font-eden antialiased">
      <LandingNav />

      <main style={{ background: "#FFFFFF" }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14 lg:py-20">

          {/* ── Hero header ── */}
          <div className="flex flex-col items-center text-center mb-10">

            {/* Trust pill — thin border, small amber star */}
            <div
              className="mb-6 inline-flex items-center gap-1.5 rounded-full px-4 py-1"
              style={{ border: "1px solid #E5E7EB", background: "#FFFFFF", fontSize: "12.5px", color: "#4B5563" }}
            >
              <Star size={12} style={{ color: AMBER2, fill: AMBER2 }} />
              Trusted by churches to manage ministry and mission
            </div>

            {/* Headline — large, heavy, dark navy */}
            <h1
              className="mb-3 leading-tight tracking-tight font-eden text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-[#0F172A]"
              style={{
                letterSpacing: "-0.02em",
              }}
            >
              Pricing
            </h1>

            {/* Sub-headline */}
            <p style={{ fontSize: "16px", color: "#6B7280", marginBottom: "24px" }}>
              Choose the plan that fits your church today.
            </p>

            {/* Billing toggle — pill with border, no gap between options */}
            <div
              className="inline-flex items-center rounded-full p-1"
              style={{ border: "1.5px solid #E5E7EB", background: "#FFFFFF" }}
            >
              <button
                onClick={() => setBilling("monthly")}
                className="rounded-full px-6 py-1.5 text-sm font-semibold transition-all duration-200"
                style={{
                  background: billing === "monthly" ? NAVY : "transparent",
                  color: billing === "monthly" ? "#FFFFFF" : "#6B7280",
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling("annually")}
                className="inline-flex items-center gap-2 rounded-full px-6 py-1.5 text-sm font-semibold transition-all duration-200"
                style={{
                  background: billing === "annually" ? NAVY : "transparent",
                  color: billing === "annually" ? "#FFFFFF" : "#6B7280",
                }}
              >
                Annually
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-bold"
                  style={{ background: "#D1FAE5", color: "#059669", fontSize: "11px" }}
                >
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* ── Pricing cards grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 items-start">

            {/* ─── FREE ─── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0 }}
              className="rounded-2xl flex flex-col"
              style={{
                padding: "28px",
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
              }}
            >
              <PlanIcon variant="sprout" />

              {/* Plan name */}
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: NAVY, marginBottom: "4px" }}>
                Free
              </h2>
              {/* Tagline */}
              <p style={{ fontSize: "12.5px", color: "#9CA3AF", marginBottom: "18px" }}>
                For churches getting started
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-0.5">
                <span style={{ fontSize: "38px", fontWeight: 800, color: NAVY, lineHeight: 1, letterSpacing: "-0.02em" }}>
                  £0
                </span>
              </div>
              <p style={{ fontSize: "11.5px", color: "#9CA3AF", marginBottom: "18px" }}>Forever free</p>

              {/* CTA */}
              <button
                onClick={() => navigate("/onboarding/welcome")}
                className="w-full rounded-xl py-2 text-sm font-semibold transition-all duration-150 hover:bg-slate-50 active:scale-95 mb-5"
                style={{ border: "1.5px solid #D1D5DB", color: NAVY, background: "transparent" }}
              >
                Get Started Free
              </button>

              {/* Features */}
              <ul className="flex flex-col gap-2">
                {FREE_FEATURES.map((f) => <FeatureCheck key={f} text={f} />)}
              </ul>
            </motion.div>

            {/* ─── PRO (highlighted) ─── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.07 }}
              className="relative rounded-2xl flex flex-col"
              style={{
                padding: "28px",
                background: "#FFFFFF",
                border: `2px solid ${AMBER2}`,
                boxShadow: "0 6px 28px rgba(212,160,23,0.16), 0 1px 6px rgba(0,0,0,0.05)",
              }}
            >
              {/* MOST POPULAR pill — overlaps top border */}
              <div className="absolute -top-[14px] left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span
                  className="inline-block rounded-full px-4 py-1 text-xs font-bold"
                  style={{ background: AMBER2, color: "#FFFFFF", letterSpacing: "0.07em" }}
                >
                  MOST POPULAR
                </span>
              </div>

              <PlanIcon variant="flower" />

              <h2 style={{ fontSize: "20px", fontWeight: 700, color: NAVY, marginBottom: "4px" }}>
                Pro
              </h2>
              <p style={{ fontSize: "12.5px", color: "#9CA3AF", marginBottom: "18px" }}>
                For growing churches
              </p>

              {/* Price row: large bold price + /month inline */}
              <div className="flex items-baseline gap-1.5 mb-4">
                <span style={{ fontSize: "38px", fontWeight: 800, color: NAVY, lineHeight: 1, letterSpacing: "-0.02em" }}>
                  {proPrice}
                </span>
                <span style={{ fontSize: "13px", color: "#9CA3AF", fontWeight: 400 }}>/month</span>
              </div>

              {/* Solid amber CTA */}
              <button
                onClick={() => navigate("/onboarding/welcome")}
                className="w-full rounded-xl py-2.5 text-sm font-semibold transition-all duration-150 hover:opacity-90 active:scale-95 mb-5"
                style={{ background: AMBER2, color: "#FFFFFF", border: "none" }}
              >
                Start Pro Trial
              </button>

              {/* Section label */}
              <p style={{ fontSize: "12.5px", fontWeight: 700, color: NAVY, marginBottom: "10px" }}>
                Everything in Free, plus:
              </p>
              <ul className="flex flex-col gap-2">
                {PRO_FEATURES.map((f) => <FeatureCheck key={f} text={f} />)}
              </ul>
            </motion.div>

            {/* ─── MAX ─── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.14 }}
              className="rounded-2xl flex flex-col"
              style={{
                padding: "28px",
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
              }}
            >
              <PlanIcon variant="tree" />

              <h2 style={{ fontSize: "20px", fontWeight: 700, color: NAVY, marginBottom: "4px" }}>
                Max
              </h2>
              <p style={{ fontSize: "12.5px", color: "#9CA3AF", marginBottom: "18px" }}>
                For established churches and larger ministries
              </p>

              <div className="flex items-baseline gap-1.5 mb-4">
                <span style={{ fontSize: "38px", fontWeight: 800, color: NAVY, lineHeight: 1, letterSpacing: "-0.02em" }}>
                  {maxPrice}
                </span>
                <span style={{ fontSize: "13px", color: "#9CA3AF", fontWeight: 400 }}>/month</span>
              </div>

              <button
                onClick={() => navigate("/onboarding/welcome")}
                className="w-full rounded-xl py-2 text-sm font-semibold transition-all duration-150 hover:bg-slate-50 active:scale-95 mb-5"
                style={{ border: "1.5px solid #D1D5DB", color: NAVY, background: "transparent" }}
              >
                Start Max Trial
              </button>

              <p style={{ fontSize: "12.5px", fontWeight: 700, color: NAVY, marginBottom: "10px" }}>
                Everything in Pro, plus:
              </p>
              <ul className="flex flex-col gap-2">
                {MAX_FEATURES.map((f) => <FeatureCheck key={f} text={f} />)}
              </ul>
            </motion.div>
          </div>

          {/* ── Trust bar ── */}
          <div
            className="rounded-2xl px-8 py-5 mb-5"
            style={{ background: "#F9FAFB", border: "1px solid #F3F4F6" }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {TRUST_ITEMS.map(({ icon: Icon, title, sub }) => (
                <div key={title} className="flex items-center gap-3">
                  {/* Icon — amber tint circle */}
                  <div
                    className="flex-shrink-0 flex items-center justify-center rounded-full"
                    style={{ width: "36px", height: "36px", background: "rgba(200,134,10,0.1)" }}
                  >
                    <Icon size={16} style={{ color: AMBER2 }} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: NAVY, lineHeight: 1.3 }}>{title}</p>
                    <p style={{ fontSize: "11.5px", color: "#9CA3AF", lineHeight: 1.3 }}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security note */}
          <div className="flex items-center justify-center gap-1.5">
            <Lock size={12} style={{ color: "#9CA3AF" }} />
            <p style={{ fontSize: "12px", color: "#9CA3AF" }}>
              All plans include secure payments and 24/7 system monitoring.
            </p>
          </div>

        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
