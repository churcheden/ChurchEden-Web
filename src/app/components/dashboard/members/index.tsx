import { useState, useMemo } from "react";
import { Search, ChevronDown, Plus, MoreHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { toast, Toaster } from "sonner";
import { members as seedMembers, type Member } from "./mock-data";
import { MemberDetail } from "./member-detail";
import { AddMemberModal } from "./add-member-modal";

// ─── Stats strip ──────────────────────────────────────────────────────────────
function StatStrip() {
  const stats = [
    { value: "1,248", label: "Total Members" },
    { value: "1,102", label: "Active" },
    { value: "34", label: "New This Month", positive: true },
    { value: "3", label: "Birthdays This Week" },
  ];
  return (
    <div className="flex" style={{ borderBottom: "1px solid #EDEAE6" }}>
      {stats.map((s, i) => (
        <div
          key={s.label}
          className="flex-1 px-6 py-5"
          style={{ borderRight: i < stats.length - 1 ? "1px solid #EDEAE6" : "none" }}
        >
          <div className="flex items-baseline gap-2">
            <span style={{ fontSize: "34px", fontWeight: 700, color: "#1A1A1A", fontFamily: "var(--font-label)", lineHeight: 1 }}>
              {s.value}
            </span>
            {s.positive && (
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#0A7A4A", fontFamily: "var(--font-label)" }}>↑</span>
            )}
          </div>
          <div style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "var(--font-label)", marginTop: "4px" }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Member["status"] }) {
  const cfg = {
    Active: { bg: "rgba(10,122,74,0.08)", dot: "#0A7A4A", text: "#0A7A4A" },
    Inactive: { bg: "#F3F4F6", dot: "#9CA3AF", text: "#6B7280" },
    "First-timer": { bg: "rgba(200,134,10,0.08)", dot: "#C8860A", text: "#C8860A" },
  }[status];
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: cfg.bg }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
      <span style={{ fontSize: "11px", fontWeight: 500, color: cfg.text, fontFamily: "var(--font-label)" }}>{status}</span>
    </span>
  );
}

// ─── Dropdown ─────────────────────────────────────────────────────────────────
function Dropdown({ value, options, onChange, placeholder }: {
  value: string; options: string[]; onChange: (v: string) => void; placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const isFiltered = value !== "";
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl transition-colors hover:bg-gray-50"
        style={{
          background: isFiltered ? "rgba(200,134,10,0.06)" : "#FFFFFF",
          border: isFiltered ? "1px solid rgba(200,134,10,0.25)" : "1px solid #E8E4DE",
        }}
      >
        <span style={{ fontSize: "13px", color: isFiltered ? "#C8860A" : "#1A1A1A", fontFamily: "var(--font-label)", fontWeight: isFiltered ? 500 : 400 }}>
          {value || placeholder}
        </span>
        <ChevronDown size={13} color={isFiltered ? "#C8860A" : "#9CA3AF"} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1.5 left-0 z-20 rounded-xl py-1 min-w-[176px]"
            style={{ background: "#FFFFFF", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #E8E4DE" }}>
            <button
              onClick={() => { onChange(""); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors"
              style={{ fontSize: "13px", fontFamily: "var(--font-label)", color: "#9CA3AF" }}
            >
              {placeholder}
            </button>
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors"
                style={{ fontSize: "13px", fontFamily: "var(--font-label)", color: opt === value ? "#C8860A" : "#1A1A1A", fontWeight: opt === value ? 600 : 400 }}
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

const MINISTRIES = ["Choir", "Ushering", "Prayer Team", "Media & Tech", "Youth Ministry", "Evangelism", "Children's Ministry", "Welfare Committee", "Men's Fellowship", "Women's Fellowship"];
const STATUSES: Member["status"][] = ["Active", "Inactive", "First-timer"];
const PER_PAGE = 8;

// ─── Main page ────────────────────────────────────────────────────────────────
export function MembersPage() {
  const [members, setMembers] = useState<Member[]>(seedMembers);
  const [selected, setSelected] = useState<Member | null>(null);
  const [search, setSearch] = useState("");
  const [ministryFilter, setMinistryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const q = search.toLowerCase();
      const matchSearch = !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.phone.includes(q);
      const matchMinistry = !ministryFilter || m.ministries.includes(ministryFilter);
      const matchStatus = !statusFilter || m.status === statusFilter;
      return matchSearch && matchMinistry && matchStatus;
    });
  }, [members, search, ministryFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const resetPage = () => setPage(1);

  const handleAddMember = (member: Member) => {
    setMembers((prev) => [member, ...prev]);
    setPage(1);
    toast.success("Member added successfully.");
  };

  if (selected) {
    return <MemberDetail member={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: "#F5F4EF" }}>
      <div className="p-4 lg:p-6">
        <div className="rounded-2xl overflow-hidden" style={{ background: "#FFFFFF", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>

          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 pt-6 pb-5" style={{ borderBottom: "1px solid #EDEAE6" }}>
            <div>
              <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#1A1A1A", fontFamily: "var(--font-label)" }}>Members</h1>
              <p style={{ fontSize: "13px", color: "#9CA3AF", fontFamily: "var(--font-label)", marginTop: "2px" }}>
                Redeemer's Chapel · All campuses
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl" style={{ background: "#F5F4EF", border: "1px solid #E8E4DE" }}>
                <Search size={14} color="#9CA3AF" />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); resetPage(); }}
                  className="bg-transparent outline-none w-44"
                  style={{ fontSize: "13px", color: "#1A1A1A", fontFamily: "var(--font-label)" }}
                />
              </div>
              {/* Filters */}
              <Dropdown value={ministryFilter} options={MINISTRIES} onChange={(v) => { setMinistryFilter(v); resetPage(); }} placeholder="All Ministries" />
              <Dropdown value={statusFilter} options={STATUSES} onChange={(v) => { setStatusFilter(v); resetPage(); }} placeholder="All Status" />
              {/* CTA */}
              <button
                onClick={() => setIsAddOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all hover:opacity-90 active:scale-95"
                style={{ background: "#1A1A1A" }}
              >
                <Plus size={14} color="#C8860A" />
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF", fontFamily: "var(--font-label)" }}>Add Member</span>
              </button>
            </div>
          </div>

          {/* Stats strip */}
          <StatStrip />

          {/* Table header */}
          <div
            className="hidden md:grid px-6 py-3 gap-4"
            style={{ gridTemplateColumns: "2.4fr 1.4fr 1.4fr 1fr 1fr 32px", background: "#FAFAF8", borderBottom: "1px solid #EDEAE6" }}
          >
            {["Member", "Contact", "Ministry", "Joined", "Status", ""].map((h) => (
              <div key={h}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "#9CA3AF", fontFamily: "var(--font-label)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</span>
              </div>
            ))}
          </div>

          {/* Rows */}
          {paginated.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <span style={{ fontSize: "14px", color: "#9CA3AF", fontFamily: "var(--font-label)" }}>No members match your filters</span>
            </div>
          ) : (
            paginated.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelected(member)}
                className="grid px-6 py-4 cursor-pointer transition-colors hover:bg-[#FAFAF8] group items-center gap-4"
                style={{
                  gridTemplateColumns: "2.4fr 1.4fr 1.4fr 1fr 1fr 32px",
                  borderBottom: "1px solid #F5F3F0",
                }}
              >
                {/* Member */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: member.avatarColor }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#fff", fontFamily: "var(--font-label)" }}>{member.initials}</span>
                  </div>
                  <div className="min-w-0">
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A1A", fontFamily: "var(--font-label)" }} className="truncate">{member.name}</div>
                    <div style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "var(--font-label)" }} className="truncate">{member.email}</div>
                  </div>
                </div>

                {/* Contact */}
                <div style={{ fontSize: "13px", color: "#4B5563", fontFamily: "var(--font-label)" }} className="hidden md:block">
                  {member.phone}
                </div>

                {/* Ministry */}
                <div className="hidden md:flex items-center gap-1.5 flex-wrap">
                  <span className="px-2.5 py-1 rounded-full" style={{ background: "#F5F4EF", fontSize: "12px", color: "#4B5563", fontFamily: "var(--font-label)" }}>
                    {member.ministries[0]}
                  </span>
                  {member.ministries.length > 1 && (
                    <span style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "var(--font-label)" }}>+{member.ministries.length - 1}</span>
                  )}
                </div>

                {/* Joined */}
                <div style={{ fontSize: "13px", color: "#4B5563", fontFamily: "var(--font-label)" }} className="hidden md:block">
                  {member.joinDate}
                </div>

                {/* Status */}
                <div><StatusBadge status={member.status} /></div>

                {/* Actions */}
                <div className="flex justify-end">
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                  >
                    <MoreHorizontal size={14} color="#6B7280" />
                  </button>
                </div>
              </motion.div>
            ))
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: "1px solid #EDEAE6" }}>
              <span style={{ fontSize: "13px", color: "#9CA3AF", fontFamily: "var(--font-label)" }}>
                Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 rounded-lg transition-colors disabled:opacity-30 hover:bg-gray-100"
                  style={{ fontSize: "13px", fontFamily: "var(--font-label)", color: "#1A1A1A" }}
                >Prev</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="w-8 h-8 rounded-lg transition-colors"
                    style={{ fontSize: "13px", fontFamily: "var(--font-label)", background: p === page ? "#1A1A1A" : "transparent", color: p === page ? "#fff" : "#1A1A1A", fontWeight: p === page ? 700 : 400 }}
                  >{p}</button>
                ))}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded-lg transition-colors disabled:opacity-30 hover:bg-gray-100"
                  style={{ fontSize: "13px", fontFamily: "var(--font-label)", color: "#1A1A1A" }}
                >Next</button>
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
            fontFamily: "var(--font-label)",
            borderRadius: "12px",
            border: "1px solid #EDEAE6",
            boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
          },
        }}
      />
    </div>
  );
}
