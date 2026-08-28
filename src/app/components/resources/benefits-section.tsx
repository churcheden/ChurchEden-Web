import { BookOpen, ShieldCheck, Users, RefreshCw } from "lucide-react";

const BENEFITS = [
  {
    icon: BookOpen,
    title: "Expertly curated",
    description: "Resources created by ministry leaders and industry experts.",
  },
  {
    icon: ShieldCheck,
    title: "Practical & actionable",
    description: "Real-world advice you can implement immediately.",
  },
  {
    icon: Users,
    title: "For churches of every size",
    description: "Helpful content whether you're just starting or growing fast.",
  },
  {
    icon: RefreshCw,
    title: "Always up to date",
    description: "New resources added regularly to support your mission.",
  },
];

export function BenefitsSection() {
  return (
    <section className="w-full bg-[#F8F6F1] pb-16 lg:pb-24">
      <div className="mx-auto max-w-[1320px] px-6 sm:px-8 lg:px-10">
        
        <div className="rounded-3xl bg-white p-8 sm:p-10 lg:p-12 border border-[#0F1E32]/10 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {BENEFITS.map((item, idx) => (
              <div
                key={item.title}
                className={`flex flex-col items-start ${
                  idx !== BENEFITS.length - 1 ? "lg:border-r lg:border-slate-100 lg:pr-6" : ""
                }`}
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF9EC] border border-[#C98A16]/30 text-[#C98A16]">
                  <item.icon size={20} strokeWidth={1.75} />
                </div>
                <h3 className="mb-1.5 text-base font-bold text-[#07182F]">
                  {item.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-[#5F6978]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
