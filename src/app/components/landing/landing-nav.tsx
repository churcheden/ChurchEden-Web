import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "../ui/utils";
import churchedenFavicon from "@/assets/churcheden_favicon.png";

const NAV_LINKS = [
  { label: "Home", href: "/", hasDropdown: false },
  { label: "Pricing", href: "/pricing", hasDropdown: false },
  { label: "Resources", href: "#", hasDropdown: false },
  { label: "About Us", href: "/about", hasDropdown: false },
];

/**
 * Sticky top navigation for the light SaaS landing page.
 * White background, crisp gold ChurchEden emblem + dark-navy wordmark, gold CTA.
 */
export function LandingNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        {/* Logo lockup: High-res circular emblem + ChurchEden wordmark */}
        <div
          onClick={() => navigate("/")}
          className="flex cursor-pointer items-center gap-2.5 sm:gap-3 transition-opacity hover:opacity-90"
        >
          <img
            src={churchedenFavicon}
            alt="ChurchEden"
            className="h-9 w-9 sm:h-10 sm:w-10 object-contain transition-transform hover:scale-105"
          />
          <span className="font-eden text-xl sm:text-[1.35rem] font-bold tracking-tight text-[#0F172A]">
            ChurchEden
          </span>
        </div>

        {/* Center nav links — desktop */}
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <button
                key={link.label}
                onClick={() => {
                  if (link.href === "/") {
                    navigate("/");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else if (link.href !== "#") {
                    navigate(link.href);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className={cn(
                  "relative flex items-center gap-1 text-sm font-medium transition-colors hover:text-[#C98A16]",
                  isActive ? "text-[#C98A16] font-semibold" : "text-slate-600"
                )}
              >
                {link.label}
                {link.hasDropdown && (
                  <ChevronDown size={14} className={isActive ? "text-[#C98A16]" : "text-slate-400"} />
                )}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#C98A16] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTAs — desktop */}
        <div className="hidden items-center gap-3 lg:flex">
          <button
            onClick={() => navigate("/onboarding/signin")}
            className="rounded-lg border border-[#0F172A]/20 px-5 py-2 text-sm font-medium text-[#0F172A] transition-all hover:bg-slate-50"
          >
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
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <button
                    key={link.label}
                    onClick={() => {
                      if (link.href === "/") {
                        navigate("/");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        setMobileOpen(false);
                      } else if (link.href !== "#") {
                        navigate(link.href);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        setMobileOpen(false);
                      }
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium hover:bg-slate-50",
                      isActive ? "text-[#C98A16] font-semibold bg-amber-50/50" : "text-slate-700"
                    )}
                  >
                    {link.label}
                    {link.hasDropdown && <ChevronDown size={14} className="text-slate-400" />}
                  </button>
                );
              })}
              <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3">
                <button
                  onClick={() => {
                    navigate("/onboarding/signin");
                    setMobileOpen(false);
                  }}
                  className="w-full rounded-lg border border-[#0F172A]/20 py-2.5 text-sm font-medium text-[#0F172A]"
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    navigate("/onboarding/welcome");
                    setMobileOpen(false);
                  }}
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
