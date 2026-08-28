import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Resource } from "./resource-types";
import { ResourceCard } from "./resource-card";

interface ResourceCarouselProps {
  resources: Resource[];
}

export function ResourceCarousel({ resources }: ResourceCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);

  // Responsive calculation for cards visible
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(4);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset index if resources filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [resources]);

  const maxIndex = Math.max(0, resources.length - visibleCount);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const canPrev = currentIndex > 0;
  const canNext = currentIndex < maxIndex;

  return (
    <section className="w-full bg-[#F8F6F1] py-10 lg:py-16">
      <div className="mx-auto max-w-[1320px] px-6 sm:px-8 lg:px-10">
        
        {/* Section Heading & Carousel Arrow Controls */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <h2
            className="font-serif text-2xl sm:text-3xl lg:text-[2.25rem] font-bold text-[#07182F] tracking-tight"
            style={{ fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" }}
          >
            Featured resources
          </h2>

          {/* Carousel Arrow Buttons */}
          <div className="flex items-center gap-3">
            {/* Left Arrow Button */}
            <button
              onClick={handlePrev}
              disabled={!canPrev}
              aria-label="Previous resources"
              className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-[#0F1E32]/12 bg-white text-[#07182F] shadow-sm transition-all duration-200 ${
                canPrev
                  ? "hover:bg-slate-50 hover:border-[#0F1E32]/25 active:scale-95 cursor-pointer opacity-100"
                  : "opacity-40 cursor-not-allowed"
              }`}
            >
              <ChevronLeft size={20} strokeWidth={2} />
            </button>

            {/* Right Arrow Button (Gold) */}
            <button
              onClick={handleNext}
              disabled={!canNext}
              aria-label="Next resources"
              className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#C98A16] text-white shadow-md shadow-[#C98A16]/25 transition-all duration-200 ${
                canNext
                  ? "hover:bg-[#B97808] active:scale-95 cursor-pointer opacity-100"
                  : "opacity-40 cursor-not-allowed"
              }`}
            >
              <ChevronRight size={20} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Carousel Viewport Container */}
        {resources.length === 0 ? (
          <div className="rounded-2xl bg-white border border-[#0F1E32]/10 p-12 text-center text-[#5F6978]">
            No resources match your search or selected category.
          </div>
        ) : (
          <div className="relative overflow-hidden w-full">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
              }}
            >
              {resources.map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 px-2 sm:px-2.5"
                  style={{ width: `${100 / visibleCount}%` }}
                >
                  <ResourceCard resource={item} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
