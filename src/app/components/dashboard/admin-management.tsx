import { useState } from "react";
import {
  UserPlus, Shield, ChevronRight, X, Check, ChevronLeft,
  Search, MoreHorizontal, Mail, Phone, Clock, LogOut,
  ToggleLeft, ToggleRight, Edit3, Trash2, Copy, Eye,
  AlertTriangle, Send,
  Crown, Church, Wallet, Megaphone, Ticket, Users, Monitor, Settings, Star, KeyRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const BRAND = "#C8860A";
const DARK = "#1A1A2E";

// ─── Types ──────────────────────────────────────────────────────────────────────
type AdminStatus = "Active" | "Invited" | "Suspended" | "Inactive";
type RoleName = "Super Admin" | "Senior Pastor" | "Finance Manager" | "Media & Comms" | "Events Coordinator" | "Member Care" | "IT / Technical" | string;

interface Admin {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: RoleName;
  status: AdminStatus;
  lastActive: string;
  memberSince: string;
  initials: string;
  color: string;
  ministry?: string;
}

const ROLE_CONFIG: Record<string, { icon: LucideIcon; color: string; bg: string }> = {
  "Super Admin":        { icon: Crown, color: "#1A0533", bg: "rgba(26,5,51,0.1)" },
  "Senior Pastor":      { icon: Church, color: "#7C3AED", bg: "rgba(124,58,237,0.1)" },
  "Finance Manager":    { icon: Wallet, color: "#16A34A", bg: "rgba(22,163,74,0.1)" },
  "Media & Comms":      { icon: Megaphone, color: "#2563EB", bg: "rgba(37,99,235,0.1)" },
  "Events Coordinator": { icon: Ticket, color: "#D97706", bg: "rgba(217,119,6,0.1)" },
  "Member Care":        { icon: Users, color: "#0D9488", bg: "rgba(13,148,136,0.1)" },
  "IT / Technical":     { icon: Monitor, color: "#6B7280", bg: "rgba(107,114,128,0.1)" },
};

const getRoleConfig = (role: string) => ROLE_CONFIG[role] ?? { icon: Settings, color: BRAND, bg: `rgba(200,134,10,0.1)` };

const STATUS_CONFIG: Record<AdminStatus, { label: string; color: string; bg: string; dot: string }> = {
  Active:    { label: "Active",    color: "#16A34A", bg: "rgba(22,163,74,0.1)",    dot: "#16A34A" },
  Invited:   { label: "Invited",   color: "#D97706", bg: "rgba(217,119,6,0.1)",    dot: "#D97706" },
  Suspended: { label: "Suspended", color: "#DC2626", bg: "rgba(220,38,38,0.1)",    dot: "#DC2626" },
  Inactive:  { label: "Inactive",  color: "#6B7280", bg: "rgba(107,114,128,0.1)",  dot: "#9CA3AF" },
};

const INITIAL_ADMINS: Admin[] = [
  { id: 1, name: "Pastor Emmanuel Kwame",  email: "emmanuel@redeemerschapel.org",  phone: "+233 24 000 0001", role: "Super Admin",        status: "Active",    lastActive: "Active now",      memberSince: "Jan 12, 2026", initials: "EK", color: "#1A0533" },
  { id: 2, name: "Rev. Abena Mensah",      email: "abena@redeemerschapel.org",     phone: "+233 24 000 0002", role: "Senior Pastor",       status: "Active",    lastActive: "2 hours ago",     memberSince: "Jan 15, 2026", initials: "AM", color: "#7C3AED" },
  { id: 3, name: "Kweku Asante",           email: "kweku@redeemerschapel.org",     phone: "+233 24 000 0003", role: "Finance Manager",     status: "Active",    lastActive: "Yesterday",       memberSince: "Feb 3, 2026",  initials: "KA", color: "#16A34A" },
  { id: 4, name: "Ama Osei",              email: "ama@redeemerschapel.org",        phone: "+233 24 000 0004", role: "Media & Comms",       status: "Active",    lastActive: "3 days ago",      memberSince: "Feb 10, 2026", initials: "AO", color: "#2563EB" },
  { id: 5, name: "Kofi Boateng",          email: "kofi@redeemerschapel.org",       phone: "+233 24 000 0005", role: "Events Coordinator",  status: "Invited",   lastActive: "—",               memberSince: "—",            initials: "KB", color: "#D97706", ministry: "Youth Ministry" },
  { id: 6, name: "Grace Agyei",           email: "grace@redeemerschapel.org",      phone: "+233 24 000 0006", role: "Member Care",         status: "Suspended", lastActive: "Jun 1, 2026",     memberSince: "Mar 1, 2026",  initials: "GA", color: "#0D9488" },
];

const PERMISSION_MATRIX = [
  {
    group: "MEMBERS",
    perms: ["View members", "Add / edit members", "Delete members", "Export member data"],
    defaults: { "Senior Pastor": [true, true, true, true], "Finance Manager": [true, false, false, false], "Media & Comms": [true, false, false, false], "Events Coordinator": [true, true, false, false], "Member Care": [true, true, false, false] },
  },
  {
    group: "GIVING & FINANCE",
    perms: ["View transactions", "Record giving manually", "View financial reports", "Approve expenses", "Access billing settings"],
    defaults: { "Finance Manager": [true, true, true, true, false] },
  },
  {
    group: "EVENTS",
    perms: ["View events", "Create / edit events", "Delete events", "Manage ticketing"],
    defaults: { "Events Coordinator": [true, true, false, true] },
  },
  {
    group: "ANNOUNCEMENTS",
    perms: ["Draft announcements", "Publish announcements", "Send SMS / WhatsApp", "Schedule broadcasts"],
    defaults: { "Media & Comms": [true, false, false, true] },
  },
  {
    group: "SERMONS & MEDIA",
    perms: ["Upload sermons", "Delete media", "Manage live stream"],
    defaults: { "Media & Comms": [true, false, false] },
  },
  {
    group: "ATTENDANCE",
    perms: ["View attendance records", "Run QR check-in", "Export attendance data"],
    defaults: { "Events Coordinator": [true, true, false] },
  },
  {
    group: "SETTINGS",
    perms: ["Church profile settings", "Integrations", "Manage admins", "Billing & plan"],
    defaults: {},
  },
];

// ─── Helper Components ─────────────────────────────────────────────────────────
function RoleBadge({ role }: { role: string }) {
  const cfg = getRoleConfig(role);
  return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
        style={{ background: cfg.bg, color: cfg.color, fontFamily: "var(--font-label)", whiteSpace: "nowrap" }}>
        <cfg.icon size={12} style={{ flexShrink: 0 }} /> {role}
      </span>
  );
}

function StatusBadge({ status }: { status: AdminStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: cfg.bg, color: cfg.color, fontFamily: "var(--font-label)" }}>
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

function Avatar({ initials, color, size = 36 }: { initials: string; color: string; size?: number }) {
  return (
    <div className="rounded-full flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, background: color, fontSize: size * 0.33, fontWeight: 700, color: "#fff", fontFamily: "var(--font-label)" }}>
      {initials}
    </div>
  );
}

function StyledInput({ placeholder, defaultValue, type = "text", value, onChange }: {
  placeholder?: string; defaultValue?: string; type?: string; value?: string; onChange?: (v: string) => void;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      defaultValue={defaultValue}
      value={value}
      onChange={e => onChange?.(e.target.value)}
      className="w-full px-3.5 py-2.5 rounded-xl outline-none transition-all"
      style={{ border: "1px solid #E5E3DC", background: "#FAFAF8", fontSize: "13px", color: DARK, fontFamily: "var(--font-label)" }}
      onFocus={e => (e.target.style.borderColor = BRAND)}
      onBlur={e => (e.target.style.borderColor = "#E5E3DC")}
    />
  );
}

function PermissionMatrix({ role }: { role: string }) {
  const getDefault = (group: typeof PERMISSION_MATRIX[0], idx: number) => {
    if (role === "Super Admin") return true;
    const d = group.defaults[role as keyof typeof group.defaults];
    return d ? (d[idx] ?? false) : false;
  };
  const [perms, setPerms] = useState(() =>
    PERMISSION_MATRIX.map(g => ({ ...g, values: g.perms.map((_, i) => getDefault(g, i)) }))
  );

  const toggle = (gi: number, pi: number) => {
    if (role === "Super Admin") return;
    setPerms(p => p.map((g, i) => i === gi ? { ...g, values: g.values.map((v, j) => j === pi ? !v : v) } : g));
  };

  return (
    <div>
      {perms.map((group, gi) => (
        <div key={group.group} className="mb-4">
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#9CA3AF", fontFamily: "var(--font-label)", letterSpacing: "0.08em", marginBottom: "6px" }}>{group.group}</p>
          {group.perms.map((perm, pi) => (
            <div key={perm} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid #F3F2ED" }}>
              <span style={{ fontSize: "13px", color: "#374151", fontFamily: "var(--font-label)" }}>{perm}</span>
              <button onClick={() => toggle(gi, pi)} className={role === "Super Admin" ? "opacity-50 cursor-not-allowed" : ""}>
                {group.values[pi]
                  ? <ToggleRight size={22} style={{ color: BRAND }} />
                  : <ToggleLeft size={22} style={{ color: "#D1D5DB" }} />}
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Invite Slide-over ─────────────────────────────────────────────────────────
const ROLES_FOR_INVITE = [
  { role: "Senior Pastor",       icon: Church, desc: "Full access except billing" },
  { role: "Finance Manager",     icon: Wallet, desc: "Finance only + reports" },
  { role: "Media & Comms",       icon: Megaphone, desc: "Announcements + media upload" },
  { role: "Events Coordinator",  icon: Ticket, desc: "Events + attend + QR check-in" },
  { role: "Member Care",         icon: Users, desc: "Members + msgs + milestones" },
  { role: "Custom Role",         icon: Settings, desc: "Build your own" },
];

function InviteSlideOver({ onClose, onInvite }: { onClose: () => void; onInvite: (admin: Admin) => void }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [inviteChannel, setInviteChannel] = useState<"Email" | "WhatsApp" | "Both">("Email");
  const [customMsg, setCustomMsg] = useState("");
  const [restrictMinistry, setRestrictMinistry] = useState(false);

  const canNext = step === 1 ? name && email : step === 2 ? !!selectedRole : true;

  const handleSend = () => {
    const cfg = getRoleConfig(selectedRole);
    onInvite({
      id: Date.now(),
      name,
      email,
      phone,
      role: selectedRole || "Member Care",
      status: "Invited",
      lastActive: "—",
      memberSince: "—",
      initials: name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(),
      color: cfg.color,
    });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full z-50 flex flex-col shadow-2xl" style={{ width: "min(480px, 100vw)", background: "#fff" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid #EEEDE8" }}>
          <div>
            <p style={{ fontSize: "16px", fontWeight: 700, color: DARK, fontFamily: "var(--font-heading)" }}>Invite Admin</p>
            <p style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "var(--font-label)" }}>Step {step} of 5</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-50 transition-colors"><X size={18} color="#9CA3AF" /></button>
        </div>

        {/* Steps indicator */}
        <div className="flex px-6 py-3 gap-1" style={{ borderBottom: "1px solid #EEEDE8" }}>
          {[1, 2, 3, 4, 5].map(s => (
            <div key={s} className="flex-1 h-1 rounded-full transition-all" style={{ background: s <= step ? BRAND : "#E5E3DC" }} />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 1 && (
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: DARK, fontFamily: "var(--font-heading)", marginBottom: "20px" }}>Basic Info</h3>
              <div className="mb-4">
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", fontFamily: "var(--font-label)", display: "block", marginBottom: "6px" }}>Full Name *</label>
                <StyledInput placeholder="e.g. Pastor Ama Boateng" value={name} onChange={setName} />
              </div>
              <div className="mb-4">
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", fontFamily: "var(--font-label)", display: "block", marginBottom: "6px" }}>Email Address *</label>
                <StyledInput type="email" placeholder="admin@yourchurch.org" value={email} onChange={setEmail} />
              </div>
              <div className="mb-4">
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", fontFamily: "var(--font-label)", display: "block", marginBottom: "6px" }}>Phone Number <span style={{ fontWeight: 400, color: "#9CA3AF" }}>(optional)</span></label>
                <StyledInput placeholder="+233 24 000 0000" value={phone} onChange={setPhone} />
              </div>
              <div>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", fontFamily: "var(--font-label)", display: "block", marginBottom: "6px" }}>Profile Photo <span style={{ fontWeight: 400, color: "#9CA3AF" }}>(optional)</span></label>
                <div className="rounded-xl p-6 text-center cursor-pointer" style={{ border: "2px dashed #E5E3DC", background: "#FAFAF8" }}>
                  <p style={{ fontSize: "13px", color: "#9CA3AF", fontFamily: "var(--font-label)" }}>Click to upload photo</p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: DARK, fontFamily: "var(--font-heading)", marginBottom: "20px" }}>Assign Role</h3>
              <div className="grid grid-cols-2 gap-3">
                {ROLES_FOR_INVITE.map(({ role, icon: RoleIcon, desc }) => {
                  const isSelected = selectedRole === role;
                  return (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className="p-4 rounded-2xl text-left transition-all relative"
                      style={{
                        border: `2px solid ${isSelected ? BRAND : "#E5E3DC"}`,
                        background: isSelected ? `rgba(200,134,10,0.06)` : "#FAFAF8",
                      }}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: BRAND }}>
                          <Check size={10} color="#fff" />
                        </div>
                      )}
                      <p style={{ fontSize: "18px", marginBottom: "6px", color: BRAND }}><RoleIcon size={18} /></p>
                      <p style={{ fontSize: "12px", fontWeight: 700, color: DARK, fontFamily: "var(--font-label)" }}>{role}</p>
                      <p style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "var(--font-label)", marginTop: "2px" }}>{desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: DARK, fontFamily: "var(--font-heading)", marginBottom: "4px" }}>Fine-tune Permissions</h3>
              <p style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "var(--font-label)", marginBottom: "16px" }}>Customise access for {selectedRole}</p>
              <PermissionMatrix role={selectedRole} />
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: DARK, fontFamily: "var(--font-heading)", marginBottom: "20px" }}>Ministry Scope</h3>
              <div className="flex items-center justify-between py-3 mb-4" style={{ borderBottom: "1px solid #F3F2ED" }}>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "#374151", fontFamily: "var(--font-label)" }}>Restrict to specific ministry</p>
                  <p style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "var(--font-label)" }}>Admin only sees data for their assigned ministries</p>
                </div>
                <button onClick={() => setRestrictMinistry(!restrictMinistry)}>
                  {restrictMinistry ? <ToggleRight size={24} style={{ color: BRAND }} /> : <ToggleLeft size={24} style={{ color: "#D1D5DB" }} />}
                </button>
              </div>
              {restrictMinistry && (
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", fontFamily: "var(--font-label)", display: "block", marginBottom: "8px" }}>Select Ministries</label>
                  {["Youth Ministry", "Women's Fellowship", "Men's Fellowship", "Choir", "Ushers", "Children's Church"].map(m => (
                    <label key={m} className="flex items-center gap-2.5 py-2.5 cursor-pointer" style={{ borderBottom: "1px solid #F3F2ED" }}>
                      <input type="checkbox" className="w-4 h-4 accent-amber-600" />
                      <span style={{ fontSize: "13px", color: DARK, fontFamily: "var(--font-label)" }}>{m}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: DARK, fontFamily: "var(--font-heading)", marginBottom: "20px" }}>Send Invite</h3>
              {/* Preview card */}
              <div className="rounded-2xl p-4 mb-5" style={{ background: "#F0EFE9", border: "1px solid #E5E3DC" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#9CA3AF", fontFamily: "var(--font-label)", letterSpacing: "0.08em", marginBottom: "10px" }}>PREVIEW</p>
                <div className="flex items-center gap-3">
                  <Avatar initials={name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "??"} color={getRoleConfig(selectedRole).color} size={44} />
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 700, color: DARK, fontFamily: "var(--font-label)" }}>{name || "Name"}</p>
                    <p style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "var(--font-label)" }}>{email}</p>
                    <div className="mt-1"><RoleBadge role={selectedRole || "Role"} /></div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", fontFamily: "var(--font-label)", display: "block", marginBottom: "8px" }}>Invite Channel</label>
                <div className="flex gap-2">
                  {(["Email", "WhatsApp", "Both"] as const).map(c => (
                    <button
                      key={c}
                      onClick={() => setInviteChannel(c)}
                      className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                      style={{
                        border: `1px solid ${inviteChannel === c ? BRAND : "#E5E3DC"}`,
                        background: inviteChannel === c ? `rgba(200,134,10,0.08)` : "#FAFAF8",
                        color: inviteChannel === c ? BRAND : "#6B7280",
                        fontFamily: "var(--font-label)",
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", fontFamily: "var(--font-label)", display: "block", marginBottom: "6px" }}>Custom Message <span style={{ fontWeight: 400, color: "#9CA3AF" }}>(optional)</span></label>
                <textarea
                  rows={3}
                  value={customMsg}
                  onChange={e => setCustomMsg(e.target.value)}
                  placeholder="Welcome to the team! We've set up your admin account..."
                  className="w-full px-3.5 py-2.5 rounded-xl outline-none resize-none"
                  style={{ border: "1px solid #E5E3DC", background: "#FAFAF8", fontSize: "13px", color: DARK, fontFamily: "var(--font-label)" }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: "1px solid #EEEDE8" }}>
          <button
            onClick={() => step > 1 ? setStep(s => s - 1) : onClose()}
            className="flex items-center gap-1.5 text-sm"
            style={{ color: "#9CA3AF", fontFamily: "var(--font-label)", fontWeight: 600 }}
          >
            <ChevronLeft size={14} /> {step > 1 ? "Back" : "Cancel"}
          </button>
          {step < 5 ? (
            <button
              onClick={() => canNext && setStep(s => s + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: canNext ? BRAND : "#E5E3DC", color: canNext ? "#fff" : "#9CA3AF", fontFamily: "var(--font-label)", cursor: canNext ? "pointer" : "not-allowed" }}
            >
              Continue <ChevronRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleSend}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: BRAND, color: "#fff", fontFamily: "var(--font-label)" }}
            >
              <Send size={14} /> Send Invite
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Admin Detail Slide-over ────────────────────────────────────────────────────
function AdminDetailSlideOver({ admin, onClose, onUpdate }: { admin: Admin; onClose: () => void; onUpdate: (a: Admin) => void }) {
  const isSuper = admin.role === "Super Admin";
  const loginActivity = [
    { device: "Chrome / macOS", location: "Accra, GH", time: "Jun 4, 2026 · 9:14 AM" },
    { device: "Safari / iOS",   location: "Accra, GH", time: "Jun 3, 2026 · 7:01 AM" },
    { device: "Edge / Windows", location: "London, UK", time: "Jun 1, 2026 · 6:23 PM" },
  ];

  const handleSuspend = () => {
    const next = admin.status === "Suspended" ? "Active" : "Suspended";
    onUpdate({ ...admin, status: next });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full z-50 flex flex-col shadow-2xl overflow-y-auto" style={{ width: "min(400px, 100vw)", background: "#fff" }}>
        <div className="flex items-center justify-between px-6 py-5 sticky top-0" style={{ background: "#fff", borderBottom: "1px solid #EEEDE8" }}>
          <p style={{ fontSize: "15px", fontWeight: 700, color: DARK, fontFamily: "var(--font-heading)" }}>Admin Details</p>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-50"><X size={18} color="#9CA3AF" /></button>
        </div>

        <div className="px-6 py-5">
          {/* Profile */}
          <div className="flex items-center gap-4 mb-5">
            <Avatar initials={admin.initials} color={admin.color} size={56} />
            <div>
              <p style={{ fontSize: "16px", fontWeight: 700, color: DARK, fontFamily: "var(--font-heading)" }}>{admin.name}</p>
              <p style={{ fontSize: "13px", color: "#9CA3AF", fontFamily: "var(--font-label)" }}>{admin.email}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <RoleBadge role={admin.role} />
                <StatusBadge status={admin.status} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="p-3 rounded-xl" style={{ background: "#F5F4EF" }}>
              <p style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "var(--font-label)", marginBottom: "2px" }}>Last Active</p>
              <p style={{ fontSize: "12px", fontWeight: 600, color: DARK, fontFamily: "var(--font-label)" }}>{admin.lastActive}</p>
            </div>
            <div className="p-3 rounded-xl" style={{ background: "#F5F4EF" }}>
              <p style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "var(--font-label)", marginBottom: "2px" }}>Member Since</p>
              <p style={{ fontSize: "12px", fontWeight: 600, color: DARK, fontFamily: "var(--font-label)" }}>{admin.memberSince}</p>
            </div>
          </div>

          {/* Permissions summary */}
          <div className="mb-5">
            <p style={{ fontSize: "13px", fontWeight: 700, color: DARK, fontFamily: "var(--font-label)", marginBottom: "10px" }}>Permissions</p>
            <PermissionMatrix role={admin.role} />
          </div>

          {/* Login activity */}
          <div className="mb-5">
            <p style={{ fontSize: "13px", fontWeight: 700, color: DARK, fontFamily: "var(--font-label)", marginBottom: "10px" }}>Recent Login Activity</p>
            {loginActivity.map((l, i) => (
              <div key={i} className="py-2.5" style={{ borderBottom: "1px solid #F3F2ED" }}>
                <p style={{ fontSize: "12px", fontWeight: 600, color: DARK, fontFamily: "var(--font-label)" }}>{l.device}</p>
                <p style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "var(--font-label)" }}>{l.location} · {l.time}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          {!isSuper && (
            <div className="flex flex-col gap-2">
              <button className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90" style={{ background: `rgba(200,134,10,0.08)`, color: BRAND, fontFamily: "var(--font-label)" }}>
                Edit Role
              </button>
              <button className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90" style={{ background: "#F5F4EF", color: DARK, fontFamily: "var(--font-label)" }}>
                Reset Password
              </button>
              <button onClick={handleSuspend} className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90" style={{ background: "rgba(245,158,11,0.1)", color: "#D97706", fontFamily: "var(--font-label)" }}>
                {admin.status === "Suspended" ? "Reactivate Account" : "Suspend Account"}
              </button>
              <button className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90" style={{ background: "rgba(239,68,68,0.08)", color: "#DC2626", fontFamily: "var(--font-label)" }}>
                Remove Admin
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Manage Roles Page ──────────────────────────────────────────────────────────
const DEFAULT_ROLES = [
  { name: "Super Admin",        icon: Crown, color: "#1A0533", count: 1, isDefault: true },
  { name: "Senior Pastor",      icon: Church, color: "#7C3AED", count: 1, isDefault: true },
  { name: "Finance Manager",    icon: Wallet, color: "#16A34A", count: 1, isDefault: true },
  { name: "Media & Comms",      icon: Megaphone, color: "#2563EB", count: 1, isDefault: true },
  { name: "Events Coordinator", icon: Ticket, color: "#D97706", count: 1, isDefault: false },
  { name: "Member Care",        icon: Users, color: "#0D9488", count: 1, isDefault: false },
  { name: "IT / Technical",     icon: Monitor, color: "#6B7280", count: 0, isDefault: false },
];

function ManageRolesPanel({ onClose }: { onClose: () => void }) {
  const [roles, setRoles] = useState(DEFAULT_ROLES);
  const [selected, setSelected] = useState(DEFAULT_ROLES[0]);
  const [newRoleName, setNewRoleName] = useState("");

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl rounded-2xl shadow-2xl flex overflow-hidden" style={{ background: "#fff", maxHeight: "85vh" }}>
          {/* Left list */}
          <div className="flex flex-col" style={{ width: "240px", borderRight: "1px solid #EEEDE8", background: "#FAFAF8" }}>
            <div className="px-4 py-4" style={{ borderBottom: "1px solid #EEEDE8" }}>
              <p style={{ fontSize: "14px", fontWeight: 700, color: DARK, fontFamily: "var(--font-heading)" }}>Roles</p>
            </div>
            <div className="flex-1 overflow-y-auto py-2 px-2">
              {roles.map(r => (
                <button
                  key={r.name}
                  onClick={() => setSelected(r)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-0.5 text-left transition-all"
                  style={{ background: selected.name === r.name ? `rgba(200,134,10,0.08)` : "transparent" }}
                >
                  <r.icon size={14} color={r.color} />
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: "12px", fontWeight: 600, color: DARK, fontFamily: "var(--font-label)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</p>
                    <p style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "var(--font-label)" }}>{r.count} admin{r.count !== 1 ? "s" : ""}</p>
                  </div>
                  {r.isDefault && (
                    <span style={{ fontSize: "9px", fontWeight: 700, color: "#9CA3AF", fontFamily: "var(--font-label)", letterSpacing: "0.05em" }}>DEFAULT</span>
                  )}
                </button>
              ))}
            </div>
            <div className="p-3" style={{ borderTop: "1px solid #EEEDE8" }}>
              <button
                className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: BRAND, color: "#fff", fontFamily: "var(--font-label)" }}
                onClick={() => {
                  const name = `Custom Role ${roles.filter(r => r.name.startsWith("Custom")).length + 1}`;
                  const nr = { name, icon: Settings, color: BRAND, count: 0, isDefault: false };
                  setRoles(r => [...r, nr]);
                  setSelected(nr);
                }}
              >
                + Create Custom Role
              </button>
            </div>
          </div>

          {/* Right editor */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #EEEDE8" }}>
              <p style={{ fontSize: "14px", fontWeight: 700, color: DARK, fontFamily: "var(--font-heading)" }}>Edit: {selected.name}</p>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-50"><X size={18} color="#9CA3AF" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="mb-4">
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", fontFamily: "var(--font-label)", display: "block", marginBottom: "6px" }}>Role Name</label>
                <input
                  defaultValue={selected.name}
                  disabled={selected.name === "Super Admin"}
                  className="w-full px-3.5 py-2.5 rounded-xl outline-none"
                  style={{ border: "1px solid #E5E3DC", background: selected.name === "Super Admin" ? "#F5F4EF" : "#FAFAF8", fontSize: "13px", color: DARK, fontFamily: "var(--font-label)" }}
                />
              </div>
              <div className="mb-4 flex items-center gap-4">
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", fontFamily: "var(--font-label)", display: "block", marginBottom: "6px" }}>Badge Color</label>
                  <input type="color" defaultValue={selected.color} className="w-10 h-10 rounded-lg cursor-pointer" style={{ border: "1px solid #E5E3DC" }} />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", fontFamily: "var(--font-label)", display: "block", marginBottom: "6px" }}>Icon</label>
                  <div className="flex gap-2">
                    {[Crown, Church, Wallet, Megaphone, Ticket, Users, Monitor, Settings, Star, KeyRound].map(Icon => (
                      <button key={Icon.name} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors" style={{ color: "#374151" }}><Icon size={18} /></button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mb-5">
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", fontFamily: "var(--font-label)", display: "block", marginBottom: "6px" }}>Description</label>
                <input
                  placeholder="Brief description of this role's responsibilities"
                  className="w-full px-3.5 py-2.5 rounded-xl outline-none"
                  style={{ border: "1px solid #E5E3DC", background: "#FAFAF8", fontSize: "13px", color: DARK, fontFamily: "var(--font-label)" }}
                />
              </div>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 700, color: DARK, fontFamily: "var(--font-label)", marginBottom: "12px" }}>Permissions</p>
                <PermissionMatrix role={selected.name} />
              </div>
            </div>
            <div className="flex items-center gap-2 px-5 py-4" style={{ borderTop: "1px solid #EEEDE8" }}>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold" style={{ background: BRAND, color: "#fff", fontFamily: "var(--font-label)" }}>
                <Check size={12} /> Save Role
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold" style={{ border: "1px solid #E5E3DC", color: DARK, fontFamily: "var(--font-label)" }}>
                <Copy size={12} /> Duplicate
              </button>
              {!selected.isDefault && (
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold ml-auto" style={{ color: "#DC2626", fontFamily: "var(--font-label)" }}>
                  <Trash2 size={12} /> Delete Role
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────────
export function AdminManagementPage() {
  const [admins, setAdmins] = useState<Admin[]>(INITIAL_ADMINS);
  const [search, setSearch] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [showRoles, setShowRoles] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [actionMenu, setActionMenu] = useState<number | null>(null);

  const filtered = admins.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase()) ||
    a.role.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: "Total Admins",     value: admins.length,                              dot: undefined },
    { label: "Active Now",       value: admins.filter(a => a.lastActive === "Active now").length, dot: "#16A34A" },
    { label: "Pending Invites",  value: admins.filter(a => a.status === "Invited").length,        dot: "#D97706" },
    { label: "Custom Roles",     value: 4,                                          dot: undefined },
  ];

  const handleInvite = (admin: Admin) => setAdmins(a => [...a, admin]);
  const handleUpdate = (updated: Admin) => {
    setAdmins(a => a.map(x => x.id === updated.id ? updated : x));
    setSelectedAdmin(updated);
  };

  const handleSuspend = (id: number) => {
    setAdmins(a => a.map(x => x.id === id ? { ...x, status: x.status === "Suspended" ? "Active" : "Suspended" as AdminStatus } : x));
    setActionMenu(null);
  };

  const handleRemove = (id: number) => {
    setAdmins(a => a.filter(x => x.id !== id));
    setActionMenu(null);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: "#F5F4EF" }}>
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
          {/* Header */}
          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <div>
              <h2 style={{ fontSize: "22px", fontWeight: 700, color: DARK, fontFamily: "var(--font-heading)" }}>Admin Management</h2>
              <p style={{ fontSize: "13px", color: "#9CA3AF", fontFamily: "var(--font-label)", marginTop: "2px" }}>
                Control who has access to ChurchLedger and what they can do
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowRoles(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all hover:bg-gray-50"
                style={{ border: "1px solid #E5E3DC", color: DARK, fontFamily: "var(--font-label)", background: "#fff" }}
              >
                <Shield size={14} /> Manage Roles
              </button>
              <button
                onClick={() => setShowInvite(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: BRAND, color: "#fff", fontFamily: "var(--font-label)" }}
              >
                <UserPlus size={14} /> Invite Admin
              </button>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {stats.map(s => (
              <div key={s.label} className="rounded-2xl p-4" style={{ background: "#fff", border: "1px solid #EEEDE8" }}>
                <div className="flex items-center gap-1.5 mb-1">
                  {s.dot && <span className="w-2 h-2 rounded-full inline-block" style={{ background: s.dot }} />}
                  <p style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "var(--font-label)" }}>{s.label}</p>
                </div>
                <p style={{ fontSize: "26px", fontWeight: 700, color: DARK, fontFamily: "var(--font-heading)" }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search admins by name, email, or role..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl outline-none"
              style={{ border: "1px solid #E5E3DC", background: "#fff", fontSize: "13px", color: DARK, fontFamily: "var(--font-label)" }}
            />
          </div>

          {/* Table */}
          <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid #EEEDE8" }}>
            {/* Table header — desktop */}
            <div className="hidden md:grid items-center gap-4 px-5 py-3" style={{ gridTemplateColumns: "2fr 1.5fr 2fr auto auto auto", borderBottom: "1px solid #F3F2ED" }}>
              {["Admin", "Role", "Permissions", "Last Active", "Status", ""].map(h => (
                <p key={h} style={{ fontSize: "11px", fontWeight: 700, color: "#9CA3AF", fontFamily: "var(--font-label)", letterSpacing: "0.06em" }}>{h}</p>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="py-12 text-center">
                <p style={{ fontSize: "14px", color: "#9CA3AF", fontFamily: "var(--font-label)" }}>No admins match your search</p>
              </div>
            )}

            {filtered.map((admin, idx) => {
              const isSuper = admin.role === "Super Admin";
              return (
                <div
                  key={admin.id}
                  className="flex md:grid items-center gap-3 md:gap-4 px-4 md:px-5 py-3.5 cursor-pointer transition-colors hover:bg-[#F9F8F4] relative flex-wrap"
                  style={{ gridTemplateColumns: "2fr 1.5fr 2fr auto auto auto", borderBottom: idx < filtered.length - 1 ? "1px solid #F3F2ED" : undefined }}
                  onClick={() => setSelectedAdmin(admin)}
                >
                  {/* Avatar + name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar initials={admin.initials} color={admin.color} size={36} />
                    <div className="min-w-0">
                      <p style={{ fontSize: "13px", fontWeight: 600, color: DARK, fontFamily: "var(--font-label)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{admin.name}</p>
                      <p style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "var(--font-label)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{admin.email}</p>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="hidden md:block"><RoleBadge role={admin.role} /></div>

                  {/* Permissions summary */}
                  <div className="hidden md:block">
                    <p style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "var(--font-label)" }}>
                      {admin.role === "Super Admin" ? "All permissions" :
                       admin.role === "Finance Manager" ? "Finance, reports" :
                       admin.role === "Media & Comms" ? "Announcements, media" :
                       admin.role === "Events Coordinator" ? "Events, attendance" :
                       admin.role === "Member Care" ? "Members, messages" :
                       "Standard access"}
                    </p>
                  </div>

                  {/* Last active */}
                  <div className="hidden md:flex items-center gap-1.5">
                    <Clock size={12} style={{ color: "#9CA3AF", flexShrink: 0 }} />
                    <span style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "var(--font-label)", whiteSpace: "nowrap" }}>{admin.lastActive}</span>
                  </div>

                  {/* Status */}
                  <div className="hidden md:block"><StatusBadge status={admin.status} /></div>

                  {/* Actions */}
                  <div className="ml-auto md:ml-0 relative" onClick={e => e.stopPropagation()}>
                    {!isSuper && (
                      <button
                        onClick={() => setActionMenu(actionMenu === admin.id ? null : admin.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <MoreHorizontal size={16} style={{ color: "#9CA3AF" }} />
                      </button>
                    )}
                    {actionMenu === admin.id && (
                      <div className="absolute right-0 top-8 rounded-xl shadow-xl z-30 py-1.5 min-w-40" style={{ background: "#fff", border: "1px solid #EEEDE8" }}>
                        <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2" style={{ fontFamily: "var(--font-label)", color: DARK }}
                          onClick={() => { setSelectedAdmin(admin); setActionMenu(null); }}>
                          <Eye size={13} /> View Details
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2" style={{ fontFamily: "var(--font-label)", color: DARK }}
                          onClick={() => { setActionMenu(null); }}>
                          <Edit3 size={13} /> Edit Role
                        </button>
                        {admin.status === "Invited" && (
                          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2" style={{ fontFamily: "var(--font-label)", color: BRAND }}
                            onClick={() => setActionMenu(null)}>
                            <Send size={13} /> Resend Invite
                          </button>
                        )}
                        <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2" style={{ fontFamily: "var(--font-label)", color: "#D97706" }}
                          onClick={() => handleSuspend(admin.id)}>
                          <AlertTriangle size={13} /> {admin.status === "Suspended" ? "Reactivate" : "Suspend"}
                        </button>
                        <div style={{ borderTop: "1px solid #F3F2ED", margin: "4px 0" }} />
                        <button className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 flex items-center gap-2" style={{ fontFamily: "var(--font-label)", color: "#DC2626" }}
                          onClick={() => handleRemove(admin.id)}>
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Activity log note */}
          <div className="mt-6 rounded-2xl p-4 flex items-center gap-3" style={{ background: "#fff", border: "1px solid #EEEDE8" }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `rgba(200,134,10,0.08)` }}>
              <Clock size={14} style={{ color: BRAND }} />
            </div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 600, color: DARK, fontFamily: "var(--font-label)" }}>Recent Activity</p>
              <p style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "var(--font-label)" }}>
                Pastor Ama edited member profile · Jun 4, 9:42 AM &nbsp;·&nbsp; Kweku approved expense · Jun 4, 8:15 AM
              </p>
            </div>
            <button className="ml-auto flex-shrink-0 text-sm font-semibold" style={{ color: BRAND, fontFamily: "var(--font-label)" }}>
              Export Log
            </button>
          </div>
        </div>
      </div>

      {/* Overlays */}
      {showInvite && <InviteSlideOver onClose={() => setShowInvite(false)} onInvite={handleInvite} />}
      {selectedAdmin && <AdminDetailSlideOver admin={selectedAdmin} onClose={() => setSelectedAdmin(null)} onUpdate={handleUpdate} />}
      {showRoles && <ManageRolesPanel onClose={() => setShowRoles(false)} />}

      {/* Close action menu on outside click */}
      {actionMenu !== null && (
        <div className="fixed inset-0 z-20" onClick={() => setActionMenu(null)} />
      )}
    </div>
  );
}
