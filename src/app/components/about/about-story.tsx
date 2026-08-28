import { motion } from "motion/react";
import { Puzzle, Lightbulb, Rocket } from "lucide-react";
import churchedenFavicon from "@/assets/churcheden_favicon.png";

const STEPS = [
  {
    number: "01",
    title: "The Problem",
    description: "Church administration became increasingly fragmented.",
    icon: Puzzle,
    isCustomIcon: false,
  },
  {
    number: "02",
    title: "The Idea",
    description: "Build one platform designed around how churches actually operate.",
    icon: Lightbulb,
    isCustomIcon: false,
  },
  {
    number: "03",
    title: "ChurchEden",
    description: "Members, attendance, giving, events, ministries, and communication brought together.",
    icon: null,
    isCustomIcon: true,
  },
  {
    number: "04",
    title: "The Future",
    description: "A connected digital ecosystem for churches everywhere.",
    icon: Rocket,
    isCustomIcon: false,
  },
];

export function AboutStory() {
  return (
    <section id="our-story" className="w-full bg-[#F7F5F0] py-20 lg:py-28 border-b border-[#0F1E32]/05">
      <div className="mx-auto max-w-[1320px] px-6 sm:px-8 lg:px-10">
        
        {/* Section Header */}
        <div className="mb-14 lg:mb-16">
          <span className="mb-3 inline-block text-[12px] font-bold tracking-[0.1em] uppercase text-[#C98A16]">
            OUR STORY
          </span>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <h2
              className="lg:col-span-6 font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-[#07182F] leading-[1.18] tracking-tight"
              style={{ fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" }}
            >
              We started with<br />
              a simple idea.
            </h2>
            <p className="lg:col-span-6 text-lg sm:text-xl font-medium text-[#4B5565] lg:pt-2">
              What if church technology actually felt simple?
            </p>
          </div>
        </div>

        {/* Timeline (horizontal desktop, vertical mobile) */}
        <div className="relative">
          {/* Subtle connecting dashed line on desktop */}
          <div className="hidden lg:block absolute top-7 left-[5%] right-[5%] h-0.5 border-t-2 border-dashed border-[#C98A16]/30 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative z-10">
            {STEPS.map((step, idx) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="flex flex-col items-start"
              >
                {/* Circular Icon Container */}
                <div
                  className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-[#C98A16]/35 shadow-sm shadow-[#C98A16]/10"
                >
                  {step.isCustomIcon ? (
                    <img src={churchedenFavicon} alt="ChurchEden" className="h-7 w-7 object-contain" />
                  ) : step.icon ? (
                    <step.icon size={22} className="text-[#C98A16]" strokeWidth={1.75} />
                  ) : null}
                </div>

                {/* Step Number */}
                <span className="text-sm font-bold text-[#07182F] tracking-wide mb-1">
                  {step.number}
                </span>

                {/* Title */}
                <h3 className="text-lg font-bold text-[#07182F] mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-[14px] leading-relaxed text-[#5F6978]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
