import { LandingNav } from "../landing/landing-nav";
import { LandingFooter } from "../landing/landing-footer";
import { AboutHero } from "./about-hero";
import { AboutProblem } from "./about-problem";
import { AboutStory } from "./about-story";
import { AboutMission } from "./about-mission";
import { AboutBeliefs } from "./about-beliefs";
import { AboutPlatform } from "./about-platform";
import { AboutTeam } from "./about-team";
import { AboutMetrics } from "./about-metrics";
import { AboutCTA } from "./about-cta";

/**
 * About Us page for ChurchEden.
 * Recreates the exact visual hierarchy, premium editorial aesthetic,
 * section order, and responsive composition specified in the reference design.
 */
export function AboutPage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#FFFFFF] font-eden antialiased">
      <LandingNav />
      <main>
        <AboutHero />
        <AboutProblem />
        <AboutStory />
        <AboutMission />
        <AboutBeliefs />
        <AboutPlatform />
        <AboutTeam />
        <AboutMetrics />
        <AboutCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
