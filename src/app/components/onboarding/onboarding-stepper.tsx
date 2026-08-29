import { Check } from "lucide-react";
import { cn } from "../ui/utils";

const PROFILE_FLOW_STEPS = [
  { path: "church-basics", label: "Church Basics", number: 1 },
  { path: "location-contact", label: "Location & Contact", number: 2 },
  { path: "service-branding", label: "Service & Branding", number: 3 },
  { path: "ministries", label: "Ministries", number: 4 },
  { path: "complete", label: "Complete", number: 5 },
];

interface OnboardingStepperProps {
  currentStepPath: string;
}

export function OnboardingStepper({ currentStepPath }: OnboardingStepperProps) {
  const currentStepIndex = PROFILE_FLOW_STEPS.findIndex((s) => s.path === currentStepPath);
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;

  return (
    <nav aria-label="Onboarding Progress" className="w-full">
      <ol className="flex items-center justify-between gap-1 sm:gap-2">
        {PROFILE_FLOW_STEPS.map((step, index) => {
          const isComplete = index < activeIndex;
          const isActive = index === activeIndex;

          return (
            <li key={step.path} className="flex-1 flex items-center">
              <div className="flex flex-col items-center mx-auto">
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 shadow-2xs",
                    isComplete && "bg-[#1B2A4A] text-white",
                    isActive && "bg-[#1B2A4A] text-white ring-4 ring-[#1B2A4A]/20",
                    !isComplete && !isActive && "border border-slate-300 bg-white text-slate-500",
                  )}
                  aria-current={isActive ? "step" : undefined}
                >
                  {isComplete ? <Check size={13} strokeWidth={3} /> : step.number}
                </div>
                <span
                  className={cn(
                    "mt-1.5 text-[11px] sm:text-xs font-semibold whitespace-nowrap text-center transition-colors",
                    isActive
                      ? "text-[#1B2A4A] font-bold"
                      : isComplete
                      ? "text-slate-700"
                      : "text-slate-400",
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting line */}
              {index < PROFILE_FLOW_STEPS.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-[2px] mx-1 sm:mx-2 -mt-4 transition-colors duration-300",
                    index < activeIndex ? "bg-[#1B2A4A]" : "bg-slate-200",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
