import { useState, useMemo } from "react";
import {
  Search, Download, Filter, ChevronUp, ChevronDown,
  Eye, FileText, Flag, X, Check, AlertTriangle, RefreshCcw,
  Copy, Plus, Maximize2, ChevronLeft, ChevronRight,
  ToggleLeft, ToggleRight, SlidersHorizontal,
  Smartphone, CreditCard, Banknote, Receipt, Landmark,
  Wallet, TrendingUp, Clock, XCircle, ArrowUpRight, ArrowDownRight,
} from "lucide-react";

// ─── Tokens ───────────────────────────────────────────────────────────────────

const BRAND = "#C8860A";
const DARK = "#1A1A1A";
const BG = "#F5F4EF";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TxType = "Tithe" | "Offering" | "Seed" | "Fundraising" | "Ticket Purchase" | "Event Fee";
export type TxChannel = "MoMo" | "Card" | "Cash" | "Cheque" | "Bank Transfer";
export type TxStatus = "Completed" | "Pending" | "Failed" | "Refunded";

export interface Transaction {
  id: string;
  memberId: string;
  member: string;
  ministry: string;
  type: TxType;
  channel: TxChannel;
  amount: number;
  currency: "GHS" | "USD" | "GBP";
  ghsEquiv?: number;
  date: string;
  time: string;
  status: TxStatus;
  receiptNo: string;
  notes?: string;
  flagged?: boolean;
  failureReason?: string;
  isNew?: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const TRANSACTIONS: Transaction[] = [
  { id: "TXN-0091", memberId: "MBR-0041", member: "Dr. Kwame Asante", ministry: "All Members", type: "Tithe", channel: "MoMo", amount: 1200, currency: "GHS", date: "Jun 4, 2026", time: "09:14 AM", status: "Completed", receiptNo: "RCP-20260604-001", isNew: true },
  { id: "TXN-0090", memberId: "MBR-0018", member: "Sis. Grace Mensah", ministry: "Choir", type: "Offering", channel: "Card", amount: 500, currency: "GHS", date: "Jun 4, 2026", time: "08:52 AM", status: "Completed", receiptNo: "RCP-20260604-002" },
  { id: "TXN-0089", memberId: "MBR-0072", member: "Bro. Yaw Amponsah", ministry: "Youth", type: "Seed", channel: "MoMo", amount: 200, currency: "GHS", date: "Jun 3, 2026", time: "07:30 PM", status: "Pending", receiptNo: "RCP-20260603-009" },
  { id: "TXN-0088", memberId: "MBR-0033", member: "Elder Abena Osei", ministry: "Prayer Team", type: "Tithe", channel: "Bank Transfer", amount: 85, currency: "USD", ghsEquiv: 1275, date: "Jun 3, 2026", time: "04:11 PM", status: "Completed", receiptNo: "RCP-20260603-008" },
  { id: "TXN-0087", memberId: "MBR-0055", member: "Sis. Ama Boateng", ministry: "Children's", type: "Fundraising", channel: "Card", amount: 300, currency: "GHS", date: "Jun 3, 2026", time: "02:45 PM", status: "Failed", receiptNo: "RCP-20260603-007", failureReason: "Insufficient funds" },
  { id: "TXN-0086", memberId: "MBR-0011", member: "Deacon Kofi Mensah", ministry: "All Members", type: "Offering", channel: "Cash", amount: 150, currency: "GHS", date: "Jun 2, 2026", time: "11:00 AM", status: "Completed", receiptNo: "RCP-20260602-012" },
  { id: "TXN-0085", memberId: "MBR-0029", member: "Sis. Akosua Darko", ministry: "Media", type: "Tithe", channel: "MoMo", amount: 800, currency: "GHS", date: "Jun 2, 2026", time: "09:05 AM", status: "Completed", receiptNo: "RCP-20260602-011", flagged: true, notes: "Flagged for reconciliation check" },
  { id: "TXN-0084", memberId: "MBR-0064", member: "Bro. Emmanuel Ofori", ministry: "Youth", type: "Tithe", channel: "MoMo", amount: 400, currency: "GHS", date: "Jun 1, 2026", time: "10:30 AM", status: "Completed", receiptNo: "RCP-20260601-018" },
  { id: "TXN-0083", memberId: "MBR-0048", member: "Sis. Patience Agyemang", ministry: "Choir", type: "Seed", channel: "Card", amount: 50, currency: "GBP", ghsEquiv: 800, date: "Jun 1, 2026", time: "08:14 AM", status: "Completed", receiptNo: "RCP-20260601-017" },
  { id: "TXN-0082", memberId: "MBR-0037", member: "Elder Joseph Antwi", ministry: "All Members", type: "Offering", channel: "Cheque", amount: 2000, currency: "GHS", date: "May 31, 2026", time: "06:00 PM", status: "Pending", receiptNo: "RCP-20260531-022" },
  { id: "TXN-0081", memberId: "MBR-0019", member: "Sis. Nana Ama", ministry: "Children's", type: "Tithe", channel: "MoMo", amount: 600, currency: "GHS", date: "May 31, 2026", time: "03:22 PM", status: "Refunded", receiptNo: "RCP-20260531-021" },
  { id: "TXN-0080", memberId: "MBR-0082", member: "Bro. Richard Kumi", ministry: "All Members", type: "Fundraising", channel: "Card", amount: 500, currency: "GHS", date: "May 30, 2026", time: "01:45 PM", status: "Completed", receiptNo: "RCP-20260530-015" },
];

const AVATAR_COLORS: Record<string, string> = {
  "Dr. Kwame Asante": "#2D1B69",
  "Sis. Grace Mensah": BRAND,
  "Bro. Yaw Amponsah": "#0A4A3A",
  "Elder Abena Osei": "#7C3AED",
  "Sis. Ama Boateng": "#B45309",
  "Deacon Kofi Mensah": "#2D1B69",
  "Sis. Akosua Darko": "#DB2777",
  "Bro. Emmanuel Ofori": "#0A4A3A",
  "Sis. Patience Agyemang": BRAND,
  "Elder Joseph Antwi": "#2D1B69",
  "Sis. Nana Ama": "#7C3AED",
  "Bro. Richard Kumi": "#B45309",
};

export function initials(name: string) {
  return name.split(" ").filter(w => w.length > 2).slice(0, 2).map(w => w[0]).join("");
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function typeStyle(t: TxType) {
  const m: Record<TxType, { color: string; bg: string }> = {
    Tithe: { color: "#0D9488", bg: "rgba(13,148,136,0.09)" },
    Offering: { color: "#2563EB", bg: "rgba(37,99,235,0.09)" },
    Seed: { color: "#92610A", bg: "rgba(200,134,10,0.10)" },
    Fundraising: { color: BRAND, bg: "rgba(200,134,10,0.13)" },
    "Ticket Purchase": { color: "#7C3AED", bg: "rgba(124,58,237,0.09)" },
    "Event Fee": { color: "#DB2777", bg: "rgba(219,39,119,0.09)" },
  };
  return m[t];
}

export function statusStyle(s: TxStatus) {
  if (s === "Completed") return { color: "#0A4A3A", bg: "rgba(10,74,58,0.09)" };
  if (s === "Pending") return { color: "#92610A", bg: "rgba(200,134,10,0.10)" };
  if (s === "Failed") return { color: "#B91C1C", bg: "rgba(185,28,28,0.09)" };
  return { color: "#6B7280", bg: "#F3F4F6" };
}

export function channelIcon(ch: TxChannel) {
  const icons: Record<TxChannel, React.ReactNode> = {
    MoMo: <Smartphone size={14} />,
    Card: <CreditCard size={14} />,
    Cash: <Banknote size={14} />,
    Cheque: <Receipt size={14} />,
    "Bank Transfer": <Landmark size={14} />,
  };
  return icons[ch];
}

// ─── Atoms ────────────────────────────────────────────────────────────────────

function Pill({ children, color, bg }: { children: React.ReactNode; color: string; bg: string }) {
  return (
    <span style={{ background: bg, color, fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 99, display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

function Avatar({ name, size = 28 }: { name: string; size?: number }) {
  const color = AVATAR_COLORS[name] ?? BRAND;
  return (
    <div style={{ width: size, height: size, borderRadius: 99, background: `${color}20`, border: `1.5px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontFamily: "var(--font-label)", fontSize: size * 0.33, fontWeight: 700, color }}>{initials(name)}</span>
    </div>
  );
}

function OutlineBtn({ children, onClick, icon, small }: { children: React.ReactNode; onClick?: () => void; icon?: React.ReactNode; small?: boolean }) {
  return (
    <button onClick={onClick} style={{ background: "transparent", color: DARK, fontFamily: "var(--font-label)", fontSize: small ? 12 : 13, fontWeight: 600, padding: small ? "6px 13px" : "8px 16px", borderRadius: 99, border: "1.5px solid #D1D5DB", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
      {icon}{children}
    </button>
  );
}

function DarkBtn({ children, onClick, icon, small }: { children: React.ReactNode; onClick?: () => void; icon?: React.ReactNode; small?: boolean }) {
  return (
    <button onClick={onClick} style={{ background: DARK, color: "#fff", fontFamily: "var(--font-label)", fontSize: small ? 12 : 13, fontWeight: 600, padding: small ? "6px 13px" : "8px 17px", borderRadius: 99, border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
      {icon}{children}
    </button>
  );
}

// ─── Filter Sidebar ───────────────────────────────────────────────────────────

interface Filters {
  types: TxType[];
  channels: TxChannel[];
  statuses: TxStatus[];
  search: string;
  amountMin: number;
  amountMax: number;
}

const ALL_TYPES: TxType[] = ["Tithe", "Offering", "Seed", "Fundraising", "Ticket Purchase", "Event Fee"];
const ALL_CHANNELS: TxChannel[] = ["MoMo", "Card", "Cash", "Cheque", "Bank Transfer"];
const ALL_STATUSES: TxStatus[] = ["Completed", "Pending", "Failed", "Refunded"];
const QUICK_DATES = ["Today", "This Week", "This Month", "Custom"];

function CheckRow<T extends string>({ label, active, onToggle }: { label: T; active: boolean; onToggle: () => void }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
      <div onClick={onToggle} style={{ width: 15, height: 15, borderRadius: 4, border: `1.5px solid ${active ? BRAND : "#D1D5DB"}`, background: active ? BRAND : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {active && <Check size={9} color="#fff" strokeWidth={3} />}
      </div>
      <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#374151" }}>{label}</span>
    </label>
  );
}

function FilterSidebar({ filters, onChange }: { filters: Filters; onChange: (f: Filters) => void }) {
  const [activeQuick, setActiveQuick] = useState("This Month");

  function toggle<T extends string>(key: keyof Filters, val: T) {
    const arr = filters[key] as T[];
    onChange({ ...filters, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] });
  }

  function reset() {
    onChange({ types: [], channels: [], statuses: [], search: "", amountMin: 0, amountMax: 10000 });
  }

  return (
    <aside style={{ width: 220, minWidth: 220, background: "#fff", borderRight: "1px solid #EBEBEB", display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "18px 16px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontFamily: "var(--font-label)", fontWeight: 700, fontSize: 14, color: DARK }}>Filters</span>
          <button onClick={reset} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: BRAND, fontFamily: "var(--font-label)", fontWeight: 600 }}>Reset</button>
        </div>

        {/* Date range */}
        <FilterSection label="Date Range">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
            {QUICK_DATES.map(d => (
              <button key={d} onClick={() => setActiveQuick(d)}
                style={{ padding: "4px 10px", borderRadius: 99, border: `1.5px solid ${activeQuick === d ? BRAND : "#E5E7EB"}`, background: activeQuick === d ? `rgba(200,134,10,0.08)` : "transparent", fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 600, color: activeQuick === d ? BRAND : "#6B7280", cursor: "pointer" }}>
                {d}
              </button>
            ))}
          </div>
          <input type="date" style={inputSm} placeholder="From" />
          <input type="date" style={{ ...inputSm, marginTop: 6 }} placeholder="To" />
        </FilterSection>

        {/* Type */}
        <FilterSection label="Transaction Type">
          {ALL_TYPES.map(t => <CheckRow key={t} label={t} active={filters.types.includes(t)} onToggle={() => toggle("types", t)} />)}
        </FilterSection>

        {/* Channel */}
        <FilterSection label="Channel">
          {ALL_CHANNELS.map(ch => <CheckRow key={ch} label={ch} active={filters.channels.includes(ch)} onToggle={() => toggle("channels", ch)} />)}
        </FilterSection>

        {/* Status */}
        <FilterSection label="Status">
          {ALL_STATUSES.map(s => <CheckRow key={s} label={s} active={filters.statuses.includes(s)} onToggle={() => toggle("statuses", s)} />)}
        </FilterSection>

        {/* Amount range */}
        <FilterSection label="Amount Range">
          <div style={{ display: "flex", gap: 8 }}>
            <input type="number" placeholder="Min" style={{ ...inputSm, width: "50%" }} />
            <input type="number" placeholder="Max" style={{ ...inputSm, width: "50%" }} />
          </div>
          <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>GHS 0 → GHS 10,000+</div>
        </FilterSection>

        <div style={{ paddingBottom: 20 }}>
          <DarkBtn>Apply Filters</DarkBtn>
        </div>
      </div>
    </aside>
  );
}

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{children}</div>
    </div>
  );
}

const inputSm: React.CSSProperties = {
  border: "1.5px solid #E5E7EB", borderRadius: 7, padding: "6px 9px", fontSize: 12,
  fontFamily: "var(--font-label)", color: "#374151", outline: "none", width: "100%", background: "#FAFAFA", boxSizing: "border-box",
};

// ─── Transaction Detail Panel ─────────────────────────────────────────────────

function DetailPanel({ tx, onClose }: { tx: Transaction; onClose: () => void }) {
  const [notes, setNotes] = useState(tx.notes ?? "");
  const [flagged, setFlagged] = useState(tx.flagged ?? false);
  const ss = statusStyle(tx.status);
  const ts = typeStyle(tx.type);
  const color = AVATAR_COLORS[tx.member] ?? BRAND;

  return (
    <div style={{ width: 320, minWidth: 320, background: "#fff", borderLeft: "1px solid #EBEBEB", display: "flex", flexDirection: "column", overflowY: "auto", flexShrink: 0 }}>
      {/* Header */}
      <div style={{ padding: "16px 18px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <span style={{ fontFamily: "var(--font-label)", fontSize: 14, fontWeight: 700, color: DARK }}>Transaction Detail</span>
        <button onClick={onClose} style={{ background: "#F3F4F6", border: "none", borderRadius: 99, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <X size={13} color="#374151" />
        </button>
      </div>

      <div style={{ padding: "18px", flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>
        {/* Member */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 46, height: 46, borderRadius: 99, background: `${color}20`, border: `2px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontFamily: "var(--font-label)", fontSize: 15, fontWeight: 700, color }}>{initials(tx.member)}</span>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-label)", fontSize: 15, fontWeight: 700, color: DARK }}>{tx.member}</div>
            <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>{tx.memberId}</div>
          </div>
        </div>

        {/* Amount */}
        <div style={{ background: BG, borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Amount</div>
          <div style={{ fontFamily: "var(--font-label)", fontSize: 34, fontWeight: 800, color: DARK }}>
            {tx.currency !== "GHS" && <span style={{ fontSize: 14, color: "#9CA3AF", marginRight: 4 }}>{tx.currency}</span>}
            {tx.currency !== "GHS" ? tx.amount : `GHS ${tx.amount.toLocaleString()}`}
          </div>
          {tx.ghsEquiv && (
            <div style={{ fontFamily: "var(--font-label)", fontSize: 12, color: BRAND, marginTop: 2 }}>≈ GHS {tx.ghsEquiv.toLocaleString()}</div>
          )}
          <div style={{ marginTop: 10, display: "flex", justifyContent: "center", gap: 8 }}>
            <Pill color={ts.color} bg={ts.bg}>{tx.type}</Pill>
            <Pill color={ss.color} bg={ss.bg}>{tx.status}</Pill>
          </div>
        </div>

        {/* Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "Transaction ID", value: tx.id, copy: true },
            { label: "Channel", value: <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>{channelIcon(tx.channel)} {tx.channel}</span> },
            { label: "Ministry", value: tx.ministry },
            { label: "Date & Time", value: `${tx.date} · ${tx.time}` },
            { label: "Status", value: tx.status },
          ].map(r => (
            <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#9CA3AF" }}>{r.label}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 500, color: DARK }}>{r.value}</span>
                {r.copy && (
                  <button title="Copy" style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "#9CA3AF" }}>
                    <Copy size={11} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: "#F3F4F6" }} />

        {/* Receipt */}
        <div>
          <div style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 10 }}>Receipt</div>
          <div style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#9CA3AF", marginBottom: 10 }}>#{tx.receiptNo}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <OutlineBtn small icon={<FileText size={12} />}>Download PDF</OutlineBtn>
            <OutlineBtn small icon={<FileText size={12} />}>Send Receipt</OutlineBtn>
          </div>
        </div>

        {/* Failure reason */}
        {tx.status === "Failed" && tx.failureReason && (
          <div style={{ background: "rgba(185,28,28,0.06)", borderRadius: 10, padding: "12px 14px", border: "1px solid rgba(185,28,28,0.15)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <AlertTriangle size={13} color="#B91C1C" />
              <span style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 700, color: "#B91C1C" }}>Failure Reason</span>
            </div>
            <div style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#B91C1C", marginBottom: 10 }}>{tx.failureReason}</div>
            <button style={{ display: "flex", alignItems: "center", gap: 6, background: "#B91C1C", color: "#fff", border: "none", borderRadius: 99, padding: "6px 14px", fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              <RefreshCcw size={11} />Retry Transaction
            </button>
          </div>
        )}

        {/* Pending cash action */}
        {tx.status === "Pending" && (tx.channel === "Cash" || tx.channel === "Cheque") && (
          <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "rgba(10,74,58,0.08)", color: "#0A4A3A", border: "1.5px solid rgba(10,74,58,0.2)", borderRadius: 99, padding: "8px 0", fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            <Check size={14} />Mark as Received
          </button>
        )}

        <div style={{ height: 1, background: "#F3F4F6" }} />

        {/* Notes */}
        <div>
          <div style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 8 }}>Internal Notes</div>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            placeholder="Add a note for the finance team…"
            style={{ border: "1.5px solid #E5E7EB", borderRadius: 9, padding: "8px 10px", fontSize: 12, fontFamily: "var(--font-label)", color: "#374151", width: "100%", resize: "vertical", outline: "none", background: "#FAFAFA", boxSizing: "border-box" }}
          />
        </div>

        {/* Flag toggle */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: flagged ? "rgba(185,28,28,0.05)" : "#F9FAFB", borderRadius: 10, border: `1.5px solid ${flagged ? "rgba(185,28,28,0.2)" : "#E5E7EB"}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Flag size={13} color={flagged ? "#B91C1C" : "#9CA3AF"} />
            <div>
              <div style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: flagged ? "#B91C1C" : "#374151" }}>Flag for Review</div>
              <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>Notify finance team</div>
            </div>
          </div>
          <button onClick={() => setFlagged(!flagged)} style={{ background: "none", border: "none", cursor: "pointer", color: flagged ? "#B91C1C" : "#9CA3AF", padding: 0 }}>
            {flagged ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
          </button>
        </div>

        {/* Audit */}
        <div>
          <div style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 8 }}>Audit Trail</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { action: "Transaction created", time: `${tx.date} · ${tx.time}`, by: "System" },
              { action: "Receipt generated", time: `${tx.date} · ${tx.time}`, by: "System" },
            ].map((a, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#374151" }}>{a.action}</div>
                  <div style={{ fontFamily: "var(--font-label)", fontSize: 10, color: "#9CA3AF" }}>by {a.by}</div>
                </div>
                <span style={{ fontFamily: "var(--font-label)", fontSize: 10, color: "#9CA3AF" }}>{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Manual Entry Modal ───────────────────────────────────────────────────────

function ManualEntryModal({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(3px)" }} />
      <div style={{ position: "relative", background: "#fff", borderRadius: 18, padding: "26px 28px", width: "min(500px, 90vw)", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <span style={{ fontFamily: "var(--font-label)", fontSize: 16, fontWeight: 700, color: DARK }}>Log Cash / Cheque</span>
          <button onClick={onClose} style={{ background: "#F3F4F6", border: "none", borderRadius: 99, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={13} />
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { label: "Member Name", type: "text", placeholder: "Search member…" },
            { label: "Amount (GHS)", type: "number", placeholder: "0.00" },
          ].map(f => (
            <div key={f.label}>
              <label style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{f.label}</label>
              <input type={f.type} placeholder={f.placeholder} style={{ border: "1.5px solid #E5E7EB", borderRadius: 9, padding: "9px 12px", fontSize: 13, fontFamily: "var(--font-label)", color: "#374151", outline: "none", width: "100%", boxSizing: "border-box" as const }} />
            </div>
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Type</label>
              <select style={{ border: "1.5px solid #E5E7EB", borderRadius: 9, padding: "9px 10px", fontSize: 13, fontFamily: "var(--font-label)", color: "#374151", outline: "none", width: "100%" }}>
                {ALL_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Channel</label>
              <select style={{ border: "1.5px solid #E5E7EB", borderRadius: 9, padding: "9px 10px", fontSize: 13, fontFamily: "var(--font-label)", color: "#374151", outline: "none", width: "100%" }}>
                <option>Cash</option><option>Cheque</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Date</label>
            <input type="date" style={{ border: "1.5px solid #E5E7EB", borderRadius: 9, padding: "9px 12px", fontSize: 13, fontFamily: "var(--font-label)", color: "#374151", outline: "none", width: "100%", boxSizing: "border-box" as const }} />
          </div>
          <div>
            <label style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Notes</label>
            <textarea rows={2} placeholder="Optional internal notes…" style={{ border: "1.5px solid #E5E7EB", borderRadius: 9, padding: "9px 12px", fontSize: 13, fontFamily: "var(--font-label)", color: "#374151", outline: "none", width: "100%", resize: "vertical", boxSizing: "border-box" as const }} />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
            <OutlineBtn onClick={onClose}>Cancel</OutlineBtn>
            <DarkBtn>Log Transaction</DarkBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sort Icon ────────────────────────────────────────────────────────────────

function SortIcon({ col, sort }: { col: string; sort: { col: string; dir: "asc" | "desc" } }) {
  if (sort.col !== col) return <ChevronUp size={12} color="#D1D5DB" />;
  return sort.dir === "asc" ? <ChevronUp size={12} color={BRAND} /> : <ChevronDown size={12} color={BRAND} />;
}

// ─── Transactions Page ────────────────────────────────────────────────────────

type SortCol = "member" | "type" | "channel" | "amount" | "date" | "status";

export function TransactionsPage() {
  const [filters, setFilters] = useState<Filters>({ types: [], channels: [], statuses: [], search: "", amountMin: 0, amountMax: 10000 });
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [sort, setSort] = useState<{ col: SortCol; dir: "asc" | "desc" }>({ col: "date", dir: "desc" });
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(25);
  const [page, setPage] = useState(1);
  const [showManual, setShowManual] = useState(false);
  const [reconcile, setReconcile] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(true);

  const visible = useMemo(() => {
    let rows = [...TRANSACTIONS];
    if (search) rows = rows.filter(t => t.member.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase()));
    if (filters.types.length) rows = rows.filter(t => filters.types.includes(t.type));
    if (filters.channels.length) rows = rows.filter(t => filters.channels.includes(t.channel));
    if (filters.statuses.length) rows = rows.filter(t => filters.statuses.includes(t.status));
    rows.sort((a, b) => {
      let v = 0;
      if (sort.col === "amount") v = a.amount - b.amount;
      else if (sort.col === "member") v = a.member.localeCompare(b.member);
      else if (sort.col === "status") v = a.status.localeCompare(b.status);
      else if (sort.col === "type") v = a.type.localeCompare(b.type);
      else v = a.id.localeCompare(b.id);
      return sort.dir === "asc" ? v : -v;
    });
    return rows;
  }, [search, filters, sort]);

  const pageRows = visible.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.max(1, Math.ceil(visible.length / perPage));

  function toggleSort(col: SortCol) {
    setSort(s => s.col === col ? { col, dir: s.dir === "asc" ? "desc" : "asc" } : { col, dir: "asc" });
  }

  function toggleRow(id: string) {
    setSelectedRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const stats = [
    {
      label: "Today's Volume",
      value: "GHS 4,200",
      icon: <Wallet size={18} />,
      accent: DARK,
      trend: <span style={{ display: "inline-flex", alignItems: "center", gap: 3, color: "#15803D", fontWeight: 700 }}><ArrowUpRight size={12} /> 12% vs yesterday</span>,
    },
    {
      label: "This Week",
      value: "GHS 18,700",
      icon: <TrendingUp size={18} />,
      accent: BRAND,
      trend: <span style={{ display: "inline-flex", alignItems: "center", gap: 3, color: "#15803D", fontWeight: 700 }}><ArrowUpRight size={12} /> 8% vs last week</span>,
    },
    {
      label: "Pending",
      value: "3",
      icon: <Clock size={18} />,
      accent: "#B45309",
      trend: <span style={{ color: "#9CA3AF" }}>Awaiting confirmation</span>,
    },
    {
      label: "Failed",
      value: "1",
      icon: <XCircle size={18} />,
      accent: "#B91C1C",
      trend: <span style={{ display: "inline-flex", alignItems: "center", gap: 3, color: "#B91C1C", fontWeight: 700 }}><ArrowDownRight size={12} /> 2 fewer this week</span>,
    },
  ];

  const COLS: { key: SortCol | ""; label: string; sortable?: boolean; width?: number }[] = [
    { key: "", label: "", width: 36 },
    { key: "member", label: "Member", sortable: true },
    { key: "", label: "Ministry", width: 110 },
    { key: "type", label: "Type", sortable: true, width: 120 },
    { key: "channel", label: "Channel", width: 120 },
    { key: "amount", label: "Amount", sortable: true, width: 110 },
    { key: "", label: "Date & Time", width: 160 },
    { key: "status", label: "Status", sortable: true, width: 110 },
    { key: "", label: "", width: 80 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: BG }}>
      {/* ── Top bar ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #EBEBEB", padding: "18px 24px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 26, fontWeight: 700, color: DARK, margin: 0 }}>Transactions</h1>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {selectedRows.size > 0 && (
              <div style={{ display: "flex", gap: 6, alignItems: "center", background: `rgba(200,134,10,0.08)`, borderRadius: 99, padding: "5px 14px", border: `1px solid rgba(200,134,10,0.2)` }}>
                <span style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: BRAND }}>{selectedRows.size} selected</span>
                <span style={{ color: "#D1D5DB" }}>·</span>
                <button style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: BRAND, background: "none", border: "none", cursor: "pointer" }}>Export</button>
                <button style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: BRAND, background: "none", border: "none", cursor: "pointer" }}>Send Receipts</button>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#6B7280" }}>Reconcile</span>
              <button onClick={() => setReconcile(!reconcile)} style={{ background: "none", border: "none", cursor: "pointer", color: reconcile ? BRAND : "#9CA3AF", padding: 0 }}>
                {reconcile ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
              </button>
            </div>
            <OutlineBtn icon={<Download size={13} />}>Export CSV</OutlineBtn>
            <OutlineBtn icon={<Download size={13} />}>Export PDF</OutlineBtn>
            <DarkBtn icon={<Plus size={14} />} onClick={() => setShowManual(true)}>Log Cash / Cheque</DarkBtn>
          </div>
        </div>

      </div>

      {/* ── Summary cards ── */}
      <div style={{ padding: "18px 24px 0", flexShrink: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ background: "#fff", border: "1px solid #EDEAE6", borderRadius: 16, padding: "16px 18px", boxShadow: "0 1px 2px rgba(15,23,41,0.04)", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: "#9CA3AF" }}>{s.label}</span>
                <div style={{ width: 38, height: 38, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: `${s.accent}14` }}>
                  <span style={{ color: s.accent }}>{s.icon}</span>
                </div>
              </div>
              <div style={{ fontFamily: "var(--font-label)", fontSize: 24, fontWeight: 800, color: s.accent === "#B91C1C" ? s.accent : DARK, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{s.value}</div>
              <div style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#9CA3AF" }}>{s.trend}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Filter sidebar */}
        {showFilters && (
          <FilterSidebar filters={filters} onChange={setFilters} />
        )}

        {/* Table area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Table toolbar */}
          <div style={{ padding: "12px 18px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #EBEBEB", background: "#fff", flexShrink: 0 }}>
            <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
              <Search size={14} color="#9CA3AF" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search member or ID…"
                style={{ border: "1.5px solid #E5E7EB", borderRadius: 99, padding: "7px 10px 7px 32px", fontSize: 13, fontFamily: "var(--font-label)", color: "#374151", outline: "none", width: "100%", background: "#FAFAFA" }} />
            </div>
            <button onClick={() => setShowFilters(f => !f)}
              style={{ display: "flex", alignItems: "center", gap: 5, background: showFilters ? `rgba(200,134,10,0.07)` : "#F3F4F6", border: `1.5px solid ${showFilters ? BRAND : "#E5E7EB"}`, borderRadius: 99, padding: "7px 13px", fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: showFilters ? BRAND : "#374151", cursor: "pointer" }}>
              <SlidersHorizontal size={13} />Filters
            </button>
            {/* Live indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
              <div style={{ position: "relative" }}>
                <div style={{ width: 8, height: 8, borderRadius: 99, background: "#22C55E" }} />
                <div style={{ position: "absolute", inset: -2, borderRadius: 99, background: "rgba(34,197,94,0.3)", animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite" }} />
              </div>
              <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#22C55E", fontWeight: 600 }}>Live</span>
              <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>· Updated just now</span>
            </div>
            {/* Per page */}
            <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
              style={{ border: "1.5px solid #E5E7EB", borderRadius: 8, padding: "6px 8px", fontSize: 12, fontFamily: "var(--font-label)", color: "#374151", outline: "none", background: "#FAFAFA", cursor: "pointer" }}>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
            </select>
          </div>

          {/* Table */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ position: "sticky", top: 0, zIndex: 10, background: "#FAFAFA", borderBottom: "2px solid #EBEBEB" }}>
                <tr>
                  <th style={{ padding: "10px 14px", width: 36 }}>
                    <input type="checkbox" onChange={e => {
                      if (e.target.checked) setSelectedRows(new Set(pageRows.map(r => r.id)));
                      else setSelectedRows(new Set());
                    }} checked={selectedRows.size === pageRows.length && pageRows.length > 0} />
                  </th>
                  {COLS.slice(1).map(col => (
                    <th key={col.label + col.key}
                      onClick={col.sortable ? () => toggleSort(col.key as SortCol) : undefined}
                      style={{ padding: "10px 14px", textAlign: "left", fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap", cursor: col.sortable ? "pointer" : "default", width: col.width, userSelect: "none" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        {col.label}
                        {col.sortable && <SortIcon col={col.key} sort={sort} />}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.map(tx => {
                  const ss = statusStyle(tx.status);
                  const ts = typeStyle(tx.type);
                  const isSelected = selected?.id === tx.id;
                  const isChecked = selectedRows.has(tx.id);
                  const isReconcileFlag = reconcile && tx.flagged;

                  return (
                    <tr key={tx.id}
                      onClick={() => setSelected(isSelected ? null : tx)}
                      style={{
                        borderBottom: "1px solid #F3F4F6",
                        background: isSelected ? "rgba(200,134,10,0.04)" : isReconcileFlag ? "rgba(185,28,28,0.03)" : "#fff",
                        cursor: "pointer",
                        transition: "background 0.1s",
                        borderLeft: tx.isNew ? "3px solid #22C55E" : isReconcileFlag ? "3px solid #B91C1C" : "3px solid transparent",
                      }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "#F9F8F4"; }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = isReconcileFlag ? "rgba(185,28,28,0.03)" : "#fff"; }}
                    >
                      <td style={{ padding: "11px 14px" }} onClick={e => e.stopPropagation()}>
                        <input type="checkbox" checked={isChecked} onChange={() => toggleRow(tx.id)} />
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Avatar name={tx.member} size={30} />
                          <div>
                            <div style={{ fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 600, color: DARK }}>{tx.member}</div>
                            <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>{tx.memberId}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <Pill color="#374151" bg="#F3F4F6">{tx.ministry}</Pill>
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <Pill color={ts.color} bg={ts.bg}>{tx.type}</Pill>
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "#374151" }}>{channelIcon(tx.channel)} {tx.channel}</span>
                      </td>
                      <td style={{ padding: "11px 14px", textAlign: "right" }}>
                        <div style={{ fontFamily: "var(--font-label)", fontSize: 14, fontWeight: 700, color: DARK }}>
                          {tx.currency !== "GHS" && <span style={{ fontSize: 10, color: "#9CA3AF", marginRight: 2 }}>{tx.currency}</span>}
                          {tx.currency !== "GHS" ? tx.amount : `GHS ${tx.amount.toLocaleString()}`}
                        </div>
                        {tx.ghsEquiv && <div style={{ fontFamily: "var(--font-label)", fontSize: 10, color: BRAND }}>≈ GHS {tx.ghsEquiv.toLocaleString()}</div>}
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <div style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#374151" }}>{tx.date}</div>
                        <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "#9CA3AF" }}>{tx.time}</div>
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <Pill color={ss.color} bg={ss.bg}>{tx.status}</Pill>
                      </td>
                      <td style={{ padding: "11px 14px" }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: "flex", gap: 4 }}>
                          {[
                            { icon: <Eye size={12} />, label: "View", action: () => setSelected(tx) },
                            { icon: <FileText size={12} />, label: "Receipt" },
                            { icon: <Flag size={12} />, label: "Flag" },
                          ].map(btn => (
                            <button key={btn.label} title={btn.label} onClick={btn.action}
                              style={{ width: 26, height: 26, borderRadius: 6, border: "1.5px solid #E5E7EB", background: "#FAFAFA", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#9CA3AF" }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = BRAND; e.currentTarget.style.color = BRAND; }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.color = "#9CA3AF"; }}>
                              {btn.icon}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ padding: "12px 18px", borderTop: "1px solid #EBEBEB", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "#9CA3AF" }}>
              Showing {Math.min(visible.length, (page - 1) * perPage + 1)}–{Math.min(visible.length, page * perPage)} of {visible.length} transactions
            </span>
            <div style={{ display: "flex", gap: 4 }}>
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                style={{ width: 30, height: 30, borderRadius: 8, border: "1.5px solid #E5E7EB", background: page === 1 ? "#F9FAFB" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: page === 1 ? "default" : "pointer", color: page === 1 ? "#D1D5DB" : "#374151" }}>
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  style={{ width: 30, height: 30, borderRadius: 8, border: `1.5px solid ${p === page ? BRAND : "#E5E7EB"}`, background: p === page ? BRAND : "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontFamily: "var(--font-label)", fontSize: 13, fontWeight: p === page ? 700 : 400, color: p === page ? "#fff" : "#374151" }}>
                  {p}
                </button>
              ))}
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                style={{ width: 30, height: 30, borderRadius: 8, border: "1.5px solid #E5E7EB", background: page === totalPages ? "#F9FAFB" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: page === totalPages ? "default" : "pointer", color: page === totalPages ? "#D1D5DB" : "#374151" }}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Detail panel */}
        {selected && <DetailPanel tx={selected} onClose={() => setSelected(null)} />}
      </div>

      {/* Manual entry modal */}
      {showManual && <ManualEntryModal onClose={() => setShowManual(false)} />}

      {/* Live pulse animation */}
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
