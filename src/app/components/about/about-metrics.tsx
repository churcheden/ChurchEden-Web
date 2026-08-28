import { motion } from "motion/react";
import { Building2, Users, Landmark, HeartHandshake } from "lucide-react";

// Replace placeholder metrics with verified ChurchEden production data.
export const ABOUT_METRICS = [
  {
    icon: Building2,
    value: "500+",
    label: "Churches Trust ChurchEden",
  },
  {
    icon: Users,
    value: "10K+",
    label: "Members Managed",
  },
  {
    icon: Landmark,
    value: "£25M+",
    label: "Giving Processed",
  },
  {
    icon: HeartHandshake,
    value: "30+",
    label: "Ministries Supported",
  },
];

export function AboutMetrics() {
  return (
    <section className="w-full bg-[#FFFFFF] py-12 lg:py-16">
      <div className="mx-auto max-w-[1320px] px-6 sm:px-8 lg:px-10">
        
        {/* Dark Navy Metrics Container */}
        <div
          className="rounded-3xl bg-[#07182F] p-8 sm:p-10 lg:p-12 text-white shadow-xl border border-white/05"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {ABOUT_METRICS.map((metric, idx) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className={`flex items-center gap-4 ${
                  idx !== ABOUT_METRICS.length - 1 ? "lg:border-r lg:border-white/10 lg:pr-6" : ""
                }`}
              >
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white/05 border border-white/10">
                  <metric.icon size={22} className="text-[#D79A22]" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {metric.value}
                  </span>
                  <span className="text-[12.5px] text-[#94A3B8] font-medium leading-tight">
                    {metric.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
