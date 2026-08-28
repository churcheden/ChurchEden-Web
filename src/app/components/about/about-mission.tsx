import { motion } from "motion/react";
import { Users, Wallet, Target } from "lucide-react";
import churchedenFavicon from "@/assets/churcheden_favicon.png";

const PILLARS = [
  {
    icon: Users,
    title: "People",
    description: "Technology that helps churches know and serve their people.",
  },
  {
    icon: Wallet,
    title: "Stewardship",
    description: "Simple, transparent tools for managing resources responsibly.",
  },
  {
    icon: Target,
    title: "Growth",
    description: "Insights and tools that help ministries understand and grow their communities.",
  },
];

export function AboutMission() {
  return (
    <section className="w-full bg-[#FFFFFF] py-16 lg:py-24">
      <div className="mx-auto max-w-[1320px] px-6 sm:px-8 lg:px-10">
        
        {/* Dark Navy Rounded Container */}
        <div
          className="relative overflow-hidden rounded-3xl bg-[#07182F] p-8 sm:p-12 lg:p-20 text-[#F7F5F0] shadow-xl border border-white/05"
        >
          {/* Subtle Watermark Logo Mark on the left */}
          <div className="absolute -left-12 -bottom-12 sm:left-4 sm:top-1/2 sm:-translate-y-1/2 opacity-[0.08] pointer-events-none">
            <img src={churchedenFavicon} alt="" className="h-64 w-64 sm:h-80 sm:w-80 object-contain" />
          </div>

          <div className="relative z-10">
            {/* Eyebrow */}
            <span className="mb-4 inline-block text-[12px] font-bold tracking-[0.1em] uppercase text-[#D79A22]">
              OUR MISSION
            </span>

            {/* Main Headline */}
            <h2
              className="mb-14 sm:mb-16 max-w-[760px] font-serif text-3xl sm:text-4xl lg:text-[3.25rem] font-semibold text-[#F7F5F0] leading-[1.15] tracking-tight"
              style={{ fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" }}
            >
              Give churches the technology to focus on what matters most.
            </h2>

            {/* 3 Pillars with vertical dividers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {PILLARS.map((pillar, idx) => (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className={`flex flex-col items-start ${
                    idx !== PILLARS.length - 1 ? "md:border-r md:border-white/10 md:pr-8 lg:pr-12" : ""
                  }`}
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/05 border border-white/10">
                    <pillar.icon size={22} className="text-[#D79A22]" strokeWidth={1.5} />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white">
                    {pillar.title}
                  </h3>
                  <p className="text-[14.5px] leading-relaxed text-[#CBD5E1]">
                    {pillar.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
