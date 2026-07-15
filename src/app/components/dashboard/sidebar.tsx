import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Home, Users, Calendar, Megaphone,
  DollarSign, BarChart2, Receipt,
  QrCode, ClipboardList, Settings,
  UserCog, X, Bird, LogOut,
} from "lucide-react";
import { useAuth } from "@/app/auth/auth-context";

interface NavItem {
  icon: React.ElementType;
  label: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "HOME",
    items: [
      { icon: Home, label: "Overview" },
      { icon: Users, label: "Members" },
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

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activePage?: string;
  onNavigate?: (page: string) => void;
}

export function Sidebar({ isOpen, onClose, activePage, onNavigate }: SidebarProps) {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [internalActive, setInternalActive] = useState("Overview");
  const [isSigningOut, setIsSigningOut] = useState(false);
  const activeItem = activePage ?? internalActive;

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
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
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
          background: "#FFFFFF",
          borderRight: "1px solid #EEEEEE",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 pt-6 pb-5">
          <Bird size={24} color="#C9931A" strokeWidth={1.8} />
          <span style={{ fontFamily: "var(--font-heading)", fontSize: "20px", fontWeight: 700, color: "#1A1A2E" }}>
            ChurchEden
          </span>
          <button className="ml-auto lg:hidden" onClick={onClose}>
            <X size={18} color="#6B7280" />
          </button>
        </div>

        {/* Church info */}
        <div className="px-4 pb-4">
          <div className="rounded-xl p-3" style={{ background: "#F7F7F8" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A2E", fontFamily: "var(--font-label)" }}>
              Redeemer's Chapel
            </div>
            <div className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{ background: "rgba(200,134,10,0.12)" }}>
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#C8860A" }} />
              <span style={{ fontSize: "11px", color: "#C8860A", fontFamily: "var(--font-label)", fontWeight: 500 }}>Super Admin</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pb-2">
          {navSections.map((section) => (
            <div key={section.title} className="mb-5">
              <div
                className="px-2 mb-1.5"
                style={{ fontSize: "10px", fontWeight: 600, color: "#9CA3AF", letterSpacing: "0.08em", fontFamily: "var(--font-label)" }}
              >
                {section.title}
              </div>
              {section.items.map((item) => {
                const isActive = activeItem === item.label;
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNav(item.label)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-0.5 transition-all duration-200 group"
                    style={{ background: isActive ? "#1A1A2E" : "transparent" }}
                  >
                    <item.icon
                      size={15}
                      style={{ color: isActive ? "#C8860A" : "#9CA3AF", flexShrink: 0 }}
                    />
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? "#FFFFFF" : "#6B7280",
                        fontFamily: "var(--font-label)",
                      }}
                    >
                      {item.label}
                    </span>
                    {isActive && (
                      <span
                        className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: "#C8860A" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="px-3 pb-4">
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-60"
            style={{ background: "#1A1A2E" }}
          >
            <LogOut size={15} color="#C8860A" />
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF", fontFamily: "var(--font-label)" }}>
              {isSigningOut ? "Signing out..." : "Sign out"}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
