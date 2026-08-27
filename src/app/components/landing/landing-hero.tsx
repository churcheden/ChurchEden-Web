import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  Play,
  Star,
  CheckCircle,
  ShieldCheck,
  Heart,
  Users,
  Calendar,
  DollarSign,
  MoreHorizontal,
  TrendingUp,
} from "lucide-react";
import heroImg from "@/assets/landing-hero.png";

const TRUST_BADGES = [
  { icon: CheckCircle, label: "Easy to use" },
  { icon: ShieldCheck, label: "Secure & Reliable" },
  { icon: Heart, label: "Built for Ministries" },
];

const NAV_TOOLBAR = [
  { icon: Users, label: "Members" },
  { icon: CheckCircle, label: "Attendance" },
  { icon: DollarSign, label: "Donations" },
  { icon: Calendar, label: "Events" },
  { icon: Users, label: "Groups" },
  { icon: MoreHorizontal, label: "More" },
];

/**
 * Light SaaS-style hero section.
 * Left:  headline, subtext, CTAs, trust badges.
 * Right: Church photo in a rounded card with the Kingdom Impact stat card
 *        floating over the bottom-right corner and the nav toolbar attached
 *        to the very bottom edge of the image.
 */
export function LandingHero() {
  const navigate = useNavigate();

  return (
    <section className="bg-[#FAFAF8] py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* LEFT COLUMN */}
          <div className="flex flex-col items-start">
            {/* Trusted pill badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-7 flex items-center gap-2 rounded-full border border-[#D4A017]/40 bg-[#FFF9EC] px-4 py-1.5"
            >
              <Star size={13} className="fill-[#D4A017] text-[#D4A017]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#D4A017]">
                Trusted by 500+ Churches Worldwide
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mb-6 flex flex-col leading-[1.1]"
            >
              <span className="text-4xl font-extrabold text-[#0F172A] sm:text-5xl lg:text-[3.25rem]">
                Faith You Can Track.
              </span>
              <span className="text-4xl font-extrabold text-[#D4A017] sm:text-5xl lg:text-[3.25rem]">
                Growth You Can Trust.
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8 max-w-[500px] text-base leading-relaxed text-slate-500 sm:text-lg"
            >
              ChurchEden is a complete church management system built for modern
              ministries to manage members, track attendance, organize events, and
              grow giving—all in one place.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mb-8 flex flex-wrap items-center gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.03, filter: "brightness(1.05)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/onboarding/welcome")}
                id="hero-start-free-trial"
                className="flex items-center gap-2 rounded-xl bg-[#D4A017] px-7 py-3.5 text-base font-semibold text-white shadow-md shadow-[#D4A017]/30 transition-all"
              >
                Start Free Trial
                <ArrowRight size={17} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                id="hero-watch-demo"
                className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-base font-semibold text-[#0F172A] transition-all hover:border-slate-400 hover:bg-slate-50"
              >
                <Play size={15} className="fill-[#0F172A] text-[#0F172A]" />
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Trust badges row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap items-center gap-3"
            >
              {TRUST_BADGES.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm ring-1 ring-slate-200"
                >
                  <Icon size={13} className="text-[#D4A017]" />
                  {label}
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT COLUMN — Hero photo with overlapping floating cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            {/* ── Image card ── */}
            <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-slate-900/15 ring-1 ring-slate-900/5">
              <img
                src={heroImg}
                alt="Church community"
                className="w-full object-cover"
              />

              {/* Kingdom Impact — floats over bottom-right of image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="absolute bottom-16 right-4 z-10 w-48 rounded-xl bg-white/95 p-3.5 shadow-xl shadow-slate-900/20 ring-1 ring-slate-100 backdrop-blur-sm"
              >
                <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Kingdom Impact
                </p>
                <p className="text-[1.6rem] font-extrabold leading-none text-[#0F172A]">
                  12,598
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Lives touched this month
                </p>
                <div className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                  <TrendingUp size={11} />
                  <span>↑18%</span>
                </div>
              </motion.div>

              {/* Nav toolbar — attached right at the bottom edge of the image */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-around bg-white/95 px-4 py-3 backdrop-blur-sm"
              >
                {NAV_TOOLBAR.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1 text-slate-500 transition-colors hover:text-[#D4A017]"
                  >
                    <Icon size={16} />
                    <span className="text-[10px] font-medium">{label}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


