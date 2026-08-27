import { LandingNav } from "./landing-nav";
import { LandingHero } from "./landing-hero";
import { LandingFeatures } from "./landing-features";
import { LandingFooter } from "./landing-footer";

/**
 * Light, modern SaaS-style marketing landing page.
 * Composed from modular sub-components for maintainability.
 *
 * Layout:
 *   LandingNav      — sticky white top nav
 *   LandingHero     — cream hero: headline, CTAs, hero photo + floating cards
 *   LandingFeatures — 2-col: features list + dashboard screenshot
 *   LandingFooter   — minimal footer with legal links
 */
export function LandingPage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white font-eden antialiased">
      <LandingNav />
      <LandingHero />
      <LandingFeatures />
      <LandingFooter />
    </div>
  );
}
