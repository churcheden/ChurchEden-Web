import { useState } from "react";
import {
  Plus, Search, Edit3, Copy, Archive, Trash2, ChevronRight,
  ChevronDown, Bell, Mail, MessageSquare, Phone, Check, X,
  ToggleLeft, ToggleRight, Upload, Pin, AlertTriangle,
  BarChart2, Users, Send, Clock, Eye, BookTemplate,
  RefreshCcw, Download, Filter, Megaphone, Star,
} from "lucide-react";
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
  { text: "Announcement sent → All Members", sub: "Sunday Service Reminder", time: "10:04", initials: "DO", color: "#2D1B69" },
  { text: "Draft saved", sub: "Choir Rehearsal Schedule Update", time: "9:41", initials: "AD", color: "#7C3AED" },
  { text: "Scheduled", sub: "Monthly Tithe & Offering Notice", time: "9:00", initials: "GM", color: "#C8860A" },
  { text: "Edited", sub: "Building Fund Pledge Drive", time: "8:52", initials: "GM", color: "#C8860A" },
  { text: "Announcement sent → Youth", sub: "Youth Rally — This Saturday", time: "8:31", initials: "KB", color: "#0A4A3A" },
  { text: "Auto-reminder sent", sub: "Harvest Conference (System)", time: "8:00", initials: "SY", color: "#6B7280" },
];

const UP_NEXT = ANNOUNCEMENTS.filter(a => a.status === "Scheduled");

// ─── Tokens ───────────────────────────────────────────────────────────────────

const BRAND = "#C8860A";
const DARK = "#1A1A1A";
const BG = "#F5F4EF";
const PANEL_BG = "#EEECEA";

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

function DarkBtn({ children, onClick, icon, small }: { children: React.ReactNode; onClick?: () => void; icon?: React.ReactNode; small?: boolean }) {
  return (
    <button onClick={onClick} style={{ background: DARK, color: "#fff", fontFamily: "var(--font-label)", fontSize: small ? 12 : 13, fontWeight: 600, padding: small ? "6px 14px" : "8px 18px", borderRadius: 99, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
      {icon}{children}
    </button>
  );
}

function OutlineBtn({ children, onClick, icon, small }: { children: React.ReactNode; onClick?: () => void; icon?: React.ReactNode; small?: boolean }) {
  return (
    <button onClick={onClick} style={{ background: "transparent", color: DARK, fontFamily: "var(--font-label)", fontSize: small ? 12 : 13, fontWeight: 600, padding: small ? "6px 14px" : "8px 16px", borderRadius: 99, border: "1.5px solid #D1D5DB", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
      {icon}{children}
    </button>
  );
}

function IconBtn({ icon, label, onClick, active }: { icon: React.ReactNode; label: string; onClick?: () => void; active?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <button title={label} onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ width: 30, height: 30, borderRadius: 8, border: `1.5px solid ${hov || active ? BRAND : "#E5E7EB"}`, background: hov || active ? `rgba(200,134,10,0.06)` : "#FAFAFA", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: hov || active ? BRAND : "#6B7280", transition: "all 0.15s" }}>
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

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: "#374151" }}>{label}</label>
      {children}
    </div>
  );
}

// ─── Left Sidebar ─────────────────────────────────────────────────────────────

function LeftSidebar({ activeTab, onTabChange, search, onSearch }: {
  activeTab: TabKey; onTabChange: (t: TabKey) => void; search: string; onSearch: (s: string) => void;
}) {
  const tabs: { key: TabKey; label: string; count: number; dot?: string }[] = [
    { key: "all", label: "All", count: ANNOUNCEMENTS.length },
    { key: "drafts", label: "Drafts", count: ANNOUNCEMENTS.filter(a => a.status === "Draft").length, dot: "#9CA3AF" },
    { key: "scheduled", label: "Scheduled", count: ANNOUNCEMENTS.filter(a => a.status === "Scheduled").length, dot: BRAND },
    { key: "published", label: "Published", count: ANNOUNCEMENTS.filter(a => a.status === "Published").length, dot: "#0A4A3A" },
    { key: "archived", label: "Archived", count: ANNOUNCEMENTS.filter(a => a.status === "Archived").length, dot: "#D1D5DB" },
  ];

  const types: AnnouncementType[] = ["General Notice", "Event Reminder", "Tithe & Offering", "Fundraising", "Pastoral Message", "Emergency"];

  return (
    <aside style={{ width: 210, minWidth: 210, display: "flex", flexDirection: "column", gap: 20, flexShrink: 0, paddingBottom: 24 }}>
      {/* Search */}
      <div style={{ position: "relative" }}>
        <Search size={14} color="#9CA3AF" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
        <input
          value={search} onChange={e => onSearch(e.target.value)}
          placeholder="Search announcements…"
          style={{ ...inputStyle, paddingLeft: 32, borderRadius: 99, background: "#fff", fontSize: 12 }}
        />
      </div>

      {/* Status filter */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EBEBEB", overflow: "hidden" }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #F3F4F6" }}>
          <span style={{ fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</span>
        </div>
        {tabs.map(t => (
          <button key={t.key} onClick={() => onTabChange(t.key)}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "9px 14px", border: "none", background: activeTab === t.key ? `rgba(200,134,10,0.06)` : "transparent", cursor: "pointer", borderLeft: `3px solid ${activeTab === t.key ? BRAND : "transparent"}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {t.dot && <div style={{ width: 7, height: 7, borderRadius: 99, background: t.dot }} />}
              <span style={{ fontFamily: "var(--font-label)", fontSize: 13, fontWeight: activeTab === t.key ? 700 : 400, color: activeTab === t.key ? BRAND : "#374151" }}>{t.label}</span>
            </div>
            <span style={{ fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 600, color: activeTab === t.key ? BRAND : "#9CA3AF", background: activeTab === t.key ? `rgba(200,134,10,0.12)` : "#F3F4F6", padding: "1px 7px", borderRadius: 99 }}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Type filter */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EBEBEB", overflow: "hidden" }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #F3F4F6" }}>
          <span style={{ fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>Type</span>
        </div>
        <div style={{ padding: "8px 0" }}>
          {types.map(t => (
            <button key={t} style={{ display: "block", width: "100%", textAlign: "left", padding: "7px 14px", border: "none", background: "transparent", cursor: "pointer", fontFamily: "var(--font-label)", fontSize: 12, color: "#374151" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#F9FAFB"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Quick filters */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EBEBEB", overflow: "hidden" }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #F3F4F6" }}>
          <span style={{ fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>Quick Filters</span>
        </div>
        <div style={{ padding: "8px 14px 12px", display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "Pinned", icon: <Pin size={12} /> },
            { label: "Urgent", icon: <AlertTriangle size={12} /> },
            { label: "System / Auto", icon: <RefreshCcw size={12} /> },
          ].map(f => (
            <label key={f.label} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <div style={{ width: 15, height: 15, borderRadius: 4, border: "1.5px solid #D1D5DB", background: "#fff", flexShrink: 0 }} />
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "var(--font-label)", fontSize: 12, color: "#374151" }}>
                <span style={{ color: "#9CA3AF" }}>{f.icon}</span>{f.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ─── Announcement Card ────────────────────────────────────────────────────────

function AnnouncementCard({
  ann, onView, onEdit,
}: {
  ann: Announcement;
  onView: (a: Announcement) => void;
  onEdit: (a: Announcement) => void;
}) {
  const ss = statusStyle(ann.status);
  const isArchived = ann.status === "Archived";

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        border: "1px solid #EBEBEB",
        borderLeft: `4px solid ${ss.border}`,
        padding: "16px 18px",
        opacity: isArchived ? 0.65 : 1,
        transition: "box-shadow 0.18s",
        cursor: "pointer",
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.07)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Top row: channels + flags + expand */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
          {ann.channels.map(ch => {
            const c = channelColor(ch);
            return (
              <Pill key={ch} color={c.color} bg={c.bg}>
                {channelIcon(ch)}{ch}
              </Pill>
            );
          })}
          {ann.pinned && (
            <Pill color="#2D1B69" bg="rgba(45,27,105,0.08)">
              <Pin size={9} />Pinned
            </Pill>
          )}
          {ann.urgent && (
            <Pill color="#B91C1C" bg="rgba(185,28,28,0.08)">
              <AlertTriangle size={9} />Urgent
            </Pill>
          )}
        </div>
        <button onClick={() => onView(ann)} style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#9CA3AF" }}>
          <ChevronRight size={13} />
        </button>
      </div>

      {/* Title */}
      <div style={{ fontFamily: "var(--font-label)", fontSize: 15, fontWeight: 700, color: DARK, marginBottom: 5, fontStyle: isArchived ? "italic" : "normal" }}>
        {ann.title}
      </div>

      {/* Body preview */}
      <p style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#6B7280", margin: "0 0 12px", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {ann.body}
      </p>

      {/* Bottom row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        {/* Left: author + ministries + time */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar initials={ann.author.initials} color={ann.author.color} size={26} />
          <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#9CA3AF" }}>{ann.author.name}</span>
          <span style={{ color: "#E5E7EB" }}>·</span>
          {ann.ministries.map(m => (
            <Pill key={m} color="#374151" bg="#F3F4F6">{m}</Pill>
          ))}
          <span style={{ color: "#E5E7EB" }}>·</span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Clock size={11} color="#9CA3AF" />
            <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#9CA3AF" }}>{ann.scheduledTime}</span>
          </div>
        </div>

        {/* Right: status + actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Pill color={ss.color} bg={ss.bg}>{ann.status}</Pill>
          <div style={{ display: "flex", gap: 4 }}>
            <IconBtn icon={<Edit3 size={12} />} label="Edit" onClick={() => onEdit(ann)} />
            <IconBtn icon={<Copy size={12} />} label="Duplicate" />
            <IconBtn icon={<Archive size={12} />} label="Archive" />
            <IconBtn icon={<Trash2 size={12} />} label="Delete" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Right Panel ──────────────────────────────────────────────────────────────

function RightPanel({ onView }: { onView: (a: Announcement) => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <aside style={{ width: 256, minWidth: 256, flexShrink: 0, display: "flex", flexDirection: "column", gap: 0, background: PANEL_BG, borderLeft: "1px solid #DDDAD4", overflowY: "auto" }}>
      {/* Up Next */}
      <div style={{ padding: "18px 16px 0" }}>
        <div style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>Up Next</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {UP_NEXT.map(ann => (
            <div key={ann.id}>
              <button
                onClick={() => setExpandedId(expandedId === ann.id ? null : ann.id)}
                style={{ width: "100%", background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: "11px 12px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "flex-start", gap: 10, marginBottom: expandedId === ann.id ? 0 : 6 }}
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
                <div style={{ background: "#fff", borderRadius: "0 0 12px 12px", border: "1px solid #E5E7EB", borderTop: "none", padding: "10px 12px", marginBottom: 6 }}>
                  <p style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#6B7280", margin: "0 0 10px", lineHeight: 1.5 }}>{ann.body.slice(0, 90)}…</p>
                  <div style={{ display: "flex", gap: 6 }}>
                    <OutlineBtn small onClick={() => onView(ann)}>View</OutlineBtn>
                    <DarkBtn small icon={<Send size={11} />}>Send Now</DarkBtn>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#DDDAD4", margin: "16px 0" }} />

      {/* Send Log */}
      <div style={{ padding: "0 16px 20px" }}>
        <div style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>Send Log</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {SEND_LOG.map((log, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 9, padding: "9px 0", borderBottom: i < SEND_LOG.length - 1 ? "1px solid #E5E7EB" : "none" }}>
              <Avatar initials={log.initials} color={log.color} size={24} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#374151", lineHeight: 1.4 }}>{log.text}</div>
                <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{log.sub}</div>
              </div>
              <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF", flexShrink: 0 }}>{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ─── Create / Edit Panel ──────────────────────────────────────────────────────

function CreatePanel({ ann, onClose }: { ann?: Announcement; onClose: () => void }) {
  const [sendTo, setSendTo] = useState<"all" | "ministry">("all");
  const [sendNow, setSendNow] = useState(true);
  const [recurring, setRecurring] = useState(false);
  const [translate, setTranslate] = useState(false);
  const [channels, setChannels] = useState<Record<Channel, boolean>>({ "In-App": true, SMS: false, WhatsApp: false, Email: true });
  const [bodyText, setBodyText] = useState(ann?.body ?? "");
  const [activePreview, setActivePreview] = useState<Channel>("In-App");

  const toggleChannel = (ch: Channel) => setChannels(prev => ({ ...prev, [ch]: !prev[ch] }));
  const smsCount = bodyText.length;

  return (
    <FormDialog
      open
      onClose={onClose}
      icon={<Bell size={20} color="#C8860A" />}
      title={ann ? "Edit Announcement" : "New Announcement"}
      description={ann ? "Update this announcement for your members." : "Create and send an announcement across your channels."}
      maxWidth="max-w-4xl"
      footer={(
        <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
          <OutlineBtn icon={<BookTemplate size={13} />}>Save as Template</OutlineBtn>
          <OutlineBtn>Save Draft</OutlineBtn>
          <OutlineBtn icon={<Eye size={13} />}>Preview</OutlineBtn>
          <div style={{ marginLeft: "auto" }}>
            <DarkBtn icon={sendNow ? <Send size={13} /> : <Clock size={13} />}>
              {sendNow ? "Send Now" : "Schedule"}
            </DarkBtn>
          </div>
        </div>
      )}
    >
      <div style={{ padding: "22px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

            {/* Left: Content */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <SectionCard title="Content">
                <FormField label="Title *">
                  <input defaultValue={ann?.title} placeholder="e.g. Sunday Service Reminder" style={inputStyle} />
                </FormField>
                <FormField label="Announcement Type">
                  <select defaultValue={ann?.type} style={inputStyle}>
                    {(["General Notice", "Event Reminder", "Tithe & Offering", "Fundraising", "Pastoral Message", "Emergency"] as AnnouncementType[]).map(t => <option key={t}>{t}</option>)}
                  </select>
                </FormField>
                <FormField label={`Message Body ${channels.SMS ? `· SMS: ${smsCount}/160` : ""}`}>
                  {/* Simple toolbar */}
                  <div style={{ border: "1.5px solid #E5E7EB", borderRadius: 10, overflow: "hidden", background: "#FAFAFA" }}>
                    <div style={{ display: "flex", gap: 2, padding: "6px 8px", borderBottom: "1px solid #E5E7EB", background: "#F9FAFB" }}>
                      {["B", "I", "•", "😊"].map(b => (
                        <button key={b} style={{ width: 26, height: 24, borderRadius: 5, border: "none", background: "transparent", cursor: "pointer", fontFamily: "var(--font-label)", fontSize: 12, fontWeight: b === "B" ? 700 : 400, fontStyle: b === "I" ? "italic" : "normal", color: "#374151" }}>{b}</button>
                      ))}
                      <div style={{ marginLeft: "auto", fontFamily: "var(--font-label)", fontSize: 11, color: channels.SMS && smsCount > 140 ? "#B91C1C" : "#9CA3AF", display: "flex", alignItems: "center" }}>
                        {smsCount} chars
                      </div>
                    </div>
                    <textarea
                      rows={5}
                      value={bodyText}
                      onChange={e => setBodyText(e.target.value)}
                      placeholder="Type your announcement here…"
                      style={{ width: "100%", border: "none", outline: "none", padding: "10px 12px", fontFamily: "var(--font-label)", fontSize: 13, color: "#1A1A1A", background: "transparent", resize: "vertical", boxSizing: "border-box" }}
                    />
                  </div>
                </FormField>
                {/* Attachment */}
                <FormField label="Attachment (optional)">
                  <div style={{ border: "2px dashed #D1D5DB", borderRadius: 10, padding: "18px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, cursor: "pointer", background: "#FAFAFA" }}>
                    <Upload size={18} color="#9CA3AF" />
                    <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#6B7280" }}>Drag & drop or <span style={{ color: BRAND, fontWeight: 600 }}>browse</span></span>
                    <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>Image or banner · max 5 MB</span>
                  </div>
                </FormField>
              </SectionCard>

              {/* Channel preview */}
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
                      {smsCount > 160 && <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#B91C1C", marginTop: 6 }}>⚠ Message exceeds 160 characters and will be split.</div>}
                    </div>
                  ) : activePreview === "WhatsApp" ? (
                    <div>
                      <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF", marginBottom: 6 }}>WhatsApp · Sent via broadcast list</div>
                      <div style={{ background: "#DCF8C6", borderRadius: "0 10px 10px 10px", padding: "8px 12px", display: "inline-block", maxWidth: "85%" }}>
                        <div style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#1A1A1A", lineHeight: 1.5 }}>{bodyText || "Your message will appear here…"}</div>
                        <div style={{ fontFamily: "var(--font-label)", fontSize: 10, color: "#9CA3AF", textAlign: "right", marginTop: 4 }}>9:00 AM ✓✓</div>
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
                        <button onClick={() => toggleChannel(ch)} style={{ background: "none", border: "none", cursor: "pointer", color: active ? cc.color : "#9CA3AF", padding: 0 }}>
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
                  <button onClick={() => setRecurring(!recurring)} style={{ background: "none", border: "none", cursor: "pointer", color: recurring ? BRAND : "#9CA3AF", padding: 0 }}>
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
                  <button onClick={() => setTranslate(!translate)} style={{ background: "none", border: "none", cursor: "pointer", color: translate ? BRAND : "#9CA3AF", padding: 0 }}>
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

              {/* Flags */}
              <SectionCard title="Flags">
                {[
                  { label: "Pin to member home feed", icon: <Pin size={13} />, sub: "Up to 3 pinned at once" },
                  { label: "Mark as Urgent", icon: <AlertTriangle size={13} />, sub: "Overrides DND, sends immediately" },
                  { label: "Approval required", icon: <Check size={13} />, sub: "Submit for senior pastor review" },
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
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.38)", backdropFilter: "blur(2px)" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "min(700px, 92vw)", background: "#fff", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "-8px 0 40px rgba(0,0,0,0.12)" }}>
        {/* Header */}
        <div style={{ background: "#fff", borderBottom: "1px solid #EBEBEB", padding: "15px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Pill color={ss.color} bg={ss.bg}>{ann.status}</Pill>
            <span style={{ fontFamily: "var(--font-label)", fontSize: 16, fontWeight: 700, color: DARK }}>{ann.title}</span>
          </div>
          <button onClick={onClose} style={{ background: "#F3F4F6", border: "none", borderRadius: 99, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={14} color="#374151" />
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
                  { label: "Failed", value: ann.failed, icon: <AlertTriangle size={14} />, color: "#B91C1C", retry: true },
                ].map(s => (
                  <div key={s.label} style={{ background: "#F9FAFB", borderRadius: 10, padding: "12px", border: "1px solid #E5E7EB" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                      <span style={{ color: s.color }}>{s.icon}</span>
                      <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>{s.label}</span>
                    </div>
                    <div style={{ fontFamily: "var(--font-label)", fontSize: 20, fontWeight: 800, color: s.color }}>{s.value ?? "—"}</div>
                    {s.retry && s.value && s.value > 0 && (
                      <button style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#B91C1C", background: "none", border: "none", cursor: "pointer", padding: 0, marginTop: 4, display: "flex", alignItems: "center", gap: 3 }}>
                        <RefreshCcw size={10} />Retry
                      </button>
                    )}
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
              <OutlineBtn small icon={<Download size={12} />}>Export</OutlineBtn>
            </div>
            <div style={{ position: "relative", marginBottom: 10 }}>
              <Search size={13} color="#9CA3AF" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
              <input value={recipientSearch} onChange={e => setRecipientSearch(e.target.value)} placeholder="Search recipients…" style={{ ...inputStyle, paddingLeft: 30, fontSize: 12 }} />
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
          <OutlineBtn small icon={<Edit3 size={12} />} onClick={() => { onClose(); onEdit(ann); }}>Edit</OutlineBtn>
          <OutlineBtn small icon={<Copy size={12} />}>Duplicate</OutlineBtn>
          <OutlineBtn small icon={<Archive size={12} />}>Archive</OutlineBtn>
          <button style={{ marginLeft: "auto", background: "rgba(185,28,28,0.08)", color: "#B91C1C", border: "1.5px solid rgba(185,28,28,0.2)", borderRadius: 99, padding: "6px 14px", fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
            <Trash2 size={12} />Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function AnnouncementsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingAnn, setEditingAnn] = useState<Announcement | undefined>();
  const [viewingAnn, setViewingAnn] = useState<Announcement | null>(null);

  const visible = ANNOUNCEMENTS.filter(a => {
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeTab === "drafts" && a.status !== "Draft") return false;
    if (activeTab === "scheduled" && a.status !== "Scheduled") return false;
    if (activeTab === "published" && a.status !== "Published") return false;
    if (activeTab === "archived" && a.status !== "Archived") return false;
    return true;
  });

  const stats = [
    { label: "Sent This Month", value: "24", trend: "+8", trendUp: true },
    { label: "Scheduled", value: "3", sub: "queued" },
    { label: "Open Rate", value: "67%", sub: "avg delivery" },
    { label: "Total Reach", value: "1,842", sub: "members notified" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: BG }}>
      {/* Top bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #EBEBEB", padding: "18px 24px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 26, fontWeight: 700, color: DARK, margin: 0 }}>Announcements</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: 99, background: "#0A4A3A" }} />
              <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#6B7280" }}>Pastor David Osei · Active</span>
            </div>
          </div>
          <DarkBtn onClick={() => { setEditingAnn(undefined); setShowCreate(true); }} icon={<Plus size={15} />}>
            New Announcement
          </DarkBtn>
        </div>

        {/* Stats strip */}
        <div style={{ display: "flex", gap: 0, borderTop: "1px solid #F3F4F6", marginBottom: 0 }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{ flex: 1, padding: "10px 20px 10px 0", borderRight: i < stats.length - 1 ? "1px solid #F3F4F6" : "none", display: "flex", alignItems: "center", gap: 14 }}>
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontFamily: "var(--font-label)", fontSize: 22, fontWeight: 800, color: DARK }}>{s.value}</span>
                  {s.trend && (
                    <span style={{ fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 700, color: "#0A4A3A" }}>{s.trend}</span>
                  )}
                  {s.sub && (
                    <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#9CA3AF" }}>{s.sub}</span>
                  )}
                </div>
                <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Three-column body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left sidebar */}
        <div style={{ padding: "18px 16px", overflowY: "auto", borderRight: "1px solid #DDDAD4" }}>
          <LeftSidebar activeTab={activeTab} onTabChange={setActiveTab} search={search} onSearch={setSearch} />
        </div>

        {/* Center feed */}
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 18px" }}>
          {/* Pinned */}
          {visible.some(a => a.pinned) && activeTab === "all" && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <Pin size={13} color={BRAND} />
                <span style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 700, color: BRAND, textTransform: "uppercase", letterSpacing: "0.04em" }}>Pinned</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {visible.filter(a => a.pinned).map(a => (
                  <AnnouncementCard key={a.id} ann={a} onView={setViewingAnn} onEdit={ann => { setEditingAnn(ann); setShowCreate(true); }} />
                ))}
              </div>
            </div>
          )}

          {/* Rest */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {visible.filter(a => !a.pinned || activeTab !== "all").map(a => (
              <AnnouncementCard key={a.id} ann={a} onView={setViewingAnn} onEdit={ann => { setEditingAnn(ann); setShowCreate(true); }} />
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
        <RightPanel onView={setViewingAnn} />
      </div>

      {/* Overlays */}
      {showCreate && (
        <CreatePanel ann={editingAnn} onClose={() => { setShowCreate(false); setEditingAnn(undefined); }} />
      )}
      {viewingAnn && (
        <DetailView
          ann={viewingAnn}
          onClose={() => setViewingAnn(null)}
          onEdit={ann => { setViewingAnn(null); setEditingAnn(ann); setShowCreate(true); }}
        />
      )}
    </div>
  );
}
