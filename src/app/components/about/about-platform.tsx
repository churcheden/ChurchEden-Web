import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { ArrowRight, Check, Users, Calendar, Heart, MessageSquare, BarChart3, Layers } from "lucide-react";
import churchedenFavicon from "@/assets/churcheden_favicon.png";

const MODULES = [
  { label: "Members", icon: Users, pos: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" },
  { label: "Attendance", icon: Calendar, pos: "top-[25%] right-0 translate-x-1/3" },
  { label: "Events & Ministries", icon: Layers, pos: "bottom-[20%] right-0 translate-x-1/4" },
  { label: "Giving & Payments", icon: Heart, pos: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2" },
  { label: "Communication", icon: MessageSquare, pos: "bottom-[20%] left-0 -translate-x-1/4" },
  { label: "Insights & Reports", icon: BarChart3, pos: "top-[25%] left-0 -translate-x-1/3" },
];

const BENEFITS = [
  {
    title: "All-in-one",
    desc: "Everything your church needs, connected in one place.",
  },
  {
    title: "Built for ministry",
    desc: "Designed specifically for how churches operate.",
  },
  {
    title: "Secure & reliable",
    desc: "Enterprise-grade security and 24/7 system monitoring.",
  },
  {
    title: "Always improving",
    desc: "Regular updates and new features based on church feedback.",
  },
];

export function AboutPlatform() {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-[#FFFFFF] py-20 lg:py-28 border-b border-[#0F1E32]/05">
      <div className="mx-auto max-w-[1320px] px-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* LEFT COLUMN: Platform Introduction */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <span className="mb-3 text-[12px] font-bold tracking-[0.1em] uppercase text-[#C98A16]">
              OUR PLATFORM
            </span>

            <h2
              className="mb-6 font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-[#07182F] leading-[1.18] tracking-tight"
              style={{ fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" }}
            >
              One church.<br />
              One connected<br />
              platform.
            </h2>

            <p className="mb-8 text-base leading-relaxed text-[#5F6978]">
              ChurchEden isn't just church management software. It's the digital
              infrastructure connecting the modern church.
            </p>

            <button
              onClick={() => navigate("/onboarding/welcome")}
              className="inline-flex items-center gap-2 rounded-lg bg-[#C98A16] px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#C98A16]/25 transition-all duration-200 hover:bg-[#B97808] active:scale-95"
            >
              Explore the Platform
              <ArrowRight size={16} />
            </button>
          </div>

          {/* CENTER: Orbital Ecosystem Diagram */}
          <div className="lg:col-span-5 flex items-center justify-center py-6 sm:py-10">
            <div className="relative w-[300px] h-[300px] sm:w-[340px] sm:h-[340px] flex items-center justify-center">
              
              {/* Outer Orbital Rings SVG */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 340 340">
                <circle cx="170" cy="170" r="145" fill="none" stroke="#E2E8F0" strokeWidth="1.5" />
                <circle cx="170" cy="170" r="105" fill="none" stroke="#C98A16" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="4 4" />
                {/* Subtle connection dots */}
                <circle cx="170" cy="25" r="3.5" fill="#C98A16" />
                <circle cx="315" cy="170" r="3.5" fill="#C98A16" />
                <circle cx="170" cy="315" r="3.5" fill="#C98A16" />
                <circle cx="25" cy="170" r="3.5" fill="#C98A16" />
              </svg>

              {/* Central Navy Hub */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="z-10 h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-[#07182F] border-2 border-[#C98A16]/50 shadow-xl flex items-center justify-center p-3"
              >
                <img src={churchedenFavicon} alt="ChurchEden" className="h-12 w-12 sm:h-14 sm:w-14 object-contain" />
              </motion.div>

              {/* Orbiting Module Cards */}
              {MODULES.map((mod) => (
                <div
                  key={mod.label}
                  className={`absolute ${mod.pos} z-20 rounded-xl bg-white border border-slate-200 px-2.5 py-1.5 sm:px-3 sm:py-2 shadow-sm flex items-center gap-1.5 whitespace-nowrap transition-transform hover:scale-105`}
                >
                  <mod.icon size={13} className="text-[#C98A16]" />
                  <span className="text-[10.5px] sm:text-[11px] font-semibold text-[#07182F]">
                    {mod.label}
                  </span>
                </div>
              ))}

            </div>
          </div>

          {/* RIGHT COLUMN: 4 Benefit Bullet Points */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            {BENEFITS.map((b) => (
              <div key={b.title} className="flex items-start gap-3">
                <span className="mt-1 flex h-4.5 w-4.5 flex-shrink-0 items-center justify-center rounded-full bg-[#C98A16]/15 text-[#C98A16]">
                  <Check size={11} strokeWidth={2.5} />
                </span>
                <div>
                  <h4 className="text-[14px] font-bold text-[#07182F]">{b.title}</h4>
                  <p className="text-[12.5px] leading-relaxed text-[#5F6978]">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
