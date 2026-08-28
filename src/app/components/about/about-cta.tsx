import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import churchedenFavicon from "@/assets/churcheden_favicon.png";

export function AboutCTA() {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-[#FFFFFF] pb-20 lg:pb-28">
      <div className="mx-auto max-w-[1320px] px-6 sm:px-8 lg:px-10">
        
        <div
          className="relative overflow-hidden rounded-3xl bg-[#07182F] px-8 py-16 sm:px-14 sm:py-20 lg:px-20 lg:py-24 text-white shadow-2xl border border-white/05"
        >
          {/* Large subtle background watermark in bottom-right */}
          <div className="absolute -right-16 -bottom-16 opacity-[0.06] pointer-events-none">
            <img src={churchedenFavicon} alt="" className="h-80 w-80 sm:h-96 sm:w-96 object-contain" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
            {/* Left Headline + Copy */}
            <div className="max-w-[620px]">
              <h2
                className="mb-4 font-serif text-3xl sm:text-4xl lg:text-[3.25rem] font-semibold text-[#F7F5F0] leading-[1.15] tracking-tight"
                style={{ fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" }}
              >
                The church is growing.<br />
                Its <span className="text-[#D79A22]">technology</span> should too.
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-[#CBD5E1]">
                Join churches building a simpler, more connected future with ChurchEden.
              </p>
            </div>

            {/* Right Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 flex-shrink-0">
              <button
                onClick={() => navigate("/onboarding/welcome")}
                className="inline-flex items-center gap-2 rounded-lg bg-[#C98A16] px-6 sm:px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#C98A16]/25 transition-all duration-200 hover:bg-[#B97808] active:scale-95"
              >
                Get Started
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => navigate("/onboarding/welcome")}
                className="inline-flex items-center rounded-lg border border-white/30 bg-transparent px-6 sm:px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10 active:scale-95"
              >
                Talk to Us
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
