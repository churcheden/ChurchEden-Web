import { useState, useMemo, useEffect, useCallback } from "react";
import {
  UserPlus,
  Shield,
  ChevronRight,
  X,
  Check,
  ChevronLeft,
  Search,
  MoreHorizontal,
  Mail,
  Phone,
  Clock,
  ToggleLeft,
  ToggleRight,
  Edit3,
  Trash2,
  Copy,
  Eye,
  AlertTriangle,
  Send,
  Crown,
  Church,
  Wallet,
  Megaphone,
  Ticket,
  Users,
  Monitor,
  Settings,
  Star,
  KeyRound,
  Download,
  Filter,
  ShieldCheck,
  Smartphone,
  Laptop,
  CheckCircle2,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/app/auth/auth-context";
import { getChurchAdmins, type AdminRow } from "@/lib/admin-api";

const BRAND_GOLD = "#C8860A";
const GOLD_LIGHT = "#E3B34D";
const GOLD_DARK = "#78350F";
const DARK_SLATE = "#1A1612";

// ─── Types ──────────────────────────────────────────────────────────────────────
type AdminStatus = "Active" | "Invited" | "Suspended" | "Inactive";
type RoleName =
  | "Super Admin"
  | "Senior Pastor"
  | "Finance Manager"
  | "Media & Comms"
  | "Events Coordinator"
  | "Member Care"
  | "IT / Technical"
  | string;

interface Admin {
  id: string;
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
  isCurrentUser?: boolean;
  twoFactorEnabled?: boolean;
}

const ROLE_CONFIG: Record<string, { icon: LucideIcon; color: string; bg: string; border: string }> = {
  "Super Admin": {
    icon: Crown,
    color: "#78350F",
    bg: "rgba(200, 134, 10, 0.12)",
    border: "rgba(200, 134, 10, 0.3)",
  },
  "Senior Pastor": {
    icon: Church,
    color: "#6D28D9",
    bg: "rgba(109, 40, 217, 0.08)",
    border: "rgba(109, 40, 217, 0.2)",
  },
  Administrator: {
    icon: ShieldCheck,
    color: "#78350F",
    bg: "rgba(200, 134, 10, 0.12)",
    border: "rgba(200, 134, 10, 0.3)",
  },
  "Finance Manager": {
    icon: Wallet,
    color: "#047857",
    bg: "rgba(4, 120, 87, 0.08)",
    border: "rgba(4, 120, 87, 0.2)",
  },
  "Media & Comms": {
    icon: Megaphone,
    color: "#1D4ED8",
    bg: "rgba(29, 78, 216, 0.08)",
    border: "rgba(29, 78, 216, 0.2)",
  },
  "Events Coordinator": {
    icon: Ticket,
    color: "#C8860A",
    bg: "rgba(200, 134, 10, 0.1)",
    border: "rgba(200, 134, 10, 0.25)",
  },
  "Member Care": {
    icon: Users,
    color: "#0F766E",
    bg: "rgba(15, 118, 110, 0.08)",
    border: "rgba(15, 118, 110, 0.2)",
  },
  "IT / Technical": {
    icon: Monitor,
    color: "#4B5563",
    bg: "rgba(75, 85, 99, 0.08)",
    border: "rgba(75, 85, 99, 0.2)",
  },
};

const getRoleConfig = (role: string) =>
  ROLE_CONFIG[role] ?? {
    icon: Settings,
    color: BRAND_GOLD,
    bg: "rgba(200, 134, 10, 0.08)",
    border: "rgba(200, 134, 10, 0.2)",
  };

// Map a backend Admin row into the display Admin shape used by this page.
const ADMIN_COLORS = ["#78350F", "#6D28D9", "#047857", "#1D4ED8", "#0F766E", "#B45309"];
const mapAdminRow = (row: AdminRow): Admin => {
  const name = row.fullName || row.linkedUser?.fullName || row.email.split("@")[0];
  const role = row.role === "SUPER_ADMIN" ? "Super Admin" : "Administrator";
  const loggedInAt =
    row.linkedUser?.lastLogin ?? row.createdAt ?? null;
  const lastActive = loggedInAt ? formatRelativeTime(loggedInAt) : "Never logged in";
  return {
    id: row.id,
    name,
    email: row.email,
    phone: "",
    role,
    status: row.isActive ? "Active" : "Inactive",
    lastActive,
    memberSince: row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—",
    initials: getInitials(name),
    color: ADMIN_COLORS[hashString(row.id) % ADMIN_COLORS.length],
    ministry:
      role === "Super Admin"
        ? "Super administrator"
        : "Church administrator",
    isCurrentUser: false,
    twoFactorEnabled: false,
  };
};

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "AD";

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const formatRelativeTime = (iso: string) => {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";
  const diffMs = Date.now() - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Active now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
};

const STATUS_CONFIG: Record<
  AdminStatus,
  { label: string; color: string; bg: string; dot: string; border: string }
> = {
  Active: {
    label: "Active",
    color: "#065F46",
    bg: "#ECFDF5",
    dot: "#10B981",
    border: "#A7F3D0",
  },
  Invited: {
    label: "Invited",
    color: "#78350F",
    bg: "#FDFBF7",
    dot: "#C8860A",
    border: "#F3E7C4",
  },
  Suspended: {
    label: "Suspended",
    color: "#991B1B",
    bg: "#FEF2F2",
    dot: "#EF4444",
    border: "#FECACA",
  },
  Inactive: {
    label: "Inactive",
    color: "#4B5563",
    bg: "#F3F4F6",
    dot: "#9CA3AF",
    border: "#E5E7EB",
  },
};

const PERMISSION_MATRIX = [
  {
    group: "MEMBERS & CONGREGATION",
    perms: [
      { name: "View members directory", desc: "Browse profiles, tags and notes" },
      { name: "Add / edit members", desc: "Create and update member records" },
      { name: "Delete member records", desc: "Permanently remove contacts" },
      { name: "Export member data (CSV)", desc: "Download full member list" },
    ],
  },
  {
    group: "GIVING & FINANCIALS",
    perms: [
      { name: "View giving & transactions", desc: "View tithes and offerings" },
      { name: "Record offline giving", desc: "Log cash and bank deposits" },
      { name: "View financial reports", desc: "Export statements and analytics" },
      { name: "Approve budget expenses", desc: "Authorize ministry expenditures" },
      { name: "Access bank & payout settings", desc: "Modify payout bank accounts" },
    ],
  },
  {
    group: "SERVICES & EVENTS",
    perms: [
      { name: "View events calendar", desc: "See upcoming church sessions" },
      { name: "Create & edit events", desc: "Schedule services and programs" },
      { name: "Manage ticket registrations", desc: "Track VIP/General attendees" },
      { name: "Run QR Code Check-in", desc: "Live check-in gatekeeper mode" },
    ],
  },
  {
    group: "ANNOUNCEMENTS & COMMUNICATIONS",
    perms: [
      { name: "Draft announcements", desc: "Prepare bulletin notices" },
      { name: "Publish live announcements", desc: "Broadcast to mobile app" },
      { name: "Send SMS & WhatsApp blasts", desc: "Trigger direct phone alerts" },
    ],
  },
  {
    group: "ADMIN & SECURITY",
    perms: [
      { name: "Manage church settings", desc: "Church branding and domain" },
      { name: "Invite & manage admins", desc: "Role assignments & privileges" },
      { name: "View security audit logs", desc: "Track login and admin actions" },
    ],
  },
];

// ─── Subcomponents ─────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: string }) {
  const cfg = getRoleConfig(role);
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-tight border shadow-2xs"
      style={{
        backgroundColor: cfg.bg,
        color: cfg.color,
        borderColor: cfg.border,
      }}
    >
      <Icon size={12} className="flex-shrink-0" />
      <span>{role}</span>
    </span>
  );
}

function StatusBadge({ status }: { status: AdminStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border"
      style={{
        backgroundColor: cfg.bg,
        color: cfg.color,
        borderColor: cfg.border,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full inline-block animate-pulse"
        style={{ backgroundColor: cfg.dot }}
      />
      <span>{cfg.label}</span>
    </span>
  );
}

function Avatar({
  initials,
  color,
  size = 38,
}: {
  initials: string;
  color: string;
  size?: number;
}) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-white shadow-xs select-none flex-shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        fontSize: size * 0.36,
      }}
    >
      {initials}
    </div>
  );
}

// ─── Slide-Over: Invite Admin ──────────────────────────────────────────────────
const ROLES_FOR_INVITE = [
  {
    role: "Senior Pastor",
    icon: Church,
    desc: "Oversees church congregation, services, and reports",
  },
  {
    role: "Finance Manager",
    icon: Wallet,
    desc: "Full accounting, tithes/offerings, and giving audit",
  },
  {
    role: "Media & Comms",
    icon: Megaphone,
    desc: "Broadcasts, announcements, and sermon media",
  },
  {
    role: "Events Coordinator",
    icon: Ticket,
    desc: "Services scheduling, ticketing, and QR check-in",
  },
  {
    role: "Member Care",
    icon: Users,
    desc: "Member follow-up, directories, and pastoral care",
  },
  {
    role: "Custom Role",
    icon: Settings,
    desc: "Fine-tune custom permissions matrix",
  },
];

function InviteSlideOver({
  onClose,
  onInvite,
}: {
  onClose: () => void;
  onInvite: (admin: Admin) => void;
}) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedRole, setSelectedRole] = useState("Senior Pastor");
  const [inviteChannel, setInviteChannel] = useState<"Email" | "WhatsApp" | "Both">("Email");
  const [customMsg, setCustomMsg] = useState("");
  const [restrictMinistry, setRestrictMinistry] = useState(false);
  const [selectedMinistries, setSelectedMinistries] = useState<string[]>(["Youth Ministry"]);

  const canNext = step === 1 ? name.trim().length > 1 && email.includes("@") : true;

  const handleSend = () => {
    const cfg = getRoleConfig(selectedRole);
    const initials = name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    onInvite({
      id: `local-${Date.now()}`,
      name,
      email,
      phone,
      role: selectedRole,
      status: "Invited",
      lastActive: "Pending invite",
      memberSince: "Today",
      initials: initials || "AD",
      color: cfg.color,
      ministry: restrictMinistry ? selectedMinistries.join(", ") : undefined,
      twoFactorEnabled: false,
    });
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full z-50 flex flex-col shadow-2xl bg-[#FCFAF6] border-l border-[#E5E3DC] w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EAE7DC] bg-white/80 backdrop-blur-md">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: BRAND_GOLD }} />
              <h3 className="text-base font-bold text-slate-900">Invite New Administrator</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Step {step} of 5 — Provision access</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="flex px-6 py-2.5 gap-1.5 bg-slate-50/50 border-b border-[#EAE7DC]">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className="flex-1 h-1.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor: s <= step ? BRAND_GOLD : "#E2E8F0",
                boxShadow: s <= step ? `0 1px 4px ${BRAND_GOLD}40` : "none",
              }}
            />
          ))}
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Administrator Details</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter credentials for the team member.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name <span style={{ color: BRAND_GOLD }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pastor Ama Mensah"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3DC] bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C8860A]/20 focus:border-[#C8860A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Church Email Address <span style={{ color: BRAND_GOLD }}>*</span>
                </label>
                <input
                  type="email"
                  placeholder="ama@redeemerschapel.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3DC] bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C8860A]/20 focus:border-[#C8860A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="tel"
                  placeholder="+233 24 000 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3DC] bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C8860A]/20 focus:border-[#C8860A]"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Select Role Preset</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose a preset role to apply predefined permissions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ROLES_FOR_INVITE.map(({ role, icon: RoleIcon, desc }) => {
                  const isSelected = selectedRole === role;
                  const cfg = getRoleConfig(role);
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={`p-3.5 rounded-2xl text-left border transition-all relative flex flex-col justify-between ${
                        isSelected
                          ? "border-[#C8860A] ring-2 ring-[#C8860A]/20"
                          : "bg-white border-[#E5E3DC] hover:border-slate-300"
                      }`}
                      style={{
                        backgroundColor: isSelected ? "rgba(200, 134, 10, 0.08)" : "#FFFFFF",
                      }}
                    >
                      {isSelected && (
                        <div
                          className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: BRAND_GOLD }}
                        >
                          <Check size={11} strokeWidth={3} />
                        </div>
                      )}
                      <div>
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center mb-2.5"
                          style={{ backgroundColor: cfg.bg, color: cfg.color }}
                        >
                          <RoleIcon size={16} />
                        </div>
                        <p className="text-xs font-bold text-slate-900">{role}</p>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">{desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Fine-tune Permissions</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Granular control for {selectedRole} role.
                </p>
              </div>

              <div className="space-y-4">
                {PERMISSION_MATRIX.map((group) => (
                  <div key={group.group} className="rounded-2xl border border-[#E5E3DC] bg-white p-3.5">
                    <p
                      className="text-[10px] font-bold uppercase tracking-wider mb-2.5"
                      style={{ color: GOLD_DARK }}
                    >
                      {group.group}
                    </p>
                    <div className="space-y-2 divide-y divide-slate-100">
                      {group.perms.map((perm) => (
                        <div key={perm.name} className="pt-2 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-semibold text-slate-800">{perm.name}</p>
                            <p className="text-[10px] text-slate-400">{perm.desc}</p>
                          </div>
                          <button
                            type="button"
                            className="hover:opacity-80 transition-opacity"
                            style={{ color: BRAND_GOLD }}
                          >
                            <ToggleRight size={24} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Ministry Scoping</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Restrict data access to specific church branches or ministries.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-[#E5E3DC] bg-white flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Restrict to Assigned Ministries</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Admin only views members and events within their department
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setRestrictMinistry(!restrictMinistry)}
                  style={{ color: restrictMinistry ? BRAND_GOLD : "#CBD5E1" }}
                >
                  {restrictMinistry ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                </button>
              </div>

              {restrictMinistry && (
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Select Departments & Ministries:
                  </label>
                  {[
                    "Youth Ministry",
                    "Children's Church",
                    "Choir & Praise Team",
                    "Ushers & Protocol",
                    "Women's Fellowship",
                    "Men's Fellowship",
                    "Evangelism & Missions",
                  ].map((m) => {
                    const isChecked = selectedMinistries.includes(m);
                    return (
                      <label
                        key={m}
                        className="flex items-center gap-3 p-2.5 rounded-xl border border-[#E5E3DC] bg-white cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            setSelectedMinistries((prev) =>
                              isChecked ? prev.filter((x) => x !== m) : [...prev, m]
                            )
                          }
                          className="w-4 h-4 rounded"
                          style={{ accentColor: BRAND_GOLD }}
                        />
                        <span className="text-xs font-medium text-slate-800">{m}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Review & Send Invite</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Confirm details before sending setup credentials.
                </p>
              </div>

              {/* Live Preview Card */}
              <div
                className="p-4 rounded-2xl border shadow-xs space-y-3"
                style={{
                  backgroundColor: "rgba(200, 134, 10, 0.05)",
                  borderColor: "rgba(200, 134, 10, 0.2)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: GOLD_DARK }}
                  >
                    Invitation Preview
                  </span>
                  <StatusBadge status="Invited" />
                </div>
                <div className="flex items-center gap-3">
                  <Avatar
                    initials={
                      name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase() || "AD"
                    }
                    color={getRoleConfig(selectedRole).color}
                    size={42}
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{name || "Administrator"}</p>
                    <p className="text-xs text-slate-500">{email || "admin@yourchurch.org"}</p>
                    <div className="mt-1">
                      <RoleBadge role={selectedRole} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Channel */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Dispatch Channel
                </label>
                <div className="flex gap-2">
                  {(["Email", "WhatsApp", "Both"] as const).map((channel) => {
                    const isSelected = inviteChannel === channel;
                    return (
                      <button
                        key={channel}
                        type="button"
                        onClick={() => setInviteChannel(channel)}
                        className="flex-1 py-2 rounded-xl text-xs font-semibold border transition-all"
                        style={{
                          backgroundColor: isSelected ? BRAND_GOLD : "#FFFFFF",
                          color: isSelected ? "#FFFFFF" : "#4B5563",
                          borderColor: isSelected ? BRAND_GOLD : "#E5E3DC",
                          boxShadow: isSelected ? `0 2px 8px ${BRAND_GOLD}40` : "none",
                        }}
                      >
                        {channel}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Personal Message <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  placeholder="Welcome to our ministry leadership team! Please use this link to complete your profile..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3DC] bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C8860A]/20 focus:border-[#C8860A] resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-[#EAE7DC] bg-white flex items-center justify-between">
          <button
            type="button"
            onClick={() => (step > 1 ? setStep((s) => s - 1) : onClose())}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <ChevronLeft size={14} />
            <span>{step > 1 ? "Back" : "Cancel"}</span>
          </button>

          {step < 5 ? (
            <button
              type="button"
              disabled={!canNext}
              onClick={() => setStep((s) => s + 1)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-xs transition-all cursor-pointer"
              style={{
                backgroundColor: BRAND_GOLD,
                boxShadow: `0 2px 10px ${BRAND_GOLD}40`,
              }}
            >
              <span>Continue</span>
              <ChevronRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSend}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white shadow-xs transition-all cursor-pointer"
              style={{
                backgroundColor: BRAND_GOLD,
                boxShadow: `0 4px 14px ${BRAND_GOLD}40`,
              }}
            >
              <Send size={13} />
              <span>Send Invitation</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Slide-Over: Admin Details ─────────────────────────────────────────────────
function AdminDetailSlideOver({
  admin,
  onClose,
  onUpdate,
}: {
  admin: Admin;
  onClose: () => void;
  onUpdate: (a: Admin) => void;
}) {
  const isSuper = admin.role === "Super Admin";

  const handleToggleSuspend = () => {
    const nextStatus: AdminStatus = admin.status === "Suspended" ? "Active" : "Suspended";
    onUpdate({ ...admin, status: nextStatus });
  };

  const loginSessions = [
    { device: "MacBook Pro · macOS 15.2", location: "Accra, Ghana", time: "Today · 9:14 AM", icon: Laptop },
    { device: "iPhone 16 Pro · iOS 18", location: "Accra, Ghana", time: "Yesterday · 8:45 PM", icon: Smartphone },
    { device: "Chrome · Windows 11", location: "London, UK", time: "Jun 1, 2026 · 6:23 PM", icon: Laptop },
  ];

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full z-50 flex flex-col shadow-2xl bg-[#FCFAF6] border-l border-[#E5E3DC] w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EAE7DC] bg-white">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} style={{ color: BRAND_GOLD }} />
            <h3 className="text-sm font-bold text-slate-900">Administrator Dossier</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Profile Badge */}
          <div className="p-4 rounded-2xl bg-white border border-[#E5E3DC] shadow-xs flex items-center gap-4">
            <Avatar initials={admin.initials} color={admin.color} size={54} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-base font-bold text-slate-900 truncate">{admin.name}</p>
                {admin.isCurrentUser && (
                  <span
                    className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                    style={{ backgroundColor: "rgba(200, 134, 10, 0.12)", color: GOLD_DARK }}
                  >
                    YOU
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 truncate">{admin.email}</p>
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <RoleBadge role={admin.role} />
                <StatusBadge status={admin.status} />
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-white border border-[#E5E3DC]">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Last Activity
              </p>
              <p className="text-xs font-bold text-slate-900 mt-1">{admin.lastActive}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-[#E5E3DC]">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                2FA Security
              </p>
              <p className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1">
                <CheckCircle2 size={12} />
                <span>{admin.twoFactorEnabled ? "Enforced" : "Optional"}</span>
              </p>
            </div>
          </div>

          {/* Ministry Scope */}
          <div className="p-4 rounded-2xl bg-white border border-[#E5E3DC]">
            <p className="text-xs font-bold text-slate-900 mb-1">Assigned Scope</p>
            <p className="text-xs text-slate-600">
              {admin.ministry ? admin.ministry : "Global access across all ministries and branches"}
            </p>
          </div>

          {/* Login Activity */}
          <div className="p-4 rounded-2xl bg-white border border-[#E5E3DC]">
            <p className="text-xs font-bold text-slate-900 mb-3">Recent Security Sessions</p>
            <div className="space-y-2.5">
              {loginSessions.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="flex items-center gap-3 text-xs">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                      <Icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate">{s.device}</p>
                      <p className="text-[11px] text-slate-400">
                        {s.location} · {s.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          {!isSuper && (
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleToggleSuspend}
                className="w-full py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                style={{
                  backgroundColor:
                    admin.status === "Suspended"
                      ? "rgba(16, 185, 129, 0.1)"
                      : "rgba(200, 134, 10, 0.1)",
                  color: admin.status === "Suspended" ? "#047857" : GOLD_DARK,
                  border: `1px solid ${
                    admin.status === "Suspended" ? "#A7F3D0" : "rgba(200, 134, 10, 0.25)"
                  }`,
                }}
              >
                <AlertTriangle size={13} />
                <span>{admin.status === "Suspended" ? "Reactivate Account" : "Suspend Access"}</span>
              </button>

              <button
                type="button"
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <Trash2 size={13} />
                <span>Remove Administrator</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Modal: Manage Roles ───────────────────────────────────────────────────────
const DEFAULT_ROLES = [
  { name: "Super Admin", icon: Crown, color: "#78350F", count: 1, isDefault: true },
  { name: "Senior Pastor", icon: Church, color: "#6D28D9", count: 1, isDefault: true },
  { name: "Finance Manager", icon: Wallet, color: "#047857", count: 1, isDefault: true },
  { name: "Media & Comms", icon: Megaphone, color: "#1D4ED8", count: 1, isDefault: true },
  { name: "Events Coordinator", icon: Ticket, color: "#C8860A", count: 1, isDefault: false },
  { name: "Member Care", icon: Users, color: "#0F766E", count: 1, isDefault: false },
  { name: "IT / Technical", icon: Monitor, color: "#4B5563", count: 0, isDefault: false },
];

function ManageRolesModal({ onClose }: { onClose: () => void }) {
  const [roles, setRoles] = useState(DEFAULT_ROLES);
  const [selected, setSelected] = useState(DEFAULT_ROLES[0]);

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl rounded-3xl shadow-2xl bg-white border border-[#E5E3DC] flex flex-col md:flex-row overflow-hidden max-h-[85vh]">
          {/* Left Column: Roles Sidebar */}
          <div className="w-full md:w-64 bg-[#FAF8F5] border-r border-[#EAE7DC] flex flex-col">
            <div className="p-4 border-b border-[#EAE7DC]">
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                System Roles
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {roles.map((r) => {
                const Icon = r.icon;
                const isSelected = selected.name === r.name;
                return (
                  <button
                    key={r.name}
                    type="button"
                    onClick={() => setSelected(r)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all"
                    style={{
                      backgroundColor: isSelected ? "rgba(200, 134, 10, 0.12)" : "transparent",
                      color: isSelected ? GOLD_DARK : "#334155",
                      fontWeight: isSelected ? 700 : 500,
                    }}
                  >
                    <Icon size={14} style={{ color: r.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs truncate">{r.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {r.count} admin{r.count !== 1 ? "s" : ""}
                      </p>
                    </div>
                    {r.isDefault && (
                      <span className="text-[9px] font-bold text-slate-400 bg-slate-200/60 px-1 rounded">
                        SYS
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="p-3 border-t border-[#EAE7DC]">
              <button
                type="button"
                onClick={() => {
                  const customName = `Custom Role ${roles.length - 6}`;
                  const newR = {
                    name: customName,
                    icon: Settings,
                    color: BRAND_GOLD,
                    count: 0,
                    isDefault: false,
                  };
                  setRoles((prev) => [...prev, newR]);
                  setSelected(newR);
                }}
                className="w-full py-2 rounded-xl text-xs font-semibold text-white transition-colors shadow-2xs"
                style={{ backgroundColor: BRAND_GOLD }}
              >
                + New Custom Role
              </button>
            </div>
          </div>

          {/* Right Column: Role Editor */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            <div className="p-5 border-b border-[#EAE7DC] flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Role: {selected.name}</h4>
                <p className="text-xs text-slate-500">Configure privileges and assigned scope</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Role Label
                </label>
                <input
                  defaultValue={selected.name}
                  disabled={selected.name === "Super Admin"}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5E3DC] text-xs text-slate-900 bg-slate-50 focus:outline-none focus:border-[#C8860A] disabled:opacity-60"
                />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-900 mb-2">Granted Permissions</p>
                <div className="space-y-3">
                  {PERMISSION_MATRIX.map((g) => (
                    <div key={g.group} className="rounded-xl border border-[#E5E3DC] p-3">
                      <p
                        className="text-[10px] font-bold uppercase tracking-wider mb-1.5"
                        style={{ color: GOLD_DARK }}
                      >
                        {g.group}
                      </p>
                      <div className="space-y-1">
                        {g.perms.map((p) => (
                          <div key={p.name} className="flex items-center justify-between py-1 text-xs">
                            <span className="text-slate-700">{p.name}</span>
                            <span className="text-emerald-600 font-semibold">Enabled</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#EAE7DC] flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-2xs transition-all"
                style={{ backgroundColor: BRAND_GOLD }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main Admin Management Page ────────────────────────────────────────────────
export function AdminManagementPage() {
  const { user } = useAuth();
  const churchId = user?.accountType === "ADMIN" ? user.church?.id : undefined;
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showInvite, setShowInvite] = useState(false);
  const [showRoles, setShowRoles] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [actionMenu, setActionMenu] = useState<string | null>(null);

  const loadAdmins = useCallback(async () => {
    if (!churchId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setLoadError(null);
      const response = await getChurchAdmins(churchId);
      const currentAdminId = user?.accountType === "ADMIN" ? user.id : undefined;
      setAdmins(
        response.admins.map((row) => ({
          ...mapAdminRow(row),
          isCurrentUser: row.id === currentAdminId,
        })),
      );
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : "Unable to load administrators.",
      );
    } finally {
      setLoading(false);
    }
  }, [churchId, user]);

  useEffect(() => {
    void loadAdmins();
  }, [loadAdmins]);

  const filteredAdmins = useMemo(() => {
    return admins.filter((a) => {
      const matchesSearch =
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase()) ||
        a.role.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [admins, search, statusFilter]);

  const stats = [
    {
      label: "Total Leaders",
      value: admins.length,
      sub: "Across all departments",
      dot: undefined,
    },
    {
      label: "Active Today",
      value: admins.filter((a) => a.lastActive.includes("Active") || a.lastActive.includes("ago"))
        .length,
      sub: "Logged in recently",
      dot: "#10B981",
    },
    {
      label: "Pending Invites",
      value: admins.filter((a) => a.status === "Invited").length,
      sub: "Awaiting activation",
      dot: BRAND_GOLD,
    },
    {
      label: "Suspended",
      value: admins.filter((a) => a.status === "Suspended").length,
      sub: "Privileges revoked",
      dot: "#EF4444",
    },
  ];

  const handleInvite = (newAdmin: Admin) => {
    setAdmins((prev) => [...prev, newAdmin]);
  };

  const handleUpdate = (updated: Admin) => {
    setAdmins((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setSelectedAdmin(updated);
  };

  const handleRemove = (id: string) => {
    setAdmins((prev) => prev.filter((a) => a.id !== id));
    setActionMenu(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F9F8F4] text-slate-800 font-eden min-h-screen overflow-y-auto selection:bg-amber-100">
      <div className="max-w-6xl w-full mx-auto px-4 md:px-8 py-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: BRAND_GOLD }} />
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Admin Management
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Control leadership permissions, invite ministry coordinators, and audit administrative activity.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowRoles(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white border border-[#E5E3DC] text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-2xs transition-all"
            >
              <Shield size={14} className="text-slate-500" />
              <span>Manage Roles</span>
            </button>

            <button
              type="button"
              onClick={() => setShowInvite(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-xs transition-all cursor-pointer"
              style={{
                backgroundColor: BRAND_GOLD,
                boxShadow: `0 4px 14px ${BRAND_GOLD}35`,
              }}
            >
              <UserPlus size={14} />
              <span>Invite Admin</span>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {stats.map((s) => (
            <div
              key={s.label}
              className="p-4 rounded-2xl bg-white border border-[#EAE7DC] shadow-xs hover:border-[#C8860A]/40 transition-all"
            >
              <div className="flex items-center gap-1.5">
                {s.dot && (
                  <span
                    className="w-2 h-2 rounded-full inline-block animate-pulse"
                    style={{ backgroundColor: s.dot }}
                  />
                )}
                <span className="text-xs font-medium text-slate-500">{s.label}</span>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
                {s.value}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Controls Toolbar: Search & Status Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or role..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E3DC] bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C8860A]/20 focus:border-[#C8860A] shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-[#E5E3DC] shadow-2xs overflow-x-auto">
            {["All", "Active", "Invited", "Suspended"].map((status) => {
              const isActive = statusFilter === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: isActive ? BRAND_GOLD : "transparent",
                    color: isActive ? "#FFFFFF" : "#4B5563",
                    boxShadow: isActive ? `0 2px 8px ${BRAND_GOLD}35` : "none",
                  }}
                >
                  {status}
                </button>
              );
            })}
          </div>
        </div>

        {/* Load / error / empty states */}
        {loading && (
          <div className="rounded-3xl bg-white border border-[#EAE7DC] shadow-sm py-16 text-center">
            <div
              className="w-10 h-10 rounded-2xl mx-auto mb-3 flex items-center justify-center animate-pulse"
              style={{ backgroundColor: "rgba(200, 134, 10, 0.1)" }}
            >
              <ShieldCheck size={18} style={{ color: BRAND_GOLD }} />
            </div>
            <p className="text-xs font-medium text-slate-500">
              Loading administrators…
            </p>
          </div>
        )}

        {!loading && loadError && (
          <div className="rounded-3xl bg-red-50 border border-red-200 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle size={18} style={{ color: "#B91C1C" }} />
              <div>
                <p className="text-xs font-bold text-red-800">Could not load administrators</p>
                <p className="text-[11px] text-red-700">{loadError}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void loadAdmins()}
              className="px-3 py-1.5 rounded-xl bg-white border border-red-200 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !loadError && admins.length === 0 && (
          <div className="rounded-3xl bg-white border border-[#EAE7DC] shadow-sm py-16 text-center">
            <div
              className="w-10 h-10 rounded-2xl mx-auto mb-3 flex items-center justify-center"
              style={{ backgroundColor: "rgba(200, 134, 10, 0.1)" }}
            >
              <Shield size={18} style={{ color: BRAND_GOLD }} />
            </div>
            <p className="text-sm font-bold text-slate-700">No administrators yet</p>
            <p className="text-xs text-slate-400 mt-1">
              This church has no administrators. Use “Invite Admin” to add the first one.
            </p>
          </div>
        )}

        {!loading && !loadError && admins.length > 0 && (
        /* Admins Table */
        <div className="rounded-3xl bg-white border border-[#EAE7DC] shadow-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-[#FAF8F5] border-b border-[#EAE7DC] text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <div className="col-span-4">Administrator</div>
          <div className="col-span-3">Assigned Role</div>
          <div className="col-span-2">Last Active</div>
          <div className="col-span-2">Account Status</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-slate-100">
          {filteredAdmins.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm font-medium">No administrators found</p>
              <p className="text-xs mt-1">Try adjusting your search or filters.</p>
            </div>
          ) : (
            filteredAdmins.map((admin) => {
              const isSuper = admin.role === "Super Admin";
              return (
                <div
                  key={admin.id}
                  onClick={() => setSelectedAdmin(admin)}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-6 py-4 items-center hover:bg-[#FDFCF7] cursor-pointer transition-colors"
                >
                  {/* Member Info */}
                  <div className="col-span-4 flex items-center gap-3.5 min-w-0">
                    <Avatar initials={admin.initials} color={admin.color} size={38} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-slate-900 truncate">{admin.name}</p>
                        {admin.isCurrentUser && (
                          <span
                            className="px-1.5 py-0.2 rounded text-[9px] font-bold"
                            style={{
                              backgroundColor: "rgba(200, 134, 10, 0.12)",
                              color: GOLD_DARK,
                            }}
                          >
                            YOU
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{admin.email}</p>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="col-span-3">
                    <RoleBadge role={admin.role} />
                  </div>

                  {/* Last Active */}
                  <div className="col-span-2 flex items-center gap-1 text-xs text-slate-500">
                    <Clock size={12} className="text-slate-400 flex-shrink-0" />
                    <span className="truncate">{admin.lastActive}</span>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <StatusBadge status={admin.status} />
                  </div>

                  {/* Menu Actions */}
                  <div
                    className="col-span-1 text-right relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setActionMenu(actionMenu === admin.id ? null : admin.id)
                      }
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      <MoreHorizontal size={16} />
                    </button>

                    {actionMenu === admin.id && (
                      <div className="absolute right-0 top-8 z-30 w-44 rounded-2xl bg-white border border-[#E5E3DC] shadow-xl p-1.5 space-y-0.5 text-left text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAdmin(admin);
                            setActionMenu(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 font-medium"
                        >
                          <Eye size={13} />
                          <span>View Dossier</span>
                        </button>

                        {!isSuper && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedAdmin(admin);
                                setActionMenu(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 font-medium"
                            >
                              <Edit3 size={13} />
                              <span>Edit Privileges</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRemove(admin.id)}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 font-medium"
                            >
                              <Trash2 size={13} />
                              <span>Remove Admin</span>
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      )}

        {/* Audit Trail Banner */}
        <div className="p-4 rounded-2xl bg-white border border-[#EAE7DC] shadow-2xs flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: "rgba(200, 134, 10, 0.1)",
                color: BRAND_GOLD,
              }}
            >
              <ShieldCheck size={16} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Security Audit Trail</p>
              <p className="text-[11px] text-slate-500">
                Super Admin actions and privilege alterations are cryptographically signed.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E5E3DC] hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
          >
            <Download size={13} />
            <span>Export Audit Log (CSV)</span>
          </button>
        </div>
      </div>

      {/* Slide-Overs and Modals */}
      {showInvite && (
        <InviteSlideOver onClose={() => setShowInvite(false)} onInvite={handleInvite} />
      )}
      {selectedAdmin && (
        <AdminDetailSlideOver
          admin={selectedAdmin}
          onClose={() => setSelectedAdmin(null)}
          onUpdate={handleUpdate}
        />
      )}
      {showRoles && <ManageRolesModal onClose={() => setShowRoles(false)} />}
    </div>
  );
}
