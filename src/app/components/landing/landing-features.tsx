import { motion } from "motion/react";
import { Users, CheckSquare, Heart } from "lucide-react";
import dashboardImg from "@/assets/ChurchEden-Dasboard.png";

const FEATURES = [
  {
    icon: Users,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "Member Management",
    desc: "Keep member profiles, families, and contact information organized and up to date.",
  },
  {
    icon: CheckSquare,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    title: "Attendance Tracking",
    desc: "Effortlessly track church attendance and engagement over time.",
  },
  {
    icon: Heart,
    iconBg: "bg-red-100",
    iconColor: "text-rose-500",
    title: "Giving & Donations",
    desc: "Accept donations, track giving history, and generate reports with ease.",
  },
];



/**
 * Two-column "Everything your church needs" section.
 * Left: heading + 3 feature rows.
 * Right: High-resolution product dashboard showcase screenshot.
 */
export function LandingFeatures() {
  return (
    <section className="bg-white pt-10 pb-16 lg:pt-14 lg:pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* LEFT: heading + feature list */}
          <div className="lg:col-span-5">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-4 text-3xl font-extrabold leading-tight text-[#0F172A] sm:text-4xl"
            >
              Everything your church needs,
              <br />
              in one powerful platform
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mb-10 text-base text-slate-500"
            >
              From member management to ministry growth, ChurchEden helps you
              focus on what matters most—your people and your mission.
            </motion.p>

            <div className="flex flex-col gap-7">
              {FEATURES.map(({ icon: Icon, iconBg, iconColor, title, desc }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBg} shadow-sm`}
                  >
                    <Icon size={22} className={iconColor} />
                  </div>
                  <div>
                    <h3 className="mb-1 text-base font-bold text-[#0F172A]">
                      {title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-500">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT: Real dashboard screenshot — enlarged width and length showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="overflow-hidden rounded-3xl bg-slate-900/5 p-2 shadow-2xl shadow-slate-900/15 ring-1 ring-slate-200 lg:col-span-7"
          >
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
              <img
                src={dashboardImg}
                alt="ChurchEden Dashboard"
                className="w-full h-auto object-cover transition-transform duration-500 hover:scale-[1.01]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
