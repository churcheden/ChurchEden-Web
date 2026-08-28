import { CATEGORIES } from "./resource-types";

interface ResourceCategoriesProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export function ResourceCategories({ activeCategory, onSelectCategory }: ResourceCategoriesProps) {
  return (
    <section className="w-full bg-[#F8F6F1] py-6">
      <div className="mx-auto max-w-[1320px] px-6 sm:px-8 lg:px-10">
        <div
          className="w-full rounded-2xl bg-white border border-[#0F1E32]/10 p-2 shadow-sm overflow-x-auto scrollbar-none"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex items-center gap-1.5 min-w-max">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.label;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.label}
                  onClick={() => onSelectCategory(cat.label)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#07182F] text-white shadow-sm"
                      : "bg-transparent text-[#07182F] hover:bg-slate-50"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-[#C98A16]" : "text-[#5F6978]"} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
