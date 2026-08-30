import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  Home, Users, Calendar, Megaphone,
  DollarSign, BarChart2, Receipt,
  QrCode, ClipboardList, Settings,
  UserCheck, UserCog, X, LogOut, Crown, ArrowRight,
} from "lucide-react";
import { useAuth } from "@/app/auth/auth-context";
import { isChurchAdmin } from "@/lib/memberships";
import justLogoTransparent from "@/assets/Just-logo-transparent.png";

// ─── Design tokens ────────────────────────────────────────────────────────────
const SIDEBAR_BG     = "#0F1729";   // deep charcoal-navy
const ACTIVE_BG      = "#1B2A4A";   // slightly lighter navy for active row
const CARD_BG        = "#162035";   // upgrade card background
const SECTION_COLOR  = "#5A6785";   // muted blue-gray for section labels
const ICON_INACTIVE  = "#8A9BBE";   // light-blue-gray for unselected icons/text
const TEXT_INACTIVE  = "#8A9BBE";
const TEXT_ACTIVE    = "#FFFFFF";
const AMBER          = "#C8860A";
const AMBER_LIGHT    = "#F59E0B";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activePage?: string;
  onNavigate?: (page: string) => void;
}

export function Sidebar({ isOpen, onClose, activePage, onNavigate }: SidebarProps) {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [internalActive, setInternalActive] = useState("Overview");
  const [isSigningOut, setIsSigningOut] = useState(false);
  const activeItem = activePage ?? internalActive;

  const navSections = useMemo(() => {
    const isAdmin = isChurchAdmin(user?.memberships);
    return [
      {
        title: "MAIN",
        items: [
          { icon: Home, label: "Overview" },
          { icon: Users, label: "Members" },
          ...(isAdmin ? [{ icon: UserCheck, label: "Join Requests" }] : []),
          { icon: Calendar, label: "Events" },
          { icon: Megaphone, label: "Announcements" },
        ],
      },
      {
        title: "FINANCE",
        items: [
          { icon: DollarSign, label: "Tithes & Offerings" },
          { icon: BarChart2, label: "Financial Reports" },
          { icon: Receipt, label: "Transactions" },
        ],
      },
      {
        title: "ATTENDANCE",
        items: [
          { icon: QrCode, label: "QR Attendance" },
          { icon: ClipboardList, label: "Attendance History" },
        ],
      },
      {
        title: "SETTINGS",
        items: [
          { icon: Settings, label: "Church Settings" },
          { icon: UserCog, label: "Admin Management" },
        ],
      },
    ];
  }, [user?.memberships]);

  const handleNav = (label: string) => {
    setInternalActive(label);
    onNavigate?.(label);
    onClose();
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      navigate("/onboarding/sign-in", { replace: true });
    } catch {
      navigate("/onboarding/sign-in", { replace: true });
    } finally {
      setIsSigningOut(false);
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen flex flex-col z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{
          width: "220px",
          minWidth: "220px",
          background: SIDEBAR_BG,
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* ── Logo ── */}
        <div className="flex items-center gap-2.5 px-5 pt-6 pb-5">
          <img src={justLogoTransparent} alt="ChurchEden" className="h-7 w-7 object-contain" />
          <span style={{ fontFamily: "var(--font-heading)", fontSize: "19px", fontWeight: 700, color: "#FFFFFF" }}>
            ChurchEden
          </span>
          <button className="ml-auto lg:hidden" onClick={onClose}>
            <X size={18} color={ICON_INACTIVE} />
          </button>
        </div>

        {/* ── Church info card ── */}
        <div className="px-4 pb-4">
          <div
            className="rounded-xl p-3"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#FFFFFF", fontFamily: "var(--font-label)" }}>
              Redeemer's Chapel
            </div>
            <div
              className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full"
              style={{ background: "rgba(200,134,10,0.18)", border: "1px solid rgba(200,134,10,0.25)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: AMBER }} />
              <span style={{ fontSize: "10.5px", color: AMBER_LIGHT, fontFamily: "var(--font-label)", fontWeight: 600, letterSpacing: "0.02em" }}>
                Super Admin
              </span>
            </div>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto px-3 pb-2" style={{ scrollbarWidth: "none" }}>
          {navSections.map((section) => (
            <div key={section.title} className="mb-5">
              {/* Section label */}
              <div
                className="px-2 mb-2"
                style={{
                  fontSize: "9.5px",
                  fontWeight: 700,
                  color: SECTION_COLOR,
                  letterSpacing: "0.1em",
                  fontFamily: "var(--font-label)",
                  textTransform: "uppercase",
                }}
              >
                {section.title}
              </div>

              {/* Nav items */}
              {section.items.map((item) => {
                const isActive = activeItem === item.label;
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNav(item.label)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-0.5 transition-all duration-200"
                    style={{
                      background: isActive ? ACTIVE_BG : "transparent",
                      border: isActive ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
                    }}
                  >
                    <item.icon
                      size={15}
                      style={{
                        color: isActive ? "#FFFFFF" : ICON_INACTIVE,
                        flexShrink: 0,
                        opacity: isActive ? 1 : 0.7,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: isActive ? 700 : 400,
                        color: isActive ? TEXT_ACTIVE : TEXT_INACTIVE,
                        fontFamily: "var(--font-label)",
                        letterSpacing: isActive ? "0.01em" : "0",
                      }}
                    >
                      {item.label}
                    </span>
                    {isActive && (
                      <span
                        className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: AMBER }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* ── Upgrade card ── */}
        <div className="px-3 pb-3">
          <div
            className="rounded-xl p-4"
            style={{
              background: CARD_BG,
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Crown size={16} style={{ color: AMBER_LIGHT }} />
              <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#FFFFFF", fontFamily: "var(--font-label)" }}>
                Unlock all features
              </span>
            </div>
            <p style={{ fontSize: "11px", color: SECTION_COLOR, fontFamily: "var(--font-label)", marginBottom: "10px" }}>
              30+ integrations
            </p>
            <button
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{
                background: "linear-gradient(90deg, #C8860A 0%, #F59E0B 100%)",
                fontSize: "12px",
                fontWeight: 700,
                color: "#FFFFFF",
                fontFamily: "var(--font-label)",
                letterSpacing: "0.02em",
              }}
            >
              15 day free trial
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* ── Sign out ── */}
        <div className="px-3 pb-4">
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-60"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <LogOut size={15} color={ICON_INACTIVE} />
            <span style={{ fontSize: "13px", fontWeight: 600, color: TEXT_INACTIVE, fontFamily: "var(--font-label)" }}>
              {isSigningOut ? "Signing out..." : "Sign out"}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
