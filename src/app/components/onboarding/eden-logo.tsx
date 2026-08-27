import { cn } from "../ui/utils";
import justLogoTransparent from "@/assets/Just-logo-transparent.png";

interface EdenLogoProps {
  className?: string;
  imgClassName?: string;
  iconClassName?: string;
  textClassName?: string;
}

/**
 * Shared brand lockup for ChurchEden onboarding and auth flows.
 */
export function EdenLogo({ className, imgClassName, textClassName }: EdenLogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <img
        src={justLogoTransparent}
        alt="ChurchEden"
        className={cn("h-8 w-8 sm:h-9 sm:w-9 object-contain", imgClassName)}
      />
      <span className={cn("font-eden text-xl font-bold tracking-tight text-white", textClassName)}>
        ChurchEden
      </span>
    </div>
  );
}
