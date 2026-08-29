import { cn } from "../ui/utils";
import justLogoTransparent from "@/assets/Just-logo-transparent.png";

export type EdenState = "idle" | "thinking" | "responding";

interface EdenRingProps {
  state: EdenState;
  size?: "large" | "small";
  className?: string;
}

/**
 * The signature animated ring. A conic-gradient arc is masked into a thin
 * ring and spun around the Eden logo mark. The single `state` prop drives
 * the rotation speed (via an interpolated `--ring-duration` custom property)
 * and the brightness of the sweep.
 */
export function EdenRing({ state, size = "large", className }: EdenRingProps) {
  return (
    <div className={cn("eden-ring", className)} data-state={state} data-size={size} aria-hidden="true">
      <div className="eden-ring__arc" />
      <div className="eden-ring__core">
        <img src={justLogoTransparent} alt="" />
      </div>
    </div>
  );
}
