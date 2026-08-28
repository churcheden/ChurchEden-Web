import { useState } from "react";
import {
  Search, Calendar, Grid3X3, List, Plus, SlidersHorizontal,
  ChevronDown, Edit3, Copy, Archive, Share2, Eye, Check,
  RotateCcw, Users, Ticket, TrendingUp, Bell, QrCode, Download,
  ChevronRight, Filter, Clock, MapPin, Tag, Repeat2,
  ArrowRight, BarChart2, AlertCircle, Send, Upload, ToggleLeft,
  ToggleRight, ChevronLeft, Maximize2, CheckCircle2, XCircle
} from "lucide-react";
import { FormDialog } from "./form-dialog";

// ─── Types ───────────────────────────────────────────────────────────────────

type EventType = "Sunday Service" | "Conference" | "Outreach" | "Fundraiser" | "Rehearsal" | "Special";
type EventStatus = "Published" | "Draft" | "Cancelled" | "Completed";
type Ministry = "All Members" | "Choir" | "Youth" | "Prayer Team" | "Children's" | "Media";
type ViewMode = "list" | "grid" | "calendar";
type TabKey = "all" | "upcoming" | "ongoing" | "past" | "drafts";

interface TicketTier { name: string; price: number | "Free"; sold: number; capacity: number; }

interface Event {
  id: string;
  name: string;
  type: EventType;
  status: EventStatus;
  ministries: Ministry[];
  date: string;
  endDate: string;
  time: string;
  endTime: string;
  venue: string;
  description: string;
  coverColor: string;
  registered: number;
  capacity: number;
  checkedIn: number;
  recurring?: string;
  ticketed: boolean;
  tiers: TicketTier[];
  pledgeGoal?: number;
  pledgeReceived?: number;
  notificationsSent: number;
  isFeatured?: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const EVENTS: Event[] = [
  {
    id: "1",
    name: "Annual Harvest Conference 2026",
    type: "Conference",
    status: "Published",
    ministries: ["All Members"],
    date: "2026-06-14",
    endDate: "2026-06-16",
    time: "09:00",
    endTime: "18:00",
    venue: "Main Sanctuary, Grace Chapel",
    description: "Join us for three transformative days of worship, teaching, and fellowship with speakers from across the globe.",
    coverColor: "#C8860A",
    registered: 148,
    capacity: 200,
    checkedIn: 0,
    ticketed: true,
    tiers: [
      { name: "General", price: "Free", sold: 98, capacity: 150 },
      { name: "VIP", price: 50, sold: 50, capacity: 50 },
    ],
    pledgeGoal: 10000,
    pledgeReceived: 3200,
    notificationsSent: 312,
    isFeatured: true,
  },
  {
    id: "2",
    name: "Sunday Worship Service",
    type: "Sunday Service",
    status: "Published",
    ministries: ["All Members"],
    date: "2026-06-07",
    endDate: "2026-06-07",
    time: "09:00",
    endTime: "11:30",
    venue: "Main Sanctuary",
    description: "Weekly Sunday service with praise, worship, and the Word.",
    coverColor: "#2D1B69",
    registered: 320,
    capacity: 500,
    checkedIn: 0,
    recurring: "Every Sunday",
    ticketed: false,
    tiers: [],
    notificationsSent: 480,
  },
  {
    id: "3",
    name: "Youth Ministry Outreach",
    type: "Outreach",
    status: "Published",
    ministries: ["Youth"],
    date: "2026-06-20",
    endDate: "2026-06-20",
    time: "14:00",
    endTime: "18:00",
    venue: "Community Park, East Legon",
    description: "Community outreach event focused on youth engagement and gospel sharing.",
    coverColor: "#0A4A3A",
    registered: 45,
    capacity: 80,
    checkedIn: 0,
    ticketed: false,
    tiers: [],
    notificationsSent: 95,
  },
  {
    id: "4",
    name: "Choir Rehearsal",
    type: "Rehearsal",
    status: "Published",
    ministries: ["Choir"],
    date: "2026-06-05",
    endDate: "2026-06-05",
    time: "17:00",
    endTime: "20:00",
    venue: "Music Room B",
    description: "Weekly choir rehearsal in preparation for the harvest conference.",
    coverColor: "#7C3AED",
    registered: 28,
    capacity: 35,
    checkedIn: 0,
    recurring: "Every Thursday",
    ticketed: false,
    tiers: [],
    notificationsSent: 32,
  },
  {
    id: "5",
    name: "Fundraiser Gala Dinner",
    type: "Fundraiser",
    status: "Draft",
    ministries: ["All Members"],
    date: "2026-07-12",
    endDate: "2026-07-12",
    time: "18:00",
    endTime: "22:00",
    venue: "Kempinski Gold Coast Hotel",
    description: "An elegant evening of fine dining and giving to support our building fund.",
    coverColor: "#B45309",
    registered: 0,
    capacity: 150,
    checkedIn: 0,
    ticketed: true,
    tiers: [
      { name: "Table (10 Seats)", price: 500, sold: 0, capacity: 15 },
      { name: "Individual Seat", price: 60, sold: 0, capacity: 0 },
    ],
    pledgeGoal: 50000,
    pledgeReceived: 0,
    notificationsSent: 0,
  },
  {
    id: "6",
    name: "Easter Special Service",
    type: "Special",
    status: "Completed",
    ministries: ["All Members"],
    date: "2026-04-05",
    endDate: "2026-04-05",
    time: "07:00",
    endTime: "12:00",
    venue: "Main Sanctuary",
    description: "Easter celebration with sunrise service, drama, and special programs.",
    coverColor: "#DB2777",
    registered: 450,
    capacity: 500,
    checkedIn: 412,
    ticketed: false,
    tiers: [],
    notificationsSent: 520,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BRAND = "#C8860A";
const DARK_PILL = "#1A1A1A";
const BG = "#F5F4EF";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function statusColor(s: EventStatus) {
  if (s === "Published") return { bg: "rgba(10,74,58,0.1)", color: "#0A4A3A" };
  if (s === "Draft") return { bg: "rgba(200,134,10,0.1)", color: "#92610A" };
  if (s === "Cancelled") return { bg: "rgba(212,24,61,0.1)", color: "#B91C1C" };
  return { bg: "rgba(107,114,128,0.1)", color: "#6B7280" };
}

function typeColor(t: EventType) {
  const m: Record<EventType, string> = {
    "Sunday Service": "#2D1B69",
    "Conference": "#C8860A",
    "Outreach": "#0A4A3A",
    "Fundraiser": "#B45309",
    "Rehearsal": "#7C3AED",
    "Special": "#DB2777",
  };
  return m[t] ?? "#6B7280";
}

function availability(ev: Event) {
  const left = ev.capacity - ev.registered;
  if (left <= 0) return { label: "Sold Out", color: "#B91C1C", bg: "rgba(212,24,61,0.08)" };
  if (left <= 10) return { label: `${left} seats left`, color: "#92610A", bg: "rgba(200,134,10,0.08)" };
  return { label: "Open", color: "#0A4A3A", bg: "rgba(10,74,58,0.08)" };
}

function progressPct(n: number, d: number) {
  return d === 0 ? 0 : Math.min(100, Math.round((n / d) * 100));
}

// ─── Small reusable bits ──────────────────────────────────────────────────────

function Pill({ children, color, bg }: { children: React.ReactNode; color: string; bg: string }) {
  return (
    <span style={{ background: bg, color, fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99 }}>
      {children}
    </span>
  );
}

function DarkBtn({ children, onClick, small, icon }: { children: React.ReactNode; onClick?: () => void; small?: boolean; icon?: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{ background: DARK_PILL, color: "#fff", fontFamily: "var(--font-label)", fontSize: small ? 12 : 13, fontWeight: 600, padding: small ? "6px 14px" : "8px 18px", borderRadius: 99, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
    >
      {icon}{children}
    </button>
  );
}

function OutlineBtn({ children, onClick, small }: { children: React.ReactNode; onClick?: () => void; small?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{ background: "transparent", color: DARK_PILL, fontFamily: "var(--font-label)", fontSize: small ? 12 : 13, fontWeight: 600, padding: small ? "6px 14px" : "8px 18px", borderRadius: 99, border: `1.5px solid #D1D5DB`, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
    >
      {children}
    </button>
  );
}

function ProgressBar({ value, max, color = BRAND, height = 6 }: { value: number; max: number; color?: string; height?: number }) {
  const pct = progressPct(value, max);
  return (
    <div style={{ background: "#E5E7EB", borderRadius: 99, height, overflow: "hidden", width: "100%" }}>
      <div style={{ background: color, width: `${pct}%`, height: "100%", borderRadius: 99, transition: "width 0.4s" }} />
    </div>
  );
}

// ─── Filter Sidebar ───────────────────────────────────────────────────────────

const ALL_MINISTRIES: Ministry[] = ["All Members", "Choir", "Youth", "Prayer Team", "Children's", "Media"];
const ALL_TYPES: EventType[] = ["Sunday Service", "Conference", "Outreach", "Fundraiser", "Rehearsal", "Special"];
const ALL_STATUSES: EventStatus[] = ["Published", "Draft", "Cancelled", "Completed"];

// week histogram mock data
const WEEK_BARS = [2, 5, 3, 7, 4, 6, 8, 3, 2, 5, 7, 4];

interface Filters {
  ministries: Ministry[];
  types: EventType[];
  statuses: EventStatus[];
  ticketedOnly: boolean;
  fromDate: string;
  toDate: string;
}

function FilterSidebar({ filters, onChange }: { filters: Filters; onChange: (f: Filters) => void }) {
  function toggleMin(m: Ministry) {
    const next = filters.ministries.includes(m)
      ? filters.ministries.filter(x => x !== m)
      : [...filters.ministries, m];
    onChange({ ...filters, ministries: next });
  }
  function toggleType(t: EventType) {
    const next = filters.types.includes(t)
      ? filters.types.filter(x => x !== t)
      : [...filters.types, t];
    onChange({ ...filters, types: next });
  }
  function toggleStatus(s: EventStatus) {
    const next = filters.statuses.includes(s)
      ? filters.statuses.filter(x => x !== s)
      : [...filters.statuses, s];
    onChange({ ...filters, statuses: next });
  }
  function reset() {
    onChange({ ministries: [], types: [], statuses: [], ticketedOnly: false, fromDate: "", toDate: "" });
  }

  const maxBar = Math.max(...WEEK_BARS);

  return (
    <aside style={{ width: 240, minWidth: 240, background: "#fff", borderRadius: 16, border: "1px solid #EBEBEB", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 20, height: "fit-content", flexShrink: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-label)", fontWeight: 700, fontSize: 14, color: "#1A1A1A" }}>Filters</span>
        <button onClick={reset} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: BRAND, fontFamily: "var(--font-label)", fontWeight: 600 }}>Reset all</button>
      </div>

      {/* Ministry */}
      <div>
        <div style={{ fontFamily: "var(--font-label)", fontWeight: 600, fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Ministry</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ALL_MINISTRIES.map(m => (
            <label key={m} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <div
                onClick={() => toggleMin(m)}
                style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${filters.ministries.includes(m) ? BRAND : "#D1D5DB"}`, background: filters.ministries.includes(m) ? BRAND : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer" }}
              >
                {filters.ministries.includes(m) && <Check size={10} color="#fff" strokeWidth={3} />}
              </div>
              <span style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#374151" }}>{m}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Type */}
      <div>
        <div style={{ fontFamily: "var(--font-label)", fontWeight: 600, fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Event Type</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ALL_TYPES.map(t => (
            <label key={t} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <div
                onClick={() => toggleType(t)}
                style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${filters.types.includes(t) ? BRAND : "#D1D5DB"}`, background: filters.types.includes(t) ? BRAND : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer" }}
              >
                {filters.types.includes(t) && <Check size={10} color="#fff" strokeWidth={3} />}
              </div>
              <span style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#374151" }}>{t}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div>
        <div style={{ fontFamily: "var(--font-label)", fontWeight: 600, fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Date Range</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <input type="date" value={filters.fromDate} onChange={e => onChange({ ...filters, fromDate: e.target.value })}
            style={{ border: "1.5px solid #E5E7EB", borderRadius: 8, padding: "6px 10px", fontSize: 12, fontFamily: "var(--font-label)", color: "#374151", outline: "none", width: "100%" }} />
          <input type="date" value={filters.toDate} onChange={e => onChange({ ...filters, toDate: e.target.value })}
            style={{ border: "1.5px solid #E5E7EB", borderRadius: 8, padding: "6px 10px", fontSize: 12, fontFamily: "var(--font-label)", color: "#374151", outline: "none", width: "100%" }} />
        </div>
        {/* Mini histogram */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 2, marginTop: 12, height: 36 }}>
          {WEEK_BARS.map((v, i) => (
            <div key={i} style={{ flex: 1, background: `rgba(200,134,10,${0.25 + 0.65 * (v / maxBar)})`, borderRadius: 3, height: `${(v / maxBar) * 100}%` }} />
          ))}
        </div>
        <div style={{ fontFamily: "var(--font-label)", fontSize: 10, color: "#9CA3AF", marginTop: 4 }}>Events per week</div>
      </div>

      {/* Status */}
      <div>
        <div style={{ fontFamily: "var(--font-label)", fontWeight: 600, fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Status</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ALL_STATUSES.map(s => (
            <label key={s} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <div
                onClick={() => toggleStatus(s)}
                style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${filters.statuses.includes(s) ? BRAND : "#D1D5DB"}`, background: filters.statuses.includes(s) ? BRAND : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer" }}
              >
                {filters.statuses.includes(s) && <Check size={10} color="#fff" strokeWidth={3} />}
              </div>
              <span style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#374151" }}>{s}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Ticketed only */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#374151", fontWeight: 500 }}>Ticketed only</span>
        <button onClick={() => onChange({ ...filters, ticketedOnly: !filters.ticketedOnly })} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: filters.ticketedOnly ? BRAND : "#9CA3AF" }}>
          {filters.ticketedOnly ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
        </button>
      </div>

      {/* Apply */}
      <button style={{ background: DARK_PILL, color: "#fff", fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 600, padding: "10px 0", borderRadius: 99, border: "none", cursor: "pointer" }}>
        Apply Filters
      </button>
    </aside>
  );
}

// ─── Event Card (List Mode) ───────────────────────────────────────────────────

function EventCard({ ev, onViewDetails, onEdit }: { ev: Event; onViewDetails: (ev: Event) => void; onEdit: (ev: Event) => void }) {
  const avail = availability(ev);
  const tc = typeColor(ev.type);
  const sc = statusColor(ev.status);
  const pct = progressPct(ev.registered, ev.capacity);

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #EBEBEB", display: "flex", gap: 0, overflow: "hidden", transition: "box-shadow 0.2s" }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.07)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
    >
      {/* Left: Cover */}
      <div style={{ width: 140, minWidth: 140, background: ev.coverColor, position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: "16px 12px" }}>
        {/* Type badge */}
        <span style={{ background: "rgba(255,255,255,0.18)", color: "#fff", fontFamily: "var(--font-label)", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 99, textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {ev.type}
        </span>
        {/* Availability chip */}
        <span style={{ background: avail.bg, color: avail.color, fontFamily: "var(--font-label)", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 99 }}>
          {avail.label}
        </span>
        {ev.ticketed && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
            <Ticket size={12} color="rgba(255,255,255,0.7)" />
            <span style={{ fontFamily: "var(--font-label)", fontSize: 10, color: "rgba(255,255,255,0.8)" }}>Ticketed</span>
          </div>
        )}
      </div>

      {/* Center: Details */}
      <div style={{ flex: 1, padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
        {/* Name + Status */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-label)", fontSize: 16, fontWeight: 700, color: "#1A1A1A" }}>{ev.name}</span>
          <Pill color={sc.color} bg={sc.bg}>{ev.status}</Pill>
          {ev.recurring && (
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "var(--font-label)", fontSize: 11, color: "#6B7280" }}>
              <Repeat2 size={11} />{ev.recurring}
            </span>
          )}
        </div>

        {/* Date + Venue strip (like departure → arrival) */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Clock size={13} color={BRAND} />
            <span style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#374151", fontWeight: 500 }}>{ev.time}</span>
            <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#9CA3AF" }}>{formatDate(ev.date)}</span>
          </div>
          <ArrowRight size={13} color="#D1D5DB" />
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#374151", fontWeight: 500 }}>{ev.endTime}</span>
            {ev.endDate !== ev.date && <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#9CA3AF" }}>{formatDate(ev.endDate)}</span>}
          </div>
          <span style={{ margin: "0 4px", color: "#E5E7EB" }}>·</span>
          <MapPin size={12} color="#9CA3AF" />
          <span style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#6B7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>{ev.venue}</span>
        </div>

        {/* Ministries */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {ev.ministries.map(m => (
            <Pill key={m} color={tc} bg={`${tc}18`}><Tag size={9} style={{ display: "inline", marginRight: 3 }} />{m}</Pill>
          ))}
        </div>

        {/* Description */}
        <p style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#9CA3AF", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "90%" }}>
          {ev.description}
        </p>
      </div>

      {/* Right: Stats + Actions */}
      <div style={{ width: 180, minWidth: 180, padding: "16px 16px", display: "flex", flexDirection: "column", gap: 10, borderLeft: "1px solid #F3F4F6" }}>
        {/* Registered count */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#6B7280" }}>Registered</span>
            <span style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 700, color: "#1A1A1A" }}>{ev.registered}/{ev.capacity}</span>
          </div>
          <ProgressBar value={ev.registered} max={ev.capacity} />
          <div style={{ fontFamily: "var(--font-label)", fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>{pct}% full</div>
        </div>

        {/* Price */}
        {ev.ticketed && ev.tiers.length > 0 && (
          <div style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#374151" }}>
            {ev.tiers[0].price === "Free" ? (
              <span style={{ color: "#0A4A3A", fontWeight: 600 }}>Free</span>
            ) : (
              <span style={{ fontWeight: 700, color: "#1A1A1A" }}>GHS {ev.tiers[0].price}+</span>
            )}
          </div>
        )}
        {!ev.ticketed && <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#0A4A3A", fontWeight: 600 }}>Free entry</span>}

        {/* Action icons */}
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { icon: <Edit3 size={13} />, label: "Edit", action: () => onEdit(ev) },
            { icon: <Copy size={13} />, label: "Duplicate" },
            { icon: <Archive size={13} />, label: "Archive" },
            { icon: <Share2 size={13} />, label: "Share" },
          ].map(({ icon, label, action }) => (
            <button key={label} title={label} onClick={action}
              style={{ width: 28, height: 28, borderRadius: 8, border: "1.5px solid #E5E7EB", background: "#FAFAFA", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6B7280" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = BRAND; e.currentTarget.style.color = BRAND; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.color = "#6B7280"; }}
            >
              {icon}
            </button>
          ))}
        </div>

        {/* View Details */}
        <button onClick={() => onViewDetails(ev)}
          style={{ background: DARK_PILL, color: "#fff", fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, padding: "7px 0", borderRadius: 99, border: "none", cursor: "pointer", textAlign: "center" }}>
          View Details
        </button>
      </div>
    </div>
  );
}

// ─── Grid Card ────────────────────────────────────────────────────────────────

function EventGridCard({ ev, onViewDetails }: { ev: Event; onViewDetails: (ev: Event) => void }) {
  const sc = statusColor(ev.status);
  return (
    <div onClick={() => onViewDetails(ev)}
      style={{ background: "#fff", borderRadius: 16, border: "1px solid #EBEBEB", overflow: "hidden", cursor: "pointer", transition: "box-shadow 0.2s" }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.08)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
    >
      <div style={{ background: ev.coverColor, height: 80, display: "flex", alignItems: "flex-start", padding: 12 }}>
        <Pill color="#fff" bg="rgba(255,255,255,0.2)">{ev.type}</Pill>
      </div>
      <div style={{ padding: "14px 14px 16px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 6, marginBottom: 6 }}>
          <span style={{ fontFamily: "var(--font-label)", fontSize: 14, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3 }}>{ev.name}</span>
          <Pill color={sc.color} bg={sc.bg}>{ev.status}</Pill>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
          <Calendar size={11} color={BRAND} />
          <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#6B7280" }}>{formatDate(ev.date)} · {ev.time}</span>
        </div>
        <ProgressBar value={ev.registered} max={ev.capacity} height={5} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>{ev.registered}/{ev.capacity} registered</span>
          <span style={{ fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 600, color: BRAND }}>{progressPct(ev.registered, ev.capacity)}%</span>
        </div>
      </div>
    </div>
  );
}

// ─── Create / Edit Panel ──────────────────────────────────────────────────────

function CreateEventPanel({ event, onClose }: { event?: Event; onClose: () => void }) {
  const [ticketing, setTicketing] = useState(event?.ticketed ?? false);
  const [pledge, setPledge] = useState(!!event?.pledgeGoal);
  const [recurring, setRecurring] = useState(!!event?.recurring);
  const [capacity, setCapacity] = useState(!!event?.capacity);
  const [sendTo, setSendTo] = useState<"all" | "ministry">("all");
  const [notifChannels, setNotifChannels] = useState({ inApp: true, sms: false, whatsapp: false, email: true });
  const [scheduleNotif, setScheduleNotif] = useState(false);

  const isEditing = !!event;

  return (
    <FormDialog
      open
      onClose={onClose}
      icon={<Calendar size={20} color="#C8860A" />}
      title={isEditing ? "Edit Event" : "Create New Event"}
      description={isEditing ? "Update the details of this event." : "Plan a new event and publish it to your members."}
      maxWidth="max-w-4xl"
      footer={(
        <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
          <OutlineBtn>Save as Draft</OutlineBtn>
          <OutlineBtn><Eye size={14} />Preview</OutlineBtn>
          <div style={{ marginLeft: "auto" }}>
            <DarkBtn icon={<Check size={14} />}>Publish Event</DarkBtn>
          </div>
        </div>
      )}
    >
      <div style={{ padding: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

            {/* ── Left Column ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <SectionCard title="Event Details">
                <FormField label="Event Name"><input defaultValue={event?.name} placeholder="e.g. Annual Harvest Conference" style={inputStyle} /></FormField>
                <FormField label="Event Type">
                  <select defaultValue={event?.type} style={inputStyle}>
                    {ALL_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </FormField>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <FormField label="Start Date"><input type="date" defaultValue={event?.date} style={inputStyle} /></FormField>
                  <FormField label="Start Time"><input type="time" defaultValue={event?.time} style={inputStyle} /></FormField>
                  <FormField label="End Date"><input type="date" defaultValue={event?.endDate} style={inputStyle} /></FormField>
                  <FormField label="End Time"><input type="time" defaultValue={event?.endTime} style={inputStyle} /></FormField>
                </div>
                <FormField label="Venue"><input defaultValue={event?.venue} placeholder="e.g. Main Sanctuary, Grace Chapel" style={inputStyle} /></FormField>
                <FormField label="Description">
                  <textarea defaultValue={event?.description} rows={3} placeholder="Describe this event..." style={{ ...inputStyle, resize: "vertical" }} />
                </FormField>

                {/* Cover Image upload */}
                <FormField label="Cover Image / Banner">
                  <div style={{ border: "2px dashed #D1D5DB", borderRadius: 10, padding: "20px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer", background: "#FAFAFA" }}>
                    <Upload size={20} color="#9CA3AF" />
                    <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#6B7280" }}>Drag & drop or <span style={{ color: BRAND, fontWeight: 600 }}>browse</span></span>
                    <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>PNG, JPG up to 5MB</span>
                  </div>
                </FormField>

                {/* Capacity toggle */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#374151", fontWeight: 500 }}>Set capacity limit</span>
                  <button onClick={() => setCapacity(!capacity)} style={{ background: "none", border: "none", cursor: "pointer", color: capacity ? BRAND : "#9CA3AF" }}>
                    {capacity ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                  </button>
                </div>
                {capacity && (
                  <FormField label="Max Capacity">
                    <input type="number" defaultValue={event?.capacity ?? 200} style={inputStyle} />
                  </FormField>
                )}

                {/* Recurring */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#374151", fontWeight: 500 }}>Recurring event</span>
                  <button onClick={() => setRecurring(!recurring)} style={{ background: "none", border: "none", cursor: "pointer", color: recurring ? BRAND : "#9CA3AF" }}>
                    {recurring ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                  </button>
                </div>
                {recurring && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <FormField label="Frequency">
                      <select style={inputStyle}>
                        <option>Daily</option><option>Weekly</option><option>Monthly</option>
                      </select>
                    </FormField>
                    <FormField label="Ends On"><input type="date" style={inputStyle} /></FormField>
                  </div>
                )}
              </SectionCard>
            </div>

            {/* ── Right Column ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Push to Members */}
              <SectionCard title="Push to Members">
                <FormField label="Send to">
                  <div style={{ display: "flex", gap: 0, borderRadius: 8, overflow: "hidden", border: "1.5px solid #E5E7EB" }}>
                    {(["all", "ministry"] as const).map(opt => (
                      <button key={opt} onClick={() => setSendTo(opt)}
                        style={{ flex: 1, padding: "7px 0", border: "none", background: sendTo === opt ? DARK_PILL : "#fff", color: sendTo === opt ? "#fff" : "#374151", fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        {opt === "all" ? "All Members" : "Specific Ministry"}
                      </button>
                    ))}
                  </div>
                </FormField>
                {sendTo === "ministry" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {ALL_MINISTRIES.filter(m => m !== "All Members").map(m => (
                      <label key={m} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                        <div style={{ width: 15, height: 15, borderRadius: 4, border: `1.5px solid #D1D5DB`, background: "#fff", flexShrink: 0 }} />
                        <span style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#374151" }}>{m}</span>
                      </label>
                    ))}
                  </div>
                )}
                <FormField label="Notification Channels">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    {(["In-App", "SMS", "WhatsApp", "Email"] as const).map((ch) => {
                      const key = ch.toLowerCase().replace("-", "") as keyof typeof notifChannels;
                      const active = notifChannels[key];
                      return (
                        <label key={ch} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                          <div onClick={() => setNotifChannels({ ...notifChannels, [key]: !active })}
                            style={{ width: 15, height: 15, borderRadius: 4, border: `1.5px solid ${active ? BRAND : "#D1D5DB"}`, background: active ? BRAND : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {active && <Check size={9} color="#fff" strokeWidth={3} />}
                          </div>
                          <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#374151" }}>{ch}</span>
                        </label>
                      );
                    })}
                  </div>
                </FormField>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#374151" }}>Schedule notification</span>
                  <button onClick={() => setScheduleNotif(!scheduleNotif)} style={{ background: "none", border: "none", cursor: "pointer", color: scheduleNotif ? BRAND : "#9CA3AF" }}>
                    {scheduleNotif ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                  </button>
                </div>
                {scheduleNotif && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <FormField label="Date"><input type="date" style={inputStyle} /></FormField>
                    <FormField label="Time"><input type="time" style={inputStyle} /></FormField>
                  </div>
                )}
              </SectionCard>

              {/* Ticketing */}
              <SectionCard title="Ticketing">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#374151" }}>Enable Ticketing</span>
                  <button onClick={() => setTicketing(!ticketing)} style={{ background: "none", border: "none", cursor: "pointer", color: ticketing ? BRAND : "#9CA3AF" }}>
                    {ticketing ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                  </button>
                </div>
                {ticketing && (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {["General", "VIP"].map(tier => (
                        <div key={tier} style={{ display: "flex", gap: 8 }}>
                          <input placeholder={tier} defaultValue={tier} style={{ ...inputStyle, flex: 1 }} />
                          <input placeholder="Price (GHS or Free)" defaultValue={tier === "General" ? "Free" : "50"} style={{ ...inputStyle, width: 120 }} />
                        </div>
                      ))}
                      <button style={{ fontFamily: "var(--font-label)", fontSize: 12, color: BRAND, fontWeight: 600, background: "none", border: `1.5px dashed ${BRAND}`, borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}>
                        + Add Tier
                      </button>
                    </div>
                    <div style={{ background: "rgba(200,134,10,0.06)", borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <QrCode size={14} color={BRAND} />
                        <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#92610A" }}>QR tickets auto-generated on registration</span>
                      </div>
                    </div>
                    <button style={{ background: DARK_PILL, color: "#fff", fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, padding: "8px 16px", borderRadius: 99, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, width: "100%" }}>
                      <Send size={13} />Deploy Ticket Notification
                    </button>
                  </>
                )}
              </SectionCard>

              {/* Pledge & Fundraising */}
              <SectionCard title="Pledge & Fundraising">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#374151" }}>Enable Pledge / Fundraising</span>
                  <button onClick={() => setPledge(!pledge)} style={{ background: "none", border: "none", cursor: "pointer", color: pledge ? BRAND : "#9CA3AF" }}>
                    {pledge ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                  </button>
                </div>
                {pledge && (
                  <>
                    <div style={{ display: "flex", gap: 8 }}>
                      <select style={{ ...inputStyle, width: 90 }}><option>GHS</option><option>USD</option><option>GBP</option></select>
                      <input type="number" placeholder="Goal amount" defaultValue={event?.pledgeGoal ?? ""} style={{ ...inputStyle, flex: 1 }} />
                    </div>
                    <FormField label="Pledge Description">
                      <input placeholder='e.g. "Support our annual conference"' style={inputStyle} />
                    </FormField>
                    {/* Progress preview */}
                    {event?.pledgeGoal && (
                      <div style={{ background: "#F9FAFB", borderRadius: 10, padding: "10px 12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#6B7280" }}>Progress</span>
                          <span style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 700, color: "#1A1A1A" }}>GHS {(event.pledgeReceived ?? 0).toLocaleString()} / GHS {event.pledgeGoal.toLocaleString()}</span>
                        </div>
                        <ProgressBar value={event.pledgeReceived ?? 0} max={event.pledgeGoal} />
                      </div>
                    )}
                    <button style={{ background: DARK_PILL, color: "#fff", fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, padding: "8px 16px", borderRadius: 99, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, width: "100%" }}>
                      <Send size={13} />Deploy Pledge Notification
                    </button>
                  </>
                )}
              </SectionCard>
            </div>
          </div>
        </div>
    </FormDialog>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EBEBEB", padding: "18px 18px" }}>
      <div style={{ fontFamily: "var(--font-label)", fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 16 }}>{title}</div>
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

const inputStyle: React.CSSProperties = {
  border: "1.5px solid #E5E7EB",
  borderRadius: 8,
  padding: "8px 10px",
  fontSize: 13,
  fontFamily: "var(--font-label)",
  color: "#1A1A1A",
  outline: "none",
  width: "100%",
  background: "#FAFAFA",
  boxSizing: "border-box" as const,
};

// ─── Event Detail Page ────────────────────────────────────────────────────────

type DetailTab = "registrations" | "tickets" | "pledges" | "notifications";

const MOCK_REGISTRATIONS = [
  { name: "Abena Osei", ministry: "Youth", date: "2026-05-12", tier: "General", checkedIn: false },
  { name: "Kwame Asante", ministry: "Choir", date: "2026-05-14", tier: "VIP", checkedIn: true },
  { name: "Ama Boateng", ministry: "All Members", date: "2026-05-15", tier: "General", checkedIn: false },
  { name: "Kofi Mensah", ministry: "Prayer Team", date: "2026-05-18", tier: "General", checkedIn: true },
  { name: "Akosua Darko", ministry: "Children's", date: "2026-05-20", tier: "General", checkedIn: false },
];

const MOCK_NOTIFS = [
  { channel: "In-App", time: "2026-05-10 09:00", delivered: 312 },
  { channel: "WhatsApp", time: "2026-05-10 09:05", delivered: 280 },
  { channel: "Email", time: "2026-05-10 09:10", delivered: 295 },
  { channel: "SMS", time: "2026-05-15 14:00", delivered: 310 },
];

function EventDetailView({ ev, onBack, onEdit }: { ev: Event; onBack: () => void; onEdit: (ev: Event) => void }) {
  const [tab, setTab] = useState<DetailTab>("registrations");
  const sc = statusColor(ev.status);
  const tc = typeColor(ev.type);

  const stats = [
    { label: "Registered", value: ev.registered, icon: <Users size={16} /> },
    { label: "Checked In", value: ev.checkedIn, icon: <CheckCircle2 size={16} /> },
    { label: "Tickets Sold", value: ev.tiers.reduce((a, t) => a + t.sold, 0), icon: <Ticket size={16} /> },
    { label: "Pledges Received", value: ev.pledgeReceived ? `GHS ${ev.pledgeReceived.toLocaleString()}` : "—", icon: <TrendingUp size={16} /> },
  ];

  const tabs: { key: DetailTab; label: string }[] = [
    { key: "registrations", label: "Registrations" },
    { key: "tickets", label: "Tickets" },
    { key: "pledges", label: "Pledges" },
    { key: "notifications", label: "Notifications Sent" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Banner */}
      <div style={{ background: ev.coverColor, padding: "28px 32px 24px", flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 99, padding: "6px 14px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-label)", fontSize: 13, marginBottom: 16 }}>
          <ChevronLeft size={14} />Back to Events
        </button>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <Pill color="#fff" bg="rgba(255,255,255,0.2)">{ev.type}</Pill>
              <Pill color={sc.color} bg="rgba(255,255,255,0.9)">{ev.status}</Pill>
            </div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 26, fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>{ev.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,0.85)" }}>
                <Clock size={14} /><span style={{ fontFamily: "var(--font-label)", fontSize: 13 }}>{ev.time} — {ev.endTime} · {formatDate(ev.date)}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,0.85)" }}>
                <MapPin size={14} /><span style={{ fontFamily: "var(--font-label)", fontSize: 13 }}>{ev.venue}</span>
              </div>
              {ev.recurring && (
                <div style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,0.85)" }}>
                  <Repeat2 size={14} /><span style={{ fontFamily: "var(--font-label)", fontSize: 13 }}>{ev.recurring}</span>
                </div>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => onEdit(ev)} style={{ background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 99, padding: "7px 16px", color: "#fff", cursor: "pointer", fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              <Edit3 size={13} />Edit
            </button>
            <button style={{ background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 99, padding: "7px 16px", color: "#fff", cursor: "pointer", fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              <Share2 size={13} />Share
            </button>
            <button style={{ background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 99, padding: "7px 16px", color: "#fff", cursor: "pointer", fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              <Archive size={13} />Archive
            </button>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{ background: "#fff", borderBottom: "1px solid #EBEBEB", display: "flex", flexShrink: 0 }}>
        {stats.map((s, i) => (
          <div key={s.label} style={{ flex: 1, padding: "14px 20px", borderRight: i < stats.length - 1 ? "1px solid #F3F4F6" : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
              <span style={{ color: BRAND }}>{s.icon}</span>
              <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</span>
            </div>
            <div style={{ fontFamily: "var(--font-label)", fontSize: 22, fontWeight: 800, color: "#1A1A1A" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", background: BG }}>
        {/* Center: Tabs + Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Tabs */}
          <div style={{ background: "#fff", borderBottom: "1px solid #EBEBEB", padding: "0 24px", display: "flex", gap: 0, flexShrink: 0 }}>
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                style={{ padding: "12px 20px", border: "none", background: "none", cursor: "pointer", fontFamily: "var(--font-label)", fontSize: 13, fontWeight: tab === t.key ? 700 : 500, color: tab === t.key ? BRAND : "#6B7280", borderBottom: tab === t.key ? `2.5px solid ${BRAND}` : "2.5px solid transparent" }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
            {tab === "registrations" && (
              <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EBEBEB", overflow: "hidden" }}>
                <div style={{ padding: "14px 18px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "var(--font-label)", fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>Registrations ({MOCK_REGISTRATIONS.length})</span>
                  <OutlineBtn small><Download size={13} />Export CSV</OutlineBtn>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#F9FAFB" }}>
                      {["Member", "Ministry", "Registered", "Ticket Tier", "Check-in"].map(h => (
                        <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_REGISTRATIONS.map((r, i) => (
                      <tr key={i} style={{ borderTop: "1px solid #F3F4F6" }}>
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 99, background: `${ev.coverColor}30`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 700, color: ev.coverColor }}>{r.name.split(" ").map(n => n[0]).join("")}</div>
                            <span style={{ fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{r.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: "12px 16px" }}><Pill color={tc} bg={`${tc}18`}>{r.ministry}</Pill></td>
                        <td style={{ padding: "12px 16px", fontFamily: "var(--font-label)", fontSize: 13, color: "#6B7280" }}>{formatDate(r.date)}</td>
                        <td style={{ padding: "12px 16px" }}><Pill color="#374151" bg="#F3F4F6">{r.tier}</Pill></td>
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            {r.checkedIn ? <CheckCircle2 size={16} color="#0A4A3A" /> : <XCircle size={16} color="#9CA3AF" />}
                            <QrCode size={13} color="#9CA3AF" style={{ cursor: "pointer" }} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "tickets" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {ev.tiers.map(tier => (
                  <div key={tier.name} style={{ background: "#fff", borderRadius: 14, border: "1px solid #EBEBEB", padding: "18px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontFamily: "var(--font-label)", fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>{tier.name}</div>
                        <div style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#6B7280" }}>{tier.price === "Free" ? "Free" : `GHS ${tier.price}`}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontFamily: "var(--font-label)", fontSize: 20, fontWeight: 800, color: "#1A1A1A" }}>{tier.sold}</div>
                        <div style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#9CA3AF" }}>of {tier.capacity} sold</div>
                      </div>
                    </div>
                    <ProgressBar value={tier.sold} max={tier.capacity} />
                    {tier.price !== "Free" && (
                      <div style={{ marginTop: 10, fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 700, color: BRAND }}>
                        Revenue: GHS {(tier.sold * (tier.price as number)).toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
                {ev.tiers.length === 0 && (
                  <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EBEBEB", padding: "32px", textAlign: "center" }}>
                    <Ticket size={32} color="#D1D5DB" style={{ margin: "0 auto 12px" }} />
                    <div style={{ fontFamily: "var(--font-label)", fontSize: 14, color: "#9CA3AF" }}>No ticketing enabled for this event</div>
                  </div>
                )}
              </div>
            )}

            {tab === "pledges" && (
              <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EBEBEB", overflow: "hidden" }}>
                <div style={{ padding: "14px 18px", borderBottom: "1px solid #F3F4F6" }}>
                  <span style={{ fontFamily: "var(--font-label)", fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>Pledges</span>
                </div>
                {ev.pledgeGoal ? (
                  <div style={{ padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#6B7280" }}>Total Goal</span>
                      <span style={{ fontFamily: "var(--font-label)", fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>GHS {ev.pledgeGoal.toLocaleString()}</span>
                    </div>
                    <ProgressBar value={ev.pledgeReceived ?? 0} max={ev.pledgeGoal} height={10} />
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                      <span style={{ fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 700, color: BRAND }}>GHS {(ev.pledgeReceived ?? 0).toLocaleString()} raised</span>
                      <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#9CA3AF" }}>{progressPct(ev.pledgeReceived ?? 0, ev.pledgeGoal)}%</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: "32px", textAlign: "center" }}>
                    <TrendingUp size={32} color="#D1D5DB" style={{ margin: "0 auto 12px" }} />
                    <div style={{ fontFamily: "var(--font-label)", fontSize: 14, color: "#9CA3AF" }}>No fundraising enabled for this event</div>
                  </div>
                )}
              </div>
            )}

            {tab === "notifications" && (
              <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EBEBEB", overflow: "hidden" }}>
                <div style={{ padding: "14px 18px", borderBottom: "1px solid #F3F4F6" }}>
                  <span style={{ fontFamily: "var(--font-label)", fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>Notifications Log</span>
                </div>
                {MOCK_NOTIFS.map((n, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderTop: i > 0 ? "1px solid #F3F4F6" : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(200,134,10,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Bell size={14} color={BRAND} />
                      </div>
                      <div>
                        <div style={{ fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{n.channel}</div>
                        <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>{n.time}</div>
                      </div>
                    </div>
                    <Pill color="#0A4A3A" bg="rgba(10,74,58,0.08)">{n.delivered} delivered</Pill>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ width: 240, flexShrink: 0, padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16, borderLeft: "1px solid #EBEBEB", background: "#fff", overflowY: "auto" }}>
          {ev.pledgeGoal && (
            <div style={{ background: "#F9FAFB", borderRadius: 12, padding: "14px 14px" }}>
              <div style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 10 }}>Fundraising</div>
              <ProgressBar value={ev.pledgeReceived ?? 0} max={ev.pledgeGoal} height={10} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                <span style={{ fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 700, color: BRAND }}>GHS {(ev.pledgeReceived ?? 0).toLocaleString()}</span>
                <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>/ GHS {ev.pledgeGoal.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Capacity gauge */}
          <div style={{ background: "#F9FAFB", borderRadius: 12, padding: "14px 14px" }}>
            <div style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 10 }}>Capacity</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#6B7280" }}>Registered</span>
              <span style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 700, color: "#1A1A1A" }}>{ev.registered}/{ev.capacity}</span>
            </div>
            <ProgressBar value={ev.registered} max={ev.capacity} height={8} />
          </div>

          {/* Quick actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 2 }}>Quick Actions</div>
            {[
              { label: "Send Reminder", icon: <Bell size={13} /> },
              { label: "Export List", icon: <Download size={13} /> },
              { label: "Close Registration", icon: <XCircle size={13} /> },
              { label: "Check-in Mode", icon: <QrCode size={13} /> },
              { label: "Duplicate Event", icon: <Copy size={13} /> },
            ].map(({ label, icon }) => (
              <button key={label} style={{ display: "flex", alignItems: "center", gap: 8, background: "#FAFAFA", border: "1.5px solid #E5E7EB", borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: "#374151", width: "100%" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = BRAND; e.currentTarget.style.color = BRAND; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.color = "#374151"; }}
              >
                <span style={{ color: "inherit" }}>{icon}</span>{label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Events Page ─────────────────────────────────────────────────────────

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All Events" },
  { key: "upcoming", label: "Upcoming" },
  { key: "ongoing", label: "Ongoing" },
  { key: "past", label: "Past" },
  { key: "drafts", label: "Drafts" },
];

export function EventsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>(undefined);
  const [detailEvent, setDetailEvent] = useState<Event | null>(null);
  const [filters, setFilters] = useState<Filters>({ ministries: [], types: [], statuses: [], ticketedOnly: false, fromDate: "", toDate: "" });
  const [showFilters, setShowFilters] = useState(true);

  const today = new Date().toISOString().slice(0, 10);

  function filtered(events: Event[]) {
    return events.filter(ev => {
      if (search && !ev.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (filters.ministries.length && !ev.ministries.some(m => filters.ministries.includes(m))) return false;
      if (filters.types.length && !filters.types.includes(ev.type)) return false;
      if (filters.statuses.length && !filters.statuses.includes(ev.status)) return false;
      if (filters.ticketedOnly && !ev.ticketed) return false;
      if (filters.fromDate && ev.date < filters.fromDate) return false;
      if (filters.toDate && ev.date > filters.toDate) return false;
      if (activeTab === "upcoming" && ev.date <= today) return false;
      if (activeTab === "past" && (ev.date >= today || ev.status !== "Completed")) return false;
      if (activeTab === "drafts" && ev.status !== "Draft") return false;
      if (activeTab === "ongoing" && (ev.date > today || ev.status === "Completed" || ev.status === "Draft")) return false;
      return true;
    });
  }

  const visibleEvents = filtered(EVENTS);

  // Detail view
  if (detailEvent) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: BG }}>
        <EventDetailView
          ev={detailEvent}
          onBack={() => setDetailEvent(null)}
          onEdit={(ev) => { setEditingEvent(ev); setShowCreate(true); }}
        />
        {showCreate && (
          <CreateEventPanel
            event={editingEvent}
            onClose={() => { setShowCreate(false); setEditingEvent(undefined); }}
          />
        )}
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: BG }}>
      {/* ── Top Bar ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #EBEBEB", padding: "0 24px", flexShrink: 0 }}>
        {/* Title row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 20, paddingBottom: 12 }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 26, fontWeight: 700, color: "#1A1A1A", margin: 0 }}>Events</h1>
          <DarkBtn onClick={() => { setEditingEvent(undefined); setShowCreate(true); }} icon={<Plus size={15} />}>
            Create Event
          </DarkBtn>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0 }}>
          {TABS.map(t => {
            const count = t.key === "all" ? EVENTS.length : filtered(EVENTS.map(ev => ev)).filter(() => {
              // approximate tab counts without rerunning full filter
              return true;
            }).length;
            return (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                style={{ padding: "10px 20px", border: "none", background: "none", cursor: "pointer", fontFamily: "var(--font-label)", fontSize: 13, fontWeight: activeTab === t.key ? 700 : 500, color: activeTab === t.key ? BRAND : "#6B7280", borderBottom: activeTab === t.key ? `2.5px solid ${BRAND}` : "2.5px solid transparent" }}>
                {t.label}
                <span style={{ marginLeft: 6, background: activeTab === t.key ? `rgba(200,134,10,0.12)` : "#F3F4F6", color: activeTab === t.key ? BRAND : "#9CA3AF", fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 600, padding: "1px 7px", borderRadius: 99 }}>
                  {t.key === "all" ? EVENTS.length : t.key === "upcoming" ? 3 : t.key === "ongoing" ? 1 : t.key === "past" ? 1 : 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Search + View Toggle ── */}
      <div style={{ padding: "14px 24px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 380 }}>
          <Search size={15} color="#9CA3AF" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search events..."
            style={{ ...inputStyle, paddingLeft: 36, borderRadius: 99, background: "#fff" }}
          />
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          style={{ display: "flex", alignItems: "center", gap: 6, background: showFilters ? `rgba(200,134,10,0.08)` : "#fff", border: `1.5px solid ${showFilters ? BRAND : "#E5E7EB"}`, borderRadius: 99, padding: "7px 14px", cursor: "pointer", fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 600, color: showFilters ? BRAND : "#374151" }}>
          <Filter size={13} />Filters
        </button>

        <div style={{ display: "flex", gap: 0, background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 10, overflow: "hidden", marginLeft: "auto" }}>
          {([
            { mode: "list" as ViewMode, icon: <List size={15} /> },
            { mode: "grid" as ViewMode, icon: <Grid3X3 size={15} /> },
            { mode: "calendar" as ViewMode, icon: <Calendar size={15} /> },
          ]).map(({ mode, icon }) => (
            <button key={mode} onClick={() => setViewMode(mode)}
              style={{ padding: "7px 14px", border: "none", background: viewMode === mode ? DARK_PILL : "transparent", color: viewMode === mode ? "#fff" : "#6B7280", cursor: "pointer", display: "flex", alignItems: "center" }}>
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content: Sidebar + Events ── */}
      <div style={{ flex: 1, display: "flex", gap: 16, padding: "0 24px 24px", overflow: "hidden" }}>
        {showFilters && (
          <div style={{ overflowY: "auto" }}>
            <FilterSidebar filters={filters} onChange={setFilters} />
          </div>
        )}

        {/* Events list / grid */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 0 }}>
          {visibleEvents.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, paddingTop: 60 }}>
              <Calendar size={40} color="#D1D5DB" />
              <div style={{ fontFamily: "var(--font-label)", fontSize: 15, fontWeight: 600, color: "#6B7280", marginTop: 14 }}>No events found</div>
              <div style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#9CA3AF", marginTop: 4 }}>Try adjusting your filters or create a new event.</div>
            </div>
          ) : viewMode === "list" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {visibleEvents.map(ev => (
                <EventCard key={ev.id} ev={ev} onViewDetails={setDetailEvent} onEdit={(ev) => { setEditingEvent(ev); setShowCreate(true); }} />
              ))}
            </div>
          ) : viewMode === "grid" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
              {visibleEvents.map(ev => (
                <EventGridCard key={ev.id} ev={ev} onViewDetails={setDetailEvent} />
              ))}
            </div>
          ) : (
            /* Calendar placeholder */
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #EBEBEB", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button style={{ background: "#F3F4F6", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer" }}><ChevronLeft size={14} /></button>
                  <span style={{ fontFamily: "var(--font-label)", fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>June 2026</span>
                  <button style={{ background: "#F3F4F6", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer" }}><ChevronRight size={14} /></button>
                </div>
              </div>
              <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridTemplateRows: "auto repeat(5, 1fr)", gap: 0 }}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                  <div key={d} style={{ padding: "10px 0", textAlign: "center", fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 600, color: "#9CA3AF", borderBottom: "1px solid #F3F4F6", textTransform: "uppercase" }}>{d}</div>
                ))}
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 6; // June starts on Monday (index 1)
                  const isValid = day >= 1 && day <= 30;
                  const dateStr = `2026-06-${String(day).padStart(2, "0")}`;
                  const dayEvents = isValid ? EVENTS.filter(ev => ev.date === dateStr) : [];
                  const isToday = dateStr === today;
                  return (
                    <div key={i} style={{ padding: "6px 8px", borderBottom: "1px solid #F9FAFB", borderRight: (i + 1) % 7 === 0 ? "none" : "1px solid #F9FAFB", minHeight: 80, background: isToday ? "rgba(200,134,10,0.03)" : "transparent" }}>
                      {isValid && (
                        <>
                          <div style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: isToday ? 700 : 400, color: isToday ? BRAND : "#374151", width: 22, height: 22, borderRadius: 99, background: isToday ? `rgba(200,134,10,0.12)` : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>{day}</div>
                          {dayEvents.slice(0, 2).map(ev => (
                            <div key={ev.id} onClick={() => setDetailEvent(ev)} style={{ background: ev.coverColor, color: "#fff", borderRadius: 4, padding: "2px 6px", fontSize: 10, fontFamily: "var(--font-label)", fontWeight: 600, marginTop: 3, cursor: "pointer", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {ev.name}
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create / Edit Panel */}
      {showCreate && (
        <CreateEventPanel
          event={editingEvent}
          onClose={() => { setShowCreate(false); setEditingEvent(undefined); }}
        />
      )}
    </div>
  );
}
