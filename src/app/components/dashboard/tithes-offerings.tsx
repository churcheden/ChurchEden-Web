import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  Plus, Download, ArrowUpRight, ArrowDownRight, Users, Wallet,
  CalendarDays, TrendingUp, CreditCard, Smartphone, Banknote, FileText,
  Globe, HandCoins, ChevronRight,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { FormDialog } from "./form-dialog";
import {
  TRANSACTIONS, type Transaction,
  statusStyle, channelIcon, initials,
} from "./transactions";

// ─── Tokens ───────────────────────────────────────────────────────────────────

const BRAND = "#C8860A";
const DARK = "#1A1A1A";
const BG = "#F5F4EF";

// ─── Channel palette (per brand spec) ────────────────────────────────────────

type ChanKey = "Online" | "MoMo" | "Card" | "Cash" | "Cheque" | "Bank";

const CHANNEL_COLORS: Record<ChanKey, string> = {
  Online: BRAND,
  MoMo: "#7C3AED",
  Card: "#7C93C4",
  Cash: "#0A4A3A",
  Cheque: "#9CA3AF",
  Bank: "#2D1B69",
};

function channelColor(ch: ChanKey) {
  return CHANNEL_COLORS[ch];
}

// ─── Calendar data (weeks) ────────────────────────────────────────────────────

interface CalBlock {
  label: string;
  channel: ChanKey;
  time: string;
  amount: number;
  count: number;
}

interface CalDay {
  key: string;
  day: string;
  dateNum: string;
  month: string;
  blocks: CalBlock[];
}

const WEEK_1: CalDay[] = [
  { key: "MON", day: "Mon", dateNum: "01", month: "JUN", blocks: [
    { label: "Online Giving", channel: "Online", time: "9:00 AM", amount: 3200, count: 11 },
  ]},
  { key: "TUE", day: "Tue", dateNum: "02", month: "JUN", blocks: [
    { label: "MoMo Transfer", channel: "MoMo", time: "10:00 AM", amount: 1800, count: 5 },
  ]},
  { key: "WED", day: "Wed", dateNum: "03", month: "JUN", blocks: [
    { label: "Online Giving", channel: "Online", time: "10:40 AM", amount: 2400, count: 7 },
    { label: "Special Seed", channel: "MoMo", time: "2:00 PM", amount: 800, count: 3 },
  ]},
  { key: "THU", day: "Thu", dateNum: "04", month: "JUN", blocks: [
    { label: "MoMo Transfer", channel: "MoMo", time: "4:00 PM", amount: 1200, count: 3 },
  ]},
  { key: "FRI", day: "Fri", dateNum: "05", month: "JUN", blocks: [
    { label: "Online Giving", channel: "Online", time: "9:00 AM", amount: 4100, count: 15 },
  ]},
  { key: "SAT", day: "Sat", dateNum: "06", month: "JUN", blocks: [
    { label: "Card Payment", channel: "Card", time: "12:00 PM", amount: 900, count: 1 },
  ]},
  { key: "SUN", day: "Sun", dateNum: "07", month: "JUN", blocks: [
    { label: "Sunday Service Offering", channel: "Cash", time: "8:30 AM", amount: 12400, count: 53 },
    { label: "First Fruit Seed", channel: "Online", time: "11:00 AM", amount: 800, count: 6 },
  ]},
];

function weekTotal(days: CalDay[]) {
  return days.reduce((s, d) => s + d.blocks.reduce((x, b) => x + b.amount, 0), 0);
}
function dayTotal(d: CalDay) {
  return d.blocks.reduce((s, b) => s + b.amount, 0);
}
function dayCount(d: CalDay) {
  return d.blocks.reduce((s, b) => s + b.count, 0);
}

const WEEK_RANGE = "Jun 1 – Jun 7, 2026";

// Derived month & year views (synthesized from the established aggregates so the
// period controls stay functional; the app has no financial backend to re-query).

const MONTH_TOTAL = 125600;
const WEEK_AVG_DAY = weekTotal(WEEK_1) / 7;
const SCALE = (MONTH_TOTAL / 28) / WEEK_AVG_DAY;

function buildMonthDays(): CalDay[] {
  const out: CalDay[] = [];
  const dayNames = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  for (let week = 0; week < 4; week++) {
    dayNames.forEach((key, d) => {
      const src = WEEK_1[d];
      const dateNum = String(1 + week * 7 + d).padStart(2, "0");
      const blocks = src.blocks.map(b => ({
        label: b.label, channel: b.channel, time: b.time,
        amount: Math.round(b.amount * SCALE), count: b.count,
      }));
      out.push({ key, day: src.day, dateNum, month: "JUN", blocks });
    });
  }
  return out;
}
const MONTH_DAYS = buildMonthDays();
const MONTH_RANGE = "Jun 1 – Jun 28, 2026";

const YEAR_MONTHS: { month: string; total: number; pct: number }[] = [
  { month: "Jan", total: 98000, pct: 78 },
  { month: "Feb", total: 104000, pct: 83 },
  { month: "Mar", total: 110000, pct: 88 },
  { month: "Apr", total: 118000, pct: 94 },
  { month: "May", total: 122000, pct: 97 },
  { month: "Jun", total: 125600, pct: 100 },
  { month: "Jul", total: 0, pct: 0 },
  { month: "Aug", total: 0, pct: 0 },
  { month: "Sep", total: 0, pct: 0 },
  { month: "Oct", total: 0, pct: 0 },
  { month: "Nov", total: 0, pct: 0 },
  { month: "Dec", total: 0, pct: 0 },
];
const YEAR_RANGE = "Jan – Dec, 2026";

// ─── Summary metrics (established page data — no financial backend exists) ──

const METRICS = [
  { label: "Total Received", value: "GHS 48,200", sub: "214 contributors · this period", trend: "+12%", trendUp: true, context: "vs last month" },
  { label: "This Week", value: "GHS 27,600", sub: "matches the weekly calendar", trend: "+8.2%", trendUp: true, context: "vs last week" },
  { label: "This Month", value: "GHS 125,600", sub: "Jun forecast trending up", trend: "+6.4%", trendUp: true, context: "vs last month" },
  { label: "Average Gift", value: "GHS 182", sub: "across 324 transactions", trend: "+4%", trendUp: true, context: "vs last period" },
  { label: "Total Transactions", value: "324", sub: "321 completed · 3 pending", trend: undefined, trendUp: false, context: "" },
];

// ─── Breakdown data ──────────────────────────────────────────────────────────

const MINISTRY_BREAKDOWN = [
  { name: "All Members", amount: 28000, trend: "up" },
  { name: "Youth Ministry", amount: 9400, trend: "up" },
  { name: "Choir", amount: 5200, trend: "down" },
  { name: "Children's", amount: 3100, trend: "up" },
  { name: "Media", amount: 2500, trend: "down" },
];
const MAX_MINISTRY = Math.max(...MINISTRY_BREAKDOWN.map(m => m.amount));

const CHANNEL_BREAKDOWN = [
  { name: "MoMo", key: "MoMo" as ChanKey, amount: 21400, pct: 44 },
  { name: "Card", key: "Card" as ChanKey, amount: 14800, pct: 31 },
  { name: "Cash", key: "Cash" as ChanKey, amount: 8600, pct: 18 },
  { name: "Cheque", key: "Cheque" as ChanKey, amount: 3400, pct: 7 },
];
const CHANNEL_TOTAL = CHANNEL_BREAKDOWN.reduce((s, c) => s + c.amount, 0);

const TOP_CONTRIBUTORS = [
  { name: "Dr. Kwame Asante", ministry: "All Members", amount: 2400, initials: "KA", color: "#2D1B69" },
  { name: "Sis. Grace Mensah", ministry: "Choir", amount: 1800, initials: "GM", color: BRAND },
  { name: "Bro. Yaw Amponsah", ministry: "Youth", amount: 1500, initials: "YA", color: "#0A4A3A" },
  { name: "Elder Abena Osei", ministry: "Prayer Team", amount: 1200, initials: "AO", color: "#7C3AED" },
  { name: "Sis. Ama Boateng", ministry: "Children's", amount: 980, initials: "AB", color: "#B45309" },
];
const MAX_CONTRIB = Math.max(...TOP_CONTRIBUTORS.map(c => c.amount));

const FUNDRAISING = { name: "Building Fund Campaign", raised: 38200, goal: 50000, pct: 76, pace: "-2.6% vs last campaign" };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  if (n >= 1000) return `GHS ${(n / 1000).toFixed(1)}k`;
  return `GHS ${n.toLocaleString()}`;
}
function fmtFull(n: number) {
  return `GHS ${n.toLocaleString()}`;
}

// ─── Shared atoms ─────────────────────────────────────────────────────────────

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EBEBEB", ...style }}>
      {children}
    </div>
  );
}

function SectionLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", ...style }}>
      {children}
    </div>
  );
}

function Avatar({ initials: ini, color, size = 26 }: { initials: string; color: string; size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 99, background: `${color}22`, border: `1.5px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontFamily: "var(--font-label)", fontSize: size * 0.34, fontWeight: 700, color }}>{ini}</span>
    </div>
  );
}

function GoldBtn({ children, onClick, icon, small }: { children: React.ReactNode; onClick?: () => void; icon?: React.ReactNode; small?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{ display: "inline-flex", alignItems: "center", gap: 7, background: `linear-gradient(135deg, ${BRAND}, #D99A20)`, border: "none", borderRadius: 99, padding: small ? "7px 15px" : "9px 18px", fontFamily: "var(--font-label)", fontSize: small ? 12.5 : 13.5, fontWeight: 700, color: "#fff", cursor: "pointer", boxShadow: "0 6px 16px rgba(200,134,10,0.28)", transition: "filter 0.15s" }}
      onMouseEnter={e => { e.currentTarget.style.filter = "brightness(0.95)"; }}
      onMouseLeave={e => { e.currentTarget.style.filter = "brightness(1)"; }}
    >
      {icon}{children}
    </button>
  );
}

function OutlineBtn({ children, onClick, icon, small }: { children: React.ReactNode; onClick?: () => void; icon?: React.ReactNode; small?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "transparent", border: "1.5px solid #D1D5DB", borderRadius: 99, padding: small ? "6px 14px" : "8px 18px", fontFamily: "var(--font-label)", fontSize: small ? 12 : 13, fontWeight: 600, color: "#374151", cursor: "pointer" }}
      onMouseEnter={e => { e.currentTarget.style.background = "#F9F8F4"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
    >
      {icon}{children}
    </button>
  );
}

type Period = "Week" | "Month" | "Year" | "Custom";

function PeriodSelector({ active, onChange }: { active: Period; onChange: (p: Period) => void }) {
  return (
    <div role="tablist" aria-label="Reporting period" style={{ display: "flex", background: "#F3F4F6", borderRadius: 10, padding: 3, gap: 2 }}>
      {(["Week", "Month", "Year", "Custom"] as Period[]).map(p => (
        <button
          key={p} role="tab" aria-selected={active === p} onClick={() => onChange(p)}
          style={{ padding: "5px 14px", borderRadius: 7, border: "none", background: active === p ? "#fff" : "transparent", color: active === p ? BRAND : "#9CA3AF", fontFamily: "var(--font-label)", fontSize: 12, fontWeight: active === p ? 700 : 500, cursor: "pointer", boxShadow: active === p ? "0 1px 4px rgba(0,0,0,0.08), inset 0 0 0 1.5px rgba(200,134,10,0.55)" : "none", transition: "all 0.15s" }}>
          {p}
        </button>
      ))}
    </div>
  );
}

// ─── Summary card ─────────────────────────────────────────────────────────────

function MetricCard({ label, value, sub, trend, trendUp, context, icon }: {
  label: string; value: string; sub: string; trend?: string; trendUp?: boolean; context?: string; icon: React.ReactNode;
}) {
  return (
    <Card style={{ padding: "16px 18px", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <SectionLabel style={{ marginBottom: 0 }}>{label}</SectionLabel>
        <div style={{ width: 30, height: 30, borderRadius: 9, background: "rgba(200,134,10,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {icon}
        </div>
      </div>
      <div style={{ fontFamily: "var(--font-label)", fontSize: 24, fontWeight: 800, color: DARK, lineHeight: 1, letterSpacing: "-0.01em" }}>{value}</div>
      <div style={{ fontFamily: "var(--font-label)", fontSize: 11.5, color: "#6B7280", marginTop: 6 }}>{sub}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: "auto", paddingTop: 8 }}>
        {trend && (
          <>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 3, background: trendUp ? "rgba(10,74,58,0.09)" : "rgba(185,28,28,0.08)", borderRadius: 99, padding: "2px 8px", fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 700, color: trendUp ? "#0A4A3A" : "#B91C1C" }}>
              {trendUp ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}{trend}
            </span>
            {context && <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>{context}</span>}
          </>
        )}
      </div>
    </Card>
  );
}

// ─── Channel icon ─────────────────────────────────────────────────────────────

function ChannelIcon({ channel, size = 12, color }: { channel: ChanKey; size?: number; color?: string }) {
  const c = color ?? channelColor(channel);
  const icon = channel === "Online" ? <Globe size={size} /> : channel === "MoMo" ? <Smartphone size={size} /> : channel === "Card" ? <CreditCard size={size} /> : channel === "Cash" ? <Banknote size={size} /> : channel === "Cheque" ? <FileText size={size} /> : <Wallet size={size} />;
  return <span style={{ color: c, display: "inline-flex", flexShrink: 0 }} aria-hidden="true">{icon}</span>;
}

// ─── Weekly Giving Calendar (7 columns) ──────────────────────────────────────

function CalendarBlock({ block, onClick }: { block: CalBlock; onClick?: () => void }) {
  const [open, setOpen] = useState(false);
  const color = channelColor(block.channel);
  return (
    <div>
      <button
        onClick={() => { setOpen(o => !o); onClick?.(); }}
        aria-expanded={open}
        style={{ display: "block", width: "100%", textAlign: "left", background: `${color}14`, border: `1px solid ${color}33`, borderLeft: `3px solid ${color}`, borderRadius: 8, padding: "7px 9px", cursor: "pointer", transition: "background 0.15s", fontFamily: "var(--font-label)" }}
        onMouseEnter={e => { e.currentTarget.style.background = `${color}1F`; }}
        onMouseLeave={e => { e.currentTarget.style.background = `${color}14`; }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
          <ChannelIcon channel={block.channel} size={12} />
          <span style={{ fontSize: 11, fontWeight: 700, color: DARK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{block.label}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 10.5, color: "#6B7280" }}>{block.time}</span>
          <span style={{ fontSize: 11.5, fontWeight: 800, color }}>{fmtFull(block.amount)}</span>
        </div>
        <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 3 }}>{block.count} contributor{block.count === 1 ? "" : "s"}</div>
      </button>
      {open && (
        <div style={{ background: "#FBF9F4", border: "1px solid #EDEAE6", borderRadius: 8, padding: "7px 9px", marginTop: 4, fontFamily: "var(--font-label)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#6B7280", marginBottom: 3 }}>
            <span>Channel</span><span style={{ fontWeight: 700, color: DARK }}>{block.channel}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#6B7280" }}>
            <span>Amount</span><span style={{ fontWeight: 700, color: BRAND }}>{fmtFull(block.amount)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function DayColumn({ day, isSunday }: { day: CalDay; isSunday: boolean }) {
  const total = dayTotal(day);
  const count = dayCount(day);
  return (
    <div role="group" aria-label={`${day.day} ${day.dateNum} ${day.month}`} style={{ background: isSunday ? "#FBF7EE" : "#FAFAF8", border: `1px solid ${isSunday ? "rgba(200,134,10,0.28)" : "#ECEAE4"}`, borderRadius: 12, padding: "10px 9px", display: "flex", flexDirection: "column", minWidth: 0 }}>
      <div style={{ textAlign: "center", marginBottom: 9, paddingBottom: 8, borderBottom: "1px solid #ECEAE4" }}>
        <div style={{ fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 800, color: isSunday ? BRAND : "#374151", letterSpacing: "0.04em" }}>{day.key}</div>
        <div style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 700, color: DARK, marginTop: 1 }}>{day.dateNum}</div>
        <div style={{ fontFamily: "var(--font-label)", fontSize: 9.5, color: "#9CA3AF", letterSpacing: "0.06em" }}>{day.month}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        {day.blocks.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, minHeight: 70, color: "#D1D5DB" }}>
            <CalendarDays size={18} />
            <div style={{ fontFamily: "var(--font-label)", fontSize: 10, color: "#B8BCC4", marginTop: 5 }}>No giving</div>
          </div>
        )}
        {day.blocks.map((b, i) => <CalendarBlock key={i} block={b} />)}
      </div>

      {total > 0 && (
        <div style={{ marginTop: 9, paddingTop: 8, borderTop: "1px solid #ECEAE4", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 800, color: isSunday ? BRAND : DARK }}>{fmt(total)}</div>
          <div style={{ fontFamily: "var(--font-label)", fontSize: 10, color: "#9CA3AF" }}>{count} contributions</div>
        </div>
      )}
    </div>
  );
}

function YearView() {
  const total = YEAR_MONTHS.reduce((s, m) => s + m.total, 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ overflowX: "auto" }}>
        <div className="giving-year-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, minmax(46px, 1fr))", gap: 8 }}>
          {YEAR_MONTHS.map(m => (
            <div key={m.month} style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 800, color: m.total > 0 ? "#374151" : "#B8BCC4" }}>{fmt(m.total)}</span>
              <div style={{ width: "100%", height: 120, background: "#F3F4F6", borderRadius: 7, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
                <div style={{ width: "100%", height: `${m.pct}%`, background: m.month === "Jun" ? BRAND : "rgba(200,134,10,0.45)", borderRadius: "7px 7px 0 0", transition: "height 0.4s" }} />
              </div>
              <span style={{ fontFamily: "var(--font-label)", fontSize: 10, color: "#9CA3AF" }}>{m.month}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "flex-end", gap: 6, paddingTop: 4, borderTop: "1px solid #F3F4F6" }}>
        <span style={{ fontFamily: "var(--font-label)", fontSize: 16, fontWeight: 800, color: DARK }}>{fmt(total)}</span>
        <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>year-to-date</span>
      </div>
    </div>
  );
}

function WeeklyCalendar({ variant }: { variant: "Week" | "Month" | "Year" }) {
  const config =
    variant === "Week"
      ? { days: WEEK_1, range: WEEK_RANGE, totalLabel: "this week", total: weekTotal(WEEK_1) }
      : variant === "Month"
        ? { days: MONTH_DAYS, range: MONTH_RANGE, totalLabel: "this month", total: MONTH_TOTAL }
        : { days: [], range: YEAR_RANGE, totalLabel: "year to date", total: YEAR_MONTHS.reduce((s, m) => s + m.total, 0) };

  return (
    <Card style={{ padding: "20px 20px 16px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <HandCoins size={16} color={BRAND} />
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 17, fontWeight: 700, color: DARK, margin: 0 }}>
              {variant === "Week" ? "Weekly Giving Calendar" : variant === "Month" ? "Monthly Giving Calendar" : "Annual Giving Calendar"}
            </h2>
          </div>
          <div style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#9CA3AF", marginTop: 3 }}>{config.range}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "var(--font-label)", fontSize: 20, fontWeight: 800, color: BRAND, lineHeight: 1 }}>{fmt(config.total)}</div>
          <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>{config.totalLabel}</div>
        </div>
      </div>

      {variant === "Year" ? (
        <YearView />
      ) : (
        <div className="giving-calendar-grid" style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 8 }}>
          {config.days.map(d => <DayColumn key={`${d.key}-${d.dateNum}`} day={d} isSunday={d.key === "SUN"} />)}
        </div>
      )}

      {/* Legend */}
      {variant !== "Year" && (
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginTop: 16, paddingTop: 12, borderTop: "1px solid #F3F4F6" }}>
          <span style={{ fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>Legend</span>
          {(["Online", "MoMo", "Card", "Cash", "Cheque"] as ChanKey[]).map(ch => (
            <div key={ch} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 9, height: 9, borderRadius: 3, background: channelColor(ch), flexShrink: 0 }} />
              <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#6B7280" }}>{ch === "MoMo" ? "Mobile Money" : ch}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// ─── Top Contributors ─────────────────────────────────────────────────────────

function TopContributors() {
  return (
    <Card style={{ padding: "18px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <SectionLabel style={{ marginBottom: 0 }}>Top Contributors</SectionLabel>
        <button style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: BRAND, background: "none", border: "none", cursor: "pointer" }}>View all</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {TOP_CONTRIBUTORS.map((c, i) => (
          <div key={c.name} style={{ position: "relative", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: `${BRAND}${i === 0 ? "14" : "0A"}`, width: `${Math.round((c.amount / MAX_CONTRIB) * 100)}%`, borderRadius: 8 }} />
            <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 9, padding: "6px 8px" }}>
              <Avatar initials={c.initials} color={c.color} size={30} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-label)", fontSize: 12.5, fontWeight: 600, color: DARK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
                <div style={{ fontFamily: "var(--font-label)", fontSize: 10.5, color: "#9CA3AF" }}>{c.ministry}</div>
              </div>
              <div style={{ fontFamily: "var(--font-label)", fontSize: 12.5, fontWeight: 700, color: BRAND, flexShrink: 0 }}>{fmtFull(c.amount)}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Fundraising Progress ─────────────────────────────────────────────────────

function FundraisingProgress() {
  return (
    <Card style={{ padding: "18px 18px", background: `linear-gradient(150deg, ${BRAND}, #B97809)` }}>
      <SectionLabel style={{ color: "rgba(255,255,255,0.65)", marginBottom: 4 }}>Fundraising Progress</SectionLabel>
      <div style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "rgba(255,255,255,0.92)", marginBottom: 14 }}>{FUNDRAISING.name}</div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ position: "relative", width: 92, height: 92, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={[{ v: FUNDRAISING.pct }, { v: 100 - FUNDRAISING.pct }]} cx="50%" cy="50%" innerRadius={32} outerRadius={44} startAngle={90} endAngle={-270} dataKey="v" strokeWidth={0}>
                <Cell fill="rgba(255,255,255,0.92)" />
                <Cell fill="rgba(255,255,255,0.2)" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <span style={{ fontFamily: "var(--font-label)", fontSize: 20, fontWeight: 800, color: "#fff" }}>{FUNDRAISING.pct}%</span>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontFamily: "var(--font-label)", fontSize: 10.5, color: "rgba(255,255,255,0.65)" }}>Raised</span>
            <span style={{ fontFamily: "var(--font-label)", fontSize: 15, fontWeight: 800, color: "#fff" }}>{fmtFull(FUNDRAISING.raised)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontFamily: "var(--font-label)", fontSize: 10.5, color: "rgba(255,255,255,0.65)" }}>Goal</span>
            <span style={{ fontFamily: "var(--font-label)", fontSize: 15, fontWeight: 800, color: "rgba(255,255,255,0.85)" }}>{fmtFull(FUNDRAISING.goal)}</span>
          </div>
          <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 99, height: 6, overflow: "hidden" }}>
            <div style={{ background: "rgba(255,255,255,0.92)", width: `${FUNDRAISING.pct}%`, height: "100%", borderRadius: 99 }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 7 }}>
            <ArrowDownRight size={11} color="rgba(255,255,255,0.7)" />
            <span style={{ fontFamily: "var(--font-label)", fontSize: 10.5, color: "rgba(255,255,255,0.7)" }}>{FUNDRAISING.pace}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─── Bottom insights ──────────────────────────────────────────────────────────

function ByMinistry() {
  return (
    <Card style={{ padding: "18px 18px" }}>
      <SectionLabel style={{ marginBottom: 14 }}>By Ministry</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
        {MINISTRY_BREAKDOWN.map(m => (
          <div key={m.name}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#374151", fontWeight: 500 }}>{m.name}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                {m.trend === "up" ? <ArrowUpRight size={11} color="#0A4A3A" /> : <ArrowDownRight size={11} color="#B91C1C" />}
                <span style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 700, color: DARK }}>{fmt(m.amount)}</span>
              </div>
            </div>
            <div style={{ background: "#F3F4F6", borderRadius: 99, height: 5, overflow: "hidden" }}>
              <div style={{ background: BRAND, width: `${Math.round((m.amount / MAX_MINISTRY) * 100)}%`, height: "100%", borderRadius: 99 }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function DonutCenter({ total }: { total: number }) {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      <div style={{ fontFamily: "var(--font-label)", fontSize: 10, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Total</div>
      <div style={{ fontFamily: "var(--font-label)", fontSize: 15, fontWeight: 800, color: DARK, lineHeight: 1 }}>{fmt(total)}</div>
    </div>
  );
}

function ByChannel() {
  return (
    <Card style={{ padding: "18px 18px" }}>
      <SectionLabel style={{ marginBottom: 8 }}>By Channel</SectionLabel>
      <div style={{ position: "relative", height: 150 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={CHANNEL_BREAKDOWN} cx="50%" cy="50%" innerRadius={46} outerRadius={66} paddingAngle={3} dataKey="amount" strokeWidth={0}>
              {CHANNEL_BREAKDOWN.map(s => <Cell key={s.name} fill={channelColor(s.key)} />)}
            </Pie>
            <Tooltip formatter={(value: number) => [`GHS ${value.toLocaleString()}`, ""]} contentStyle={{ borderRadius: 10, border: "none", fontSize: 12, fontFamily: "var(--font-label)" }} />
          </PieChart>
        </ResponsiveContainer>
        <DonutCenter total={CHANNEL_TOTAL} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 10 }}>
        {CHANNEL_BREAKDOWN.map(ch => (
          <div key={ch.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 9, height: 9, borderRadius: 3, background: channelColor(ch.key), flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-label)", fontSize: 11.5, color: "#374151", flex: 1 }}>{ch.name}</span>
            <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>{ch.pct}%</span>
            <span style={{ fontFamily: "var(--font-label)", fontSize: 11.5, fontWeight: 700, color: DARK }}>{fmt(ch.amount)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function RecentTransactions() {
  const rows: Transaction[] = TRANSACTIONS.slice(0, 5);
  return (
    <Card style={{ padding: "18px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <SectionLabel style={{ marginBottom: 0 }}>Recent Transactions</SectionLabel>
        <button style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: BRAND, background: "none", border: "none", cursor: "pointer" }}>
          View all <ChevronRight size={13} />
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {rows.map(t => {
          const ss = statusStyle(t.status);
          const amt = t.currency !== "GHS" && t.ghsEquiv ? t.ghsEquiv : t.amount;
          return (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: "1px solid #F3F4F6" }}>
              <Avatar initials={initials(t.member)} color={t.member === "Dr. Kwame Asante" ? "#2D1B69" : t.member === "Sis. Grace Mensah" ? BRAND : t.member === "Bro. Yaw Amponsah" ? "#0A4A3A" : t.member === "Elder Abena Osei" ? "#7C3AED" : t.member === "Deacon Kofi Mensah" ? "#2D1B69" : "#B45309"} size={30} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-label)", fontSize: 12.5, fontWeight: 600, color: DARK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.member}</div>
                <div style={{ fontFamily: "var(--font-label)", fontSize: 10.5, color: "#9CA3AF" }}>{t.type} · {channelIcon(t.channel)} {t.channel} · {t.date}, {t.time}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "var(--font-label)", fontSize: 12.5, fontWeight: 800, color: DARK }}>GHS {amt.toLocaleString()}</div>
                <span style={{ padding: "2px 8px", borderRadius: 99, fontFamily: "var(--font-label)", fontSize: 10, fontWeight: 700, color: ss.color, background: ss.bg, display: "inline-block" }}>{t.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ─── Record Giving Dialog ─────────────────────────────────────────────────────

function RecordGivingDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ member: "", type: "Tithe", channel: "MoMo", amount: "", date: "", notes: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.member.trim() || !form.amount) {
      toast.error("Please fill in the member and amount.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onClose();
      toast.success(`Giving of GHS ${Number(form.amount).toLocaleString()} recorded successfully.`);
      setForm({ member: "", type: "Tithe", channel: "MoMo", amount: "", date: "", notes: "" });
    }, 700);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", border: "1.5px solid #E5E7EB", borderRadius: 8, padding: "8px 11px",
    fontFamily: "var(--font-label)", fontSize: 13, color: DARK, background: "#FAFAFA", outline: "none", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = { display: "block", fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 };

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      icon={<HandCoins size={20} color={BRAND} />}
      title="Record Giving"
      description="Log a cash, cheque or mobile money contribution."
      maxWidth="max-w-lg"
      submitFormId="record-giving-form"
      submitting={submitting}
      primaryButton={{ label: "Record Giving", icon: <HandCoins size={15} color="#FFFFFF" />, loadingLabel: "Saving...", onClick: () => {} }}
    >
      <form id="record-giving-form" onSubmit={handleSubmit} className="px-6 sm:px-7 py-6">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Member</label>
            <input style={inputStyle} placeholder="Search or enter member name" value={form.member} onChange={e => setForm({ ...form, member: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Giving Type</label>
            <select style={inputStyle} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option>Tithe</option><option>Offering</option><option>Seed</option><option>Fundraising</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Channel</label>
            <select style={inputStyle} value={form.channel} onChange={e => setForm({ ...form, channel: e.target.value })}>
              <option>MoMo</option><option>Card</option><option>Cash</option><option>Cheque</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Amount (GHS)</label>
            <input style={inputStyle} type="number" min="0" placeholder="0.00" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Date</label>
            <input style={inputStyle} type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Notes (optional)</label>
            <textarea style={{ ...inputStyle, minHeight: 64, resize: "vertical" }} placeholder="Internal notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>
        </div>
      </form>
    </FormDialog>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function TithesOfferingsPage() {
  const [period, setPeriod] = useState<Period>("Week");
  const [showRecord, setShowRecord] = useState(false);

  return (
    <div style={{ flex: 1, overflowY: "auto", background: BG }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "22px 24px 36px" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginBottom: 18 }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 26, fontWeight: 700, color: DARK, margin: 0, letterSpacing: "-0.01em" }}>Tithes &amp; Offerings</h1>
            <p style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#6B7280", margin: "4px 0 0" }}>Here&apos;s your giving overview for this period.</p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <OutlineBtn icon={<Download size={14} />} onClick={() => toast.success("Report export queued. You'll receive an email shortly.")}>Export Report</OutlineBtn>
            <GoldBtn icon={<Plus size={15} />} onClick={() => setShowRecord(true)}>Record Giving</GoldBtn>
          </div>
        </div>

        {/* ── Period selector ── */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
          <PeriodSelector
            active={period}
            onChange={p => {
              setPeriod(p);
              if (p === "Custom") toast("Custom date ranges need the giving API — showing this week.", { position: "bottom-right" });
            }}
          />
        </div>

        {/* ── Summary cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" style={{ gap: 12, marginBottom: 18 }}>
          <MetricCard label="Total Received" value={METRICS[0].value} sub={METRICS[0].sub} trend={METRICS[0].trend} trendUp context={METRICS[0].context} icon={<Wallet size={15} color={BRAND} />} />
          <MetricCard label="This Week" value={METRICS[1].value} sub={METRICS[1].sub} trend={METRICS[1].trend} trendUp context={METRICS[1].context} icon={<CalendarDays size={15} color={BRAND} />} />
          <MetricCard label="This Month" value={METRICS[2].value} sub={METRICS[2].sub} trend={METRICS[2].trend} trendUp context={METRICS[2].context} icon={<TrendingUp size={15} color={BRAND} />} />
          <MetricCard label="Average Gift" value={METRICS[3].value} sub={METRICS[3].sub} trend={METRICS[3].trend} trendUp context={METRICS[3].context} icon={<Users size={15} color={BRAND} />} />
          <MetricCard label="Total Transactions" value={METRICS[4].value} sub={METRICS[4].sub} trend={METRICS[4].trend} trendUp={false} context={METRICS[4].context} icon={<HandCoins size={15} color={BRAND} />} />
        </div>

        {/* ── Main: calendar + right insights ── */}
        <div className="flex flex-col lg:flex-row" style={{ gap: 14, alignItems: "stretch" }}>
          <div className="flex-1" style={{ minWidth: 0 }}>
            <WeeklyCalendar variant={period === "Custom" ? "Week" : (period as "Week" | "Month" | "Year")} />
          </div>
          <div className="lg:w-[300px]" style={{ display: "flex", flexDirection: "column", gap: 14, flexShrink: 0 }}>
            <TopContributors />
            <FundraisingProgress />
          </div>
        </div>

        {/* ── Bottom insights ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: 14, marginTop: 14 }}>
          <ByMinistry />
          <ByChannel />
          <RecentTransactions />
        </div>
      </div>

      <RecordGivingDialog open={showRecord} onClose={() => setShowRecord(false)} />
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
      <style>{`
        @media (min-width: 1024px) {
          .giving-calendar-grid { grid-template-columns: repeat(7, minmax(0, 1fr)) !important; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .giving-calendar-grid { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; }
        }
        @media (min-width: 640px) and (max-width: 767px) {
          .giving-calendar-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 639px) {
          .giving-calendar-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
