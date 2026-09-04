import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Ban,
  Building,
  CalendarDays,
  Check,
  Eye,
  Mail,
  MapPin,
  Phone,
  User,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { ApiError, apiClient, apiRequest } from "@/lib/apiClient";
import { FormDialog } from "./form-dialog";

// ─── Design tokens (match dashboard pages) ───────────────────────────────────
const GOLD        = "#C8860A";
const INK         = "#1A1A1A";
const BODY        = "#4B5563";
const MUTED       = "#9CA3AF";
const BORDER      = "#E8E4DE";
const BORDER_SOFT = "#EDEAE6";
const SURFACE     = "#F5F4EF";
const FONT        = "var(--font-label)";

// ─── Types ───────────────────────────────────────────────────────────────────
type Status = "PENDING" | "APPROVED" | "REJECTED";

interface JoinRequest {
  id: string;
  email?: string;
  status: Status;
  role: string;
  rejectionReason: string | null;
  joinedAt: string;
  church?: { id: string; name: string; logoUrl: string | null } | null;
  user?: { id: string; email: string; fullName: string | null } | null;
  memberProfile: {
    profilePhotoUrl?: string | null;
    fullName?: string | null;
    contactEmail?: string | null;
    phoneNumber?: string | null;
    city?: string | null;
    address?: string | null;
    dateOfBirth?: string | null;
    gender?: string | null;
    maritalStatus?: string | null;
    occupation?: string | null;
  } | null;
  isBanned?: boolean;
}

interface JoinRequestsResponse {
  status: "success";
  requests: JoinRequest[];
}

interface MessageResponse {
  status?: "success";
  message: string;
}

const FILTERS: { key: Status; label: string }[] = [
  { key: "PENDING", label: "Pending" },
  { key: "APPROVED", label: "Approved" },
  { key: "REJECTED", label: "Rejected" },
];

const STATUS_CONFIG: Record<Status, { bg: string; dot: string; text: string }> = {
  PENDING: { bg: "rgba(200,134,10,0.08)", dot: GOLD, text: GOLD },
  APPROVED: { bg: "rgba(10,122,74,0.08)", dot: "#0A7A4A", text: "#0A7A4A" },
  REJECTED: { bg: "#FDF1F0", dot: "#B3261E", text: "#B3261E" },
};

const AVATAR_COLORS = ["#C8860A", "#2D1B69", "#0A4A3A", "#6D28D9", "#047857", "#1D4ED8", "#B3261E", "#1A0533"];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function avatarMeta(name: string) {
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "?";
  let hash = 0;
  for (const ch of name.toLowerCase()) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  const color = AVATAR_COLORS[hash % AVATAR_COLORS.length];
  return { initials, color };
}

function relativeTime(iso: string): string {
  if (!iso) return "recently";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "recently";
  const diffMinutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const hours = Math.floor(diffMinutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function Skeleton({ w, h = 12 }: { w: number | string; h?: number }) {
  return (
    <span
      className="block"
      style={{
        width: typeof w === "number" ? `${w}px` : w,
        height: `${h}px`,
        borderRadius: "6px",
        background: "linear-gradient(90deg, #EFECE7 25%, #F7F5F1 37%, #EFECE7 63%)",
        backgroundSize: "400% 100%",
        display: "inline-block",
        animation: "joinSkeleton 1.4s ease infinite",
      }}
    />
  );
}

function RowSkeletons() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-2xl p-4 flex items-center gap-3" style={{ background: "#FFFFFF", border: `1px solid ${BORDER_SOFT}` }}>
          <div className="w-10 h-10 rounded-full flex-shrink-0" style={{ background: "#EFECE7" }} />
          <div className="flex-1 space-y-2">
            <Skeleton w={150} h={12} />
            <Skeleton w={220} h={10} />
            <Skeleton w={180} h={10} />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ filter }: { filter: Status }) {
  const config = {
    PENDING: {
      title: "No pending join requests",
      subtitle: "When someone requests to join your church, they'll show up here for you to approve or reject.",
    },
    APPROVED: { title: "No approved requests yet", subtitle: "Requests you approve will be listed here." },
    REJECTED: { title: "No rejected requests", subtitle: "Requests you reject will be listed here." },
  }[filter];
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(200,134,10,0.08)" }}>
        <UserCheck size={24} color={GOLD} />
      </div>
      <div style={{ fontSize: "16px", fontWeight: 700, color: INK, fontFamily: FONT }}>{config.title}</div>
      <p style={{ fontSize: "13.5px", color: MUTED, fontFamily: FONT, marginTop: "6px", maxWidth: 360 }}>{config.subtitle}</p>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "#FDF1F0" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B3261E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div style={{ fontSize: "16px", fontWeight: 700, color: INK, fontFamily: FONT }}>Unable to load join requests</div>
      <p style={{ fontSize: "13.5px", color: MUTED, fontFamily: FONT, marginTop: "6px", maxWidth: 340, textAlign: "center" }}>
        Something went wrong while loading your join requests. Only church administrators can view this page.
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

function StatusPill({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: cfg.bg }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
      <span style={{ fontSize: "11px", fontWeight: 500, color: cfg.text, fontFamily: FONT }}>
        {FILTERS.find((f) => f.key === status)?.label}
      </span>
    </span>
  );
}

// ─── User Profile Detail Modal ───────────────────────────────────────────────
function MemberDetailModal({
  request,
  onClose,
  onApprove,
  onReject,
  onBan,
  onUnban,
  actingId,
}: {
  request: JoinRequest | null;
  onClose: () => void;
  onApprove: (r: JoinRequest) => void;
  onReject: (r: JoinRequest) => void;
  onBan: (r: JoinRequest) => void;
  onUnban: (r: JoinRequest) => void;
  actingId: string | null;
}) {
  if (!request) return null;
  const name =
    request.memberProfile?.fullName ||
    request.user?.fullName ||
    request.email ||
    "Church Member";
  const { initials, color } = avatarMeta(name);
  const profile = request.memberProfile;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", duration: 0.35 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border border-stone-200"
          style={{ fontFamily: FONT }}
        >
          {/* Header Banner */}
          <div className="relative bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] px-6 pt-6 pb-12 text-white">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20"
            >
              <X size={16} />
            </button>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#C8860A]">
              <UserCheck size={14} />
              Join Request Profile Details
            </div>
            <h2 className="mt-1 text-xl font-bold text-white">{name}</h2>
            <p className="text-xs text-slate-300">Complete membership profile scan</p>
          </div>

          {/* Profile Card Main Body */}
          <div className="px-6 -mt-8 pb-6">
            <div className="flex items-end justify-between mb-4">
              <div className="flex items-end gap-3.5">
                {profile?.profilePhotoUrl ? (
                  <img
                    src={profile.profilePhotoUrl}
                    alt={name}
                    className="h-20 w-20 rounded-2xl border-4 border-white object-cover shadow-md"
                  />
                ) : (
                  <div
                    className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white text-2xl font-black text-white shadow-md"
                    style={{ background: color }}
                  >
                    {initials}
                  </div>
                )}
                <div>
                  <h3 className="text-base font-bold text-[#1A1A1A] leading-tight">{name}</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <StatusPill status={request.status} />
                    {request.isBanned && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                        BANNED
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Structured Profile Fields Grid */}
            <div className="space-y-3.5 text-xs max-h-[60vh] overflow-y-auto pr-1">
              {/* Contact Information */}
              <div className="rounded-2xl border border-stone-200/80 bg-stone-50/70 p-3.5 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#C8860A] flex items-center gap-1.5">
                  <Mail size={12} /> Contact Information
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <span className="text-stone-400 block text-[10.5px]">Email Address</span>
                    <span className="font-semibold text-stone-800 break-all">
                      {profile?.contactEmail || request.email || request.user?.email || "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10.5px]">Phone Number</span>
                    <span className="font-semibold text-stone-800">
                      {profile?.phoneNumber || "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10.5px]">City / Location</span>
                    <span className="font-semibold text-stone-800">
                      {profile?.city || "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10.5px]">Residential Address</span>
                    <span className="font-semibold text-stone-800 truncate block">
                      {profile?.address || "Not specified"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Personal Profile Details */}
              <div className="rounded-2xl border border-stone-200/80 bg-stone-50/70 p-3.5 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#C8860A] flex items-center gap-1.5">
                  <User size={12} /> Personal Profile
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div>
                    <span className="text-stone-400 block text-[10.5px]">Date of Birth</span>
                    <span className="font-semibold text-stone-800">
                      {profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10.5px]">Gender</span>
                    <span className="font-semibold text-stone-800 capitalize">
                      {profile?.gender ? profile.gender.toLowerCase().replace(/_/g, " ") : "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10.5px]">Marital Status</span>
                    <span className="font-semibold text-stone-800 capitalize">
                      {profile?.maritalStatus ? profile.maritalStatus.toLowerCase().replace(/_/g, " ") : "Not specified"}
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-3">
                    <span className="text-stone-400 block text-[10.5px]">Occupation / Profession</span>
                    <span className="font-semibold text-stone-800">
                      {profile?.occupation || "Not specified"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Church & Request Context */}
              <div className="rounded-2xl border border-stone-200/80 bg-stone-50/70 p-3.5 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#C8860A] flex items-center gap-1.5">
                  <Building size={12} /> Membership & Request Info
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {request.church?.name && (
                    <div>
                      <span className="text-stone-400 block text-[10.5px]">Church</span>
                      <span className="font-semibold text-stone-800">{request.church.name}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-stone-400 block text-[10.5px]">Assigned Role</span>
                    <span className="font-semibold text-stone-800">{request.role || "Member"}</span>
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <span className="text-stone-400 block text-[10.5px]">Requested On</span>
                    <span className="font-semibold text-stone-800">
                      {request.joinedAt ? new Date(request.joinedAt).toLocaleString() : "Recently"} ({relativeTime(request.joinedAt)})
                    </span>
                  </div>
                </div>
              </div>

              {/* Rejection / Ban Notes */}
              {request.rejectionReason && (
                <div className="rounded-2xl border border-red-200 bg-red-50/60 p-3 text-red-800 text-xs">
                  <span className="font-bold">Rejection Reason: </span>
                  {request.rejectionReason}
                </div>
              )}
            </div>

            {/* Actions Bar */}
            <div className="mt-5 flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-stone-100">
              {request.status === "PENDING" && (
                <>
                  <button
                    onClick={() => { onClose(); onApprove(request); }}
                    disabled={actingId !== null}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#C8860A] to-[#D99A20] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95"
                  >
                    <Check size={14} /> Approve
                  </button>
                  <button
                    onClick={() => { onClose(); onReject(request); }}
                    disabled={actingId !== null}
                    className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    <X size={14} /> Reject
                  </button>
                  <button
                    onClick={() => { onClose(); onBan(request); }}
                    disabled={actingId !== null}
                    className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
                  >
                    <Ban size={14} /> Ban
                  </button>
                </>
              )}
              {request.status !== "PENDING" && request.isBanned && (
                <button
                  onClick={() => { onClose(); onUnban(request); }}
                  disabled={actingId !== null}
                  className="flex items-center gap-1.5 rounded-xl border border-green-500 bg-green-50 px-4 py-2 text-xs font-semibold text-green-700 hover:bg-green-100"
                >
                  <Check size={14} /> Unban
                </button>
              )}
              <button
                onClick={onClose}
                className="rounded-xl border border-stone-300 bg-stone-100 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-200"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export function JoinRequestsPage() {
  const [filter, setFilter] = useState<Status>("PENDING");
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<JoinRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [actingId, setActingId] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<JoinRequest | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [banTarget, setBanTarget] = useState<JoinRequest | null>(null);
  const [banReason, setBanReason] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      const response = await apiRequest<JoinRequestsResponse>(`/join-requests?status=${filter}`, {
        auth: true,
      });
      setRequests(response.requests ?? []);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void load();
  }, [load]);

  const errorMessage = (error: unknown, fallback: string) =>
    error instanceof ApiError ? error.message : fallback;

  const handleApprove = async (request: JoinRequest) => {
    setActingId(request.id);
    try {
      await apiRequest<MessageResponse>("/join-requests/approve", {
        method: "POST",
        auth: true,
        body: { membershipId: request.id },
      });
      toast.success("Request approved");
      await load();
    } catch (error) {
      toast.error(errorMessage(error, "Could not approve the request."));
    } finally {
      setActingId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    setActingId(rejectTarget.id);
    try {
      await apiRequest<MessageResponse>("/join-requests/reject", {
        method: "POST",
        auth: true,
        body: {
          membershipId: rejectTarget.id,
          rejectionReason: rejectReason.trim() || undefined,
        },
      });
      toast.success("Request rejected");
      setRejectTarget(null);
      setRejectReason("");
      await load();
    } catch (error) {
      toast.error(errorMessage(error, "Could not reject the request."));
    } finally {
      setActingId(null);
    }
  };

  const handleBan = async (request: JoinRequest, reason: string) => {
    setActingId(request.id);
    try {
      await apiRequest<MessageResponse>("/join-requests/ban", {
        method: "POST",
        auth: true,
        body: { membershipId: request.id, banReason: reason },
      });
      toast.success("User banned from this church");
      setBanTarget(null);
      setBanReason("");
      await load();
    } catch (error) {
      toast.error(errorMessage(error, "Could not ban the user."));
    } finally {
      setActingId(null);
    }
  };

  const handleUnban = async (request: JoinRequest) => {
    setActingId(request.id);
    try {
      await apiRequest<MessageResponse>("/join-requests/unban", {
        method: "POST",
        auth: true,
        body: { membershipId: request.id },
      });
      toast.success("User unbanned from this church");
      await load();
    } catch (error) {
      toast.error(errorMessage(error, "Could not unban the user."));
    } finally {
      setActingId(null);
    }
  };

  const memberName = (request: JoinRequest) =>
    request.memberProfile?.fullName || request.user?.fullName || request.email || "Church member";

  const singleChurch = new Set(requests.map((r) => r.church?.id).filter(Boolean)).size <= 1;

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: SURFACE }}>
      <div className="p-4 lg:p-6 space-y-4">
        {/* Content header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 700, color: INK, fontFamily: FONT }}>Join Requests</h1>
            <p style={{ fontSize: "13px", color: MUTED, fontFamily: FONT, marginTop: "2px" }}>
              Review and respond to people who want to join your church.
            </p>
          </div>

          {/* Status tabs */}
          <div
            className="flex items-center gap-1.5 p-1 rounded-xl self-start sm:self-auto"
            style={{ background: "#FFFFFF", border: `1px solid ${BORDER}` }}
          >
            {FILTERS.map((item) => {
              const isActive = filter === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setFilter(item.key)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-[0.98]"
                  style={{
                    background: isActive ? GOLD : "transparent",
                    color: isActive ? "#FFFFFF" : BODY,
                    boxShadow: isActive ? `0 2px 8px ${GOLD}35` : "none",
                    fontFamily: FONT,
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Request list */}
        <div className="rounded-2xl" style={{ background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center gap-2 px-5 py-3" style={{ borderBottom: `1px solid ${BORDER_SOFT}` }}>
            <Users size={13} color={MUTED} />
            <span style={{ fontSize: "12px", fontWeight: 600, color: MUTED, fontFamily: FONT, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {FILTERS.find((f) => f.key === filter)?.label} requests ({requests.length})
            </span>
          </div>

          <div className="p-4">
            {loading ? (
              <RowSkeletons />
            ) : failed ? (
              <ErrorState onRetry={() => void load()} />
            ) : requests.length === 0 ? (
              <EmptyState filter={filter} />
            ) : (
              <div className="space-y-3">
                <AnimatePresence initial={false}>
                  {requests
                    .filter((r): r is JoinRequest => Boolean(r && r.id))
                    .map((request, i) => (
                      <motion.div
                        key={request.id || `request-${i}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: Math.min(i * 0.03, 0.3) }}
                        className="rounded-2xl p-4"
                        style={{ border: `1px solid ${BORDER_SOFT}`, background: "#FFFFFF" }}
                      >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        {/* Avatar + identity (clickable to view complete details) */}
                        <div
                          className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer group"
                          onClick={() => setSelectedRequest(request)}
                        >
                          {request.memberProfile?.profilePhotoUrl ? (
                            <img
                              src={request.memberProfile.profilePhotoUrl}
                              alt={memberName(request)}
                              className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-amber-500/20 group-hover:border-amber-500 transition-colors"
                            />
                          ) : (
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                              style={{ background: avatarMeta(memberName(request)).color }}
                            >
                              <span style={{ fontSize: "13px", fontWeight: 700, color: "#FFFFFF", fontFamily: FONT }}>
                                {avatarMeta(memberName(request)).initials}
                              </span>
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="truncate group-hover:text-[#C8860A] transition-colors" style={{ fontSize: "13.5px", fontWeight: 600, color: INK, fontFamily: FONT }}>
                                {memberName(request)}
                              </span>
                              {filter === "PENDING" && <StatusPill status={request.status} />}
                            </div>
                            <div style={{ fontSize: "12px", color: MUTED, fontFamily: FONT }} className="truncate">
                              {request.memberProfile?.contactEmail || request.email || request.user?.email || "No email available"}
                            </div>
                            <div className="flex items-center gap-3 flex-wrap" style={{ fontSize: "11.5px", color: MUTED, fontFamily: FONT, marginTop: "2px" }}>
                              {request.memberProfile?.city && (
                                <span className="inline-flex items-center gap-1">
                                  <MapPin size={11} color={MUTED} />
                                  {request.memberProfile.city}
                                </span>
                              )}
                              {request.memberProfile?.phoneNumber && (
                                <span className="inline-flex items-center gap-1">
                                  <Phone size={11} color={MUTED} />
                                  {request.memberProfile.phoneNumber}
                                </span>
                              )}
                              <span className="inline-flex items-center gap-1">
                                <CalendarDays size={11} color={MUTED} />
                                Requested {relativeTime(request.joinedAt)}
                              </span>
                              {!singleChurch && request.church?.name && <span className="truncate">· {request.church.name}</span>}
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setSelectedRequest(request); }}
                                className="inline-flex items-center gap-1 font-semibold text-[#C8860A] hover:underline ml-1"
                              >
                                <Eye size={11} /> View details
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center w-full sm:w-auto">
                          {filter === "PENDING" && (
                            <>
                              <button
                                type="button"
                                onClick={() => void handleApprove(request)}
                                disabled={actingId !== null}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl transition-all active:scale-[0.98] hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
                                style={{
                                  background: `linear-gradient(135deg, ${GOLD} 0%, #D99A20 100%)`,
                                  boxShadow: "0 6px 16px rgba(200,134,10,0.22)",
                                  fontSize: "12.5px", fontWeight: 600, color: "#FFFFFF", fontFamily: FONT,
                                }}
                              >
                                {actingId === request.id ? (
                                  <>
                                    <span
                                      className="inline-block w-3.5 h-3.5 rounded-full"
                                      style={{ border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#FFFFFF", animation: "joinSpin 0.7s linear infinite" }}
                                    />
                                    Working...
                                  </>
                                ) : (
                                  <>
                                    <Check size={14} />
                                    Approve
                                  </>
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => { setBanTarget(request); setBanReason(""); }}
                                disabled={actingId !== null}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl transition-all active:scale-[0.98] hover:bg-[#FDF1F0] disabled:opacity-60 disabled:cursor-not-allowed"
                                style={{ border: `1px solid ${BORDER}`, background: "#FFFFFF", fontSize: "12.5px", fontWeight: 600, color: "#B3261E", fontFamily: FONT }}
                              >
                                <Ban size={14} />
                                Ban
                              </button>
                              <button
                                type="button"
                                onClick={() => { setRejectTarget(request); setRejectReason(""); }}
                                disabled={actingId !== null}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl transition-all active:scale-[0.98] hover:bg-[#FDF1F0] disabled:opacity-60 disabled:cursor-not-allowed"
                                style={{ border: `1px solid ${BORDER}`, background: "#FFFFFF", fontSize: "12.5px", fontWeight: 600, color: "#B3261E", fontFamily: FONT }}
                              >
                                <X size={14} />
                                Reject
                              </button>
                            </>
                          )}
                          {filter !== "PENDING" && request.isBanned && (
                            <button
                              type="button"
                              onClick={() => void handleUnban(request)}
                              disabled={actingId !== null}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl transition-all active:scale-[0.98] hover:bg-[#D0F0D0] disabled:opacity-60 disabled:cursor-not-allowed"
                              style={{ border: `1px solid #33C933`, background: "#EFF7EF", fontSize: "12.5px", fontWeight: 600, color: "#33C933", fontFamily: FONT }}
                            >
                              <Check size={14} />
                              Unban
                            </button>
                          )}
                          {filter !== "PENDING" && !request.isBanned && <StatusPill status={request.status} />}
                        </div>
                      </div>

                      {/* Rejection reason */}
                      {filter === "REJECTED" && request.rejectionReason && (
                        <div
                          className="mt-3 rounded-xl px-3.5 py-2.5"
                          style={{ background: "#FFF7F5", border: "1px solid #FCE3DE", fontSize: "12.5px", color: BODY, fontFamily: FONT }}
                        >
                          <span style={{ fontWeight: 600, color: "#B3261E", fontFamily: FONT }}>Reason: </span>
                          {request.rejectionReason}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject dialog */}
      <FormDialog
        open={rejectTarget !== null}
        onClose={() => {
          if (actingId !== null) return;
          setRejectTarget(null);
          setRejectReason("");
        }}
        icon={<X size={18} style={{ color: GOLD }} />}
        title={`Reject ${rejectTarget ? memberName(rejectTarget) : ""}'s request`}
        description="The member will see this reason on their request status."
        maxWidth="max-w-lg"
        primaryButton={{
          label: "Reject request",
          onClick: () => void handleReject(),
          loading: rejectTarget !== null && actingId === rejectTarget.id,
          loadingLabel: "Rejecting...",
        }}
      >
        <div className="p-6">
          <label style={{ fontSize: "12.5px", fontWeight: 600, color: INK, fontFamily: FONT }}>
            Reason <span style={{ color: MUTED, fontWeight: 400 }}>(optional)</span>
          </label>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="e.g. We're only accepting members from our main campus right now."
            className="w-full mt-2 outline-none resize-none rounded-xl px-4 py-3 transition-shadow"
            style={{
              background: "#FFFFFF",
              border: `1px solid ${BORDER}`,
              fontSize: "13px", color: INK, fontFamily: FONT,
              boxShadow: "none",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(200,134,10,0.12)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = "none"; }}
          />
          <div style={{ fontSize: "11px", color: MUTED, fontFamily: FONT, marginTop: "6px", textAlign: "right" }}>
            {rejectReason.length}/500
          </div>
        </div>
      </FormDialog>

      {/* Ban dialog */}
      <FormDialog
        open={banTarget !== null}
        onClose={() => {
          if (actingId !== null) return;
          setBanTarget(null);
          setBanReason("");
        }}
        icon={<Ban size={18} style={{ color: "#B3261E" }} />}
        title={`Ban ${banTarget ? memberName(banTarget) : ""} from your church`}
        description="Banned users can no longer join or request to join this church."
        maxWidth="max-w-lg"
        primaryButton={{
          label: "Ban user",
          onClick: () => { if (banTarget) void handleBan(banTarget, banReason.trim()); },
          loading: banTarget !== null && actingId === banTarget.id,
          loadingLabel: "Banning...",
          disabled: !banReason.trim(),
          danger: true,
        }}
      >
        <div className="p-6">
          <label style={{ fontSize: "12.5px", fontWeight: 600, color: INK, fontFamily: FONT }}>
            Reason <span style={{ color: "#B3261E", fontWeight: 600 }}>*</span>
          </label>
          <textarea
            value={banReason}
            onChange={(e) => setBanReason(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="e.g. Repeatedly submitted abusive requests."
            className="w-full mt-2 outline-none resize-none rounded-xl px-4 py-3 transition-shadow"
            style={{
              background: "#FFFFFF",
              border: `1px solid ${banReason.trim() ? BORDER : "#E5B8B4"}`,
              fontSize: "13px", color: INK, fontFamily: FONT,
              boxShadow: "none",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#B3261E"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(179,38,30,0.12)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = banReason.trim() ? BORDER : "#E5B8B4"; e.currentTarget.style.boxShadow = "none"; }}
          />
          <div style={{ fontSize: "11px", color: MUTED, fontFamily: FONT, marginTop: "6px", textAlign: "right" }}>
            {banReason.length}/500
          </div>
        </div>
      </FormDialog>

      {/* Member Details Modal Pop-Up */}
      <MemberDetailModal
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onApprove={(r) => void handleApprove(r)}
        onReject={(r) => { setRejectTarget(r); setRejectReason(""); }}
        onBan={(r) => { setBanTarget(r); setBanReason(""); }}
        onUnban={(r) => void handleUnban(r)}
        actingId={actingId}
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

      <style>{`@keyframes joinSkeleton { 0% { background-position: 100% 0 } 100% { background-position: 0 0 } } @keyframes joinSpin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}