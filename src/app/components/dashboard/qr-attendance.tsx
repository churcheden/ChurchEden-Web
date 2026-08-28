import { useEffect, useMemo, useRef, useState } from "react";
import {
  QrCode as QrCodeIcon,
  Users,
  UserCheck,
  TrendingUp,
  Activity,
  Play,
  Pause,
  RotateCcw,
  Power,
  Maximize2,
  Download,
  Share2,
  Copy,
  Clock,
  RefreshCw,
  MapPin,
  CalendarDays,
  Lightbulb,
  ShieldCheck,
  Wifi,
  AlertTriangle,
  X,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { toast, Toaster } from "sonner";
import { FormDialog, DIALOG_BODY } from "./form-dialog";

// ─── Tokens ───────────────────────────────────────────────────────────────────

const BG = "#F5F4EF";
const GOLD = "#C8860A";
const INK = "#1A1A1A";
const BODY = "#4B5563";
const MUTED = "#9CA3AF";
const BORDER = "#EDEAE6";
const SUCCESS = "#22C55E";
const AMBER = "#F59E0B";
const DANGER = "#EF4444";
const NAVY = "#0F1729";

// ─── Mock data ────────────────────────────────────────────────────────────────

interface ServiceOption {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  registrations: number;
}

const SERVICES: ServiceOption[] = [
  { id: "SVC-2304", name: "Sunday Main Service", date: "Sun, Aug 30", time: "9:00 – 11:30 AM", location: "Main Sanctuary", registrations: 248 },
  { id: "SVC-2298", name: "Mid-Week Bible Study", date: "Wed, Aug 26", time: "6:30 – 8:00 PM", location: "Fellowship Hall", registrations: 132 },
  { id: "SVC-2301", name: "Youth Revival", date: "Sat, Aug 29", time: "4:00 – 6:30 PM", location: "Youth Auditorium", registrations: 87 },
  { id: "SVC-2306", name: "Morning Intercession", date: "Fri, Aug 28", time: "5:00 – 6:30 AM", location: "Prayer Room", registrations: 42 },
];

interface CheckIn {
  id: string;
  name: string;
  time: string;
  initials: string;
  color: string;
  source: "QR" | "Manual";
}

const INITIAL_CHECKINS: CheckIn[] = [
  { id: "MBR-0064", name: "Bro. Emmanuel Ofori", time: "9:10 AM", initials: "EO", color: "#0A4A3A", source: "QR" },
  { id: "MBR-0011", name: "Deacon Kofi Mensah", time: "9:07 AM", initials: "KM", color: "#2D1B69", source: "QR" },
  { id: "MBR-0041", name: "Dr. Kwame Asante", time: "9:04 AM", initials: "KA", color: "#2D1B69", source: "QR" },
  { id: "MBR-0033", name: "Elder Abena Osei", time: "9:01 AM", initials: "AO", color: "#7C3AED", source: "Manual" },
  { id: "MBR-0018", name: "Sis. Grace Mensah", time: "8:52 AM", initials: "GM", color: GOLD, source: "QR" },
];

const PENDING_FEED = [
  { id: "MBR-0072", name: "Bro. Yaw Amponsah", initials: "YA", color: "#0A4A3A" },
  { id: "MBR-0055", name: "Sis. Ama Boateng", initials: "AB", color: "#B45309" },
  { id: "MBR-0029", name: "Sis. Akosua Darko", initials: "AD", color: "#DB2777" },
  { id: "MBR-0066", name: "Deacon Kwabena Owusu", initials: "KO", color: "#2563EB" },
  { id: "MBR-0044", name: "Sis. Efua Adjei", initials: "EA", color: "#B91C1C" },
];

const QUICK_TIPS = [
  { icon: <Wifi size={16} />, title: "Share the live link", text: "Members without the app can open the attendance link on any phone." },
  { icon: <RefreshCw size={16} />, title: "Regenerate for events", text: "Rotate the QR between services so each session stays unique." },
  { icon: <ShieldCheck size={16} />, title: "Auto-expiry", text: `Sessions end automatically after ${"60"} minutes or when you End it manually.` },
  { icon: <Users size={16} />, title: "Manual fallback", text: "Front-desk can add check-ins manually for walk-in guests whose phone is low." },
];

function timeNow(): string {
  const d = new Date();
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ap}`;
}

// ─── Atoms ────────────────────────────────────────────────────────────────────

function Avatar({ initials, color, size = 36 }: { initials: string; color: string; size?: number }) {
  return (
    <div
      className="flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, borderRadius: "50%", background: `${color}22`, border: `1.5px solid ${color}55` }}
    >
      <span style={{ fontFamily: "var(--font-label)", fontSize: size * 0.34, fontWeight: 700, color }}>{initials}</span>
    </div>
  );
}

function Card({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{ background: "#FFFFFF", border: `1px solid ${BORDER}`, boxShadow: "0 1px 2px rgba(15,23,41,0.04)", ...style }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 style={{ fontFamily: "var(--font-label)", fontSize: "15px", fontWeight: 700, color: INK }}>{children}</h3>
      {action}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  accent = GOLD,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  accent?: string;
}) {
  return (
    <Card className="p-4 sm:p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span style={{ fontFamily: "var(--font-label)", fontSize: "12px", fontWeight: 600, color: MUTED }}>{label}</span>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${accent}14` }}>
          <span style={{ color: accent }}>{icon}</span>
        </div>
      </div>
      <div>
        <div style={{ fontFamily: "var(--font-label)", fontSize: "26px", fontWeight: 800, color: INK, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
          {value}
        </div>
        {sub && <div className="mt-2" style={{ fontFamily: "var(--font-label)", fontSize: "12px", color: MUTED }}>{sub}</div>}
      </div>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function QRAttendancePage() {
  // Load / skeleton
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Session state
  const [service, setService] = useState<ServiceOption>(SERVICES[0]);
  const [sessionToken, setSessionToken] = useState("SAT-7F3K-9Q2M-XR5D");
  const [startAt, setStartAt] = useState<number | null>(null);
  const [pausedRemaining, setPausedRemaining] = useState<number>(60 * 60);
  const [accrued, setAccrued] = useState<number>(0);
  const [status, setStatus] = useState<"idle" | "active" | "paused" | "expired">("idle");

  // Data
  const [checkins, setCheckins] = useState<CheckIn[]>(INITIAL_CHECKINS);
  const feedRef = useRef(0);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  // ── Simulated load ──
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  // ── Countdown while active ──
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (status !== "active") return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [status]);

  // ── Auto check-in feed while active ──
  useEffect(() => {
    if (status !== "active") return;
    const id = window.setInterval(() => {
      if (feedRef.current >= PENDING_FEED.length) return;
      const nxt = PENDING_FEED[feedRef.current];
      feedRef.current += 1;
      setCheckins((prev) => [
        { ...nxt, time: timeNow(), source: nxt.id.includes("7") ? "Manual" : "QR" },
        ...prev,
      ]);
      toast.success(`${nxt.name} checked in via QR`);
    }, 9000);
    return () => window.clearInterval(id);
  }, [status]);

  // Derived
  const registered = service.registrations;
  const present = checkins.length;

  const totalRemainingSec =
    status === "active"
      ? Math.max(0, Math.round((pausedRemaining - (now - (startAt ?? now)) / 1000) + accrued))
      : Math.max(0, pausedRemaining);

  const hh = Math.floor(totalRemainingSec / 3600);
  const mm = Math.floor((totalRemainingSec % 3600) / 60);
  const ss = totalRemainingSec % 60;
  const countdown = `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;

  const rate = registered > 0 ? Math.round((present / registered) * 100) : 0;
  const rateColor = rate >= 75 ? SUCCESS : rate >= 45 ? AMBER : DANGER;

  const attendUrl = useMemo(
    () => `https://attend.cheden.app/live?session=${sessionToken}&sid=${service.id}`,
    [sessionToken, service.id],
  );

  const statusMeta: Record<string, { label: string; color: string; bg: string; dot: string }> = {
    idle: { label: "Not Started", color: MUTED, bg: "#F3F4F6", dot: MUTED },
    active: { label: "Live · Active", color: "#15803D", bg: "#E9F9EF", dot: SUCCESS },
    paused: { label: "Paused", color: "#B45309", bg: "#FDF3E3", dot: AMBER },
    expired: { label: "Expired", color: "#B91C1C", bg: "#FDEBEB", dot: DANGER },
  };
  const sm = statusMeta[status];

  // ── Actions ──
  function startSession() {
    setStatus("active");
    setStartAt(Date.now());
    setPausedRemaining(60 * 60);
    setAccrued(0);
    toast.success("Session is now live — scan away!");
  }

  function pauseSession() {
    if (startAt == null) return;
    const elapsed = (Date.now() - startAt) / 1000;
    const remaining = Math.max(0, pausedRemaining - elapsed);
    setAccrued(0);
    setPausedRemaining(remaining);
    setStatus("paused");
    toast.info("Session paused");
  }

  function resumeSession() {
    setStartAt(Date.now());
    setStatus("active");
    toast.success("Session resumed");
  }

  function regenerate() {
    const seq = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const part = () => Array.from({ length: 4 }, () => seq[Math.floor(Math.random() * seq.length)]).join("");
    setSessionToken(`SAT-${part()}-${part()}-${part()}`);
    toast.success("QR code regenerated — previous link is now invalid");
  }

  function endSession() {
    setStatus("expired");
    setConfirmEnd(false);
    setFullscreen(false);
    toast.info("Session ended");
  }

  function copyToken() {
    navigator.clipboard?.writeText(sessionToken);
    toast.success("Session link copied to clipboard");
  }

  function downloadQR() {
    const canvas = qrCanvasRef.current;
    if (canvas) {
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `attendance-${service.id}.png`;
      a.click();
      toast.success("QR code downloaded");
    }
  }

  async function shareQR() {
    const payload = { title: `ChurchEden Attendance · ${service.name}`, text: attendUrl };
    if (navigator.share) {
      try {
        await navigator.share(payload);
      } catch {
        navigator.clipboard?.writeText(attendUrl);
        toast.success("Link copied to clipboard");
      }
    } else {
      navigator.clipboard?.writeText(attendUrl);
      toast.success("Link copied to clipboard");
    }
  }

  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // ── Skeleton ──
  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-6" style={{ background: BG }}>
        <div className="max-w-[1240px] mx-auto flex flex-col gap-5">
          <div className="h-8 w-56 rounded-lg" style={{ background: "#E8E4DE" + "" }} />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl" style={{ background: "#fff", border: `1px solid ${BORDER}`, height: 132 }} />
            ))}
          </div>
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 rounded-2xl" style={{ background: "#fff", border: `1px solid ${BORDER}`, height: 400 }} />
            <div className="rounded-2xl" style={{ background: "#fff", border: `1px solid ${BORDER}`, height: 400 }} />
          </div>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: BG }}>
        <Card className="p-8 max-w-sm text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: "#FDEBEB" }}>
            <AlertTriangle size={24} style={{ color: DANGER }} />
          </div>
          <h3 style={{ fontFamily: "var(--font-label)", fontSize: "16px", fontWeight: 700, color: INK }}>Couldn’t load live session</h3>
          <p className="mt-1" style={{ fontFamily: "var(--font-label)", fontSize: "13px", color: MUTED }}>
            We couldn’t reach the attendance service. Check your connection and try again.
          </p>
          <button
            onClick={() => { setError(false); setLoading(true); setTimeout(() => setLoading(false), 700); }}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl"
            style={{ background: GOLD, color: "#fff", fontFamily: "var(--font-label)", fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer" }}
          >
            <RefreshCw size={15} /> Retry
          </button>
        </Card>
      </div>
    );
  }

  // ── Fullscreen QR ──
  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-6" style={{ background: "linear-gradient(150deg,#10151F 0%,#0F1729 100%)" }}>
        <button
          onClick={() => setFullscreen(false)}
          className="absolute top-5 right-5 flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{ background: "rgba(255,255,255,0.08)", color: "#E5E7EB", fontFamily: "var(--font-label)", fontSize: "13px", fontWeight: 600, border: "1px solid rgba(255,255,255,0.12)", cursor: "pointer" }}
        >
          <X size={16} /> Exit
        </button>
        <div className="text-center max-w-md">
          <div className="flex items-center justify-center gap-2 mb-5">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "rgba(34,197,94,0.15)", color: "#4ADE80", fontFamily: "var(--font-label)", fontSize: "12px", fontWeight: 700 }}>
              <span className="w-2 h-2 rounded-full" style={{ background: SUCCESS }} /> SCAN TO CHECK IN
            </span>
          </div>
          <div className="mx-auto w-72 h-72 bg-white rounded-3xl p-5 flex items-center justify-center shadow-2xl">
            <QRCodeCanvas ref={qrCanvasRef} value={attendUrl} size={248} bgColor="#FFFFFF" fgColor={NAVY} level="M" includeMargin />
          </div>
          <div className="mt-6" style={{ color: "#fff", fontFamily: "var(--font-label)" }}>
            <div className="text-xl font-bold">{service.name}</div>
            <div className="mt-1 text-sm" style={{ color: "#9CA3AF" }}>{service.date} · {service.time}</div>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "rgba(255,255,255,0.07)", fontFamily: "var(--font-label)", fontSize: "13px", color: "#E5E7EB" }}>
              <Clock size={14} style={{ color: "#60A5FA" }} /> {countdown} left
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main layout ──
  return (
    <div className="flex-1 overflow-y-auto" style={{ background: BG }}>
      <div className="px-5 sm:px-7 py-6">
        <div className="max-w-[1240px] mx-auto flex flex-col gap-5">
          {/* Page title */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "22px", fontWeight: 800, color: INK, letterSpacing: "-0.02em" }}>
                QR Attendance
              </h1>
              <p className="mt-0.5" style={{ fontFamily: "var(--font-label)", fontSize: "13px", color: MUTED }}>
                Control the live check-in session for each service.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full" style={{ background: sm.bg, color: sm.color, fontFamily: "var(--font-label)", fontSize: "12.5px", fontWeight: 700 }}>
                <span className="w-2 h-2 rounded-full" style={{ background: sm.dot, boxShadow: `0 0 0 3px ${sm.dot}22` }} />
                {sm.label}
              </span>
              <button
                onClick={() => setConfirmEnd(true)}
                disabled={status === "idle"}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl disabled:opacity-50"
                style={{ background: DANGER, color: "#fff", fontFamily: "var(--font-label)", fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer", transition: "opacity .15s" }}
              >
                <Power size={15} /> End Session
              </button>
            </div>
          </div>

          {/* Summary cards — separated box components with vector icons */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<Users size={18} />}
              label="Registered"
              value={registered.toLocaleString()}
              sub={<span>Records awaiting check-in</span>}
              accent={NAVY}
            />
            <StatCard
              icon={<UserCheck size={18} />}
              label="Present"
              value={present}
              sub={<span>{checkins.filter((c) => c.source === "QR").length} via QR · {checkins.filter((c) => c.source === "Manual").length} manual</span>}
              accent="#2563EB"
            />
            <StatCard
              icon={<TrendingUp size={18} />}
              label="Attendance Rate"
              value={<>{rate}%</>}
              sub={
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full" style={{ background: "#F0EEE9" }}>
                    <div className="h-full rounded-full" style={{ width: `${rate}%`, background: rateColor }} />
                  </div>
                  <span style={{ color: rateColor, fontSize: "12px", fontWeight: 700 }}>{rate >= 75 ? "Great" : rate >= 45 ? "Fair" : "Low"}</span>
                </div>
              }
              accent={rateColor}
            />
            <StatCard
              icon={<Activity size={18} />}
              label={status === "idle" ? "Session" : "Remaining Time"}
              value={
                status === "idle" ? (
                  <span style={{ fontSize: "20px" }}>—</span>
                ) : status === "expired" ? (
                  "Ended"
                ) : (
                  <span className="tabular-nums">{countdown}</span>
                )
              }
              sub={<span className="inline-flex items-center gap-1.5"><Clock size={12} /> 60-min auto expiry</span>}
              accent={status === "expired" ? DANGER : GOLD}
            />
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left: QR card */}
            <Card className="lg:col-span-2 p-5 sm:p-6 flex flex-col gap-5">
              <SectionTitle
                action={
                  <select
                    value={service.id}
                    onChange={(e) => setService(SERVICES.find((s) => s.id === e.target.value) ?? SERVICES[0])}
                    className="rounded-xl"
                    style={{
                      fontFamily: "var(--font-label)", fontSize: "12.5px", fontWeight: 600, color: INK,
                      padding: "8px 32px 8px 12px", border: `1px solid ${BORDER}`, background: "#FAFAF7",
                      appearance: "none", WebkitAppearance: "none", cursor: "pointer", outline: "none",
                    }}
                  >
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                }
              >
                Live Check-in QR
              </SectionTitle>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="relative p-5 rounded-3xl"
                    style={{
                      background: "#FFFFFF",
                      border: `1.5px dashed ${status === "active" ? `${SUCCESS}99` : BORDER}`,
                      boxShadow: "0 20px 45px rgba(15,23,41,0.12)",
                    }}
                  >
                    <div className="p-3 bg-white">
                      <QRCodeCanvas
                        ref={qrCanvasRef}
                        value={attendUrl}
                        size={196}
                        bgColor="#FFFFFF"
                        fgColor={NAVY}
                        level="M"
                        includeMargin
                      />
                    </div>
                    {status === "active" && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: SUCCESS, color: "#fff", fontFamily: "var(--font-label)", fontSize: "11px", fontWeight: 700, boxShadow: `0 4px 12px ${SUCCESS}55` }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#fff" }} /> LIVE
                      </span>
                    )}
                  </div>
                  <div className="text-center">
                    <div style={{ fontFamily: "var(--font-label)", fontSize: "13px", fontWeight: 700, color: INK }}>{service.name}</div>
                    <div className="mt-0.5 inline-flex items-center gap-3" style={{ fontFamily: "var(--font-label)", fontSize: "12px", color: MUTED }}>
                      <span className="inline-flex items-center gap-1"><CalendarDays size={12} /> {service.date}</span>
                      <span className="inline-flex items-center gap-1"><Clock size={12} /> {service.time}</span>
                      <span className="inline-flex items-center gap-1"><MapPin size={12} /> {service.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-3 gap-2.5">
                    <ActionBtn icon={<Maximize2 size={15} />} label="Full Screen" onClick={() => setFullscreen(true)} />
                    <ActionBtn icon={<Download size={15} />} label="Download" onClick={downloadQR} />
                    <ActionBtn icon={<Share2 size={15} />} label="Share" onClick={shareQR} />
                  </div>
                  <div className="rounded-xl p-3.5 flex items-start gap-3" style={{ background: "#F7F6F2", border: `1px solid ${BORDER}` }}>
                    <ShieldCheck size={16} className="mt-0.5 flex-shrink-0" style={{ color: GOLD }} />
                    <p style={{ fontFamily: "var(--font-label)", fontSize: "12px", color: BODY, lineHeight: 1.5 }}>
                      Members scan this code (or open the attend link) at the door to be counted into the service automatically.
                    </p>
                  </div>
                  <SessionControls
                    status={status}
                    onStart={startSession}
                    onPause={pauseSession}
                    onResume={resumeSession}
                    onRegenerate={regenerate}
                  />
                </div>
              </div>
            </Card>

            {/* Right: Session Controls + summary */}
            <div className="flex flex-col gap-5">
              <Card className="p-5 flex flex-col gap-4">
                <SectionTitle>Attendance Summary</SectionTitle>
                <div className="flex flex-col gap-3.5">
                  <SummaryRow label="Registered" value={registered} icon={<Users size={15} />} />
                  <SummaryRow label="Checked in" value={present} icon={<UserCheck size={15} />} />
                  <SummaryRow label="Awaiting" value={Math.max(0, registered - present)} icon={<Activity size={15} />} />
                  <SummaryRow label="Attendance rate" value={`${rate}%`} icon={<TrendingUp size={15} />} accent />
                </div>
                <div className="mt-1 h-2 rounded-full overflow-hidden" style={{ background: "#F0EEE9" }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${rate}%`, background: `linear-gradient(90deg, ${GOLD} 0%, #D99A20 100%)` }} />
                </div>
              </Card>

              <Card className="p-5">
                <SectionTitle>Session Controls</SectionTitle>
                <div className="grid grid-cols-2 gap-2.5">
                  {status === "idle" && <PrimaryBtn icon={<Play size={15} />} label="Start Session" onClick={startSession} full />}
                  {status === "active" && <GoldGhostBtn icon={<Pause size={15} />} label="Pause" onClick={pauseSession} />}
                  {status === "paused" && <PrimaryBtn icon={<Play size={15} />} label="Resume" onClick={resumeSession} />}
                  {(status === "active" || status === "paused") && <ToneBtn icon={<RotateCcw size={15} />} label="Regenerate QR" onClick={regenerate} />}
                  {status === "expired" && <PrimaryBtn icon={<Play size={15} />} label="Start New Session" onClick={startSession} full />}
                  <ToneBtn icon={<Copy size={15} />} label="Copy Link" onClick={copyToken} />
                </div>
                <div className="mt-3 pt-3 flex items-center justify-center gap-1.5" style={{ borderTop: `1px solid ${BORDER}` }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: sm.dot }} />
                  <span style={{ fontFamily: "var(--font-label)", fontSize: "12px", color: MUTED }}>
                    {status === "idle" && "Ready to go live"}
                    {status === "active" && "Members can check in now"}
                    {status === "paused" && "Check-ins temporarily on hold"}
                    {status === "expired" && "Session closed"}
                  </span>
                </div>
              </Card>
            </div>
          </div>

          {/* Bottom grid: Recent check-ins + Session info + Tips */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <Card className="lg:col-span-2 p-5 sm:p-6">
              <SectionTitle
                action={
                  <button className="text-xs font-semibold" style={{ fontFamily: "var(--font-label)", color: GOLD, background: "none", border: "none", cursor: "pointer" }}>
                    View all
                  </button>
                }
              >
                Recent Check-ins
              </SectionTitle>
              <div className="flex flex-col divide-y" style={{ borderColor: "#F3F1EC" }}>
                {checkins.slice(0, 6).map((c) => (
                  <div key={c.id} className="flex items-center gap-3 py-3">
                    <Avatar initials={c.initials} color={c.color} size={38} />
                    <div className="min-w-0 flex-1">
                      <div style={{ fontFamily: "var(--font-label)", fontSize: "13.5px", fontWeight: 600, color: INK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
                      <div style={{ fontFamily: "var(--font-label)", fontSize: "11.5px", color: MUTED }}>{c.id}</div>
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: c.source === "QR" ? "#EAF4FF" : "#F7F6F2", color: c.source === "QR" ? "#1D4ED8" : MUTED, fontFamily: "var(--font-label)", fontSize: "11px", fontWeight: 600 }}>
                      <QrCodeIcon size={11} /> {c.source}
                    </span>
                    <span style={{ fontFamily: "var(--font-label)", fontSize: "12px", color: MUTED, fontVariantNumeric: "tabular-nums" }}>{c.time}</span>
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex flex-col gap-5">
              {/* Session Information */}
              <Card className="p-5">
                <SectionTitle>Session Info</SectionTitle>
                <div className="flex flex-col gap-2.5 text-sm">
                  {[
                    { label: "Service", value: service.name },
                    { label: "Session ID", value: `SES-${sessionToken.slice(-4)}${service.id.slice(-2)}` },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center justify-between">
                      <span style={{ fontFamily: "var(--font-label)", fontSize: "12px", color: MUTED }}>{r.label}</span>
                      <span style={{ fontFamily: "var(--font-label)", fontSize: "12.5px", fontWeight: 600, color: INK }}>{r.value}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between">
                    <span style={{ fontFamily: "var(--font-label)", fontSize: "12px", color: MUTED }}>Session Token</span>
                    <button onClick={copyToken} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg" style={{ fontFamily: "var(--font-label)", fontSize: "11.5px", fontWeight: 600, color: DIALOG_BODY, background: "#F5F4EF", border: `1px solid ${BORDER}`, cursor: "pointer" }}>
                      <Copy size={11} /> <span className="tabular-nums">{sessionToken.slice(0, 4)}····{sessionToken.slice(-4)}</span>
                    </button>
                  </div>
                </div>
                <div className="mt-4 rounded-xl px-3.5 py-3" style={{ background: "#FDF6E9", border: `1px solid #F3E3BE` }}>
                  <p style={{ fontFamily: "var(--font-label)", fontSize: "11.5px", color: "#8A6A18", lineHeight: 1.5 }}>
                    The attend link is scannable by any camera app — no app install required.
                  </p>
                </div>
              </Card>

              {/* Quick tips */}
              <Card className="p-5">
                <SectionTitle><span className="inline-flex items-center gap-2"><Lightbulb size={16} style={{ color: GOLD }} /> Quick Tips</span></SectionTitle>
                <div className="flex flex-col gap-3.5">
                  {QUICK_TIPS.map((t) => (
                    <div key={t.title} className="flex gap-2.5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${GOLD}12` }}>
                        <span style={{ color: GOLD }}>{t.icon}</span>
                      </div>
                      <div>
                        <div style={{ fontFamily: "var(--font-label)", fontSize: "12.5px", fontWeight: 700, color: INK }}>{t.title}</div>
                        <div style={{ fontFamily: "var(--font-label)", fontSize: "11.5px", color: MUTED, lineHeight: 1.45 }}>{t.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* End Session confirmation */}
      <FormDialog
        open={confirmEnd}
        onClose={() => setConfirmEnd(false)}
        icon={<Power size={20} style={{ color: DANGER }} />}
        title="End this attendance session?"
        description="The QR and attend link will stop working. Members who haven’t checked in yet won’t be counted."
        maxWidth="max-w-md"
        primaryButton={{ label: "End Session", onClick: endSession, icon: <Power size={15} /> }}
      >
        <div className="px-6 sm:px-7 py-5" style={{ fontFamily: "var(--font-label)", fontSize: "13px", color: "var(--color-body, #4B5563)", lineHeight: 1.6 }}>
          This will close the live session for <strong style={{ color: DIALOG_BODY }}>{service.name}</strong> and expire
          the {present} recorded check-ins. You can start a new session anytime.
        </div>
      </FormDialog>

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

// ── Sub-components ────────────────────────────────────────────────────────────

function ActionBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-1.5 rounded-xl py-3"
      style={{ background: "#FAFAF7", border: `1px solid ${BORDER}`, color: INK, fontFamily: "var(--font-label)", fontSize: "11.5px", fontWeight: 600, cursor: "pointer", transition: "background .15s,border-color .15s" }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function PrimaryBtn({ icon, label, onClick, full }: { icon: React.ReactNode; label: string; onClick: () => void; full?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl py-2.5 ${full ? "col-span-2" : ""}`}
      style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #D99A20 100%)`, color: "#fff", fontFamily: "var(--font-label)", fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer", boxShadow: `0 6px 16px ${GOLD}30` }}
    >
      {icon} {label}
    </button>
  );
}

function GoldGhostBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 rounded-xl py-2.5"
      style={{ background: `${GOLD}10`, color: GOLD, fontFamily: "var(--font-label)", fontSize: "13px", fontWeight: 700, border: `1.5px solid ${GOLD}40`, cursor: "pointer" }}
    >
      {icon} {label}
    </button>
  );
}

function ToneBtn({ icon, label, onClick, full }: { icon: React.ReactNode; label: string; onClick: () => void; full?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl py-2.5 ${full ? "col-span-2" : ""}`}
      style={{ background: "#FFFFFF", color: DIALOG_BODY, fontFamily: "var(--font-label)", fontSize: "13px", fontWeight: 600, border: `1px solid ${BORDER}`, cursor: "pointer" }}
    >
      {icon} {label}
    </button>
  );
}

function SessionControls({
  status,
  onStart,
  onPause,
  onResume,
  onRegenerate,
}: {
  status: "idle" | "active" | "paused" | "expired";
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onRegenerate: () => void;
}) {
  const active = status === "active" || status === "paused";
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {status === "idle" && <PrimaryBtn icon={<Play size={15} />} label="Start Session" onClick={onStart} full />}
      {status === "active" && <GoldGhostBtn icon={<Pause size={15} />} label="Pause" onClick={onPause} />}
      {status === "paused" && <PrimaryBtn icon={<Play size={15} />} label="Resume" onClick={onResume} />}
      {active && <ToneBtn icon={<RotateCcw size={15} />} label="Regenerate" onClick={onRegenerate} />}
      {(status === "idle" || status === "expired") && (
        <ToneBtn icon={<RotateCcw size={15} />} label="New QR" onClick={onRegenerate} />
      )}
    </div>
  );
}

function SummaryRow({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="inline-flex items-center gap-2" style={{ fontFamily: "var(--font-label)", fontSize: "12.5px", color: MUTED, fontWeight: 500 }}>
        <span style={{ color: accent ? GOLD : MUTED }}>{icon}</span>
        {label}
      </span>
      <span style={{ fontFamily: "var(--font-label)", fontSize: "14px", fontWeight: 700, color: accent ? GOLD : INK }}>{value}</span>
    </div>
  );
}
