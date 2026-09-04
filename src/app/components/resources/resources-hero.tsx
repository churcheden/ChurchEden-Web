import { motion } from "motion/react";
import { BookOpen, Search } from "lucide-react";

interface ResourcesHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function ResourcesHero({ searchQuery, onSearchChange }: ResourcesHeroProps) {
  return (
    <section className="w-full bg-[#F8F6F1] py-12 lg:py-16 border-b border-[#0F1E32]/05">
      <div className="mx-auto max-w-[1320px] px-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-6 flex flex-col items-start">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C98A16]/35 bg-[#FFF9EC] px-3.5 py-1 text-[11.5px] font-bold uppercase tracking-[0.08em] text-[#C98A16] shadow-sm"
            >
              <BookOpen size={13} className="text-[#C98A16]" />
              RESOURCES
            </motion.div>

            {/* Large Editorial Serif Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="mb-5 font-serif text-4xl sm:text-5xl lg:text-[3.6rem] font-semibold leading-[1.12] tracking-tight text-[#07182F]"
              style={{ fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" }}
            >
              Practical resources<br />
              for modern<br />
              <span className="text-[#C98A16]">ministry leaders.</span>
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="mb-8 text-base sm:text-lg leading-relaxed text-[#5F6978] max-w-[480px]"
            >
              Guides, templates, articles, and insights to help your church work
              smarter, serve better, and make a bigger impact in your community.
            </motion.p>

            {/* Search Input Field */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="relative w-full max-w-[420px]"
            >
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7B8491]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search resources..."
                className="w-full rounded-2xl bg-white border border-[#0F1E32]/12 py-3.5 pl-11 pr-4 text-sm text-[#162033] placeholder-[#7B8491] shadow-sm transition-all focus:border-[#C98A16] focus:outline-none focus:ring-2 focus:ring-[#C98A16]/20"
              />
            </motion.div>
          </div>

          {/* RIGHT COLUMN — Large Rounded Workspace Image */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative overflow-hidden rounded-2xl lg:rounded-3xl border border-[#0F1E32]/10 shadow-xl bg-white"
              style={{
                boxShadow: "0 20px 50px -15px rgba(15, 23, 42, 0.10)",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80"
                alt="Church leader working thoughtfully in warm ministry office setting with digital tablet"
                loading="eager"
                decoding="async"
                className="w-full h-[320px] sm:h-[400px] lg:h-[420px] object-cover object-center"
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
