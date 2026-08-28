import { motion } from "motion/react";
import { Resource } from "./resource-types";

interface ResourceCardProps {
  resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const Icon = resource.icon;
  const MetaIcon = resource.metaIcon;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-[#0F1E32]/10 shadow-sm transition-shadow hover:shadow-md h-full"
    >
      {/* Thumbnail Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={resource.image}
          alt={resource.title}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Category Pill Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-block rounded-full bg-white/95 backdrop-blur-sm border border-[#C98A16]/40 px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-[#C98A16] shadow-sm">
            {resource.category}
          </span>
        </div>
      </div>

      {/* Icon Badge overlapping image bottom */}
      <div className="relative px-5 pt-0 pb-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="-mt-4 mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-[#0F1E32]/10 shadow-sm text-[#C98A16]">
            <Icon size={18} strokeWidth={1.75} />
          </div>

          {/* Title */}
          <h3
            className="mb-2 font-serif text-base sm:text-lg font-bold leading-snug text-[#07182F] group-hover:text-[#C98A16] transition-colors"
            style={{ fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" }}
          >
            {resource.title}
          </h3>

          {/* Short Description */}
          <p className="mb-4 text-[13px] leading-relaxed text-[#5F6978]">
            {resource.description}
          </p>
        </div>

        {/* Metadata Footer */}
        <div className="flex items-center gap-1.5 border-t border-slate-100 pt-3 text-[12px] font-medium text-[#7B8491]">
          <MetaIcon size={14} className="text-[#C98A16]" />
          <span>{resource.metadata}</span>
        </div>
      </div>
    </motion.div>
  );
}
