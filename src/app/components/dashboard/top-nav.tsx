import { Menu, Search, Bell, Calendar, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import justLogoTransparent from "@/assets/Just-logo-transparent.png";

interface TopNavProps {
  onMenuClick: () => void;
  pageTitle?: string;
  breadcrumb?: string;
}

export function TopNav({ onMenuClick, pageTitle = "Church Overview", breadcrumb }: TopNavProps) {
  const navigate = useNavigate();
  return (
    <header
      className="flex-shrink-0 flex items-center gap-4 px-5 lg:px-6"
      style={{
        height: "64px",
        background: "#FFFFFF",
        borderBottom: "1px solid #EEEEEE",
      }}
    >
      {/* Mobile hamburger */}
      <button
        className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
        onClick={onMenuClick}
      >
        <Menu size={20} color="#1A1A2E" />
      </button>

      {/* Page title */}
      <div className="hidden sm:flex flex-col">
        <span style={{ fontSize: "16px", fontWeight: 700, color: "#1A1A2E", fontFamily: "var(--font-label)" }}>
          {pageTitle}
        </span>
        <div className="flex items-center gap-1">
          <span style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "var(--font-label)" }}>Home</span>
          <ChevronRight size={10} color="#9CA3AF" />
          <span style={{ fontSize: "11px", color: "#C8860A", fontFamily: "var(--font-label)" }}>
            {breadcrumb ?? "Overview"}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="flex-1 mx-2 lg:mx-8 max-w-sm lg:max-w-md">
        <div
          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full"
          style={{ background: "#F7F7F8" }}
        >
          <Search size={15} color="#9CA3AF" />
          <input
            type="text"
            placeholder="Search members, events, transactions..."
            className="flex-1 bg-transparent outline-none min-w-0"
            style={{ fontSize: "13px", color: "#1A1A2E", fontFamily: "var(--font-label)" }}
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 lg:gap-3 ml-auto">
        {/* Ask Eden */}
        <button
          onClick={() => navigate("/eden-ai")}
          className="flex items-center gap-2 pl-1.5 pr-2.5 h-9 rounded-full transition-colors flex-shrink-0"
          style={{
            background: "var(--eden-surface)",
            border: "1px solid var(--eden-outline-variant)",
          }}
          title="Open Eden AI"
        >
          <img
            src={justLogoTransparent}
            alt=""
            style={{ width: "17px", height: "17px", objectFit: "contain" }}
          />
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--eden-on-surface)", fontFamily: "var(--font-label)" }}>
            Ask Eden
          </span>
          <span
            className="hidden xl:inline-flex items-center px-1.5 py-0.5 rounded font-mono"
            style={{ fontSize: "10px", color: "var(--eden-on-surface-variant)", background: "var(--eden-surface-container-low)" }}
          >
            Ctrl K
          </span>
        </button>

        {/* Date chip */}
        <div
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: "#F7F7F8", border: "1px solid #EEEEEE" }}
        >
          <Calendar size={13} color="#C8860A" />
          <span style={{ fontSize: "12px", color: "#1A1A2E", fontFamily: "var(--font-label)", fontWeight: 500, whiteSpace: "nowrap" }}>
            01 · Mon, June
          </span>
        </div>

        {/* Notification bell */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <Bell size={18} color="#6B7280" />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: "#C8860A" }}
          />
        </button>

        {/* Admin avatar */}
        <div className="hidden sm:flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #1A0533 0%, #2D1B69 100%)" }}
          >
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#C8860A", fontFamily: "var(--font-label)" }}>PE</span>
          </div>
          <div className="hidden lg:block">
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A2E", fontFamily: "var(--font-label)" }}>
              Pastor Emmanuel
            </div>
            <div style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "var(--font-label)" }}>Super Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}
