import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Bird, ChevronDown, Menu, X } from "lucide-react";
import { cn } from "../ui/utils";

const NAV_LINKS = [
  { label: "Product", hasDropdown: true },
  { label: "Pricing", hasDropdown: false },
  { label: "Resources", hasDropdown: true },
  { label: "About Us", hasDropdown: false },
];

/**
 * Sticky top navigation for the light SaaS landing page.
 * White background, dark-navy wordmark, gold CTA.
 */
export function LandingNav() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F172A]">
            <Bird size={18} strokeWidth={1.75} className="text-[#D4A017]" />
          </div>
          <span className="font-eden text-xl font-bold tracking-tight text-[#0F172A]">
            ChurchEden
          </span>
        </div>

        {/* Center nav links — desktop */}
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              className="flex items-center gap-1 text-sm font-medium text-slate-600 transition-colors hover:text-[#0F172A]"
            >
              {link.label}
              {link.hasDropdown && (
                <ChevronDown size={14} className="text-slate-400" />
              )}
            </button>
          ))}
        </nav>

        {/* Right CTAs — desktop */}
        <div className="hidden items-center gap-3 lg:flex">
          <button className="rounded-lg border border-[#0F172A]/20 px-5 py-2 text-sm font-medium text-[#0F172A] transition-all hover:bg-slate-50">
            Log in
          </button>
          <motion.button
            whileHover={{ scale: 1.02, filter: "brightness(1.05)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/onboarding/welcome")}
            className="rounded-lg bg-[#D4A017] px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-[#D4A017]/30 transition-all hover:bg-[#C49010]"
          >
            Get Started
          </motion.button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X size={22} className="text-[#0F172A]" />
          ) : (
            <Menu size={22} className="text-[#0F172A]" />
          )}
        </button>
      </div>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-gray-100 bg-white lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50",
                  )}
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown size={14} className="text-slate-400" />}
                </button>
              ))}
              <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3">
                <button className="w-full rounded-lg border border-[#0F172A]/20 py-2.5 text-sm font-medium text-[#0F172A]">
                  Log in
                </button>
                <button
                  onClick={() => navigate("/onboarding/welcome")}
                  className="w-full rounded-lg bg-[#D4A017] py-2.5 text-sm font-semibold text-white"
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
