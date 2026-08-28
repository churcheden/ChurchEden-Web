import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie,
} from "recharts";
import {
  Download, Send, Check, X, Clock, Flame, ChevronRight,
  MessageSquare, Phone, FileText, Filter, Search,
  ArrowUpRight, ArrowDownRight, AlertTriangle, Star,
  Users, CalendarDays, BarChart3, ClipboardList,
} from "lucide-react";

// ─── Tokens ───────────────────────────────────────────────────────────────────

const BRAND = "#C8860A";
const DARK = "#1A1A1A";
const BG = "#F5F4EF";
const SUCCESS = "#0A4A3A";
const DANGER = "#B91C1C";

// ─── Mock data ────────────────────────────────────────────────────────────────

// Bar chart — last 8 services
const SERVICE_BARS = [
  { label: "May 11", present: 198, capacity: 340 },
  { label: "May 18", present: 221, capacity: 340 },
  { label: "May 25", present: 209, capacity: 340 },
  { label: "Jun 1", present: 214, capacity: 340 },
  { label: "Jun 4\nBible", present: 88, capacity: 120 },
  { label: "Jun 7", present: 231, capacity: 340 },
  { label: "Jun 11\nYouth", present: 74, capacity: 100 },
  { label: "Jun 14\nConf.", present: 148, capacity: 200 },
];

// Heatmap — 12 weeks × 7 days
const HEATMAP_WEEKS = Array.from({ length: 12 }, (_, wi) =>
  Array.from({ length: 7 }, (_, di) => {
    const rate = Math.random();
    // Sundays are always high
    const isService = di === 0 || (di === 3 && Math.random() > 0.4);
    return isService ? Math.max(0.3, rate) : 0;
  })
);

const MINISTRY_ROWS = [
  { name: "All Members", rate: 68, count: 214, trend: "up" },
  { name: "Youth Ministry", rate: 81, count: 74, trend: "up" },
  { name: "Choir", rate: 94, count: 32, trend: "up" },
  { name: "Children's", rate: 72, count: 48, trend: "down" },
  { name: "Prayer Team", rate: 88, count: 22, trend: "up" },
  { name: "Media", rate: 75, count: 12, trend: "down" },
];

type AttStatus = "present" | "absent" | "late" | "guest";

interface MemberRecord {
  id: string;
  name: string;
  ministry: string;
  initials: string;
  color: string;
  isFirstTimer?: boolean;
  isAtRisk?: boolean;
  streak: number;
  rate: number;
  services: AttStatus[]; // last 5 (Jun 14, Jun 7, Jun 1, May 25, May 18)
  lastSeen: string;
  lastTime: string;
  timeline: { service: string; date: string; status: AttStatus; time?: string }[];
}

const MEMBERS: MemberRecord[] = [
  {
    id: "MBR-0041", name: "Dr. Kwame Asante", ministry: "All Members", initials: "KA", color: "#2D1B69",
    streak: 7, rate: 92, services: ["present", "present", "present", "present", "present"],
    lastSeen: "Jun 7, 2026", lastTime: "9:04 AM",
    timeline: [
      { service: "Sunday Service", date: "Jun 7, 2026", status: "present", time: "9:04 AM" },
      { service: "Harvest Conference", date: "Jun 14, 2026", status: "present", time: "9:00 AM" },
      { service: "Sunday Service", date: "Jun 1, 2026", status: "present", time: "8:58 AM" },
      { service: "Sunday Service", date: "May 25, 2026", status: "late", time: "9:32 AM" },
      { service: "Sunday Service", date: "May 18, 2026", status: "present", time: "8:47 AM" },
    ],
  },
  {
    id: "MBR-0018", name: "Sis. Grace Mensah", ministry: "Choir", initials: "GM", color: BRAND,
    streak: 12, rate: 98, services: ["present", "present", "present", "present", "present"],
    lastSeen: "Jun 14, 2026", lastTime: "8:52 AM",
    timeline: [
      { service: "Harvest Conference", date: "Jun 14, 2026", status: "present", time: "8:52 AM" },
      { service: "Sunday Service", date: "Jun 7, 2026", status: "present", time: "8:40 AM" },
      { service: "Sunday Service", date: "Jun 1, 2026", status: "present", time: "8:51 AM" },
      { service: "Sunday Service", date: "May 25, 2026", status: "present", time: "8:44 AM" },
      { service: "Sunday Service", date: "May 18, 2026", status: "present", time: "8:39 AM" },
    ],
  },
  {
    id: "MBR-0072", name: "Bro. Yaw Amponsah", ministry: "Youth", initials: "YA", color: "#0A4A3A",
    streak: 0, rate: 38, isAtRisk: true, services: ["absent", "absent", "absent", "present", "present"],
    lastSeen: "May 25, 2026", lastTime: "9:12 AM",
    timeline: [
      { service: "Harvest Conference", date: "Jun 14, 2026", status: "absent" },
      { service: "Sunday Service", date: "Jun 7, 2026", status: "absent" },
      { service: "Sunday Service", date: "Jun 1, 2026", status: "absent" },
      { service: "Sunday Service", date: "May 25, 2026", status: "present", time: "9:12 AM" },
      { service: "Sunday Service", date: "May 18, 2026", status: "present", time: "9:05 AM" },
    ],
  },
  {
    id: "MBR-0033", name: "Elder Abena Osei", ministry: "Prayer Team", initials: "AO", color: "#7C3AED",
    streak: 5, rate: 85, services: ["present", "present", "present", "late", "present"],
    lastSeen: "Jun 14, 2026", lastTime: "9:01 AM",
    timeline: [
      { service: "Harvest Conference", date: "Jun 14, 2026", status: "present", time: "9:01 AM" },
      { service: "Sunday Service", date: "Jun 7, 2026", status: "present", time: "9:00 AM" },
      { service: "Sunday Service", date: "Jun 1, 2026", status: "present", time: "9:14 AM" },
      { service: "Sunday Service", date: "May 25, 2026", status: "late", time: "9:45 AM" },
      { service: "Sunday Service", date: "May 18, 2026", status: "present", time: "8:55 AM" },
    ],
  },
  {
    id: "MBR-0055", name: "Sis. Ama Boateng", ministry: "Children's", initials: "AB", color: "#B45309",
    streak: 2, rate: 74, services: ["present", "present", "late", "absent", "present"],
    lastSeen: "Jun 7, 2026", lastTime: "9:22 AM",
    timeline: [
      { service: "Sunday Service", date: "Jun 7, 2026", status: "present", time: "9:22 AM" },
      { service: "Sunday Service", date: "Jun 1, 2026", status: "present", time: "9:10 AM" },
      { service: "Sunday Service", date: "May 25, 2026", status: "late", time: "9:55 AM" },
      { service: "Sunday Service", date: "May 18, 2026", status: "absent" },
      { service: "Sunday Service", date: "May 11, 2026", status: "present", time: "9:00 AM" },
    ],
  },
  {
    id: "MBR-0999", name: "Maame Serwaa Ofori", ministry: "All Members", initials: "MS", color: "#DB2777",
    streak: 1, rate: 20, isAtRisk: true, services: ["guest", "absent", "absent", "absent", "absent"],
    lastSeen: "Jun 14, 2026", lastTime: "10:00 AM", isFirstTimer: true,
    timeline: [
      { service: "Harvest Conference", date: "Jun 14, 2026", status: "guest", time: "10:00 AM" },
      { service: "Sunday Service", date: "Jun 7, 2026", status: "absent" },
      { service: "Sunday Service", date: "Jun 1, 2026", status: "absent" },
      { service: "Sunday Service", date: "May 25, 2026", status: "absent" },
      { service: "Sunday Service", date: "May 18, 2026", status: "absent" },
    ],
  },
];

const SERVICE_COLS = ["Jun 14", "Jun 7", "Jun 1", "May 25", "May 18"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function attIcon(s: AttStatus) {
  if (s === "present") return { icon: <Check size={12} strokeWidth={3} />, color: "#0A4A3A", bg: "rgba(10,74,58,0.10)" };
  if (s === "absent") return { icon: <X size={12} strokeWidth={3} />, color: "#B91C1C", bg: "rgba(185,28,28,0.09)" };
  if (s === "late") return { icon: <span style={{ fontSize: 10, fontWeight: 700 }}>L</span>, color: "#92610A", bg: "rgba(200,134,10,0.10)" };
  return { icon: <span style={{ fontSize: 10, fontWeight: 700 }}>G</span>, color: "#2563EB", bg: "rgba(37,99,235,0.09)" };
}

function statusLabel(s: AttStatus) {
  return { present: "Present", absent: "Absent", late: "Late", guest: "Guest" }[s];
}

// ─── Atoms ────────────────────────────────────────────────────────────────────

function Avatar({ initials, color, size = 30 }: { initials: string; color: string; size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `${color}20`, border: `1.5px solid ${color}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontFamily: "var(--font-label)", fontSize: size * 0.33, fontWeight: 700, color }}>{initials}</span>
    </div>
  );
}

function Pill({ children, color, bg }: { children: React.ReactNode; color: string; bg: string }) {
  return (
    <span style={{ background: bg, color, fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99 }}>
      {children}
    </span>
  );
}

function DarkPill({ children, onClick, icon }: { children: React.ReactNode; onClick?: () => void; icon?: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: DARK, color: "#fff", border: "none", borderRadius: 99, padding: "9px 18px", fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
      {icon}{children}
    </button>
  );
}

function OutlineBtn({ children, onClick, icon, small }: { children: React.ReactNode; onClick?: () => void; icon?: React.ReactNode; small?: boolean }) {
  return (
    <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", color: DARK, border: "1.5px solid #D1D5DB", borderRadius: 99, padding: small ? "6px 13px" : "8px 16px", fontFamily: "var(--font-label)", fontSize: small ? 12 : 13, fontWeight: 600, cursor: "pointer" }}>
      {icon}{children}
    </button>
  );
}

function ProgressBar({ pct, color = BRAND }: { pct: number; color?: string }) {
  return (
    <div style={{ background: "#E5E3DC", borderRadius: 99, height: 6, overflow: "hidden", flex: 1 }}>
      <div style={{ background: color, width: `${pct}%`, height: "100%", borderRadius: 99 }} />
    </div>
  );
}

// ─── Custom bar tooltip ───────────────────────────────────────────────────────

function BarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const present = payload[0]?.value ?? 0;
  const cap = payload[1]?.value ?? 340;
  const pct = cap > 0 ? Math.round((present / cap) * 100) : 0;
  return (
    <div style={{ background: DARK, borderRadius: 10, padding: "10px 14px", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
      <div style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>{label.replace("\n", " — ")}</div>
      <div style={{ fontFamily: "var(--font-label)", fontSize: 15, fontWeight: 800, color: "#fff" }}>{present} present</div>
      <div style={{ fontFamily: "var(--font-label)", fontSize: 12, color: BRAND }}>{pct}% attendance rate</div>
    </div>
  );
}

// ─── Filter Sidebar ───────────────────────────────────────────────────────────

function FilterSidebar() {
  const inputStyle: React.CSSProperties = {
    border: "1.5px solid #E5E7EB", borderRadius: 8, padding: "7px 10px",
    fontSize: 12, fontFamily: "var(--font-label)", color: DARK,
    background: "#FAFAFA", outline: "none", width: "100%", boxSizing: "border-box",
  };

  function Lbl({ children }: { children: React.ReactNode }) {
    return <div style={{ fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: 8 }}>{children}</div>;
  }

  function Sec({ children }: { children: React.ReactNode }) {
    return <div style={{ marginBottom: 18 }}>{children}</div>;
  }

  function CbRow({ label }: { label: string }) {
    return (
      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 7 }}>
        <div style={{ width: 15, height: 15, borderRadius: 4, border: "1.5px solid #D1D5DB", background: "#fff", flexShrink: 0 }} />
        <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#374151" }}>{label}</span>
      </label>
    );
  }

  return (
    <aside style={{ width: 210, minWidth: 210, background: "#fff", borderRight: "1px solid #EBEBEB", padding: "18px 16px", overflowY: "auto", flexShrink: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <span style={{ fontFamily: "var(--font-label)", fontSize: 14, fontWeight: 700, color: DARK }}>Filters</span>
        <button style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: BRAND, background: "none", border: "none", cursor: "pointer" }}>Reset</button>
      </div>

      <Sec>
        <Lbl>Event / Service</Lbl>
        <select style={inputStyle}>
          <option>All Services</option>
          <option>Sunday Service</option>
          <option>Wednesday Bible Study</option>
          <option>Youth Meeting</option>
          <option>Harvest Conference</option>
        </select>
      </Sec>

      <Sec>
        <Lbl>Date Range</Lbl>
        <input type="date" style={inputStyle} />
        <input type="date" style={{ ...inputStyle, marginTop: 6 }} />
      </Sec>

      <Sec>
        <Lbl>Ministry</Lbl>
        {["All Members", "Youth", "Choir", "Children's", "Prayer Team", "Media"].map(m => <CbRow key={m} label={m} />)}
      </Sec>

      <Sec>
        <Lbl>Status</Lbl>
        {["Present", "Absent", "Late", "Guest"].map(s => <CbRow key={s} label={s} />)}
      </Sec>

      <Sec>
        <Lbl>Member Type</Lbl>
        {["All", "Regular", "First-timer", "At Risk"].map(s => <CbRow key={s} label={s} />)}
      </Sec>

      <DarkPill>Apply Filters</DarkPill>
    </aside>
  );
}

// ─── Overview view ────────────────────────────────────────────────────────────

function OverviewView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Bar chart */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #EBEBEB", padding: "22px 24px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Attendance Trend</div>
            <div style={{ fontFamily: "var(--font-label)", fontSize: 26, fontWeight: 800, color: DARK }}>Last 8 Services</div>
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            {[
              { dot: BRAND, label: "Present" },
              { dot: "#E5E3DC", label: "Capacity" },
            ].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: l.dot }} />
                <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#9CA3AF" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SERVICE_BARS} barCategoryGap="30%">
              <XAxis dataKey="label" tick={{ fontFamily: "var(--font-label)", fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: "var(--font-label)", fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={32} />
              <Tooltip content={<BarTooltip />} cursor={{ fill: "rgba(200,134,10,0.04)", radius: 6 }} />
              <Bar dataKey="capacity" fill="#E5E3DC" radius={[4, 4, 0, 0]} />
              <Bar dataKey="present" radius={[4, 4, 0, 0]}>
                {SERVICE_BARS.map((_, i) => (
                  <Cell key={i} fill={i === SERVICE_BARS.length - 3 ? BRAND : `${BRAND}99`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heatmap */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #EBEBEB", padding: "20px 24px" }}>
        <div style={{ fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 14 }}>Attendance Heatmap — Last 12 Weeks</div>
        <div style={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
          {/* Day labels */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2, marginRight: 4 }}>
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={i} style={{ width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-label)", fontSize: 9, color: "#9CA3AF" }}>{d}</div>
            ))}
          </div>
          {/* Weeks */}
          {HEATMAP_WEEKS.map((week, wi) => (
            <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {week.map((rate, di) => (
                <div key={di} title={rate > 0 ? `${Math.round(rate * 100)}% attendance` : "No service"}
                  style={{ width: 14, height: 14, borderRadius: 3, background: rate === 0 ? "#F3F4F6" : `rgba(200,134,10,${0.15 + rate * 0.85})`, cursor: rate > 0 ? "pointer" : "default", transition: "opacity 0.15s" }}
                  onMouseEnter={e => { if (rate > 0) e.currentTarget.style.opacity = "0.75"; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                />
              ))}
            </div>
          ))}
          {/* Scale */}
          <div style={{ display: "flex", alignItems: "center", gap: 3, marginLeft: 12, alignSelf: "flex-end" }}>
            <span style={{ fontFamily: "var(--font-label)", fontSize: 9, color: "#9CA3AF" }}>Low</span>
            {[0.15, 0.35, 0.55, 0.75, 1].map((o, i) => (
              <div key={i} style={{ width: 12, height: 12, borderRadius: 2, background: `rgba(200,134,10,${o})` }} />
            ))}
            <span style={{ fontFamily: "var(--font-label)", fontSize: 9, color: "#9CA3AF" }}>High</span>
          </div>
        </div>
      </div>

      {/* Ministry breakdown */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #EBEBEB", padding: "20px 24px" }}>
        <div style={{ fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 16 }}>Ministry Breakdown</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {MINISTRY_ROWS.map(m => (
            <div key={m.name} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 130, flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--font-label)", fontSize: 13, color: DARK, fontWeight: 500 }}>{m.name}</span>
              </div>
              <ProgressBar pct={m.rate} />
              <div style={{ display: "flex", alignItems: "center", gap: 6, width: 100, flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 700, color: DARK }}>{m.rate}%</span>
                {m.trend === "up"
                  ? <ArrowUpRight size={13} color={SUCCESS} />
                  : <ArrowDownRight size={13} color={DANGER} />}
                <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>{m.count} members</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Records view ─────────────────────────────────────────────────────────────

function RecordsView({ onSelectMember }: { onSelectMember: (m: MemberRecord) => void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  const filtered = MEMBERS.filter(m => !search || m.name.toLowerCase().includes(search.toLowerCase()));

  function toggle(id: string) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #EBEBEB", overflow: "hidden" }}>
      {/* Toolbar */}
      <div style={{ padding: "14px 18px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 300 }}>
          <Search size={14} color="#9CA3AF" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members…"
            style={{ border: "1.5px solid #E5E7EB", borderRadius: 99, padding: "7px 10px 7px 30px", fontSize: 12, fontFamily: "var(--font-label)", color: DARK, outline: "none", width: "100%", background: "#FAFAFA" }} />
        </div>
        {selected.size > 0 && (
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: BRAND }}>{selected.size} selected</span>
            {[
              { label: "Send Absence Message", icon: <MessageSquare size={12} /> },
              { label: "Flag for Follow-up", icon: <AlertTriangle size={12} /> },
              { label: "Export", icon: <Download size={12} /> },
            ].map(a => (
              <OutlineBtn key={a.label} small icon={a.icon}>{a.label}</OutlineBtn>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              <th style={thStyle}><input type="checkbox" onChange={e => setSelected(e.target.checked ? new Set(filtered.map(m => m.id)) : new Set())} /></th>
              <th style={{ ...thStyle, textAlign: "left" }}>Member</th>
              <th style={thStyle}>Ministry</th>
              {SERVICE_COLS.map(c => <th key={c} style={thStyle}>{c}</th>)}
              <th style={thStyle}>Streak</th>
              <th style={thStyle}>Rate</th>
              <th style={thStyle}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => {
              const isConsistent = m.services.filter(s => s === "present" || s === "late").length >= 4;
              const borderCol = m.isAtRisk ? `3px solid rgba(185,28,28,0.5)` : isConsistent ? `3px solid rgba(10,74,58,0.4)` : "3px solid transparent";
              return (
                <tr key={m.id}
                  style={{ borderBottom: "1px solid #F3F4F6", borderLeft: borderCol, background: m.isAtRisk ? "rgba(185,28,28,0.02)" : isConsistent ? "rgba(10,74,58,0.015)" : "#fff", cursor: "pointer" }}
                  onClick={() => onSelectMember(m)}
                  onMouseEnter={e => { e.currentTarget.style.background = "#F9F8F4"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = m.isAtRisk ? "rgba(185,28,28,0.02)" : isConsistent ? "rgba(10,74,58,0.015)" : "#fff"; }}
                >
                  <td style={tdStyle} onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={selected.has(m.id)} onChange={() => toggle(m.id)} />
                  </td>
                  <td style={{ ...tdStyle, minWidth: 200 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar initials={m.initials} color={m.color} size={30} />
                      <div>
                        <div style={{ fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 600, color: DARK, display: "flex", alignItems: "center", gap: 6 }}>
                          {m.name}
                          {m.isFirstTimer && <Pill color="#2563EB" bg="rgba(37,99,235,0.09)">First-timer</Pill>}
                          {m.isAtRisk && <Pill color={DANGER} bg="rgba(185,28,28,0.08)">At Risk</Pill>}
                        </div>
                        <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>{m.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    <Pill color="#374151" bg="#F3F4F6">{m.ministry}</Pill>
                  </td>
                  {m.services.map((s, i) => {
                    const ic = attIcon(s);
                    return (
                      <td key={i} style={{ ...tdStyle, textAlign: "center" }}>
                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: ic.bg, color: ic.color, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
                          {ic.icon}
                        </div>
                      </td>
                    );
                  })}
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                      {m.streak >= 5 && <Flame size={13} color="#F97316" />}
                      <span style={{ fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 700, color: m.streak >= 5 ? "#F97316" : DARK }}>{m.streak}</span>
                    </div>
                  </td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    <span style={{ fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 700, color: m.rate >= 80 ? SUCCESS : m.rate < 50 ? DANGER : DARK }}>{m.rate}%</span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: "center" }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                      <button title="View Profile" style={actionBtn} onMouseEnter={e => hoverIn(e)} onMouseLeave={e => hoverOut(e)}><FileText size={12} /></button>
                      <button title="Send Follow-up" style={actionBtn} onMouseEnter={e => hoverIn(e)} onMouseLeave={e => hoverOut(e)}><Send size={12} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div style={{ padding: "12px 18px", borderTop: "1px solid #F3F4F6", display: "flex", gap: 16 }}>
        {[
          { s: "present" as AttStatus, label: "Present" },
          { s: "absent" as AttStatus, label: "Absent" },
          { s: "late" as AttStatus, label: "Late" },
          { s: "guest" as AttStatus, label: "Guest" },
        ].map(l => {
          const ic = attIcon(l.s);
          return (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: ic.bg, display: "flex", alignItems: "center", justifyContent: "center", color: ic.color }}>{ic.icon}</div>
              <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>{l.label}</span>
            </div>
          );
        })}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 4, height: 18, borderRadius: 2, background: "rgba(10,74,58,0.4)" }} />
          <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>Consistent (4+/5)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 4, height: 18, borderRadius: 2, background: "rgba(185,28,28,0.5)" }} />
          <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>At Risk (3+ misses)</span>
        </div>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = { padding: "10px 12px", textAlign: "center", fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" };
const tdStyle: React.CSSProperties = { padding: "10px 12px" };
const actionBtn: React.CSSProperties = { width: 26, height: 26, borderRadius: 6, border: "1.5px solid #E5E7EB", background: "#FAFAFA", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#9CA3AF" };
function hoverIn(e: React.MouseEvent<HTMLButtonElement>) { e.currentTarget.style.borderColor = BRAND; e.currentTarget.style.color = BRAND; }
function hoverOut(e: React.MouseEvent<HTMLButtonElement>) { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.color = "#9CA3AF"; }

// ─── Member Detail Panel ──────────────────────────────────────────────────────

function MemberDetailPanel({ member, onClose }: { member: MemberRecord; onClose: () => void }) {
  const presentCount = member.timeline.filter(t => t.status === "present").length;
  const absentCount = member.timeline.filter(t => t.status === "absent").length;
  const lateCount = member.timeline.filter(t => t.status === "late").length;

  const ringData = [
    { name: "Present", value: presentCount, color: SUCCESS },
    { name: "Late", value: lateCount, color: BRAND },
    { name: "Absent", value: absentCount, color: DANGER },
  ];

  return (
    <div style={{ width: 300, minWidth: 300, background: "#fff", borderLeft: "1px solid #EBEBEB", display: "flex", flexDirection: "column", overflowY: "auto", flexShrink: 0 }}>
      {/* Header */}
      <div style={{ padding: "16px 18px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "var(--font-label)", fontSize: 14, fontWeight: 700, color: DARK }}>Member Detail</span>
        <button onClick={onClose} style={{ background: "#F3F4F6", border: "none", borderRadius: 99, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <X size={13} color="#374151" />
        </button>
      </div>

      <div style={{ padding: "18px", display: "flex", flexDirection: "column", gap: 18 }}>
        {/* Member info */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar initials={member.initials} color={member.color} size={48} />
          <div>
            <div style={{ fontFamily: "var(--font-label)", fontSize: 15, fontWeight: 700, color: DARK }}>{member.name}</div>
            <div style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#9CA3AF" }}>{member.ministry} · {member.id}</div>
            {member.isAtRisk && <Pill color={DANGER} bg="rgba(185,28,28,0.08)">At Risk</Pill>}
          </div>
        </div>

        {/* Rate + ring */}
        <div style={{ background: BG, borderRadius: 14, padding: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div>
              <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF", textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>Attendance Rate</div>
              <div style={{ fontFamily: "var(--font-label)", fontSize: 36, fontWeight: 800, color: member.rate >= 80 ? SUCCESS : member.rate < 50 ? DANGER : DARK }}>{member.rate}%</div>
            </div>
            <div style={{ position: "relative", width: 80, height: 80 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={ringData} cx="50%" cy="50%" innerRadius={26} outerRadius={36} dataKey="value" strokeWidth={2} stroke="#fff">
                    {ringData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {ringData.map(d => (
              <div key={d.name} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-label)", fontSize: 14, fontWeight: 700, color: d.color }}>{d.value}</div>
                <div style={{ fontFamily: "var(--font-label)", fontSize: 10, color: "#9CA3AF" }}>{d.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Streak + last seen */}
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1, background: "#F9FAFB", borderRadius: 10, padding: "10px 12px", border: "1px solid #EBEBEB" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
              {member.streak >= 5 && <Flame size={13} color="#F97316" />}
              <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>Streak</span>
            </div>
            <div style={{ fontFamily: "var(--font-label)", fontSize: 20, fontWeight: 800, color: member.streak >= 5 ? "#F97316" : DARK }}>{member.streak}</div>
            <div style={{ fontFamily: "var(--font-label)", fontSize: 10, color: "#9CA3AF" }}>consecutive</div>
          </div>
          <div style={{ flex: 1, background: "#F9FAFB", borderRadius: 10, padding: "10px 12px", border: "1px solid #EBEBEB" }}>
            <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>Last Seen</div>
            <div style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 700, color: DARK }}>{member.lastSeen}</div>
            <div style={{ fontFamily: "var(--font-label)", fontSize: 10, color: "#9CA3AF" }}>{member.lastTime}</div>
          </div>
        </div>

        {/* AI insight */}
        {member.isAtRisk && (
          <div style={{ background: "rgba(200,134,10,0.07)", borderRadius: 10, padding: "10px 12px", display: "flex", gap: 8 }}>
            <Star size={13} color={BRAND} style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#92610A", lineHeight: 1.5 }}>
              Tends to miss consecutive services. Last attended 3 weeks ago — consider a personal follow-up.
            </span>
          </div>
        )}

        {/* Timeline */}
        <div>
          <div style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 700, color: DARK, marginBottom: 12 }}>Service History</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {member.timeline.map((t, i) => {
              const ic = attIcon(t.status);
              return (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, paddingBottom: 12, position: "relative" }}>
                  {/* Timeline line */}
                  {i < member.timeline.length - 1 && (
                    <div style={{ position: "absolute", left: 11, top: 22, bottom: 0, width: 1.5, background: "#F3F4F6" }} />
                  )}
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: ic.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: ic.color, zIndex: 1 }}>
                    {ic.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: DARK }}>{t.service}</div>
                    <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>
                      {t.date}
                      {t.time && ` · ${t.time}`}
                      {' · '}<span style={{ color: ic.color }}>{statusLabel(t.status)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ height: 1, background: "#F3F4F6" }} />

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { label: "Send WhatsApp Follow-up", icon: <MessageSquare size={13} />, color: "#1DA851" },
            { label: "Send SMS", icon: <Phone size={13} />, color: DARK },
            { label: "Add Pastoral Note", icon: <FileText size={13} />, color: DARK },
          ].map(a => (
            <button key={a.label} style={{ display: "flex", alignItems: "center", gap: 9, background: "#F9FAFB", border: "1.5px solid #E5E7EB", borderRadius: 10, padding: "10px 14px", fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 600, color: a.color, cursor: "pointer", width: "100%" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = BRAND; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; }}>
              {a.icon}{a.label}
            </button>
          ))}
          <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "transparent", border: "none", fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 600, color: BRAND, cursor: "pointer", padding: "6px" }}>
            View Full Profile <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Attendance History Page ─────────────────────────────────────────────

type ViewKey = "overview" | "records";
type PeriodKey = "This Week" | "This Month" | "This Year" | "Custom";

export function AttendanceHistoryPage() {
  const [view, setView] = useState<ViewKey>("overview");
  const [period, setPeriod] = useState<PeriodKey>("This Month");
  const [selectedMember, setSelectedMember] = useState<MemberRecord | null>(null);

  const STATS = [
    { label: "Average Attendance", value: "68%", trend: "+3.2%", up: true },
    { label: "This Sunday", value: "214 members", icon: <CalendarDays size={15} /> },
    { label: "Consistent Members", value: "89", sub: "attended 4+ of last 5", icon: <Star size={15} color={BRAND} /> },
    { label: "At Risk", value: "23", sub: "missed 3+ services", icon: <AlertTriangle size={15} color="#92610A" />, warn: true },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: BG }}>
      {/* ── Top bar ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #EBEBEB", padding: "18px 24px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 26, fontWeight: 700, color: DARK, margin: "0 0 3px" }}>Attendance</h1>
            <p style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#9CA3AF", margin: 0 }}>Track member presence across services and events</p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {/* Period toggle */}
            <div style={{ display: "flex", background: "#F3F4F6", borderRadius: 10, padding: 3 }}>
              {(["This Week", "This Month", "This Year", "Custom"] as PeriodKey[]).map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  style={{ padding: "6px 14px", borderRadius: 7, border: "none", background: period === p ? "#fff" : "transparent", fontFamily: "var(--font-label)", fontSize: 12, fontWeight: period === p ? 700 : 400, color: period === p ? DARK : "#9CA3AF", cursor: "pointer", boxShadow: period === p ? "0 1px 4px rgba(0,0,0,0.07)" : "none" }}>
                  {p}
                </button>
              ))}
            </div>
            <OutlineBtn icon={<Download size={13} />}>Export Report</OutlineBtn>
            <DarkPill icon={<Send size={13} />}>Send Absence Follow-up</DarkPill>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ display: "flex", gap: 0, borderTop: "1px solid #F3F4F6" }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{ flex: 1, padding: "12px 20px 12px 0", borderRight: i < STATS.length - 1 ? "1px solid #F3F4F6" : "none", marginRight: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                {s.icon && <span>{s.icon}</span>}
                <span style={{ fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase" as const, letterSpacing: "0.04em" }}>{s.label}</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontFamily: "var(--font-label)", fontSize: 22, fontWeight: 800, color: s.warn ? "#92610A" : DARK }}>{s.value}</span>
                {s.trend && (
                  <span style={{ fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 700, color: s.up ? SUCCESS : DANGER, display: "flex", alignItems: "center", gap: 2 }}>
                    {s.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}{s.trend}
                  </span>
                )}
                {s.sub && <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>{s.sub}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <FilterSidebar />

        {/* Center */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* View toggle */}
          <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #EBEBEB", background: "#fff", flexShrink: 0 }}>
            <div style={{ display: "flex", background: "#F3F4F6", borderRadius: 10, padding: 3 }}>
              {([{ key: "overview" as ViewKey, label: "Overview", icon: BarChart3 }, { key: "records" as ViewKey, label: "Records", icon: ClipboardList }]).map(v => (
                <button key={v.key} onClick={() => setView(v.key)}
                  style={{ padding: "7px 18px", borderRadius: 8, border: "none", background: view === v.key ? "#fff" : "transparent", fontFamily: "var(--font-label)", fontSize: 13, fontWeight: view === v.key ? 700 : 400, color: view === v.key ? DARK : "#9CA3AF", cursor: "pointer", boxShadow: view === v.key ? "0 1px 6px rgba(0,0,0,0.08)" : "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <v.icon size={14} /> {v.label}
                </button>
              ))}
            </div>
            <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#9CA3AF" }}>
              {MEMBERS.length} members · {period.toLowerCase()}
            </span>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px" }}>
            {view === "overview" ? <OverviewView /> : <RecordsView onSelectMember={setSelectedMember} />}
          </div>
        </div>

        {/* Right: Member detail */}
        {selectedMember && (
          <MemberDetailPanel member={selectedMember} onClose={() => setSelectedMember(null)} />
        )}
      </div>
    </div>
  );
}
