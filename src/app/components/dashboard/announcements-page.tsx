import { useMemo, useState } from "react";
import {
  Plus, Search, Edit3, Copy, Archive, Trash2, ChevronRight,
  ChevronDown, Bell, Mail, MessageSquare, Phone, Check, X,
  ToggleLeft, ToggleRight, Upload, Pin, AlertTriangle,
  Users, Send, Clock, Eye, BookTemplate,
  RefreshCcw, Download, Filter, Megaphone, SlidersHorizontal,
  TrendingUp, CalendarClock, SendHorizonal, Users2, FilterX,
  CalendarRange, Smile,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { FormDialog } from "./form-dialog";

// ─── Types ────────────────────────────────────────────────────────────────────

type AnnouncementStatus = "Draft" | "Scheduled" | "Published" | "Archived";
type Channel = "In-App" | "SMS" | "WhatsApp" | "Email";
type AnnouncementType = "General Notice" | "Event Reminder" | "Tithe & Offering" | "Fundraising" | "Pastoral Message" | "Emergency";
type TabKey = "all" | "drafts" | "scheduled" | "published" | "archived";

interface Announcement {
  id: string;
  title: string;
  body: string;
  type: AnnouncementType;
  status: AnnouncementStatus;
  channels: Channel[];
  ministries: string[];
  scheduledTime: string;
  author: { name: string; initials: string; color: string };
  pinned?: boolean;
  urgent?: boolean;
  reach?: number;
  delivered?: number;
  opened?: number;
  failed?: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "1",
    title: "Sunday Service Reminder",
    body: "Dear church family, don't forget our Sunday service this week at 9:00 AM. We have a special guest speaker — Bishop Emmanuel Asante — joining us for the morning session. Come early to get a good seat!",
    type: "General Notice",
    status: "Published",
    channels: ["In-App", "WhatsApp", "SMS"],
    ministries: ["All Members"],
    scheduledTime: "Sun 7:00 AM",
    author: { name: "Pastor David Osei", initials: "DO", color: "#2D1B69" },
    pinned: true,
    reach: 482,
    delivered: 461,
    opened: 312,
    failed: 21,
  },
  {
    id: "2",
    title: "Monthly Tithe & Offering Notice",
    body: "Beloved, as we approach the end of the month, we encourage all members to faithfully bring their tithes and offerings. You can give online via the app or at the offering box during service.",
    type: "Tithe & Offering",
    status: "Scheduled",
    channels: ["In-App", "Email", "SMS"],
    ministries: ["All Members"],
    scheduledTime: "Thu 8:00 AM",
    author: { name: "Elder Grace Mensah", initials: "GM", color: "#C8860A" },
    reach: 482,
  },
  {
    id: "3",
    title: "Youth Rally — This Saturday",
    body: "Youth Ministry is hosting a rally this Saturday at 3 PM at the Community Park. All young adults aged 16–35 are invited. Bring a friend! There'll be food, games, and an inspiring word.",
    type: "Event Reminder",
    status: "Published",
    channels: ["In-App", "WhatsApp"],
    ministries: ["Youth"],
    scheduledTime: "Wed 10:00 AM",
    author: { name: "Bro. Kwame Boateng", initials: "KB", color: "#0A4A3A" },
    reach: 148,
    delivered: 141,
    opened: 98,
    failed: 7,
  },
  {
    id: "4",
    title: "Harvest Conference Registration Now Open",
    body: "Registration for the Annual Harvest Conference (June 14–16) is now open. Visit the Events page in your app to register and secure your spot. VIP tables are limited — book early!",
    type: "Event Reminder",
    status: "Published",
    channels: ["In-App", "Email", "WhatsApp", "SMS"],
    ministries: ["All Members"],
    scheduledTime: "Mon 9:00 AM",
    author: { name: "Pastor David Osei", initials: "DO", color: "#2D1B69" },
    pinned: true,
    reach: 482,
    delivered: 475,
    opened: 390,
    failed: 7,
  },
  {
    id: "5",
    title: "Choir Rehearsal Schedule Update",
    body: "Please note that choir rehearsals have moved to Thursdays, 5 PM–8 PM in Music Room B, effective immediately. Please update your calendars accordingly.",
    type: "General Notice",
    status: "Draft",
    channels: ["In-App"],
    ministries: ["Choir"],
    scheduledTime: "—",
    author: { name: "Sis. Abena Darko", initials: "AD", color: "#7C3AED" },
  },
  {
    id: "6",
    title: "Building Fund Pledge Drive",
    body: "We are trusting God for GHS 500,000 toward our new sanctuary building fund. We invite every family to prayerfully commit a pledge over the next six months. Pledge forms available at the welcome desk.",
    type: "Fundraising",
    status: "Scheduled",
    channels: ["In-App", "Email", "WhatsApp"],
    ministries: ["All Members"],
    scheduledTime: "Fri 7:30 AM",
    author: { name: "Elder Grace Mensah", initials: "GM", color: "#C8860A" },
    urgent: true,
    reach: 482,
  },
  {
    id: "7",
    title: "Easter Service — Thank You!",
    body: "What an incredible Easter celebration! Thank you to every volunteer, musician, and church member who made this year's Easter service unforgettable. God bless you all!",
    type: "Pastoral Message",
    status: "Archived",
    channels: ["In-App", "Email"],
    ministries: ["All Members"],
    scheduledTime: "Apr 6, 9:00 AM",
    author: { name: "Pastor David Osei", initials: "DO", color: "#2D1B69" },
    reach: 480,
    delivered: 474,
    opened: 421,
    failed: 6,
  },
];

const SEND_LOG = [
  { text: "Announcement sent → All Members", sub: "Sunday Service Reminder", time: "10:04", initials: "DO", color: "#2D1B69", kind: "sent" },
  { text: "Draft saved", sub: "Choir Rehearsal Schedule Update", time: "9:41", initials: "AD", color: "#7C3AED", kind: "draft" },
  { text: "Scheduled", sub: "Monthly Tithe & Offering Notice", time: "9:00", initials: "GM", color: "#C8860A", kind: "scheduled" },
  { text: "Edited", sub: "Building Fund Pledge Drive", time: "8:52", initials: "GM", color: "#C8860A", kind: "edited" },
  { text: "Announcement sent → Youth", sub: "Youth Rally — This Saturday", time: "8:31", initials: "KB", color: "#0A4A3A", kind: "sent" },
  { text: "Auto-reminder sent", sub: "Harvest Conference (System)", time: "8:00", initials: "SY", color: "#6B7280", kind: "sent" },
] as const;

const CURRENT_USER = "Pastor David Osei";

const UP_NEXT = ANNOUNCEMENTS.filter(a => a.status === "Scheduled");

// ─── Tokens ───────────────────────────────────────────────────────────────────

const BRAND = "#C8860A";
const DARK = "#1A1A1A";
const BG = "#F5F4EF";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusStyle(s: AnnouncementStatus) {
  if (s === "Published") return { color: "#0A4A3A", bg: "rgba(10,74,58,0.10)", border: "#0A4A3A" };
  if (s === "Scheduled") return { color: "#92610A", bg: "rgba(200,134,10,0.10)", border: BRAND };
  if (s === "Draft") return { color: "#6B7280", bg: "#F3F4F6", border: "#9CA3AF" };
  return { color: "#9CA3AF", bg: "#F9FAFB", border: "#E5E7EB" };
}

function channelIcon(ch: Channel) {
  const props = { size: 11 };
  if (ch === "Email") return <Mail {...props} />;
  if (ch === "SMS") return <Phone {...props} />;
  if (ch === "WhatsApp") return <MessageSquare {...props} />;
  return <Bell {...props} />;
}

function channelColor(ch: Channel) {
  if (ch === "Email") return { bg: "rgba(59,130,246,0.10)", color: "#2563EB" };
  if (ch === "SMS") return { bg: "rgba(16,185,129,0.10)", color: "#059669" };
  if (ch === "WhatsApp") return { bg: "rgba(37,211,102,0.10)", color: "#1DA851" };
  return { bg: "rgba(200,134,10,0.10)", color: "#92610A" };
}

const inputStyle: React.CSSProperties = {
  border: "1.5px solid #E5E7EB",
  borderRadius: 8,
  padding: "8px 11px",
  fontSize: 13,
  fontFamily: "var(--font-label)",
  color: "#1A1A1A",
  background: "#FAFAFA",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

// ─── Reusable atoms ───────────────────────────────────────────────────────────

function Pill({ children, color, bg }: { children: React.ReactNode; color: string; bg: string }) {
  return (
    <span style={{ background: bg, color, fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99, display: "inline-flex", alignItems: "center", gap: 4 }}>
      {children}
    </span>
  );
}

function Avatar({ initials, color, size = 28 }: { initials: string; color: string; size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 99, background: `${color}20`, border: `1.5px solid ${color}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontFamily: "var(--font-label)", fontSize: size * 0.36, fontWeight: 700, color }}>{initials}</span>
    </div>
  );
}

function GoldBtn({ children, onClick, icon, small, loading, loadingLabel }: { children: React.ReactNode; onClick?: () => void; icon?: React.ReactNode; small?: boolean; loading?: boolean; loadingLabel?: string }) {
  const [hov, setHov] = useState(false);
  const [down, setDown] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setDown(false); }}
      onMouseDown={() => setDown(true)}
      onMouseUp={() => setDown(false)}
      style={{
        background: hov ? "linear-gradient(135deg, #B97809 0%, #D99A20 100%)" : `linear-gradient(135deg, ${BRAND} 0%, #D99A20 100%)`,
        color: "#fff", fontFamily: "var(--font-label)", fontSize: small ? 12.5 : 13.5, fontWeight: 700,
        padding: small ? "7px 15px" : "10px 20px", borderRadius: 99, border: "none", cursor: loading ? "wait" : "pointer",
        display: "inline-flex", alignItems: "center", gap: 7,
        boxShadow: loading ? "none" : `0 6px 16px rgba(200,134,10,0.28)`,
        transform: down ? "translateY(1px) scale(0.99)" : "none",
        transition: "all 0.15s ease", opacity: loading ? 0.75 : 1,
      }}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 rounded-full" style={{ border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
          {loadingLabel || "Working..."}
        </>
      ) : (
        <>
          {icon}{children}
        </>
      )}
    </button>
  );
}

function Btn2({ children, onClick, icon, small, danger }: { children: React.ReactNode; onClick?: () => void; icon?: React.ReactNode; small?: boolean; danger?: boolean }) {
  return (
    <button onClick={onClick} style={{ background: danger ? "rgba(185,28,28,0.06)" : "transparent", color: danger ? "#B91C1C" : DARK, fontFamily: "var(--font-label)", fontSize: small ? 12 : 13, fontWeight: 600, padding: small ? "6px 14px" : "8px 16px", borderRadius: 99, border: `1.5px solid ${danger ? "rgba(185,28,28,0.25)" : "#D1D5DB"}`, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, transition: "all 0.15s" }}>
      {icon}{children}
    </button>
  );
}

function IconBtn({ icon, label, onClick, danger, disabled }: { icon: React.ReactNode; label: string; onClick?: () => void; danger?: boolean; disabled?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      title={label} aria-label={label} onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ width: 30, height: 30, borderRadius: 8, border: `1.5px solid ${hov ? (danger ? "rgba(185,28,28,0.4)" : BRAND) : "#E5E7EB"}`, background: hov ? (danger ? "rgba(185,28,28,0.06)" : `rgba(200,134,10,0.06)`) : "#FAFAFA", display: "flex", alignItems: "center", justifyContent: "center", cursor: disabled ? "not-allowed" : "pointer", color: hov ? (danger ? "#B91C1C" : BRAND) : "#6B7280", transition: "all 0.15s", opacity: disabled ? 0.4 : 1 }}>
      {icon}
    </button>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EBEBEB", padding: "18px" }}>
      <div style={{ fontFamily: "var(--font-label)", fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 16 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>{children}</div>
    </div>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: "#374151" }}>
        {label}{required && <span style={{ color: BRAND }}> *</span>}
      </label>
      {children}
    </div>
  );
}

// ─── Summary Metric Card ──────────────────────────────────────────────────────

function SummaryCard({
  icon, label, value, sub, trend, trendUp, tone = "#2D1B69",
}: {
  icon: React.ReactNode; label: string; value: string; sub?: string; trend?: string; trendUp?: boolean; tone?: string;
}) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #EBEBEB", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12, minWidth: 0, boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${tone}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
        {trend && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 700, color: trendUp ? "#0A4A3A" : "#B91C1C", background: trendUp ? "rgba(10,74,58,0.08)" : "rgba(185,28,28,0.08)", padding: "2px 8px", borderRadius: 99 }}>
            {trendUp ? <TrendingUp size={11} /> : null}{trend}
          </span>
        )}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-label)", fontSize: 26, fontWeight: 800, color: DARK, lineHeight: 1.1 }}>{value}</div>
        <div style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: "#6B7280", marginTop: 2 }}>{label}</div>
        {sub && <div style={{ fontFamily: "var(--font-label)", fontSize: 11.5, color: "#9CA3AF", marginTop: 3 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ─── Left Filter Panel ────────────────────────────────────────────────────────

function StatusFilterRow({
  keyVal, label, count, active, dot, onClick,
}: {
  keyVal: TabKey; label: string; count: number; active: boolean; dot?: string; onClick: () => void;
}) {
  return (
    <button onClick={onClick} aria-pressed={active}
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "9px 14px", border: "none", background: active ? `rgba(200,134,10,0.06)` : "transparent", cursor: "pointer", borderLeft: `3px solid ${active ? BRAND : "transparent"}`, transition: "background 0.15s" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {dot ? <div style={{ width: 7, height: 7, borderRadius: 99, background: dot }} /> : null}
        <span style={{ fontFamily: "var(--font-label)", fontSize: 13, fontWeight: active ? 700 : 400, color: active ? BRAND : "#374151" }}>{label}</span>
      </div>
      <span style={{ fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 600, color: active ? BRAND : "#9CA3AF", background: active ? `rgba(200,134,10,0.12)` : "#F3F4F6", padding: "1px 7px", borderRadius: 99 }}>{count}</span>
    </button>
  );
}

function LeftPanel({
  anns, status, onStatus, typeFilter, onType, pinnedOnly, onPinned, urgentOnly, onUrgent, search, onSearch,
}: {
  anns: Announcement[];
  status: TabKey; onStatus: (t: TabKey) => void;
  typeFilter: AnnouncementType | "all"; onType: (t: AnnouncementType | "all") => void;
  pinnedOnly: boolean; onPinned: (v: boolean) => void;
  urgentOnly: boolean; onUrgent: (v: boolean) => void;
  search: string; onSearch: (s: string) => void;
}) {
  const allTypes = useMemo(() => {
    const set = new Set(anns.map(a => a.type));
    return Array.from(set);
  }, [anns]);

  const countFor = (fn: (a: Announcement) => boolean) => anns.filter(fn).length;

  const hasActive = search !== "" || typeFilter !== "all" || pinnedOnly || urgentOnly;

  const reset = () => { onSearch(""); onType("all"); onPinned(false); onUrgent(false); };

  return (
    <aside style={{ display: "flex", flexDirection: "column", gap: 16, flexShrink: 0 }}>
      {/* Search */}
      <div style={{ position: "relative" }}>
        <Search size={14} color="#9CA3AF" style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
        <input
          value={search} onChange={e => onSearch(e.target.value)}
          placeholder="Search announcements…"
          aria-label="Search announcements"
          style={{ ...inputStyle, paddingLeft: 32, borderRadius: 99, background: "#fff", fontSize: 12.5 }}
        />
        {search ? (
          <button onClick={() => onSearch("")} aria-label="Clear search" style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#9CA3AF", cursor: "pointer" }}>
            <X size={13} />
          </button>
        ) : null}
      </div>

      {/* Status */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EBEBEB", overflow: "hidden" }}>
        <div style={{ padding: "11px 14px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</span>
          {status !== "all" && <button onClick={() => onStatus("all")} style={{ background: "none", border: "none", fontSize: 11, color: BRAND, fontFamily: "var(--font-label)", fontWeight: 600, cursor: "pointer" }}>Show all</button>}
        </div>
        <div>
          <StatusFilterRow keyVal="all" label="All" count={anns.length} active={status === "all"} onClick={() => onStatus("all")} />
          <StatusFilterRow keyVal="drafts" label="Drafts" count={countFor(a => a.status === "Draft")} active={status === "drafts"} dot="#9CA3AF" onClick={() => onStatus("drafts")} />
          <StatusFilterRow keyVal="scheduled" label="Scheduled" count={countFor(a => a.status === "Scheduled")} active={status === "scheduled"} dot={BRAND} onClick={() => onStatus("scheduled")} />
          <StatusFilterRow keyVal="published" label="Published" count={countFor(a => a.status === "Published")} active={status === "published"} dot="#0A4A3A" onClick={() => onStatus("published")} />
          <StatusFilterRow keyVal="archived" label="Archived" count={countFor(a => a.status === "Archived")} active={status === "archived"} dot="#D1D5DB" onClick={() => onStatus("archived")} />
        </div>
      </div>

      {/* Type */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EBEBEB", overflow: "hidden" }}>
        <div style={{ padding: "11px 14px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>Type</span>
          {typeFilter !== "all" && <button onClick={() => onType("all")} style={{ background: "none", border: "none", fontSize: 11, color: BRAND, fontFamily: "var(--font-label)", fontWeight: 600, cursor: "pointer" }}>All types</button>}
        </div>
        <div style={{ padding: "6px 0" }}>
          <button
            onClick={() => onType("all")}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", textAlign: "left", padding: "7px 14px", border: "none", background: typeFilter === "all" ? "rgba(200,134,10,0.06)" : "transparent", cursor: "pointer", fontFamily: "var(--font-label)", fontSize: 12.5, fontWeight: typeFilter === "all" ? 700 : 400, color: typeFilter === "all" ? BRAND : "#374151" }}>
            <span>All types</span>
            <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>{anns.length}</span>
          </button>
          {allTypes.map(t => (
            <button key={t} onClick={() => onType(t)}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", textAlign: "left", padding: "7px 14px", border: "none", background: typeFilter === t ? "rgba(200,134,10,0.06)" : "transparent", cursor: "pointer", fontFamily: "var(--font-label)", fontSize: 12.5, fontWeight: typeFilter === t ? 700 : 400, color: typeFilter === t ? BRAND : "#374151" }}>
              <span>{t}</span>
              <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>{countFor(a => a.type === t)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick filters */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EBEBEB", overflow: "hidden" }}>
        <div style={{ padding: "11px 14px", borderBottom: "1px solid #F3F4F6" }}>
          <span style={{ fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>Quick Filters</span>
        </div>
        <div style={{ padding: "8px 14px 12px", display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "Pinned", icon: <Pin size={12} />, val: pinnedOnly, on: onPinned },
            { label: "Urgent", icon: <AlertTriangle size={12} />, val: urgentOnly, on: onUrgent },
          ].map(f => (
            <label key={f.label} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <button
                role="checkbox" aria-checked={f.val} onClick={() => f.on(!f.val)}
                style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${f.val ? BRAND : "#D1D5DB"}`, background: f.val ? BRAND : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer" }}>
                {f.val && <Check size={10} color="#fff" strokeWidth={3} />}
              </button>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "var(--font-label)", fontSize: 12, color: "#374151" }}>
                <span style={{ color: "#9CA3AF" }}>{f.icon}</span>{f.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset */}
      {hasActive && (
        <button onClick={reset}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", padding: "9px 0", borderRadius: 99, border: "1.5px solid #EBEBEB", background: "#fff", fontFamily: "var(--font-label)", fontSize: 12.5, fontWeight: 600, color: "#6B7280", cursor: "pointer", transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = BRAND; e.currentTarget.style.color = BRAND; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#EBEBEB"; e.currentTarget.style.color = "#6B7280"; }}
        >
          <FilterX size={13} />Clear filters
        </button>
      )}
    </aside>
  );
}

// ─── Announcement Card ────────────────────────────────────────────────────────

function AnnouncementCard({
  ann, onView, onEdit, onDuplicate, onArchive, onDelete,
}: {
  ann: Announcement;
  onView: (a: Announcement) => void;
  onEdit: (a: Announcement) => void;
  onDuplicate: (a: Announcement) => void;
  onArchive: (a: Announcement) => void;
  onDelete: (a: Announcement) => void;
}) {
  const ss = statusStyle(ann.status);
  const isArchived = ann.status === "Archived";

  return (
    <div
      onClick={() => onView(ann)}
      role="button" tabIndex={0} aria-label={`View announcement: ${ann.title}`}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onView(ann); } }}
      style={{
        background: "#fff",
        borderRadius: 14,
        border: "1px solid #EBEBEB",
        borderLeft: `3px solid ${ss.border}`,
        padding: "14px 16px",
        opacity: isArchived ? 0.6 : 1,
        cursor: "pointer",
        transition: "box-shadow 0.18s, border-color 0.18s",
        display: "flex", flexDirection: "column", gap: 9,
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)"; e.currentTarget.style.borderColor = "#E0DCD5"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#EBEBEB"; }}
    >
      {/* Top row: channels + flags | status */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
          {ann.channels.map(ch => {
            const c = channelColor(ch);
            return (
              <Pill key={ch} color={c.color} bg={c.bg}>
                {channelIcon(ch)}{ch}
              </Pill>
            );
          })}
          {ann.pinned && <Pill color="#2D1B69" bg="rgba(45,27,105,0.08)"><Pin size={9} />Pinned</Pill>}
          {ann.urgent && <Pill color="#B91C1C" bg="rgba(185,28,28,0.08)"><AlertTriangle size={9} />Urgent</Pill>}
        </div>
        <Pill color={ss.color} bg={ss.bg}>{ann.status}</Pill>
      </div>

      {/* Title */}
      <div style={{ fontFamily: "var(--font-label)", fontSize: 15, fontWeight: 700, color: DARK, fontStyle: isArchived ? "italic" : "normal", lineHeight: 1.3 }}>{ann.title}</div>

      {/* Body preview */}
      <p style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#6B7280", margin: 0, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {ann.body}
      </p>

      {/* Bottom row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginTop: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Avatar initials={ann.author.initials} color={ann.author.color} size={22} />
            <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#6B7280", whiteSpace: "nowrap" }}>{ann.author.name}</span>
          </div>
          {ann.ministries.slice(0, 2).map(m => (
            <Pill key={m} color="#374151" bg="#F3F4F6">{m}</Pill>
          ))}
          {ann.ministries.length > 2 && <Pill color="#374151" bg="#F3F4F6">+{ann.ministries.length - 2}</Pill>}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Clock size={11} color="#9CA3AF" />
            <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#9CA3AF" }}>{ann.scheduledTime}</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 4 }} onClick={e => e.stopPropagation()}>
          {!isArchived && <IconBtn icon={<Edit3 size={13} />} label="Edit" onClick={() => onEdit(ann)} />}
          <IconBtn icon={<Copy size={13} />} label="Duplicate" onClick={() => onDuplicate(ann)} />
          {!isArchived && <IconBtn icon={<Archive size={13} />} label="Archive" onClick={() => onArchive(ann)} />}
          <IconBtn icon={<Trash2 size={13} />} label="Delete" danger onClick={() => onDelete(ann)} disabled={ann.pinned} />
        </div>
      </div>
    </div>
  );
}

// ─── Right Panel ──────────────────────────────────────────────────────────────

function RightPanel({ onView }: { onView: (a: Announcement) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <aside style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Up Next */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EBEBEB", overflow: "hidden" }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Up Next</span>
          <span style={{ fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 600, color: BRAND, background: "rgba(200,134,10,0.08)", padding: "2px 8px", borderRadius: 99 }}>{UP_NEXT.length}</span>
        </div>
        <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
          {UP_NEXT.length === 0 && (
            <div style={{ fontFamily: "var(--font-label)", fontSize: 12.5, color: "#9CA3AF", padding: "8px 4px" }}>Nothing scheduled.</div>
          )}
          {UP_NEXT.map(ann => (
            <div key={ann.id}>
              <button
                onClick={() => setExpandedId(expandedId === ann.id ? null : ann.id)}
                aria-expanded={expandedId === ann.id}
                style={{ width: "100%", background: "#FAFAF8", borderRadius: 12, border: `1px solid ${expandedId === ann.id ? BRAND : "#EBEBEB"}`, padding: "11px 12px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "flex-start", gap: 10, transition: "border-color 0.15s" }}
              >
                <Avatar initials={ann.author.initials} color={ann.author.color} size={30} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 600, color: DARK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ann.title}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                    <Clock size={11} color={BRAND} />
                    <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#92610A" }}>{ann.scheduledTime}</span>
                  </div>
                </div>
                <ChevronDown size={13} color="#9CA3AF" style={{ transform: expandedId === ann.id ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0, marginTop: 2 }} />
              </button>
              {expandedId === ann.id && (
                <div style={{ background: "#fff", borderRadius: "0 0 12px 12px", border: "1px solid #EBEBEB", borderTop: "none", padding: "10px 12px", marginBottom: 2 }}>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 }}>
                    {ann.channels.map(ch => {
                      const c = channelColor(ch);
                      return <Pill key={ch} color={c.color} bg={c.bg}>{channelIcon(ch)}{ch}</Pill>;
                    })}
                  </div>
                  <p style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#6B7280", margin: "0 0 10px", lineHeight: 1.5 }}>{ann.body.slice(0, 90)}…</p>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Btn2 small onClick={() => onView(ann)}>View</Btn2>
                    <GoldBtn small icon={<Send size={11} />}>Send Now</GoldBtn>
                  </div>
                </div>
              )}
            </div>
          ))}
          {UP_NEXT.length > 0 && (
            <button style={{ background: "none", border: "none", fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: BRAND, cursor: "pointer", padding: "4px 2px", textAlign: "left" }}>View all →</button>
          )}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#EBEBEB" }} />

      {/* Send Log */}
      <div>
        <div style={{ padding: "0 4px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Send Log</span>
          <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>Today</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {SEND_LOG.map((log, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 9, padding: "9px 4px", borderBottom: i < SEND_LOG.length - 1 ? "1px solid #F3F4F6" : "none" }}>
              <Avatar initials={log.initials} color={log.color} size={24} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#374151", lineHeight: 1.4 }}>{log.text}</div>
                <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{log.sub}</div>
              </div>
              <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF", flexShrink: 0 }}>{log.time}</span>
            </div>
          ))}
        </div>
        <button style={{ background: "none", border: "none", fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: BRAND, cursor: "pointer", padding: "8px 4px 0", textAlign: "left" }}>View full send log →</button>
      </div>
    </aside>
  );
}

// ─── Create / Edit Panel ──────────────────────────────────────────────────────

function CreatePanel({ ann, onClose, onSave }: {
  ann?: Announcement;
  onClose: () => void;
  onSave: (a: Announcement) => void;
}) {
  const [sendTo, setSendTo] = useState<"all" | "ministry">("all");
  const [sendNow, setSendNow] = useState(true);
  const [recurring, setRecurring] = useState(false);
  const [translate, setTranslate] = useState(false);
  const [channels, setChannels] = useState<Record<Channel, boolean>>({ "In-App": true, SMS: false, WhatsApp: false, Email: true });
  const [title, setTitle] = useState(ann?.title ?? "");
  const [type, setType] = useState<AnnouncementType>(ann?.type ?? "General Notice");
  const [bodyText, setBodyText] = useState(ann?.body ?? "");
  const [activePreview, setActivePreview] = useState<Channel>("In-App");
  const [titleErr, setTitleErr] = useState<string | null>(null);
  const [bodyErr, setBodyErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const toggleChannel = (ch: Channel) => setChannels(prev => ({ ...prev, [ch]: !prev[ch] }));
  const smsCount = bodyText.length;

  const isEditing = !!ann;

  const ALL_TYPES: AnnouncementType[] = ["General Notice", "Event Reminder", "Tithe & Offering", "Fundraising", "Pastoral Message", "Emergency"];

  const submit = (status: AnnouncementStatus) => {
    let valid = true;
    if (!title.trim()) { setTitleErr("Title is required."); valid = false; }
    if (!bodyText.trim()) { setBodyErr("Message is required."); valid = false; }
    if (!valid) return;

    setSubmitting(true);
    const activeChannels = (Object.keys(channels).filter(k => channels[k as Channel]) as Channel[]);
    const newAnn: Announcement = {
      id: ann?.id ?? `new-${Date.now()}`,
      title: title.trim(),
      body: bodyText.trim(),
      type,
      status,
      channels: activeChannels.length ? activeChannels : ["In-App"],
      ministries: sendTo === "all" ? ["All Members"] : ["Choir", "Youth", "Prayer Team", "Children's", "Media"].filter((_, i) => i < 2),
      scheduledTime: status === "Draft" ? "—" : sendNow ? "Now" : "Fri 8:00 AM",
      author: { name: CURRENT_USER, initials: "DO", color: "#2D1B69" },
      pinned: ann?.pinned,
      urgent: ann?.urgent,
      reach: ann?.reach,
      delivered: ann?.delivered,
      opened: ann?.opened,
      failed: ann?.failed,
    };

    setTimeout(() => {
      onSave(newAnn);
      setSubmitting(false);
      onClose();
      if (status === "Published") toast.success("Announcement published successfully.");
      else if (status === "Scheduled") toast.success("Announcement scheduled successfully.");
      else toast.success("Draft saved successfully.");
    }, 600);
  };

  const footer = (
    <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", flexWrap: "wrap" }}>
      {!isEditing && <Btn2 icon={<BookTemplate size={13} />}>Save as Template</Btn2>}
      <Btn2 icon={<Clock size={13} />} onClick={() => submit("Draft")}>Save Draft</Btn2>
      <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
        <GoldBtn icon={sendNow ? <Send size={13} /> : <CalendarClock size={13} />} onClick={() => submit(sendNow ? "Published" : "Scheduled")} loading={submitting} loadingLabel={sendNow ? "Publishing..." : "Scheduling..."}>
          {isEditing ? "Save Changes" : sendNow ? "Publish Now" : "Schedule Announcement"}
        </GoldBtn>
      </div>
    </div>
  );

  return (
    <FormDialog
      open
      onClose={onClose}
      icon={<Bell size={20} color="#C8860A" />}
      title={isEditing ? "Edit Announcement" : "New Announcement"}
      description={isEditing ? "Update this announcement for your members." : "Create and send an announcement to your church community."}
      maxWidth="max-w-4xl"
      footer={footer}
    >
      <div style={{ padding: "22px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          {/* Left: Content */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <SectionCard title="Content">
              <FormField label="Title" required>
                <input value={title} onChange={e => { setTitle(e.target.value); if (titleErr) setTitleErr(null); }} placeholder="e.g. Sunday Service Reminder" aria-label="Announcement title" style={{ ...inputStyle, borderColor: titleErr ? "#B91C1C" : undefined }} />
                {titleErr && <span style={{ fontFamily: "var(--font-label)", fontSize: 11.5, color: "#B91C1C" }}>{titleErr}</span>}
              </FormField>
              <FormField label="Announcement Type">
                <select value={type} onChange={e => setType(e.target.value as AnnouncementType)} style={inputStyle}>
                  {ALL_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </FormField>
              <FormField label={`Message Body ${channels.SMS ? `· SMS: ${smsCount}/160` : ""}`} required>
                <div style={{ border: "1.5px solid #E5E7EB", borderRadius: 10, overflow: "hidden", background: "#FAFAFA" }}>
                  <div style={{ display: "flex", gap: 2, padding: "6px 8px", borderBottom: "1px solid #E5E7EB", background: "#F9FAFB" }}>
                    {["B", "I", "•"].map(b => (
                      <button key={b} style={{ width: 26, height: 24, borderRadius: 5, border: "none", background: "transparent", cursor: "pointer", fontFamily: "var(--font-label)", fontSize: 12, fontWeight: b === "B" ? 700 : 400, fontStyle: b === "I" ? "italic" : "normal", color: "#374151" }}>{b}</button>
                    ))}
                    <button title="Insert emoji" style={{ width: 26, height: 24, borderRadius: 5, border: "none", background: "transparent", cursor: "pointer", color: "#374151", display: "flex", alignItems: "center", justifyContent: "center" }}><Smile size={14} /></button>
                    <div style={{ marginLeft: "auto", fontFamily: "var(--font-label)", fontSize: 11, color: channels.SMS && smsCount > 140 ? "#B91C1C" : "#9CA3AF", display: "flex", alignItems: "center" }}>
                      {smsCount} chars
                    </div>
                  </div>
                  <textarea
                    rows={5}
                    value={bodyText}
                    onChange={e => { setBodyText(e.target.value); if (bodyErr) setBodyErr(null); }}
                    placeholder="Type your announcement here…"
                    aria-label="Announcement message"
                    style={{ width: "100%", border: "none", outline: "none", padding: "10px 12px", fontFamily: "var(--font-label)", fontSize: 13, color: "#1A1A1A", background: "transparent", resize: "vertical", boxSizing: "border-box" }}
                  />
                </div>
                {bodyErr && <span style={{ fontFamily: "var(--font-label)", fontSize: 11.5, color: "#B91C1C" }}>{bodyErr}</span>}
              </FormField>
              <FormField label="Attachment (optional)">
                <div style={{ border: "2px dashed #D1D5DB", borderRadius: 10, padding: "18px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, cursor: "pointer", background: "#FAFAFA" }}>
                  <Upload size={18} color="#9CA3AF" />
                  <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#6B7280" }}>Drag & drop or <span style={{ color: BRAND, fontWeight: 600 }}>browse</span></span>
                  <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>Image or banner · max 5 MB</span>
                </div>
              </FormField>
            </SectionCard>

            <SectionCard title="Preview Per Channel">
              <div style={{ display: "flex", gap: 6 }}>
                {(["In-App", "SMS", "WhatsApp", "Email"] as Channel[]).map(ch => {
                  const cc = channelColor(ch);
                  const active = activePreview === ch;
                  return (
                    <button key={ch} onClick={() => setActivePreview(ch)}
                      style={{ flex: 1, padding: "6px 0", borderRadius: 8, border: `1.5px solid ${active ? cc.color : "#E5E7EB"}`, background: active ? cc.bg : "transparent", fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 600, color: active ? cc.color : "#9CA3AF", cursor: "pointer" }}>
                      {ch}
                    </button>
                  );
                })}
              </div>
              <div style={{ background: "#F9FAFB", borderRadius: 10, padding: "14px 14px", minHeight: 90 }}>
                {activePreview === "SMS" ? (
                  <div>
                    <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF", marginBottom: 6 }}>SMS Preview · max 160 chars</div>
                    <div style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{bodyText.slice(0, 160) || "Your message will appear here…"}</div>
                    {smsCount > 160 && <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#B91C1C", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}><AlertTriangle size={12} /> Message exceeds 160 characters and will be split.</div>}
                  </div>
                ) : activePreview === "WhatsApp" ? (
                  <div>
                    <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF", marginBottom: 6 }}>WhatsApp · Sent via broadcast list</div>
                    <div style={{ background: "#DCF8C6", borderRadius: "0 10px 10px 10px", padding: "8px 12px", display: "inline-block", maxWidth: "85%" }}>
                      <div style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#1A1A1A", lineHeight: 1.5 }}>{bodyText || "Your message will appear here…"}</div>
                      <div style={{ fontFamily: "var(--font-label)", fontSize: 10, color: "#9CA3AF", textAlign: "right", marginTop: 4, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>9:00 AM <Check size={11} style={{ color: "#34B7F1" }} /><Check size={11} style={{ color: "#34B7F1", marginLeft: -4 }} /></div>
                    </div>
                  </div>
                ) : activePreview === "Email" ? (
                  <div>
                    <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF", marginBottom: 8 }}>Email Preview</div>
                    <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, padding: "12px" }}>
                      <div style={{ fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 6 }}>Grace Chapel Church</div>
                      <div style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{bodyText || "Your message will appear here…"}</div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF", marginBottom: 6 }}>In-App Notification</div>
                    <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, padding: "10px 12px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: `rgba(200,134,10,0.12)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Bell size={15} color={BRAND} />
                      </div>
                      <div>
                        <div style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 700, color: DARK }}>Grace Chapel</div>
                        <div style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#374151", lineHeight: 1.4 }}>{bodyText.slice(0, 60) || "Your message…"}{bodyText.length > 60 ? "…" : ""}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </SectionCard>
          </div>

          {/* Right: Delivery */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <SectionCard title="Target Audience">
              <FormField label="Send to">
                <div style={{ display: "flex", gap: 0, border: "1.5px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
                  {(["all", "ministry"] as const).map(opt => (
                    <button key={opt} onClick={() => setSendTo(opt)}
                      style={{ flex: 1, padding: "8px 0", border: "none", background: sendTo === opt ? DARK : "#fff", color: sendTo === opt ? "#fff" : "#374151", fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                      {opt === "all" ? "All Members" : "Specific Ministry"}
                    </button>
                  ))}
                </div>
              </FormField>
              {sendTo === "ministry" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {["Choir", "Youth", "Prayer Team", "Children's", "Media"].map(m => (
                    <label key={m} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                      <div style={{ width: 15, height: 15, borderRadius: 4, border: "1.5px solid #D1D5DB", background: "#fff", flexShrink: 0 }} />
                      <span style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#374151" }}>{m}</span>
                    </label>
                  ))}
                </div>
              )}
              <div style={{ background: "rgba(200,134,10,0.06)", borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                <Users size={14} color={BRAND} />
                <span style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#92610A" }}>
                  Estimated reach: <strong>~{sendTo === "all" ? "482" : "~95"} members</strong>
                </span>
              </div>
            </SectionCard>

            <SectionCard title="Delivery Channels">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {(["In-App", "SMS", "WhatsApp", "Email"] as Channel[]).map(ch => {
                  const cc = channelColor(ch);
                  const active = channels[ch];
                  return (
                    <div key={ch} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", borderRadius: 10, border: `1.5px solid ${active ? cc.color : "#E5E7EB"}`, background: active ? cc.bg : "#FAFAFA" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ color: cc.color }}>{channelIcon(ch)}</span>
                        <span style={{ fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 500, color: "#374151" }}>{ch}</span>
                        {ch === "WhatsApp" && <span style={{ fontFamily: "var(--font-label)", fontSize: 10, color: "#9CA3AF" }}>via broadcast</span>}
                        {ch === "SMS" && <span style={{ fontFamily: "var(--font-label)", fontSize: 10, color: smsCount > 160 ? "#B91C1C" : "#9CA3AF" }}>{smsCount}/160</span>}
                      </div>
                      <button onClick={() => toggleChannel(ch)} aria-label={`Toggle ${ch}`} style={{ background: "none", border: "none", cursor: "pointer", color: active ? cc.color : "#9CA3AF", padding: 0 }}>
                        {active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            <SectionCard title="Scheduling">
              <div style={{ display: "flex", gap: 0, border: "1.5px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
                {([true, false] as const).map(opt => (
                  <button key={String(opt)} onClick={() => setSendNow(opt)}
                    style={{ flex: 1, padding: "8px 0", border: "none", background: sendNow === opt ? DARK : "#fff", color: sendNow === opt ? "#fff" : "#374151", fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    {opt ? "Send Now" : "Schedule for Later"}
                  </button>
                ))}
              </div>
              {!sendNow && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <FormField label="Date"><input type="date" style={inputStyle} /></FormField>
                  <FormField label="Time"><input type="time" style={inputStyle} /></FormField>
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#374151" }}>Repeat this announcement</span>
                <button onClick={() => setRecurring(!recurring)} aria-label="Toggle repeat" style={{ background: "none", border: "none", cursor: "pointer", color: recurring ? BRAND : "#9CA3AF", padding: 0 }}>
                  {recurring ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                </button>
              </div>
              {recurring && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <FormField label="Frequency">
                    <select style={inputStyle}><option>Daily</option><option>Weekly</option><option>Monthly</option></select>
                  </FormField>
                  <FormField label="Ends On"><input type="date" style={inputStyle} /></FormField>
                </div>
              )}
              {recurring && (
                <div style={{ background: "#F9FAFB", borderRadius: 8, padding: "8px 12px" }}>
                  <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#6B7280", fontStyle: "italic" }}>e.g. "Every Sunday morning at 7 AM — service reminder"</span>
                </div>
              )}
            </SectionCard>

            <SectionCard title="Language">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#374151" }}>Translate message</span>
                <button onClick={() => setTranslate(!translate)} aria-label="Toggle translate" style={{ background: "none", border: "none", cursor: "pointer", color: translate ? BRAND : "#9CA3AF", padding: 0 }}>
                  {translate ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                </button>
              </div>
              {translate && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {["English", "Twi", "Ga", "Ewe"].map(lang => (
                    <div key={lang} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 10px", background: "#F9FAFB", borderRadius: 8, border: "1px solid #E5E7EB" }}>
                      <span style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#374151" }}>{lang}</span>
                      <button style={{ background: `rgba(200,134,10,0.08)`, color: BRAND, border: "none", borderRadius: 6, padding: "3px 10px", fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Generate</button>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard title="Flags">
              {[
                { label: "Pin to member home feed", icon: <Pin size={13} />, sub: "Up to 3 pinned at once" },
                { label: "Mark as Urgent", icon: <AlertTriangle size={13} />, sub: "Overrides DND for emergency announcements" },
              ].map(f => (
                <div key={f.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#9CA3AF" }}>{f.icon}</span>
                    <div>
                      <div style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#374151" }}>{f.label}</div>
                      <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>{f.sub}</div>
                    </div>
                  </div>
                  <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 0 }}>
                    <ToggleLeft size={24} />
                  </button>
                </div>
              ))}
            </SectionCard>
          </div>
        </div>
      </div>
    </FormDialog>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

function ConfirmDialog({
  open, title, message, confirmLabel, tone = "danger", onCancel, onConfirm,
}: {
  open: boolean; title: string; message: string; confirmLabel: string; tone?: "danger" | "brand";
  onCancel: () => void; onConfirm: () => void;
}) {
  return (
    <FormDialog
      open={open}
      onClose={onCancel}
      icon={<AlertTriangle size={20} color={tone === "danger" ? "#B91C1C" : "#C8860A"} />}
      title={title}
      maxWidth="max-w-md"
      description={message}
      primaryButton={{
        label: confirmLabel,
        icon: <Trash2 size={15} color="#fff" />,
        onClick: onConfirm,
      }}
    >
      <div style={{ padding: "20px 24px 6px" }}>
        <p style={{ fontFamily: "var(--font-label)", fontSize: 13.5, color: "#4B5563", margin: 0, lineHeight: 1.6 }}>
          {message}
        </p>
      </div>
    </FormDialog>
  );
}

// ─── Detail View ──────────────────────────────────────────────────────────────

function DetailView({ ann, onClose, onEdit }: { ann: Announcement; onClose: () => void; onEdit: (a: Announcement) => void }) {
  const [recipientSearch, setRecipientSearch] = useState("");
  const ss = statusStyle(ann.status);

  const RECIPIENTS = [
    { name: "Abena Osei", channel: "SMS", status: "Delivered" },
    { name: "Kwame Asante", channel: "Email", status: "Opened" },
    { name: "Ama Boateng", channel: "WhatsApp", status: "Delivered" },
    { name: "Kofi Mensah", channel: "In-App", status: "Opened" },
    { name: "Akosua Darko", channel: "SMS", status: "Failed" },
    { name: "Yaw Amponsah", channel: "Email", status: "Delivered" },
  ];

  const filtered = RECIPIENTS.filter(r => !recipientSearch || r.name.toLowerCase().includes(recipientSearch.toLowerCase()));

  const channelStats = ann.channels.map(ch => ({
    ch,
    val: ch === "SMS" ? (ann.delivered ?? 0) : ch === "Email" ? Math.round((ann.delivered ?? 0) * 0.9) : Math.round((ann.delivered ?? 0) * 0.95),
    total: ann.reach ?? 0,
  }));

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 90, display: "flex" }} role="dialog" aria-modal="true" aria-label={ann.title}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(20,16,16,0.45)", backdropFilter: "blur(3px)" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "min(720px, 94vw)", background: "#fff", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "-8px 0 40px rgba(0,0,0,0.12)" }}>
        {/* Header */}
        <div style={{ background: "#fff", borderBottom: "1px solid #EBEBEB", padding: "15px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <Pill color={ss.color} bg={ss.bg}>{ann.status}</Pill>
            <span style={{ fontFamily: "var(--font-label)", fontSize: 16, fontWeight: 700, color: DARK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ann.title}</span>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ background: "#F3F4F6", border: "none", borderRadius: 99, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={16} color="#374151" />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "22px" }}>
          {/* Message */}
          <div style={{ background: "#F9FAFB", borderRadius: 14, padding: "16px 18px", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Avatar initials={ann.author.initials} color={ann.author.color} size={28} />
              <div>
                <div style={{ fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 600, color: DARK }}>{ann.author.name}</div>
                <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>{ann.scheduledTime} · {ann.ministries.join(", ")}</div>
              </div>
            </div>
            <div style={{ fontFamily: "var(--font-label)", fontSize: 14, color: "#374151", lineHeight: 1.65 }}>{ann.body}</div>
          </div>

          {/* Delivery stats */}
          {ann.reach && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 12 }}>Delivery Stats</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
                {[
                  { label: "Sent to", value: ann.reach, icon: <Send size={14} />, color: "#2D1B69" },
                  { label: "Delivered", value: ann.delivered, icon: <Check size={14} />, color: "#0A4A3A" },
                  { label: "Opened", value: ann.opened, icon: <Eye size={14} />, color: BRAND },
                  { label: "Failed", value: ann.failed, icon: <AlertTriangle size={14} />, color: "#B91C1C" },
                ].map(s => (
                  <div key={s.label} style={{ background: "#F9FAFB", borderRadius: 10, padding: "12px", border: "1px solid #E5E7EB" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                      <span style={{ color: s.color }}>{s.icon}</span>
                      <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>{s.label}</span>
                    </div>
                    <div style={{ fontFamily: "var(--font-label)", fontSize: 20, fontWeight: 800, color: s.color }}>{s.value ?? "—"}</div>
                  </div>
                ))}
              </div>

              {/* Channel breakdown */}
              <div style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>Channel Breakdown</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {channelStats.map(cs => {
                  const cc = channelColor(cs.ch);
                  const pct = cs.total > 0 ? Math.round((cs.val / cs.total) * 100) : 0;
                  return (
                    <div key={cs.ch} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Pill color={cc.color} bg={cc.bg}>{channelIcon(cs.ch)}{cs.ch}</Pill>
                      <div style={{ flex: 1, background: "#E5E7EB", borderRadius: 99, height: 6, overflow: "hidden" }}>
                        <div style={{ background: cc.color, width: `${pct}%`, height: "100%", borderRadius: 99 }} />
                      </div>
                      <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#6B7280", width: 60, textAlign: "right" }}>{cs.val}/{cs.total}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recipients */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 700, color: DARK }}>Recipients</div>
              <Btn2 small icon={<Download size={12} />}>Export</Btn2>
            </div>
            <div style={{ position: "relative", marginBottom: 10 }}>
              <Search size={13} color="#9CA3AF" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
              <input value={recipientSearch} onChange={e => setRecipientSearch(e.target.value)} placeholder="Search recipients…" aria-label="Search recipients" style={{ ...inputStyle, paddingLeft: 30, fontSize: 12 }} />
            </div>
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F9FAFB" }}>
                    {["Member", "Channel", "Status"].map(h => (
                      <th key={h} style={{ padding: "9px 14px", textAlign: "left", fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => {
                    const rStatus = r.status === "Delivered" ? { color: "#0A4A3A", bg: "rgba(10,74,58,0.08)" }
                      : r.status === "Opened" ? { color: BRAND, bg: "rgba(200,134,10,0.08)" }
                      : { color: "#B91C1C", bg: "rgba(185,28,28,0.08)" };
                    return (
                      <tr key={i} style={{ borderTop: "1px solid #F3F4F6" }}>
                        <td style={{ padding: "10px 14px", fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 500, color: DARK }}>{r.name}</td>
                        <td style={{ padding: "10px 14px" }}>
                          <Pill color={channelColor(r.channel as Channel).color} bg={channelColor(r.channel as Channel).bg}>{r.channel}</Pill>
                        </td>
                        <td style={{ padding: "10px 14px" }}>
                          <Pill color={rStatus.color} bg={rStatus.bg}>{r.status}</Pill>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ background: "#F9FAFB", borderTop: "1px solid #EBEBEB", padding: "12px 22px", display: "flex", gap: 8, flexShrink: 0 }}>
          {ann.status !== "Archived" && <Btn2 small icon={<Edit3 size={12} />} onClick={() => { onClose(); onEdit(ann); }}>Edit</Btn2>}
          <Btn2 small icon={<Copy size={12} />}>Duplicate</Btn2>
          {ann.status !== "Archived" && <Btn2 small icon={<Archive size={12} />}>Archive</Btn2>}
          <button style={{ marginLeft: "auto", background: "rgba(185,28,28,0.08)", color: "#B91C1C", border: "1.5px solid rgba(185,28,28,0.2)", borderRadius: 99, padding: "6px 14px", fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
            <Trash2 size={12} />Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(ANNOUNCEMENTS);
  const [status, setStatus] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<AnnouncementType | "all">("all");
  const [pinnedOnly, setPinnedOnly] = useState(false);
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [editingAnn, setEditingAnn] = useState<Announcement | undefined>();
  const [viewingAnn, setViewingAnn] = useState<Announcement | null>(null);
  const [confirm, setConfirm] = useState<{ ann: Announcement; action: "archive" | "delete" } | null>(null);
  const [mobileFilters, setMobileFilters] = useState(false);

  const visible = announcements.filter(a => {
    if (search && !(a.title + " " + a.body).toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== "all" && a.type !== typeFilter) return false;
    if (pinnedOnly && !a.pinned) return false;
    if (urgentOnly && !a.urgent) return false;
    if (status === "drafts" && a.status !== "Draft") return false;
    if (status === "scheduled" && a.status !== "Scheduled") return false;
    if (status === "published" && a.status !== "Published") return false;
    if (status === "archived" && a.status !== "Archived") return false;
    return true;
  });

  const pinned = visible.filter(a => a.pinned);
  const rest = visible.filter(a => !a.pinned || status !== "all");

  // ── Summary metrics (computed from real data) ──
  const sentThisMonth = announcements.filter(a => a.status === "Published").length;
  const scheduledCount = announcements.filter(a => a.status === "Scheduled").length;
  const draftsCount = announcements.filter(a => a.status === "Draft").length;
  const archivedCount = announcements.filter(a => a.status === "Archived").length;
  const withStats = announcements.filter(a => typeof a.reach === "number" && typeof a.delivered === "number");
  const deliveryRate = withStats.length
    ? Math.round((withStats.reduce((s, a) => s + (a.delivered ?? 0), 0) / withStats.reduce((s, a) => s + (a.reach ?? 0), 0)) * 100)
    : 0;
  const totalReach = announcements.reduce((s, a) => s + (a.reach ?? 0), 0);
  const sentLogCount = SEND_LOG.filter(l => l.kind === "sent").length;

  const handleSave = (a: Announcement) => {
    setAnnouncements(prev => {
      const exists = prev.some(x => x.id === a.id);
      return exists ? prev.map(x => (x.id === a.id ? a : x)) : [a, ...prev];
    });
  };

  const handleDuplicate = (a: Announcement) => {
    const copy: Announcement = { ...a, id: `dup-${Date.now()}`, title: `${a.title} (Copy)`, status: "Draft" };
    setAnnouncements(prev => [copy, ...prev]);
    toast.success(`Duplicated "${a.title}" as a draft.`);
  };

  const runConfirm = () => {
    if (!confirm) return;
    if (confirm.action === "archive") {
      setAnnouncements(prev => prev.map(a => (a.id === confirm.ann.id ? { ...a, status: "Archived" as const } : a)));
      toast.success("Announcement archived.");
    } else {
      setAnnouncements(prev => prev.filter(a => a.id !== confirm.ann.id));
      toast.success("Announcement deleted.");
      if (viewingAnn?.id === confirm.ann.id) setViewingAnn(null);
    }
    setConfirm(null);
  };

  const currentUserName = CURRENT_USER;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto", background: BG }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #EBEBEB", padding: "18px 26px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 26, fontWeight: 700, color: DARK, margin: 0, letterSpacing: "-0.01em" }}>Announcements</h1>
            <p style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#6B7280", margin: "4px 0 0" }}>Share important updates and keep your church connected.</p>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 10 }}>
              <Avatar initials="DO" color="#2D1B69" size={22} />
              <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#6B7280" }}>{currentUserName}</span>
              <span style={{ width: 6, height: 6, borderRadius: 99, background: "#0A4A3A" }} />
              <span style={{ fontFamily: "var(--font-label)", fontSize: 11.5, color: "#9CA3AF" }}>Active · Admin</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={() => setMobileFilters(true)}
              className="xl:hidden inline-flex items-center gap-2"
              aria-label="Open filters"
              style={{ background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 99, padding: "10px 16px", fontFamily: "var(--font-label)", fontSize: 13.5, fontWeight: 600, color: DARK, cursor: "pointer" }}
            >
              <SlidersHorizontal size={15} />Filters
            </button>
            <GoldBtn icon={<Plus size={16} />} onClick={() => { setEditingAnn(undefined); setShowCreate(true); }}>
              New Announcement
            </GoldBtn>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: 12, marginTop: 12, paddingBottom: 6 }}>
          <SummaryCard
            icon={<SendHorizonal size={18} color="#2D1B69" />} tone="#2D1B69"
            label="Sent This Month" value={String(sentThisMonth)}
            trend={`+${sentLogCount} this week`} trendUp
          />
          <SummaryCard
            icon={<CalendarClock size={18} color="#92610A" />} tone="#C8860A"
            label="Scheduled" value={String(scheduledCount)} sub={`${draftsCount} draft · ${archivedCount} archived`}
          />
          <SummaryCard
            icon={<TrendingUp size={18} color="#0A4A3A" />} tone="#0A4A3A"
            label="Avg Delivery Rate" value={`${deliveryRate}%`} sub={"vs last month"} trend="↑ 5%" trendUp
          />
          <SummaryCard
            icon={<Users2 size={18} color="#7C3AED" />} tone="#7C3AED"
            label="Members Notified" value={totalReach.toLocaleString()} sub="Total reach"
          />
        </div>
      </div>

      {/* Body - columns layout */}
      <div className="flex flex-col xl:flex-row xl:sticky xl:top-0 xl:h-screen">
        {/* Left sidebar - desktop */}
        <div className="ann-left hidden xl:block xl:overflow-y-auto" style={{ padding: "16px 16px", borderRight: "1px solid #DDDAD4", width: 232, minWidth: 232 }}>
          <LeftPanel
            anns={announcements}
            status={status} onStatus={setStatus}
            typeFilter={typeFilter} onType={setTypeFilter}
            pinnedOnly={pinnedOnly} onPinned={setPinnedOnly}
            urgentOnly={urgentOnly} onUrgent={setUrgentOnly}
            search={search} onSearch={setSearch}
          />
        </div>

        {/* Mobile filters overlay */}
        {mobileFilters && (
          <div className="xl:hidden" style={{ position: "fixed", inset: 0, zIndex: 80, display: "flex" }} role="dialog" aria-modal="true" aria-label="Filters">
            <div onClick={() => setMobileFilters(false)} style={{ position: "absolute", inset: 0, background: "rgba(20,16,16,0.45)", backdropFilter: "blur(3px)" }} />
            <div style={{ position: "relative", width: "min(320px, 85vw)", height: "100%", background: BG, boxShadow: "8px 0 40px rgba(0,0,0,0.12)", overflowY: "auto", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: 16, fontWeight: 700, color: DARK }}>Filters</span>
                <button onClick={() => setMobileFilters(false)} aria-label="Close filters" style={{ background: "#F3F4F6", border: "none", borderRadius: 99, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <X size={15} color="#374151" />
                </button>
              </div>
              <LeftPanel
                anns={announcements}
                status={status} onStatus={setStatus}
                typeFilter={typeFilter} onType={setTypeFilter}
                pinnedOnly={pinnedOnly} onPinned={setPinnedOnly}
                urgentOnly={urgentOnly} onUrgent={setUrgentOnly}
                search={search} onSearch={setSearch}
              />
            </div>
          </div>
        )}

        {/* Center feed */}
        <div className="order-1 xl:order-none xl:overflow-y-auto" style={{ flex: 1, minWidth: 0, padding: "16px 20px", height: "100%" }}>
          {/* Pinned */}
          {pinned.length > 0 && status === "all" && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <Pin size={13} color={BRAND} />
                <span style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 700, color: BRAND, textTransform: "uppercase", letterSpacing: "0.04em" }}>Pinned</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {pinned.map(a => (
                  <AnnouncementCard
                    key={a.id} ann={a}
                    onView={setViewingAnn}
                    onEdit={ann => { setEditingAnn(ann); setShowCreate(true); }}
                    onDuplicate={handleDuplicate}
                    onArchive={ann => setConfirm({ ann, action: "archive" })}
                    onDelete={ann => setConfirm({ ann, action: "delete" })}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Rest */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {rest.map(a => (
              <AnnouncementCard
                key={a.id} ann={a}
                onView={setViewingAnn}
                onEdit={ann => { setEditingAnn(ann); setShowCreate(true); }}
                onDuplicate={handleDuplicate}
                onArchive={ann => setConfirm({ ann, action: "archive" })}
                onDelete={ann => setConfirm({ ann, action: "delete" })}
              />
            ))}
          </div>

          {visible.length === 0 && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 60 }}>
              <Megaphone size={36} color="#D1D5DB" />
              <div style={{ fontFamily: "var(--font-label)", fontSize: 15, fontWeight: 600, color: "#6B7280", marginTop: 14 }}>No announcements found</div>
              <div style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#9CA3AF", marginTop: 4 }}>Try adjusting your filters or create a new announcement.</div>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="w-full xl:w-[280px] xl:min-w-[280px] xl:border-l xl:overflow-y-auto xl:h-full" style={{ padding: "16px 16px", borderTop: "1px solid #DDDAD4" }}>
          <RightPanel onView={setViewingAnn} />
        </div>
      </div>

      {/* Overlays */}
      {showCreate && (
        <CreatePanel
          ann={editingAnn}
          onClose={() => { setShowCreate(false); setEditingAnn(undefined); }}
          onSave={handleSave}
        />
      )}
      {viewingAnn && (
        <DetailView
          ann={viewingAnn}
          onClose={() => setViewingAnn(null)}
          onEdit={ann => { setViewingAnn(null); setEditingAnn(ann); setShowCreate(true); }}
        />
      )}
      <ConfirmDialog
        open={!!confirm}
        title={confirm?.action === "archive" ? "Archive announcement" : "Delete announcement"}
        message={confirm?.action === "archive"
          ? `Archive "${confirm?.ann.title}"? It will be removed from the active feed but kept for history.`
          : `Delete "${confirm?.ann.title}" permanently? This cannot be undone.`}
        confirmLabel={confirm?.action === "archive" ? "Archive" : "Delete"}
        onCancel={() => setConfirm(null)}
        onConfirm={runConfirm}
      />
      <Toaster
        position="bottom-right"
        richColors
        toastOptions={{
          style: {
            fontFamily: "var(--font-label)",
            borderRadius: "12px",
            border: "1px solid #EDEAE6",
            boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
          },
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
