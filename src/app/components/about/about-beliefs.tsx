import { motion } from "motion/react";
import { Eye, Users, Shield, Sparkles } from "lucide-react";

const BELIEFS = [
  {
    icon: Eye,
    title: "Technology should feel invisible.",
    description: "The best church software doesn't get in the way.",
  },
  {
    icon: Users,
    title: "People come before data.",
    description: "Every member isn't just a profile in a database.",
  },
  {
    icon: Shield,
    title: "Stewardship deserves trust.",
    description: "Church finances require transparency, security, and accountability.",
  },
  {
    icon: Sparkles,
    title: "Simplicity is powerful.",
    description: "Church leaders shouldn't need to be technology experts to use powerful software.",
  },
];

export function AboutBeliefs() {
  return (
    <section className="w-full bg-[#FAFAF8] py-20 lg:py-28 border-b border-[#0F1E32]/05">
      <div className="mx-auto max-w-[1320px] px-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-start">
          
          {/* LEFT SIDE: Heading (approx 30%) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <span className="mb-3 text-[12px] font-bold tracking-[0.1em] uppercase text-[#C98A16]">
              WHAT WE BELIEVE
            </span>

            <h2
              className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-[#07182F] leading-[1.18] tracking-tight"
              style={{ fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" }}
            >
              Technology should<br />
              serve, not get<br />
              in the way.
            </h2>
          </div>

          {/* RIGHT SIDE: 4 Belief Cards (approx 70%) */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {BELIEFS.map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.08 }}
                  className="rounded-2xl bg-white p-6 sm:p-7 border border-[#0F1E32]/08 shadow-sm flex flex-col items-start transition-all hover:shadow-md"
                >
                  {/* Icon in soft gold circle */}
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#C98A16]/10 text-[#C98A16]">
                    <item.icon size={18} strokeWidth={1.75} />
                  </div>

                  <h3 className="mb-2 text-[15px] font-bold text-[#07182F] leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-[13.5px] leading-relaxed text-[#5F6978]">
                    {item.description}
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
