import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import {
  Eye, EyeOff, Plus, TrendingUp, TrendingDown, ChevronDown,
  ChevronRight, Download, Mail, AlertTriangle, Check, X,
  Upload, RefreshCcw, FileText, Filter, Edit3, Trash2,
  ArrowUpRight, ArrowDownRight, Landmark, Wifi,
  RadioTower, Bus, Globe, BarChart3, ClipboardList, Search, Briefcase, Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ─── Design tokens ────────────────────────────────────────────────────────────

const BRAND = "#C8860A";
const DARK = "#1A1A1A";
const BG = "#F5F4EF";
const CARD = "#fff";
const DARK_CARD = "#1A1A1A";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MONTHLY_GIVING = [
  { month: "Jan", tithes: 18200, offerings: 7400, fundraising: 2100, other: 800 },
  { month: "Feb", tithes: 19800, offerings: 8100, fundraising: 1800, other: 600 },
  { month: "Mar", tithes: 22400, offerings: 9200, fundraising: 4200, other: 1100 },
  { month: "Apr", tithes: 20100, offerings: 7800, fundraising: 2600, other: 900 },
  { month: "May", tithes: 24600, offerings: 10300, fundraising: 5800, other: 1400 },
  { month: "Jun", tithes: 21800, offerings: 8900, fundraising: 3200, other: 700 },
  { month: "Jul", tithes: 0, offerings: 0, fundraising: 0, other: 0 },
  { month: "Aug", tithes: 0, offerings: 0, fundraising: 0, other: 0 },
  { month: "Sep", tithes: 0, offerings: 0, fundraising: 0, other: 0 },
  { month: "Oct", tithes: 0, offerings: 0, fundraising: 0, other: 0 },
  { month: "Nov", tithes: 0, offerings: 0, fundraising: 0, other: 0 },
  { month: "Dec", tithes: 0, offerings: 0, fundraising: 0, other: 0 },
];

const EXPENSE_CATEGORIES = [
  { name: "Staff & Honoraria", amount: 4800, color: "#2D1B69" },
  { name: "Utilities", amount: 2400, color: BRAND },
  { name: "Events & Programs", amount: 2100, color: "#0A4A3A" },
  { name: "Media & Equipment", amount: 1600, color: "#7C3AED" },
  { name: "Outreach & Missions", amount: 900, color: "#DB2777" },
  { name: "Maintenance & Repairs", amount: 700, color: "#B45309" },
  { name: "Miscellaneous", amount: 300, color: "#6B7280" },
];
const TOTAL_EXPENSES = EXPENSE_CATEGORIES.reduce((s, c) => s + c.amount, 0);

type ExpStatus = "Approved" | "Pending" | "Rejected";
interface Expense {
  id: string; category: string; description: string;
  recordedBy: string; date: string; amount: number; status: ExpStatus;
}

const EXPENSES: Expense[] = [
  { id: "EXP-041", category: "Staff & Honoraria", description: "Worship leader monthly stipend", recordedBy: "Elder Grace Mensah", date: "Jun 1, 2026", amount: 1200, status: "Approved" },
  { id: "EXP-042", category: "Utilities", description: "Electricity bill — Main Sanctuary", recordedBy: "Deacon Kofi Mensah", date: "Jun 2, 2026", amount: 820, status: "Approved" },
  { id: "EXP-043", category: "Events & Programs", description: "Harvest Conference catering deposit", recordedBy: "Elder Grace Mensah", date: "Jun 3, 2026", amount: 3500, status: "Pending" },
  { id: "EXP-044", category: "Media & Equipment", description: "Replacement microphone set", recordedBy: "Bro. Emmanuel Ofori", date: "Jun 3, 2026", amount: 680, status: "Pending" },
  { id: "EXP-045", category: "Outreach & Missions", description: "Youth outreach transport", recordedBy: "Bro. Kwame Boateng", date: "Jun 4, 2026", amount: 350, status: "Approved" },
  { id: "EXP-046", category: "Maintenance & Repairs", description: "Roof repair — Fellowship Hall", recordedBy: "Deacon Kofi Mensah", date: "May 30, 2026", amount: 2200, status: "Rejected" },
  { id: "EXP-047", category: "Miscellaneous", description: "Stationery & printing", recordedBy: "Sis. Ama Boateng", date: "May 28, 2026", amount: 120, status: "Approved" },
];

const BUDGET_GOALS: { icon: LucideIcon; label: string; pct: number; current: number; goal: number }[] = [
  { icon: Landmark, label: "Building Fund", pct: 72, current: 72000, goal: 100000 },
  { icon: RadioTower, label: "Media Equipment", pct: 28, current: 1400, goal: 5000 },
  { icon: Bus, label: "Church Bus", pct: 45, current: 13500, goal: 30000 },
  { icon: Globe, label: "Outreach Fund", pct: 61, current: 6100, goal: 10000 },
];

const BUDGET_ENVELOPES = [
  { category: "Staff & Honoraria", budget: 6000, spent: 4800, period: "Monthly" },
  { category: "Utilities", budget: 3000, spent: 2400, period: "Monthly" },
  { category: "Events & Programs", budget: 5000, spent: 5600, period: "Monthly" },
  { category: "Media & Equipment", budget: 3000, spent: 1600, period: "Quarterly" },
  { category: "Outreach & Missions", budget: 2000, spent: 900, period: "Monthly" },
  { category: "Maintenance & Repairs", budget: 1500, spent: 700, period: "Monthly" },
];

const REPORTS: { name: string; desc: string; icon: LucideIcon }[] = [
  { name: "Monthly Giving Summary", desc: "Giving breakdown for current month by type & ministry", icon: BarChart3 },
  { name: "Annual Financial Statement", desc: "Full year income, expenses, and net surplus", icon: ClipboardList },
  { name: "Expense Audit Report", desc: "All expenses with status and approval trail", icon: Search },
  { name: "Ministry Budget Report", desc: "Budget vs actual per ministry for current period", icon: Briefcase },
  { name: "Donor / Contributor Report", desc: "Top contributors ranked by giving amount", icon: Users },
];

const REPORT_HISTORY = [
  { name: "Monthly Giving Summary", date: "Jun 1, 2026", by: "Pastor David Osei" },
  { name: "Expense Audit Report", date: "May 31, 2026", by: "Elder Grace Mensah" },
  { name: "Annual Financial Statement", date: "May 15, 2026", by: "Pastor David Osei" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtGHS(n: number) { return `GHS ${n.toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; }
function fmtK(n: number) { return n >= 1000 ? `${(n / 1000).toFixed(0)}k` : `${n}`; }

function expStatusStyle(s: ExpStatus) {
  if (s === "Approved") return { color: "#0A4A3A", bg: "rgba(10,74,58,0.09)" };
  if (s === "Pending") return { color: "#92610A", bg: "rgba(200,134,10,0.10)" };
  return { color: "#B91C1C", bg: "rgba(185,28,28,0.09)" };
}

function budgetColor(pct: number) {
  if (pct >= 100) return "#B91C1C";
  if (pct >= 80) return "#92610A";
  return "#0A4A3A";
}

// ─── Atoms ────────────────────────────────────────────────────────────────────

function Pill({ children, color, bg }: { children: React.ReactNode; color: string; bg: string }) {
  return (
    <span style={{ background: bg, color, fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 99, whiteSpace: "nowrap" as const }}>
      {children}
    </span>
  );
}

function TrendChip({ pct, up }: { pct: string; up: boolean }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: up ? "rgba(10,74,58,0.10)" : "rgba(185,28,28,0.09)", color: up ? "#0A4A3A" : "#B91C1C", borderRadius: 99, padding: "3px 10px", fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 700 }}>
      {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{pct}
      <span style={{ fontWeight: 400, fontSize: 11, opacity: 0.7 }}>vs Last Month</span>
    </span>
  );
}

function ProgressBar({ pct, color = BRAND, dark = false, height = 6 }: { pct: number; color?: string; dark?: boolean; height?: number }) {
  return (
    <div style={{ background: dark ? "rgba(255,255,255,0.12)" : "#E5E3DC", borderRadius: 99, height, overflow: "hidden", width: "100%" }}>
      <div style={{ background: color, width: `${Math.min(100, pct)}%`, height: "100%", borderRadius: 99, transition: "width 0.5s" }} />
    </div>
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

function SectionCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: CARD, borderRadius: 16, border: "1px solid #EBEBEB", ...style }}>{children}</div>;
}

function DarkCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: DARK_CARD, borderRadius: 16, ...style }}>{children}</div>;
}

function BrandCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: BRAND, borderRadius: 16, ...style }}>{children}</div>;
}

// ─── Custom Bar chart tooltip ─────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s: number, p: any) => s + (p.value || 0), 0);
  return (
    <div style={{ background: DARK, borderRadius: 10, padding: "10px 14px", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
      <div style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: "var(--font-label)", fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 6 }}>GHS {total.toLocaleString()}</div>
      {payload.map((p: any) => p.value > 0 && (
        <div key={p.name} style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
          <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "rgba(255,255,255,0.55)" }}>{p.name}</span>
          <span style={{ fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>GHS {p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Period selector ──────────────────────────────────────────────────────────

type Period = "This Month" | "This Quarter" | "This Year" | "Custom";

function PeriodDropdown({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
  const [open, setOpen] = useState(false);
  const opts: Period[] = ["This Month", "This Quarter", "This Year", "Custom"];
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 99, padding: "8px 16px", fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 600, color: DARK, cursor: "pointer" }}>
        {value} <ChevronDown size={14} />
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, background: "#fff", borderRadius: 12, border: "1px solid #EBEBEB", boxShadow: "0 8px 24px rgba(0,0,0,0.10)", zIndex: 20, minWidth: 160, overflow: "hidden" }}>
          {opts.map(o => (
            <button key={o} onClick={() => { onChange(o); setOpen(false); }}
              style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 16px", border: "none", background: o === value ? `rgba(200,134,10,0.07)` : "transparent", fontFamily: "var(--font-label)", fontSize: 13, color: o === value ? BRAND : "#374151", fontWeight: o === value ? 700 : 400, cursor: "pointer" }}>
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

type TabKey = "overview" | "expenses" | "budgets" | "reports";
const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "expenses", label: "Expenses" },
  { key: "budgets", label: "Budgets" },
  { key: "reports", label: "Reports" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// OVERVIEW TAB
// ═══════════════════════════════════════════════════════════════════════════════

function IncomeBreakdownCollapsible() {
  const [open, setOpen] = useState(false);
  const items = [
    { label: "Tithes", amount: 42000, color: BRAND },
    { label: "Offerings", amount: 18500, color: "#2D1B69" },
    { label: "Fundraising", amount: 12000, color: "#0A4A3A" },
    { label: "Special Gifts", amount: 5200, color: "#7C3AED" },
    { label: "Other", amount: 1843, color: "#9CA3AF" },
  ];
  const total = items.reduce((s, i) => s + i.amount, 0);
  return (
    <SectionCard style={{ overflow: "hidden" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "none", border: "none", cursor: "pointer" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `rgba(200,134,10,0.10)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FileText size={13} color={BRAND} />
          </div>
          <span style={{ fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 700, color: DARK }}>Income Breakdown</span>
        </div>
        <ChevronDown size={15} color="#9CA3AF" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>
      {open && (
        <div style={{ padding: "0 16px 16px", borderTop: "1px solid #F3F4F6" }}>
          <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF", marginBottom: 10, marginTop: 12 }}>This Quarter · Total: <strong style={{ color: DARK }}>${total.toLocaleString()}</strong></div>
          {/* Stacked bar */}
          <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", height: 8, marginBottom: 14 }}>
            {items.map(i => (
              <div key={i.label} style={{ background: i.color, width: `${(i.amount / total) * 100}%`, height: "100%" }} />
            ))}
          </div>
          {items.map(i => (
            <div key={i.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #F9F8F4" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 8, height: 8, borderRadius: 3, background: i.color, flexShrink: 0 }} />
                <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#374151" }}>{i.label}</span>
              </div>
              <span style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 700, color: DARK }}>${i.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

function OverviewTab() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [currency, setCurrency] = useState("USD");
  const [peakMonth, setPeakMonth] = useState("May");

  const chartData = MONTHLY_GIVING.map(m => ({
    ...m,
    total: m.tithes + m.offerings + m.fundraising + m.other,
  }));

  const statCards = [
    { label: "Total Income",    value: "$48,200", pct: "8.2%",  up: true,  accentColor: "#0A4A3A", accentBg: "rgba(10,74,58,0.06)" },
    { label: "Total Expenses",  value: "$12,800", pct: "5.3%",  up: false, accentColor: "#B91C1C", accentBg: "rgba(185,28,28,0.05)" },
    { label: "Net Surplus",     value: "$35,400", pct: "12.2%", up: true,  accentColor: BRAND,     accentBg: `rgba(200,134,10,0.06)` },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

      {/* ── Row 1: Merged cuboid panel + right sidebar ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 18, alignItems: "start" }}>

        {/* ── Merged panel: two 3D-styled cuboid columns ── */}
        <div style={{
          display: "flex",
          borderRadius: 20,
          overflow: "hidden",
          border: "1px solid #E0DED8",
          boxShadow: "0 2px 0 #D4D1CA, 0 6px 24px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)",
          background: "#fff",
          position: "relative",
        }}>
          {/* Left cuboid — Balance (dark) */}
          <div style={{
            flex: "0 0 44%",
            padding: "28px 26px 26px",
            background: "linear-gradient(160deg, #22213A 0%, #1A1A1A 60%, #141414 100%)",
            position: "relative",
            boxShadow: "inset -1px 0 0 rgba(255,255,255,0.06)",
          }}>
            {/* Top-face highlight stripe */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, rgba(200,134,10,0.6), rgba(200,134,10,0.1))", borderRadius: "20px 0 0 0" }} />

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
              <div>
                <div style={{ fontFamily: "var(--font-label)", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Total Church Balance</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <select value={currency} onChange={e => setCurrency(e.target.value)}
                    style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: 7, padding: "3px 7px", fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: "#fff", background: "rgba(255,255,255,0.08)", cursor: "pointer", outline: "none" }}>
                    <option>USD</option><option>GBP</option><option>GHS</option>
                  </select>
                  <button onClick={() => setBalanceVisible(v => !v)} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 7, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.5)" }}>
                    {balanceVisible ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.06)", borderRadius: 9, padding: "5px 10px", border: "1px solid rgba(255,255,255,0.08)" }}>
                <Landmark size={12} color="rgba(255,255,255,0.35)" />
                <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "rgba(255,255,255,0.45)" }}>Main Account</span>
                <ChevronDown size={11} color="rgba(255,255,255,0.3)" />
              </div>
            </div>

            {/* Big number */}
            <div style={{ fontFamily: "var(--font-label)", fontSize: 38, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: 8, filter: balanceVisible ? "none" : "blur(12px)", userSelect: "none" as const }}>
              {balanceVisible ? "$128,430" : "$••••••"}
            </div>
            <div style={{ marginBottom: 14 }}>
              <TrendChip pct="12.4%" up={true} />
            </div>

            {/* Insight chip */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(200,134,10,0.15)", borderRadius: 99, padding: "5px 11px", marginBottom: 22, border: "1px solid rgba(200,134,10,0.25)" }}>
              <div style={{ width: 6, height: 6, borderRadius: 99, background: BRAND }} />
              <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: BRAND, fontWeight: 500 }}>Tithes = 68% of giving this year</span>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {[
                { label: "Record Income",   icon: <Plus size={13} /> },
                { label: "Record Expense",  icon: <ArrowUpRight size={13} /> },
                { label: "Generate Report", icon: <FileText size={13} /> },
              ].map(btn => (
                <button key={btn.label} style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 14px", fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)", cursor: "pointer", textAlign: "left" as const }}>
                  <span style={{ color: BRAND }}>{btn.icon}</span>{btn.label}
                </button>
              ))}
            </div>

            {/* Right-edge cuboid shadow */}
            <div style={{ position: "absolute", top: 0, right: 0, width: 16, bottom: 0, background: "linear-gradient(to right, transparent, rgba(0,0,0,0.18))", pointerEvents: "none" }} />
          </div>

          {/* Divider with depth accent */}
          <div style={{ width: 1, background: "linear-gradient(to bottom, rgba(200,134,10,0.3), rgba(200,134,10,0.06) 40%, transparent)" }} />

          {/* Right cuboid — Bar chart (light) */}
          <div style={{
            flex: 1,
            padding: "24px 22px 20px",
            background: "#fff",
            position: "relative",
          }}>
            {/* Top-face highlight stripe */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, rgba(200,134,10,0.08), rgba(200,134,10,0.0))", borderRadius: "0 20px 0 0" }} />

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
              <div>
                <div style={{ fontFamily: "var(--font-label)", fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Giving & Income Overview</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span style={{ fontFamily: "var(--font-label)", fontSize: 30, fontWeight: 800, color: DARK }}>$98,643</span>
                  <TrendChip pct="14.1%" up={true} />
                </div>
                <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>Year to date · Jan – Jun 2026</div>
              </div>
              <button style={{ display: "flex", alignItems: "center", gap: 4, background: "#F3F4F6", border: "1px solid #E5E7EB", borderRadius: 99, padding: "6px 12px", fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 600, color: "#374151", cursor: "pointer" }}>
                This Year <ChevronDown size={12} />
              </button>
            </div>

            <div style={{ height: 220, marginTop: 14 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barCategoryGap="30%">
                  <XAxis dataKey="month" tick={{ fontFamily: "var(--font-label)", fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={fmtK} tick={{ fontFamily: "var(--font-label)", fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={32} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(200,134,10,0.04)", radius: 6 }} />
                  <Bar dataKey="tithes" stackId="a" name="Tithes">
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.month === peakMonth ? BRAND : "#E5E3DC"} opacity={entry.total === 0 ? 0.2 : 1} />
                    ))}
                  </Bar>
                  <Bar dataKey="offerings" stackId="a" name="Offerings">
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.month === peakMonth ? `${BRAND}BB` : "#D1CFC8"} opacity={entry.total === 0 ? 0.1 : 1} />
                    ))}
                  </Bar>
                  <Bar dataKey="fundraising" stackId="a" name="Fundraising">
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.month === peakMonth ? `${BRAND}77` : "#C4C2BB"} opacity={entry.total === 0 ? 0.1 : 1} />
                    ))}
                  </Bar>
                  <Bar dataKey="other" stackId="a" name="Other" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.month === peakMonth ? `${BRAND}44` : "#B8B5AE"} opacity={entry.total === 0 ? 0.1 : 1} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
              {[
                { label: "Tithes", c: BRAND },
                { label: "Offerings", c: `${BRAND}BB` },
                { label: "Fundraising", c: `${BRAND}77` },
                { label: "Other", c: "#9CA3AF" },
              ].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 3, background: l.c }} />
                  <span style={{ fontFamily: "var(--font-label)", fontSize: 10, color: "#9CA3AF" }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right sidebar ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Total Income / Total Expenses / Net Surplus */}
          {statCards.map(s => (
            <div key={s.label} style={{
              background: "#fff",
              borderRadius: 14,
              border: "1px solid #EBEBEB",
              padding: "16px 18px",
              borderLeft: `4px solid ${s.accentColor}`,
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}>
              <div style={{ fontFamily: "var(--font-label)", fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>{s.label}</div>
              <div style={{ fontFamily: "var(--font-label)", fontSize: 24, fontWeight: 800, color: s.accentColor, marginBottom: 6 }}>{s.value}</div>
              <TrendChip pct={s.pct} up={s.up} />
            </div>
          ))}

          {/* Income Breakdown — collapsible */}
          <IncomeBreakdownCollapsible />
        </div>
      </div>

      {/* ── Row 2: Budget Goals — expanded full width ── */}
      <div style={{
        background: DARK_CARD,
        borderRadius: 20,
        padding: "24px 28px",
        boxShadow: "0 2px 0 #111, 0 8px 32px rgba(0,0,0,0.16)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: "var(--font-label)", fontSize: 14, fontWeight: 700, color: "#fff" }}>Budget Goals</div>
            <div style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Track giving targets and fundraising milestones</div>
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: 6, background: `rgba(200,134,10,0.18)`, color: BRAND, border: "1px solid rgba(200,134,10,0.25)", borderRadius: 99, padding: "7px 16px", fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            <Plus size={13} />Add Goal
          </button>
        </div>

        {/* 2×2 goal grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {BUDGET_GOALS.map(g => {
            const remaining = g.goal - g.current;
            return (
              <div key={g.label} style={{
                background: "rgba(255,255,255,0.04)",
                borderRadius: 14,
                padding: "18px 20px",
                border: "1px solid rgba(255,255,255,0.07)",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}><g.icon size={18} color="#fff" /></div>
                    <div>
                      <div style={{ fontFamily: "var(--font-label)", fontSize: 14, fontWeight: 700, color: "#fff" }}>{g.label}</div>
                      <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>
                        ${remaining.toLocaleString()} remaining
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "var(--font-label)", fontSize: 24, fontWeight: 800, color: BRAND }}>{g.pct}%</div>
                    <div style={{ fontFamily: "var(--font-label)", fontSize: 10, color: "rgba(255,255,255,0.3)" }}>funded</div>
                  </div>
                </div>

                <ProgressBar pct={g.pct} dark={true} height={10} />

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-label)", fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 2 }}>Raised</div>
                    <div style={{ fontFamily: "var(--font-label)", fontSize: 15, fontWeight: 700, color: BRAND }}>${g.current.toLocaleString()}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "var(--font-label)", fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 2 }}>Goal</div>
                    <div style={{ fontFamily: "var(--font-label)", fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>${g.goal.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPENSES TAB
// ═══════════════════════════════════════════════════════════════════════════════

function ExpensesTab() {
  const [showForm, setShowForm] = useState(true);
  const [formCategory, setFormCategory] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formAmount, setFormAmount] = useState("");

  const inputStyle: React.CSSProperties = {
    border: "1.5px solid #E5E7EB", borderRadius: 8, padding: "8px 11px",
    fontSize: 13, fontFamily: "var(--font-label)", color: DARK,
    background: "#FAFAFA", outline: "none", width: "100%", boxSizing: "border-box",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Stats strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {[
          { label: "Total This Month", value: `GHS ${TOTAL_EXPENSES.toLocaleString()}`, icon: <FileText size={15} />, color: DARK },
          { label: "Largest Category", value: "Staff & Honoraria", icon: <AlertTriangle size={15} />, color: "#2D1B69" },
          { label: "vs Budget", value: "GHS 1,200 under", icon: <TrendingDown size={15} />, color: "#0A4A3A" },
          { label: "Pending Approval", value: "2 expenses", icon: <AlertTriangle size={15} />, color: "#92610A" },
        ].map(s => (
          <SectionCard key={s.label} style={{ padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ color: s.color }}>{s.icon}</span>
              <span style={{ fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</span>
            </div>
            <div style={{ fontFamily: "var(--font-label)", fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
          </SectionCard>
        ))}
      </div>

      {/* Three-column body */}
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr 280px", gap: 18, alignItems: "start" }}>

        {/* Donut chart */}
        <SectionCard style={{ padding: "20px 18px" }}>
          <div style={{ fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 16 }}>Expense Categories</div>
          <div style={{ position: "relative", height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={EXPENSE_CATEGORIES} cx="50%" cy="50%" innerRadius={52} outerRadius={78} dataKey="amount" strokeWidth={2} stroke="#fff">
                  {EXPENSE_CATEGORIES.map((c, i) => <Cell key={i} fill={c.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
              <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>Total</div>
              <div style={{ fontFamily: "var(--font-label)", fontSize: 18, fontWeight: 800, color: DARK }}>GHS {(TOTAL_EXPENSES / 1000).toFixed(1)}k</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
            {EXPENSE_CATEGORIES.map(c => (
              <div key={c.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 9, height: 9, borderRadius: 3, background: c.color, flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#374151" }}>{c.name}</span>
                </div>
                <span style={{ fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 700, color: DARK }}>GHS {(c.amount / 1000).toFixed(1)}k</span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Expense table */}
        <SectionCard style={{ overflow: "hidden" }}>
          <div style={{ padding: "16px 18px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "var(--font-label)", fontSize: 14, fontWeight: 700, color: DARK }}>Expense Log</span>
            <div style={{ display: "flex", gap: 8 }}>
              <OutlineBtn small icon={<Filter size={12} />}>Filter</OutlineBtn>
              <OutlineBtn small icon={<Download size={12} />}>Export</OutlineBtn>
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                {["Category", "Description", "Recorded by", "Date", "Amount", "Status", ""].map(h => (
                  <th key={h} style={{ padding: "9px 14px", textAlign: "left", fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" as const }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EXPENSES.map((exp, i) => {
                const ss = expStatusStyle(exp.status);
                const needsApproval = exp.amount >= 500 && exp.status === "Pending";
                return (
                  <tr key={exp.id} style={{ borderTop: "1px solid #F3F4F6" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#F9F8F4"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}>
                    <td style={{ padding: "10px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 3, background: EXPENSE_CATEGORIES.find(c => c.name === exp.category)?.color ?? "#9CA3AF", flexShrink: 0 }} />
                        <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#374151", fontWeight: 500 }}>{exp.category}</span>
                      </div>
                    </td>
                    <td style={{ padding: "10px 14px", fontFamily: "var(--font-label)", fontSize: 12, color: DARK, maxWidth: 160 }}>
                      <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{exp.description}</div>
                      {needsApproval && <div style={{ fontFamily: "var(--font-label)", fontSize: 10, color: "#92610A", marginTop: 1, display: "flex", alignItems: "center", gap: 3 }}><AlertTriangle size={11} /> Requires approval (≥ GHS 500)</div>}
                    </td>
                    <td style={{ padding: "10px 14px", fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF", whiteSpace: "nowrap" as const }}>{exp.recordedBy.split(" ").slice(0, 2).join(" ")}</td>
                    <td style={{ padding: "10px 14px", fontFamily: "var(--font-label)", fontSize: 12, color: "#6B7280", whiteSpace: "nowrap" as const }}>{exp.date}</td>
                    <td style={{ padding: "10px 14px", fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 700, color: DARK, whiteSpace: "nowrap" as const }}>GHS {exp.amount.toLocaleString()}</td>
                    <td style={{ padding: "10px 14px" }}><Pill color={ss.color} bg={ss.bg}>{exp.status}</Pill></td>
                    <td style={{ padding: "10px 14px" }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        {[<Eye size={12} />, <Edit3 size={12} />, <Check size={12} />, <Trash2 size={12} />].map((icon, j) => (
                          <button key={j} style={{ width: 24, height: 24, borderRadius: 6, border: "1.5px solid #E5E7EB", background: "#FAFAFA", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#9CA3AF" }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = BRAND; e.currentTarget.style.color = BRAND; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.color = "#9CA3AF"; }}>
                            {icon}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </SectionCard>

        {/* Quick log form */}
        <SectionCard style={{ padding: "20px 18px" }}>
          <div style={{ fontFamily: "var(--font-label)", fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 16 }}>Log Expense</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <div>
              <label style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Category</label>
              <select value={formCategory} onChange={e => setFormCategory(e.target.value)} style={inputStyle}>
                <option value="">Select category…</option>
                {EXPENSE_CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Description</label>
              <input value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="Brief description…" style={inputStyle} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 8 }}>
              <div>
                <label style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Cur.</label>
                <select style={inputStyle}><option>GHS</option><option>USD</option><option>GBP</option></select>
              </div>
              <div>
                <label style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Amount</label>
                <input type="number" value={formAmount} onChange={e => setFormAmount(e.target.value)} placeholder="0.00" style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Date</label>
              <input type="date" style={inputStyle} defaultValue="2026-06-04" />
            </div>
            {/* Receipt upload */}
            <div>
              <label style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Receipt</label>
              <div style={{ border: "2px dashed #D1D5DB", borderRadius: 10, padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, cursor: "pointer", background: "#FAFAFA" }}>
                <Upload size={16} color="#9CA3AF" />
                <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#6B7280" }}>Drop or <span style={{ color: BRAND, fontWeight: 600 }}>browse</span></span>
              </div>
            </div>
            <div>
              <label style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Recorded by</label>
              <input defaultValue="Pastor David Osei" readOnly style={{ ...inputStyle, background: "#F3F4F6", color: "#9CA3AF" }} />
            </div>
            {/* Approval note */}
            {Number(formAmount) >= 500 && (
              <div style={{ background: "rgba(200,134,10,0.07)", borderRadius: 8, padding: "9px 11px", display: "flex", gap: 7 }}>
                <AlertTriangle size={13} color={BRAND} style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#92610A" }}>Expenses ≥ GHS 500 require senior pastor or finance lead approval.</span>
              </div>
            )}
            <button style={{ background: DARK, color: "#fff", border: "none", borderRadius: 99, padding: "10px", fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              Submit for Approval
            </button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BUDGETS TAB
// ═══════════════════════════════════════════════════════════════════════════════

function BudgetsTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "var(--font-label)", fontSize: 15, fontWeight: 700, color: DARK }}>Budget Envelopes</div>
          <div style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>Tracking spend vs budget in real time</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ display: "flex", background: "#F3F4F6", borderRadius: 10, padding: 3, gap: 2 }}>
            {["Monthly", "Quarterly", "Annual"].map(p => (
              <button key={p} style={{ padding: "5px 14px", borderRadius: 7, border: "none", background: p === "Monthly" ? "#fff" : "transparent", fontFamily: "var(--font-label)", fontSize: 12, fontWeight: p === "Monthly" ? 700 : 400, color: p === "Monthly" ? DARK : "#9CA3AF", cursor: "pointer" }}>{p}</button>
            ))}
          </div>
          <DarkPill icon={<Plus size={14} />}>New Budget</DarkPill>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {BUDGET_ENVELOPES.map(env => {
          const pct = Math.round((env.spent / env.budget) * 100);
          const col = budgetColor(pct);
          const over = pct >= 100;
          return (
            <SectionCard key={env.category} style={{ padding: "20px 22px", borderLeft: `4px solid ${col}` }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                <div>
                  <div style={{ fontFamily: "var(--font-label)", fontSize: 14, fontWeight: 700, color: DARK }}>{env.category}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                    <Pill color="#374151" bg="#F3F4F6">{env.period}</Pill>
                    {over && <Pill color="#B91C1C" bg="rgba(185,28,28,0.09)">Over Budget</Pill>}
                    {pct >= 80 && !over && <Pill color="#92610A" bg="rgba(200,134,10,0.09)">Near Limit</Pill>}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--font-label)", fontSize: 22, fontWeight: 800, color: col }}>{pct}%</div>
                  <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>used</div>
                </div>
              </div>

              <ProgressBar pct={pct} color={col} height={8} />

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                <div>
                  <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>Spent</div>
                  <div style={{ fontFamily: "var(--font-label)", fontSize: 14, fontWeight: 700, color: DARK }}>GHS {env.spent.toLocaleString()}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>Budget</div>
                  <div style={{ fontFamily: "var(--font-label)", fontSize: 14, fontWeight: 700, color: "#6B7280" }}>GHS {env.budget.toLocaleString()}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>Remaining</div>
                  <div style={{ fontFamily: "var(--font-label)", fontSize: 14, fontWeight: 700, color: over ? "#B91C1C" : "#0A4A3A" }}>
                    {over ? "-" : ""}GHS {Math.abs(env.budget - env.spent).toLocaleString()}
                  </div>
                </div>
              </div>

              {over && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, background: "rgba(185,28,28,0.06)", borderRadius: 8, padding: "7px 10px" }}>
                  <AlertTriangle size={12} color="#B91C1C" />
                  <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#B91C1C" }}>Overspend alert sent to finance admin</span>
                </div>
              )}
            </SectionCard>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// REPORTS TAB
// ═══════════════════════════════════════════════════════════════════════════════

function ReportsTab() {
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const inputStyle: React.CSSProperties = {
    border: "1.5px solid #E5E7EB", borderRadius: 8, padding: "8px 11px",
    fontSize: 13, fontFamily: "var(--font-label)", color: DARK,
    background: "#FAFAFA", outline: "none", width: "100%", boxSizing: "border-box",
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 18, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {/* Pre-built templates */}
        <SectionCard style={{ padding: "22px 24px" }}>
          <div style={{ fontFamily: "var(--font-label)", fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 16 }}>Pre-built Report Templates</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {REPORTS.map(r => (
              <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 12, border: "1px solid #EBEBEB", background: "#FAFAFA" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = BRAND; e.currentTarget.style.background = `rgba(200,134,10,0.03)`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#EBEBEB"; e.currentTarget.style.background = "#FAFAFA"; }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `rgba(200,134,10,0.10)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><r.icon size={18} color={BRAND} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-label)", fontSize: 14, fontWeight: 600, color: DARK }}>{r.name}</div>
                  <div style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#9CA3AF" }}>{r.desc}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <OutlineBtn small icon={<Eye size={12} />}>Preview</OutlineBtn>
                  <OutlineBtn small icon={<Download size={12} />}>PDF</OutlineBtn>
                  <OutlineBtn small icon={<Mail size={12} />}>Email</OutlineBtn>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Custom report builder */}
        <SectionCard style={{ padding: "22px 24px" }}>
          <div style={{ fontFamily: "var(--font-label)", fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 16 }}>Custom Report Builder</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>From Date</label>
              <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>To Date</label>
              <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Ministry</label>
              <select style={inputStyle}>
                <option>All Ministries</option>
                <option>Youth</option>
                <option>Choir</option>
                <option>Prayer Team</option>
                <option>Children's</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <label style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>Data Fields</label>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
              {["Giving by type", "Expenses by category", "Ministry breakdown", "Member contributions", "Channel split", "Net surplus"].map(f => (
                <label key={f} style={{ display: "flex", alignItems: "center", gap: 6, background: "#F3F4F6", borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}>
                  <div style={{ width: 14, height: 14, borderRadius: 4, border: "1.5px solid #D1D5DB", background: "#fff" }} />
                  <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#374151" }}>{f}</span>
                </label>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <DarkPill icon={<FileText size={14} />}>Generate Report</DarkPill>
          </div>
        </SectionCard>
      </div>

      {/* Report history */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <SectionCard style={{ padding: "20px 20px" }}>
          <div style={{ fontFamily: "var(--font-label)", fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 14 }}>Report History</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {REPORT_HISTORY.map((r, i) => (
              <div key={i} style={{ padding: "12px 0", borderBottom: i < REPORT_HISTORY.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                <div style={{ fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 2 }}>{r.name}</div>
                <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>{r.date} · {r.by}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                  <button style={{ display: "flex", alignItems: "center", gap: 4, background: "#F3F4F6", border: "none", borderRadius: 7, padding: "5px 10px", fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 600, color: "#374151", cursor: "pointer" }}>
                    <Download size={11} />PDF
                  </button>
                  <button style={{ display: "flex", alignItems: "center", gap: 4, background: "#F3F4F6", border: "none", borderRadius: 7, padding: "5px 10px", fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 600, color: "#374151", cursor: "pointer" }}>
                    <Mail size={11} />Email
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Reconciliation */}
        <DarkCard style={{ padding: "18px 20px" }}>
          <div style={{ fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 12 }}>Reconciliation</div>
          {["May 2026", "Apr 2026", "Mar 2026"].map((month, i) => (
            <div key={month} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
              <span style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "rgba(255,255,255,0.85)" }}>{month}</span>
              {i === 0 ? (
                <button style={{ display: "flex", alignItems: "center", gap: 5, background: `rgba(200,134,10,0.2)`, color: BRAND, border: "none", borderRadius: 99, padding: "4px 12px", fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                  Mark Reconciled
                </button>
              ) : (
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 600, color: "#22C55E" }}>
                  <Check size={12} />Reconciled
                </span>
              )}
            </div>
          ))}
        </DarkCard>

        {/* Multi-account */}
        <SectionCard style={{ padding: "18px 18px" }}>
          <div style={{ fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 12 }}>Accounts</div>
          {[
            { name: "Main Account", balance: "GHS 86,430", active: true },
            { name: "Building Fund", balance: "GHS 32,000", active: false },
            { name: "Missions Account", balance: "GHS 10,000", active: false },
          ].map(acc => (
            <div key={acc.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: acc.name !== "Missions Account" ? "1px solid #F3F4F6" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: 99, background: acc.active ? BRAND : "#D1D5DB" }} />
                <span style={{ fontFamily: "var(--font-label)", fontSize: 13, color: DARK, fontWeight: acc.active ? 600 : 400 }}>{acc.name}</span>
              </div>
              <span style={{ fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 700, color: acc.active ? BRAND : "#6B7280" }}>{acc.balance}</span>
            </div>
          ))}
        </SectionCard>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export function FinancialReportsPage() {
  const [tab, setTab] = useState<TabKey>("overview");
  const [period, setPeriod] = useState<Period>("This Month");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: BG }}>
      {/* ── Top bar ── */}
      <div style={{ background: CARD, borderBottom: "1px solid #EBEBEB", padding: "18px 28px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 26, fontWeight: 700, color: DARK, margin: "0 0 3px" }}>Financial Overview</h1>
            <p style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#9CA3AF", margin: 0 }}>Real-time financial insights to support kingdom stewardship</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Live indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ position: "relative" }}>
                <div style={{ width: 8, height: 8, borderRadius: 99, background: BRAND }} />
                <div style={{ position: "absolute", inset: -2, borderRadius: 99, background: `rgba(200,134,10,0.3)`, animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite" }} />
              </div>
              <span style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: BRAND }}>Live Update</span>
            </div>
            <PeriodDropdown value={period} onChange={setPeriod} />
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ padding: "10px 22px", border: "none", background: "none", cursor: "pointer", fontFamily: "var(--font-label)", fontSize: 13, fontWeight: tab === t.key ? 700 : 500, color: tab === t.key ? BRAND : "#6B7280", borderBottom: tab === t.key ? `2.5px solid ${BRAND}` : "2.5px solid transparent", transition: "all 0.15s" }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px 36px" }}>
        {tab === "overview" && <OverviewTab />}
        {tab === "expenses" && <ExpensesTab />}
        {tab === "budgets" && <BudgetsTab />}
        {tab === "reports" && <ReportsTab />}
      </div>

      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
