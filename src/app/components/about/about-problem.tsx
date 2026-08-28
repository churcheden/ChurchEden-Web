import { motion } from "motion/react";
import { Check, Users, Calendar, Heart, Layers, ArrowRight, FileSpreadsheet } from "lucide-react";
import churchedenFavicon from "@/assets/churcheden_favicon.png";

const PROBLEMS = [
  "Members in one system.",
  "Giving in another.",
  "Attendance in spreadsheets.",
  "Events somewhere else.",
];

export function AboutProblem() {
  return (
    <section className="w-full bg-[#FFFFFF] py-20 lg:py-28 border-b border-[#0F1E32]/05">
      <div className="mx-auto max-w-[1320px] px-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: Problem narrative (approx 40%) */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <span className="mb-3 text-[12px] font-bold tracking-[0.1em] uppercase text-[#C98A16]">
              THE PROBLEM
            </span>

            <h2
              className="mb-6 font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-[#07182F] leading-[1.18] tracking-tight"
              style={{ fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" }}
            >
              Churches shouldn't have<br />
              to piece everything<br />
              together.
            </h2>

            {/* Bullet items with gold check circle */}
            <ul className="mb-8 flex flex-col gap-3.5 w-full">
              {PROBLEMS.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#C98A16]/15 text-[#C98A16]">
                    <Check size={11} strokeWidth={2.5} />
                  </span>
                  <span className="text-[15px] text-[#4B5565] font-medium">{item}</span>
                </li>
              ))}
            </ul>

            {/* Bold summary statement */}
            <p className="text-base sm:text-[17px] font-bold text-[#07182F] leading-snug">
              We believe church leaders deserve better.
            </p>
          </div>

          {/* RIGHT COLUMN: Fragmented vs Connected Ecosystem (approx 60%) */}
          <div className="lg:col-span-7 flex items-center justify-center">
            <div
              className="relative w-full max-w-[620px] rounded-3xl p-6 sm:p-8 bg-[#FBFBFA] border border-[#0F1E32]/08 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6"
            >
              
              {/* LEFT SIDE: Disconnected Fragmented Nodes */}
              <div className="relative w-full sm:w-[44%] h-[260px] flex items-center justify-center">
                {/* Dotted fragmented curve SVG background */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 220 260">
                  <path d="M 40 40 Q 90 80 50 130 T 120 210" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" />
                  <path d="M 160 50 Q 110 110 150 170 T 70 220" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" />
                </svg>

                {/* Scattered floating cards */}
                <div className="absolute top-2 left-2 rounded-xl bg-white border border-slate-200 px-3 py-2 shadow-sm flex items-center gap-2">
                  <Users size={14} className="text-slate-500" />
                  <span className="text-[11px] font-medium text-slate-700">Members</span>
                </div>

                <div className="absolute top-2 right-4 rounded-xl bg-white border border-slate-200 px-3 py-2 shadow-sm flex items-center gap-2">
                  <Calendar size={14} className="text-slate-500" />
                  <span className="text-[11px] font-medium text-slate-700">Attendance</span>
                </div>

                <div className="absolute top-[105px] left-3 rounded-xl bg-white border border-slate-200 px-3 py-2 shadow-sm flex items-center gap-2">
                  <Heart size={14} className="text-slate-500" />
                  <span className="text-[11px] font-medium text-slate-700">Giving</span>
                </div>

                <div className="absolute bottom-2 left-10 rounded-xl bg-white border border-slate-200 px-3 py-2 shadow-sm flex items-center gap-2">
                  <FileSpreadsheet size={14} className="text-slate-500" />
                  <span className="text-[11px] font-medium text-slate-700">Events</span>
                </div>

                <div className="absolute bottom-6 right-2 rounded-xl bg-white border border-slate-200 px-3 py-2 shadow-sm flex items-center gap-2">
                  <Layers size={14} className="text-slate-500" />
                  <span className="text-[11px] font-medium text-slate-700">Groups</span>
                </div>
              </div>

              {/* CENTER: Transition Arrow */}
              <div className="flex-shrink-0 flex items-center justify-center">
                <div className="h-9 w-9 rounded-full bg-[#C98A16] text-white flex items-center justify-center shadow-md shadow-[#C98A16]/30">
                  <ArrowRight size={16} strokeWidth={2.5} />
                </div>
              </div>

              {/* RIGHT SIDE: Unified ChurchEden Ecosystem */}
              <div className="relative w-full sm:w-[48%] h-[280px] flex items-center justify-center">
                {/* SVG connection lines radiating from center */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 240 280">
                  {/* Top node (Members) */}
                  <line x1="120" y1="140" x2="120" y2="40" stroke="#C98A16" strokeWidth="1.5" strokeOpacity="0.45" />
                  {/* Top-right node (Attendance) */}
                  <line x1="120" y1="140" x2="190" y2="85" stroke="#C98A16" strokeWidth="1.5" strokeOpacity="0.45" />
                  {/* Left node (Giving) */}
                  <line x1="120" y1="140" x2="40" y2="140" stroke="#C98A16" strokeWidth="1.5" strokeOpacity="0.45" />
                  {/* Bottom-left node (Events) */}
                  <line x1="120" y1="140" x2="120" y2="235" stroke="#C98A16" strokeWidth="1.5" strokeOpacity="0.45" />
                  {/* Bottom-right node (Groups & Ministries) */}
                  <line x1="120" y1="140" x2="190" y2="200" stroke="#C98A16" strokeWidth="1.5" strokeOpacity="0.45" />
                </svg>

                {/* Central ChurchEden Hub */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="z-10 h-16 w-16 rounded-2xl bg-[#07182F] border-2 border-[#C98A16]/50 shadow-lg flex items-center justify-center p-2.5"
                >
                  <img src={churchedenFavicon} alt="ChurchEden" className="h-10 w-10 object-contain" />
                </motion.div>

                {/* Orbiting connected feature cards */}
                {/* Top: Members */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 rounded-xl bg-white border border-slate-200 px-3 py-1.5 shadow-sm flex items-center gap-1.5 z-10">
                  <Users size={13} className="text-[#C98A16]" />
                  <span className="text-[11px] font-semibold text-[#07182F]">Members</span>
                </div>

                {/* Top Right: Attendance */}
                <div className="absolute top-[65px] right-0 rounded-xl bg-white border border-slate-200 px-2.5 py-1.5 shadow-sm flex items-center gap-1.5 z-10">
                  <Calendar size={13} className="text-[#C98A16]" />
                  <span className="text-[10.5px] font-semibold text-[#07182F]">Attendance</span>
                </div>

                {/* Left: Giving */}
                <div className="absolute top-[120px] left-0 rounded-xl bg-white border border-slate-200 px-2.5 py-1.5 shadow-sm flex items-center gap-1.5 z-10">
                  <Heart size={13} className="text-[#C98A16]" />
                  <span className="text-[10.5px] font-semibold text-[#07182F]">Giving</span>
                </div>

                {/* Bottom Center: Events */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-xl bg-white border border-slate-200 px-3 py-1.5 shadow-sm flex items-center gap-1.5 z-10">
                  <FileSpreadsheet size={13} className="text-[#C98A16]" />
                  <span className="text-[11px] font-semibold text-[#07182F]">Events</span>
                </div>

                {/* Bottom Right: Groups & Ministries */}
                <div className="absolute bottom-[45px] right-0 rounded-xl bg-white border border-slate-200 px-2.5 py-1.5 shadow-sm flex items-center gap-1.5 z-10">
                  <Layers size={13} className="text-[#C98A16]" />
                  <span className="text-[10.5px] font-semibold text-[#07182F]">Groups & Min.</span>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
