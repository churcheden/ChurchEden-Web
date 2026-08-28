import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import danielImg from "@/assets/team/daniel-addo.jpg";
import graceImg from "@/assets/team/grace-mensah.jpg";
import joshuaImg from "@/assets/team/joshua-williams.jpg";
import naomiImg from "@/assets/team/naomi-agyeman.jpg";

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Daniel Addo",
    role: "Co-Founder & CEO",
    bio: "Passionate about churches, people, and building tools that make a difference.",
    image: danielImg,
  },
  {
    name: "Grace Mensah",
    role: "Head of Product",
    bio: "Loves turning complex challenges into simple, beautiful solutions.",
    image: graceImg,
  },
  {
    name: "Joshua Williams",
    role: "Head of Engineering",
    bio: "Engineering reliable systems churches can depend on.",
    image: joshuaImg,
  },
  {
    name: "Naomi Agyeman",
    role: "Head of Design",
    bio: "Designing experiences that help leaders focus on what matters most.",
    image: naomiImg,
  },
];

export function AboutTeam() {
  return (
    <section className="w-full bg-[#FAFAF8] py-20 lg:py-28 border-b border-[#0F1E32]/05">
      <div className="mx-auto max-w-[1320px] px-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-start">
          
          {/* LEFT SIDE: Intro */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <span className="mb-3 text-[12px] font-bold tracking-[0.1em] uppercase text-[#C98A16]">
              THE PEOPLE BEHIND CHURCHEDEN
            </span>

            <h2
              className="mb-6 font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-[#07182F] leading-[1.18] tracking-tight"
              style={{ fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" }}
            >
              A small team building<br />
              something bigger.
            </h2>

            <p className="mb-6 text-base leading-relaxed text-[#5F6978]">
              We're engineers, designers, and people who believe technology can
              help churches do more with less.
            </p>

            <a
              href="#careers"
              onClick={(e) => { e.preventDefault(); }}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C98A16] hover:underline"
            >
              Join Our Team
              <ArrowRight size={15} />
            </a>
          </div>

          {/* RIGHT SIDE: Team Cards */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {TEAM_MEMBERS.map((member, idx) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.08 }}
                  className="rounded-2xl bg-white p-5 border border-[#0F1E32]/08 shadow-sm flex flex-col items-center text-center transition-all hover:shadow-md"
                >
                  {/* Portrait Avatar */}
                  <div className="mb-4 h-16 w-16 sm:h-18 sm:w-18 overflow-hidden rounded-full border-2 border-amber-500/20 shadow-sm">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <h3 className="text-[15px] font-bold text-[#07182F] mb-0.5">
                    {member.name}
                  </h3>

                  <span className="text-[12px] font-medium text-[#C98A16] mb-3">
                    {member.role}
                  </span>

                  <p className="text-[12.5px] leading-relaxed text-[#5F6978]">
                    {member.bio}
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
