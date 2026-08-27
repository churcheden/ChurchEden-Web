/**
 * Minimal landing page footer with legal links.
 */
export function LandingFooter() {
  return (
    <footer className="border-t border-slate-100 bg-white py-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 text-xs text-slate-400 lg:px-10">
        <span>© {new Date().getFullYear()} ChurchEden. All rights reserved.</span>
        <div className="flex items-center gap-5">
          <a href="#" className="transition-colors hover:text-slate-700">
            Terms of Use
          </a>
          <a href="#" className="transition-colors hover:text-slate-700">
            Privacy Policy
          </a>
          <a href="#" className="transition-colors hover:text-slate-700">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
