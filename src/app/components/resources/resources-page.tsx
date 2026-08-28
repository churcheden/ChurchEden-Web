import { useState, useMemo } from "react";
import { LandingNav } from "../landing/landing-nav";
import { LandingFooter } from "../landing/landing-footer";
import { ResourcesHero } from "./resources-hero";
import { ResourceCategories } from "./resource-categories";
import { ResourceCarousel } from "./resource-carousel";
import { NewsletterSection } from "./newsletter-section";
import { BenefitsSection } from "./benefits-section";
import { RESOURCE_ITEMS, CATEGORIES } from "./resource-types";

export function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Resources");

  // Combined search and category filtering
  const filteredResources = useMemo(() => {
    return RESOURCE_ITEMS.filter((item) => {
      // Category filter
      if (activeCategory !== "All Resources") {
        const catObj = CATEGORIES.find((c) => c.label === activeCategory);
        if (catObj && "categoryKey" in catObj && item.category !== catObj.categoryKey) {
          return false;
        }
      }

      // Search query filter (title, description, category)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        return matchesTitle || matchesDesc || matchesCategory;
      }

      return true;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#F8F6F1] font-eden text-[#162033] antialiased">
      <LandingNav />
      <main>
        <ResourcesHero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <ResourceCategories
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
        <ResourceCarousel resources={filteredResources} />
        <NewsletterSection />
        <BenefitsSection />
      </main>
      <LandingFooter />
    </div>
  );
}
