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
 * Right: Mocked product dashboard card.
 */
export function LandingFeatures() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* LEFT: heading + feature list */}
          <div>
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
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
                  >
                    <Icon size={20} className={iconColor} />
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

          {/* RIGHT: Real dashboard screenshot */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="overflow-hidden rounded-2xl shadow-2xl shadow-slate-900/10 ring-1 ring-slate-200"
          >
            <img
              src={dashboardImg}
              alt="ChurchEden Dashboard"
              className="w-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
