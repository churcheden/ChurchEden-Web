import { useState } from "react";
import { Check, Shield, CreditCard, Headphones, Lock, Star, Crown, Sprout, Flower2, TreePine } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { LandingNav } from "./landing-nav";
import { LandingFooter } from "./landing-footer";

// ─── Design tokens ────────────────────────────────────────────────────────────
const NAVY   = "#0F172A";
const AMBER  = "#C8860A";
const AMBER2 = "#D4A017";

// ─── Data ─────────────────────────────────────────────────────────────────────

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
  {
    icon: Shield,
    title: "Secure & Reliable",
    sub: "Your data is safe with us",
  },
  {
    icon: CreditCard,
    title: "Easy to Use",
    sub: "Designed for church teams",
  },
  {
    icon: Headphones,
    title: "Support That Cares",
    sub: "We're here to help",
  },
  {
    icon: Lock,
    title: "Cancel Anytime",
    sub: "No long-term contracts",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FeatureCheck({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2.5">
      <span
        className="mt-0.5 flex h-4.5 w-4.5 flex-shrink-0 items-center justify-center rounded-full"
        style={{ background: "rgba(200,134,10,0.12)", minWidth: "18px", minHeight: "18px" }}
      >
        <Check size={10} style={{ color: AMBER, strokeWidth: 3 }} />
      </span>
      <span style={{ fontSize: "13.5px", color: "#4B5563", lineHeight: 1.5 }}>{text}</span>
    </li>
  );
}

function PlanIcon({ Icon, bg = "#FEF3E2" }: { Icon: React.ElementType; bg?: string }) {
  return (
    <div
      className="flex items-center justify-center rounded-xl"
      style={{ width: "52px", height: "52px", background: bg, marginBottom: "14px" }}
    >
      <Icon size={24} style={{ color: AMBER2 }} strokeWidth={1.5} />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "annually">("monthly");
  const navigate = useNavigate();

  const proPrice  = billing === "monthly" ? "£49.99" : "£39.99";
  const maxPrice  = billing === "monthly" ? "£99.99" : "£79.99";

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white font-eden antialiased">
      <LandingNav />

      {/* ── Page content ── */}
      <main style={{ background: "#FAFAF8" }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10 py-16 lg:py-24">

          {/* ── Header ── */}
          <div className="flex flex-col items-center text-center mb-12">

            {/* Trust pill */}
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
              style={{
                border: "1px solid #E5E7EB",
                background: "#FFFFFF",
                color: "#374151",
                fontSize: "13px",
              }}
            >
              <Star size={13} style={{ color: AMBER2, fill: AMBER2 }} />
              Trusted by churches to manage ministry and mission
            </div>

            {/* Headline */}
            <h1
              className="mb-4 text-4xl sm:text-5xl lg:text-[3.25rem] font-bold leading-tight tracking-tight"
              style={{ color: NAVY, fontFamily: "var(--font-heading)" }}
            >
              Simple pricing. Powerful{" "}
              <span style={{ color: AMBER2 }}>ministry.</span>
            </h1>

            {/* Sub-headline */}
            <p style={{ fontSize: "17px", color: "#6B7280", marginBottom: "28px" }}>
              Choose the plan that fits your church today.
            </p>

            {/* Billing toggle */}
            <div
              className="inline-flex items-center gap-3 rounded-full p-1"
              style={{ border: "1px solid #E5E7EB", background: "#FFFFFF" }}
            >
              <button
                onClick={() => setBilling("monthly")}
                className="rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200"
                style={{
                  background: billing === "monthly" ? NAVY : "transparent",
                  color: billing === "monthly" ? "#FFFFFF" : "#6B7280",
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling("annually")}
                className="flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200"
                style={{
                  background: billing === "annually" ? NAVY : "transparent",
                  color: billing === "annually" ? "#FFFFFF" : "#6B7280",
                }}
              >
                Annually
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-bold"
                  style={{ background: "#D1FAE5", color: "#065F46" }}
                >
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* ── Pricing cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-start">

            {/* ─── Free card ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0 }}
              className="rounded-2xl p-7 flex flex-col"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
              }}
            >
              <PlanIcon Icon={Sprout} />
              <h2 style={{ fontSize: "22px", fontWeight: 700, color: NAVY, marginBottom: "4px" }}>Free</h2>
              <p style={{ fontSize: "13px", color: "#9CA3AF", marginBottom: "20px" }}>
                For churches getting started
              </p>

              <div className="mb-1 flex items-baseline gap-1">
                <span style={{ fontSize: "40px", fontWeight: 800, color: NAVY, lineHeight: 1 }}>£0</span>
              </div>
              <p style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "20px" }}>Forever free</p>

              <button
                onClick={() => navigate("/onboarding/welcome")}
                className="w-full rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 hover:bg-slate-50 active:scale-95 mb-6"
                style={{
                  border: "1.5px solid #D1D5DB",
                  color: NAVY,
                  background: "transparent",
                }}
              >
                Get Started Free
              </button>

              <ul className="flex flex-col gap-2.5">
                {FREE_FEATURES.map((f) => <FeatureCheck key={f} text={f} />)}
              </ul>
            </motion.div>

            {/* ─── Pro card (highlighted) ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="relative rounded-2xl p-7 flex flex-col"
              style={{
                background: "#FFFFFF",
                border: `2px solid ${AMBER2}`,
                boxShadow: "0 8px 32px rgba(212,160,23,0.18), 0 1px 8px rgba(0,0,0,0.06)",
              }}
            >
              {/* Most Popular badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span
                  className="inline-block rounded-full px-4 py-1 text-xs font-bold tracking-wider"
                  style={{ background: AMBER2, color: "#FFFFFF", letterSpacing: "0.08em" }}
                >
                  MOST POPULAR
                </span>
              </div>

              <PlanIcon Icon={Flower2} />
              <h2 style={{ fontSize: "22px", fontWeight: 700, color: NAVY, marginBottom: "4px" }}>Pro</h2>
              <p style={{ fontSize: "13px", color: "#9CA3AF", marginBottom: "20px" }}>
                For growing churches
              </p>

              <div className="mb-1 flex items-baseline gap-1">
                <span style={{ fontSize: "40px", fontWeight: 800, color: NAVY, lineHeight: 1 }}>
                  {proPrice}
                </span>
                <span style={{ fontSize: "14px", color: "#9CA3AF" }}>/month</span>
              </div>
              <div style={{ marginBottom: "20px", height: "18px" }} />

              <button
                onClick={() => navigate("/onboarding/welcome")}
                className="w-full rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95 mb-6"
                style={{
                  background: `linear-gradient(90deg, ${AMBER} 0%, ${AMBER2} 100%)`,
                  color: "#FFFFFF",
                  border: "none",
                }}
              >
                Start Pro Trial
              </button>

              <p style={{ fontSize: "12.5px", fontWeight: 700, color: NAVY, marginBottom: "12px" }}>
                Everything in Free, plus:
              </p>
              <ul className="flex flex-col gap-2.5">
                {PRO_FEATURES.map((f) => <FeatureCheck key={f} text={f} />)}
              </ul>
            </motion.div>

            {/* ─── Max card ─── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.16 }}
              className="rounded-2xl p-7 flex flex-col"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
              }}
            >
              <PlanIcon Icon={TreePine} />
              <h2 style={{ fontSize: "22px", fontWeight: 700, color: NAVY, marginBottom: "4px" }}>Max</h2>
              <p style={{ fontSize: "13px", color: "#9CA3AF", marginBottom: "20px" }}>
                For established churches and larger ministries
              </p>

              <div className="mb-1 flex items-baseline gap-1">
                <span style={{ fontSize: "40px", fontWeight: 800, color: NAVY, lineHeight: 1 }}>
                  {maxPrice}
                </span>
                <span style={{ fontSize: "14px", color: "#9CA3AF" }}>/month</span>
              </div>
              <div style={{ marginBottom: "20px", height: "18px" }} />

              <button
                onClick={() => navigate("/onboarding/welcome")}
                className="w-full rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 hover:bg-slate-50 active:scale-95 mb-6"
                style={{
                  border: "1.5px solid #D1D5DB",
                  color: NAVY,
                  background: "transparent",
                }}
              >
                Start Max Trial
              </button>

              <p style={{ fontSize: "12.5px", fontWeight: 700, color: NAVY, marginBottom: "12px" }}>
                Everything in Pro, plus:
              </p>
              <ul className="flex flex-col gap-2.5">
                {MAX_FEATURES.map((f) => <FeatureCheck key={f} text={f} />)}
              </ul>
            </motion.div>
          </div>

          {/* ── Trust bar ── */}
          <div
            className="rounded-2xl px-6 py-6 mb-6"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E5E7EB",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {TRUST_ITEMS.map(({ icon: Icon, title, sub }) => (
                <div key={title} className="flex flex-col items-center text-center gap-2">
                  <div
                    className="flex items-center justify-center rounded-full"
                    style={{ width: "40px", height: "40px", background: "rgba(200,134,10,0.1)" }}
                  >
                    <Icon size={18} style={{ color: AMBER2 }} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p style={{ fontSize: "13.5px", fontWeight: 700, color: NAVY }}>{title}</p>
                    <p style={{ fontSize: "12px", color: "#9CA3AF" }}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security note */}
          <div className="flex items-center justify-center gap-2">
            <Lock size={13} style={{ color: "#9CA3AF" }} />
            <p style={{ fontSize: "12.5px", color: "#9CA3AF" }}>
              All plans include secure payments and 24/7 system monitoring.
            </p>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
