import { useEffect, useState, useMemo, useRef } from "react";
import {
  Search, ChevronDown, ChevronLeft, ChevronRight, Plus, MoreHorizontal,
  Users, UserCheck, UserPlus, Cake, X, SlidersHorizontal,
  Pencil, PhoneCall, Trash2, User,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast, Toaster } from "sonner";
import { members as seedMembers, type Member } from "./mock-data";
import { MemberDetail } from "./member-detail";
import { AddMemberModal } from "./add-member-modal";

// ─── Design tokens (match dashboard) ─────────────────────────────────────────
const GOLD        = "#C8860A";
const INK         = "#1A1A1A";
const BODY        = "#4B5563";
const MUTED       = "#9CA3AF";
const BORDER      = "#E8E4DE";
const BORDER_SOFT = "#EDEAE6";
const SURFACE     = "#F5F4EF";
const GREEN       = "#0A7A4A";
const FONT        = "var(--font-label)";

const MINISTRIES = ["Choir", "Ushering", "Prayer Team", "Media & Tech", "Youth Ministry", "Evangelism", "Children's Ministry", "Welfare Committee", "Men's Fellowship", "Women's Fellowship"];
const STATUSES: Member["status"][] = ["Active", "Inactive", "First-timer"];
const PAGE_SIZES = [8, 16, 24];

// ─── Loading skeleton primitives ─────────────────────────────────────────────
function Skeleton({ w, h = 12, radius = 6, inline = false }: { w: number | string; h?: number; radius?: number; inline?: boolean }) {
  return (
    <span
      className="block"
      style={{
        width: typeof w === "number" ? `${w}px` : w,
        height: `${h}px`,
        borderRadius: `${radius}px`,
        background: "linear-gradient(90deg, #EFECE7 25%, #F7F5F1 37%, #EFECE7 63%)",
        backgroundSize: "400% 100%",
        display: inline ? "inline-block" : "block",
        animation: "memberSkeleton 1.4s ease infinite",
      }}
    />
  );
}

function CardSkeletons() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl p-5 flex items-center gap-4" style={{ background: "#FFFFFF", border: `1px solid ${BORDER_SOFT}` }}>
          <div className="w-10 h-10 rounded-lg" style={{ background: "#EFECE7" }} />
          <div className="flex-1 space-y-2">
            <Skeleton w={90} h={10} />
            <Skeleton w={60} h={30} />
          </div>
        </div>
      ))}
    </div>
  );
}

function RowSkeletons({ count = 5 }: { count?: number }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="grid px-6 py-4 items-center gap-4" style={{ gridTemplateColumns: "2.4fr 1.4fr 1.4fr 1fr 1fr 32px", borderBottom: `1px solid ${BORDER_SOFT}` }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full" style={{ background: "#EFECE7" }} />
            <div className="space-y-2">
              <Skeleton w={140} h={11} />
              <Skeleton w={170} h={9} />
            </div>
          </div>
          <Skeleton w={120} h={12} />
          <Skeleton w={90} h={12} />
          <Skeleton w={80} h={12} />
          <Skeleton w={70} h={22} radius={11} />
          <div />
        </div>
      ))}
    </div>
  );
}

// ─── Summary cards ───────────────────────────────────────────────────────────
function SummaryCard({ value, label, sub, icon: Icon, color, iconColor }: {
  value: string; label: string; sub?: string; icon: React.ElementType; color: string; iconColor: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl p-5 flex items-center gap-4 transition-shadow hover:shadow-sm"
      style={{ background: "#FFFFFF", border: `1px solid ${BORDER_SOFT}` }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: color }}
      >
        <Icon size={20} style={{ color: iconColor }} />
      </div>
      <div className="min-w-0">
        <div style={{ fontSize: "28px", fontWeight: 700, color: INK, fontFamily: FONT, lineHeight: 1.1 }}>
          {value}
        </div>
        <div style={{ fontSize: "12.5px", color: BODY, fontFamily: FONT, marginTop: "2px" }}>{label}</div>
        {sub && (
          <div style={{ fontSize: "11.5px", color: MUTED, fontFamily: FONT, marginTop: "2px" }}>{sub}</div>
        )}
      </div>
    </motion.div>
  );
}

function SummaryCards() {
  const cards = [
    { value: "1,248", label: "Total Members", icon: Users, color: "rgba(200,134,10,0.10)", iconColor: GOLD, sub: undefined },
    { value: "1,102", label: "Active Members", icon: UserCheck, color: "rgba(10,122,74,0.10)", iconColor: GREEN, sub: undefined },
    { value: "34", label: "New This Month", icon: UserPlus, color: "rgba(200,134,10,0.10)", iconColor: GOLD, sub: "↑ 12% from last month" },
    { value: "3", label: "Birthdays This Week", icon: Cake, color: "rgba(124,58,237,0.10)", iconColor: "#6D28D9", sub: undefined },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 px-0">
      {cards.map((c) => <SummaryCard key={c.label} {...c} />)}
    </div>
  );
}

// ─── Status badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Member["status"] }) {
  const cfg = {
    Active: { bg: "rgba(10,122,74,0.08)", dot: GREEN, text: GREEN },
    Inactive: { bg: "#F3F4F6", dot: "#9CA3AF", text: "#6B7280" },
    "First-timer": { bg: "rgba(200,134,10,0.08)", dot: GOLD, text: GOLD },
  }[status];
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: cfg.bg, border: "1px solid transparent" }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
      <span style={{ fontSize: "11px", fontWeight: 500, color: cfg.text, fontFamily: FONT }}>{status}</span>
    </span>
  );
}

// ─── Dropdown (filter) ───────────────────────────────────────────────────────
function Dropdown({ value, options, onChange, placeholder, ariaLabel }: {
  value: string; options: string[]; onChange: (v: string) => void; placeholder: string; ariaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const isFiltered = value !== "";
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl transition-all hover:bg-[#FAFAF8]"
        style={{
          background: isFiltered ? "rgba(200,134,10,0.06)" : "#FFFFFF",
          border: isFiltered ? "1px solid rgba(200,134,10,0.25)" : `1px solid ${BORDER}`,
          outline: "none",
          boxShadow: open ? "0 0 0 3px rgba(200,134,10,0.12)" : "none",
        }}
      >
        <span style={{ fontSize: "13px", color: isFiltered ? GOLD : INK, fontFamily: FONT, fontWeight: isFiltered ? 500 : 400 }}>
          {value || placeholder}
        </span>
        <ChevronDown size={13} color={isFiltered ? GOLD : MUTED} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute top-full mt-1.5 left-0 z-20 rounded-xl py-1 min-w-[180px]"
            style={{ background: "#FFFFFF", boxShadow: "0 12px 32px rgba(0,0,0,0.12)", border: `1px solid ${BORDER}` }}
          >
            <button
              onClick={() => { onChange(""); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 hover:bg-[#FAFAF8] transition-colors"
              style={{ fontSize: "13px", fontFamily: FONT, color: MUTED }}
            >
              {placeholder}
            </button>
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className="w-full text-left px-4 py-2.5 hover:bg-[#FAFAF8] transition-colors"
                style={{ fontSize: "13px", fontFamily: FONT, color: opt === value ? GOLD : INK, fontWeight: opt === value ? 600 : 400 }}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Row actions menu ────────────────────────────────────────────────────────
function RowActions({ member }: { member: Member }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Actions for ${member.name}`}
        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[#F0EEE9]"
        style={{ color: "#6B7280", outline: "none", boxShadow: open ? "0 0 0 3px rgba(200,134,10,0.15)" : "none" }}
      >
        <MoreHorizontal size={16} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setOpen(false); }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-1 z-20 rounded-xl py-1.5 min-w-[170px]"
              style={{ background: "#FFFFFF", boxShadow: "0 12px 32px rgba(0,0,0,0.14)", border: `1px solid ${BORDER}` }}
              role="menu"
            >
              {[{ icon: User, label: "View profile" }, { icon: Pencil, label: "Edit details" }, { icon: PhoneCall, label: "Call member" }, { icon: Trash2, label: "Remove member", danger: true as const }].map((item) => (
                <button
                  key={item.label}
                  role="menuitem"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                    if (item.label === "View profile") toast.info("Opening member profile…");
                    else toast.success(`${item.label} — coming soon`);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#FAFAF8] transition-colors text-left"
                  style={{
                    fontSize: "13px", fontFamily: FONT,
                    color: item.danger ? "#B3261E" : INK,
                    fontWeight: 500,
                  }}
                >
                  <item.icon size={15} style={{ color: item.danger ? "#B3261E" : MUTED }} />
                  {item.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────
function EmptyState({ onClear }: { onClear: () => void }) {
  const hasFilters = true;
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(200,134,10,0.08)" }}>
        <Search size={24} color={GOLD} />
      </div>
      <div style={{ fontSize: "16px", fontWeight: 700, color: INK, fontFamily: FONT }}>No members found</div>
      <p style={{ fontSize: "13.5px", color: MUTED, fontFamily: FONT, marginTop: "6px", maxWidth: 320 }}>
        Try adjusting your search or filters.
      </p>
      {hasFilters && (
        <button
          onClick={onClear}
          className="mt-5 flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all hover:bg-[#FAFAF8] active:scale-[0.98]"
          style={{ border: `1px solid ${BORDER}`, background: "#FFFFFF", fontSize: "13px", fontWeight: 600, color: INK, fontFamily: FONT }}
        >
          <X size={14} color={MUTED} />
          Clear filters
        </button>
      )}
    </div>
  );
}

// ─── Error state ─────────────────────────────────────────────────────────────
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "#FDF1F0" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B3261E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div style={{ fontSize: "16px", fontWeight: 700, color: INK, fontFamily: FONT }}>Unable to load members</div>
      <p style={{ fontSize: "13.5px", color: MUTED, fontFamily: FONT, marginTop: "6px", maxWidth: 320 }}>
        Something went wrong while loading your member directory.
      </p>
      <button
        onClick={onRetry}
        className="mt-5 px-5 py-2.5 rounded-xl transition-all active:scale-[0.98]"
        style={{ background: GOLD, fontSize: "13px", fontWeight: 600, color: "#FFFFFF", fontFamily: FONT }}
      >
        Try again
      </button>
    </div>
  );
}

// ─── Items per page ───────────────────────────────────────────────────────────
function ItemsPerPage({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <span style={{ fontSize: "12.5px", color: MUTED, fontFamily: FONT }}>Rows</span>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
          style={{ border: `1px solid ${BORDER}`, background: "#FFFFFF", fontSize: "12.5px", color: INK, fontFamily: FONT, fontWeight: 500 }}
        >
          {value}
          <ChevronDown size={12} color={MUTED} />
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute bottom-full mb-1 left-0 z-20 rounded-lg py-1 min-w-[70px]" style={{ background: "#FFFFFF", boxShadow: "0 10px 24px rgba(0,0,0,0.12)", border: `1px solid ${BORDER}` }}>
              {PAGE_SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => { onChange(s); setOpen(false); }}
                  className="w-full text-left px-3 py-2 hover:bg-[#FAFAF8]"
                  style={{ fontSize: "12.5px", fontFamily: FONT, color: s === value ? GOLD : INK, fontWeight: s === value ? 600 : 400 }}
                >{s}</button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export function MembersPage() {
  const [members, setMembers] = useState<Member[]>(seedMembers);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [selected, setSelected] = useState<Member | null>(null);
  const [search, setSearch] = useState("");
  const [ministryFilter, setMinistryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(PAGE_SIZES[0]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Simulated fetch to demonstrate loading / error states.
  const load = useRef(() => {});
  load.current = () => {
    setStatus("loading");
    setTimeout(() => {
      setMembers(seedMembers);
      setStatus("ready");
    }, 700);
  };

  useEffect(() => {
    load.current();
  }, []);

  const retry = () => load.current();

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const q = search.toLowerCase();
      const matchSearch = !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.phone.includes(q);
      const matchMinistry = !ministryFilter || m.ministries.includes(ministryFilter);
      const matchStatus = !statusFilter || m.status === statusFilter;
      return matchSearch && matchMinistry && matchStatus;
    });
  }, [members, search, ministryFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const hasActiveFilters = !!(search || ministryFilter || statusFilter);

  const clearFilters = () => {
    setSearch("");
    setMinistryFilter("");
    setStatusFilter("");
    setPage(1);
  };

  const resetPage = () => setPage(1);

  const handleAddMember = (member: Member) => {
    setMembers((prev) => [member, ...prev]);
    setPage(1);
    toast.success("Member added successfully.");
  };

  if (selected) {
    return <MemberDetail member={selected} onBack={() => setSelected(null)} />;
  }

  const showSearchBox = status !== "loading";

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: SURFACE }}>
      <div className="p-4 lg:p-6 space-y-4">
        {/* Content header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 700, color: INK, fontFamily: FONT }}>Members</h1>
            <p style={{ fontSize: "13px", color: MUTED, fontFamily: FONT, marginTop: "2px" }}>
              Redeemer's Chapel · All campuses
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {showSearchBox && (
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl" style={{ background: "#FFFFFF", border: `1px solid ${BORDER}` }}>
                <Search size={14} color={MUTED} />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); resetPage(); }}
                  className="bg-transparent outline-none w-40"
                  aria-label="Search members"
                  style={{ fontSize: "13px", color: INK, fontFamily: FONT }}
                />
                {search && (
                  <button onClick={() => { setSearch(""); resetPage(); }} aria-label="Clear search" className="text-[#9CA3AF] hover:text-[#1A1A1A] transition-colors">
                    <X size={14} />
                  </button>
                )}
              </div>
            )}
            <Dropdown value={ministryFilter} options={MINISTRIES} onChange={(v) => { setMinistryFilter(v); resetPage(); }} placeholder="All Ministries" ariaLabel="Filter by ministry" />
            <Dropdown value={statusFilter} options={STATUSES} onChange={(v) => { setStatusFilter(v); resetPage(); }} placeholder="All Status" ariaLabel="Filter by status" />
            <button
              onClick={() => setIsAddOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all active:scale-[0.98] hover:opacity-95"
              style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #D99A20 100%)`, boxShadow: "0 6px 16px rgba(200,134,10,0.25)" }}
            >
              <Plus size={15} color="#FFFFFF" />
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF", fontFamily: FONT }}>Add Member</span>
            </button>
          </div>
        </div>

        {/* Summary cards */}
        {status === "loading" ? <CardSkeletons /> : status === "error" ? null : <SummaryCards />}

        {/* Table card */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04)" }}>
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 px-6 py-3" style={{ borderBottom: `1px solid ${BORDER_SOFT}`, background: "#FFFFFF" }}>
            <div style={{ fontSize: "13px", color: MUTED, fontFamily: FONT }}>
              <span style={{ fontSize: "13.5px", fontWeight: 600, color: INK, fontFamily: FONT }}>{filtered.length}</span> members
              {hasActiveFilters && (
                <button onClick={clearFilters} className="ml-3 inline-flex items-center gap-1 text-[12.5px] font-medium hover:underline" style={{ color: GOLD, fontFamily: FONT }}>
                  <X size={12} color={GOLD} /> Clear filters
                </button>
              )}
            </div>
            {status !== "loading" && status !== "error" && (
              <ItemsPerPage value={perPage} onChange={(v) => { setPerPage(v); setPage(1); }} />
            )}
          </div>

          {/* Table header */}
          <div
            className="hidden md:grid px-6 py-3 gap-4"
            style={{ gridTemplateColumns: "2.4fr 1.4fr 1.4fr 1fr 1fr 48px", background: "#FAFAF8", borderBottom: `1px solid ${BORDER_SOFT}` }}
          >
            {["Member", "Contact", "Ministry", "Joined", "Status", ""].map((h) => (
              <div key={h}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: MUTED, fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</span>
              </div>
            ))}
          </div>

          {/* Body */}
          <div className="md:hidden flex items-center gap-2 px-6 py-3" style={{ background: "#FAFAF8", borderBottom: `1px solid ${BORDER_SOFT}` }}>
            <SlidersHorizontal size={13} color={MUTED} />
            <span style={{ fontSize: "11.5px", color: MUTED, fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.05em" }}>Members list</span>
          </div>

          {status === "loading" ? (
            <RowSkeletons />
          ) : status === "error" ? (
            <ErrorState onRetry={retry} />
          ) : paginated.length === 0 ? (
            <EmptyState onClear={clearFilters} />
          ) : (
            <div className="overflow-x-auto">
              <div>
                {paginated.map((member, i) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    onClick={() => setSelected(member)}
                    className="grid min-w-[760px] md:min-w-0 px-6 py-4 cursor-pointer transition-colors hover:bg-[#FAFAF8] group items-center gap-4"
                    style={{
                      gridTemplateColumns: "2.4fr 1.4fr 1.4fr 1fr 1fr 48px",
                      borderBottom: `1px solid ${BORDER_SOFT}`,
                    }}
                  >
                    {/* Member */}
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: member.avatarColor }}>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: "#fff", fontFamily: FONT }}>{member.initials}</span>
                      </div>
                      <div className="min-w-0">
                        <div style={{ fontSize: "13px", fontWeight: 600, color: INK, fontFamily: FONT }} className="truncate">{member.name}</div>
                        <div style={{ fontSize: "11px", color: MUTED, fontFamily: FONT }} className="truncate">{member.email}</div>
                      </div>
                    </div>

                    {/* Contact */}
                    <div style={{ fontSize: "13px", color: BODY, fontFamily: FONT }}>{member.phone}</div>

                    {/* Ministry */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2.5 py-1 rounded-full" style={{ background: SURFACE, fontSize: "12px", color: BODY, fontFamily: FONT }}>
                        {member.ministries[0]}
                      </span>
                      {member.ministries.length > 1 && (
                        <span style={{ fontSize: "11px", color: MUTED, fontFamily: FONT }}>+{member.ministries.length - 1}</span>
                      )}
                    </div>

                    {/* Joined */}
                    <div style={{ fontSize: "13px", color: BODY, fontFamily: FONT }}>{member.joinDate}</div>

                    {/* Status */}
                    <div><StatusBadge status={member.status} /></div>

                    {/* Actions */}
                    <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                      <RowActions member={member} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Pagination */}
          {status === "ready" && filtered.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: `1px solid ${BORDER_SOFT}` }}>
              <span style={{ fontSize: "13px", color: MUTED, fontFamily: FONT }}>
                Showing {(safePage - 1) * perPage + 1}–{Math.min(safePage * perPage, filtered.length)} of {filtered.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={safePage === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  aria-label="Previous page"
                  className="px-3 py-1.5 rounded-lg transition-colors disabled:opacity-30 hover:bg-[#FAFAF8] flex items-center gap-1"
                  style={{ fontSize: "13px", fontFamily: FONT, color: INK }}
                >
                  <ChevronLeft size={14} /> Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    aria-label={`Page ${p}`}
                    aria-current={p === safePage ? "page" : undefined}
                    className="w-8 h-8 rounded-lg transition-colors"
                    style={{ fontSize: "13px", fontFamily: FONT, background: p === safePage ? INK : "transparent", color: p === safePage ? "#fff" : INK, fontWeight: p === safePage ? 700 : 400 }}
                  >{p}</button>
                ))}
                <button
                  disabled={safePage === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  aria-label="Next page"
                  className="px-3 py-1.5 rounded-lg transition-colors disabled:opacity-30 hover:bg-[#FAFAF8] flex items-center gap-1"
                  style={{ fontSize: "13px", fontFamily: FONT, color: INK }}
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AddMemberModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAddMember}
      />
      <Toaster
        position="bottom-right"
        richColors
        toastOptions={{
          style: {
            fontFamily: FONT,
            borderRadius: "12px",
            border: `1px solid ${BORDER_SOFT}`,
            boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
          },
        }}
      />

      {/* Skeleton keyframe */}
      <style>{`@keyframes memberSkeleton { 0% { background-position: 100% 0 } 100% { background-position: 0 0 } }`}</style>
    </div>
  );
}
