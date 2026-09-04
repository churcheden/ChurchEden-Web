import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import aboutHeroImg from "@/assets/about-hero.jpg";

export function AboutHero() {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleScrollToStory = () => {
    const el = document.getElementById("our-story");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full overflow-hidden min-h-[560px] lg:min-h-[640px] flex items-center bg-[#0C1524]">
      {/* Low-weight blurred background placeholder layer — prevents solid blue block before load */}
      <div
        className="absolute inset-0 z-0 transition-opacity duration-1000"
        style={{
          background: "radial-gradient(circle at 70% 50%, rgba(30, 45, 66, 0.6) 0%, rgba(12, 21, 36, 1) 100%)",
          filter: "blur(20px)",
          transform: "scale(1.1)",
        }}
      />

      {/* Background Image positioned on right with smooth fade-in */}
      <div className="absolute inset-0 z-0">
        <img
          src={aboutHeroImg}
          alt="Diverse church community gathering in warm fellowship"
          loading="eager"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`h-full w-full object-cover object-center lg:object-right transition-opacity duration-700 ease-out ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
        {/* Subtle smear gradient overlay — fades in gracefully as image loads */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            isLoaded ? "opacity-100" : "opacity-30"
          }`}
          style={{
            background: `linear-gradient(
              90deg,
              rgba(7, 24, 47, 0.98) 0%,
              rgba(7, 24, 47, 0.92) 32%,
              rgba(7, 24, 47, 0.70) 55%,
              rgba(7, 24, 47, 0.25) 80%,
              rgba(7, 24, 47, 0.10) 100%
            )`,
          }}
        />
      </div>

      {/* Hero Content on the left */}
      <div className="relative z-10 mx-auto w-full max-w-[1320px] px-6 sm:px-8 lg:px-10 py-20 lg:py-28">
        <div className="max-w-[560px]">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-4 inline-block text-[12px] font-bold tracking-[0.1em] uppercase text-[#D79A22]"
          >
            ABOUT CHURCHEDEN
          </motion.div>

          {/* Headline (editorial serif) */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mb-6 font-serif text-4xl sm:text-5xl lg:text-[4rem] font-semibold leading-[1.12] text-[#F7F5F0] tracking-tight"
            style={{ fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" }}
          >
            Built for the<br />
            people behind<br />
            the ministry.
          </motion.h1>

          {/* Supporting copy */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mb-8 text-base sm:text-lg leading-relaxed text-[#D2D7E0] max-w-[480px]"
          >
            ChurchEden exists to make church management simpler, so leaders can
            spend less time managing systems and more time serving people.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
          >
            <button
              onClick={handleScrollToStory}
              className="inline-flex items-center gap-2 rounded-lg bg-[#C98A16] px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#C98A16]/25 transition-all duration-200 hover:bg-[#B97808] active:scale-95"
            >
              Our Story
              <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
