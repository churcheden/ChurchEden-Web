import { useState, useEffect, useRef } from "react";
import {
  X, Search, UserPlus, Wifi, WifiOff, ChevronDown,
  QrCode, Users, CheckCircle2, Clock, AlertTriangle, Check, Camera,
} from "lucide-react";

// ─── Tokens ───────────────────────────────────────────────────────────────────

const BRAND = "#C8860A";
const SUCCESS = "#22C55E";
const WARN = "#F59E0B";
const DANGER = "#EF4444";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_MEMBERS = [
  { id: "MBR-0041", name: "Dr. Kwame Asante", ministry: "All Members", initials: "KA", color: "#2D1B69", checkedIn: false, checkTime: "" },
  { id: "MBR-0018", name: "Sis. Grace Mensah", ministry: "Choir", initials: "GM", color: BRAND, checkedIn: true, checkTime: "8:52 AM" },
  { id: "MBR-0072", name: "Bro. Yaw Amponsah", ministry: "Youth", initials: "YA", color: "#0A4A3A", checkedIn: false, checkTime: "" },
  { id: "MBR-0033", name: "Elder Abena Osei", ministry: "Prayer Team", initials: "AO", color: "#7C3AED", checkedIn: true, checkTime: "9:01 AM" },
  { id: "MBR-0055", name: "Sis. Ama Boateng", ministry: "Children's", initials: "AB", color: "#B45309", checkedIn: false, checkTime: "" },
  { id: "MBR-0011", name: "Deacon Kofi Mensah", ministry: "All Members", initials: "KM", color: "#2D1B69", checkedIn: true, checkTime: "8:44 AM" },
  { id: "MBR-0029", name: "Sis. Akosua Darko", ministry: "Media", initials: "AD", color: "#DB2777", checkedIn: false, checkTime: "" },
  { id: "MBR-0064", name: "Bro. Emmanuel Ofori", ministry: "Youth", initials: "EO", color: "#0A4A3A", checkedIn: true, checkTime: "9:10 AM" },
];

const LIVE_FEED_INIT = [
  { name: "Elder Abena Osei", time: "9:01 AM", initials: "AO", color: "#7C3AED" },
  { name: "Deacon Kofi Mensah", time: "8:44 AM", initials: "KM", color: "#2D1B69" },
  { name: "Sis. Grace Mensah", time: "8:52 AM", initials: "GM", color: BRAND },
  { name: "Bro. Emmanuel Ofori", time: "9:10 AM", initials: "EO", color: "#0A4A3A" },
  { name: "Dr. Kwame Asante", time: "9:04 AM", initials: "KA", color: "#2D1B69" },
];

type ScanState = "idle" | "success" | "duplicate" | "notfound";
type Mode = "scan" | "manual";

// ─── Small atoms ─────────────────────────────────────────────────────────────

function Avatar({ initials, color, size = 36 }: { initials: string; color: string; size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `${color}30`, border: `2px solid ${color}60`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontFamily: "var(--font-label)", fontSize: size * 0.34, fontWeight: 700, color }}>{initials}</span>
    </div>
  );
}

// ─── Corner bracket SVG ───────────────────────────────────────────────────────

function CornerBrackets({ color, size = 28, thickness = 3 }: { color: string; size?: number; thickness?: number }) {
  const s = size;
  const t = thickness;
  const corners = [
    // top-left
    `M 0 ${s} L 0 0 L ${s} 0`,
    // top-right (reflected)
    `M 0 ${s} L 0 0 L ${-s} 0`,
    // bottom-left
    `M 0 ${-s} L 0 0 L ${s} 0`,
    // bottom-right
    `M 0 ${-s} L 0 0 L ${-s} 0`,
  ];
  const positions = [
    { top: 0, left: 0 },
    { top: 0, right: 0 },
    { bottom: 0, left: 0 },
    { bottom: 0, right: 0 },
  ];
  return (
    <>
      {corners.map((d, i) => (
        <svg
          key={i}
          width={s} height={s}
          viewBox={`${-s} ${-s} ${s * 2} ${s * 2}`}
          style={{ position: "absolute", ...positions[i] }}
        >
          <path d={d} fill="none" stroke={color} strokeWidth={t} strokeLinecap="round" />
        </svg>
      ))}
    </>
  );
}

// ─── Scan Zone ────────────────────────────────────────────────────────────────

function ScanZone({ scanState }: { scanState: ScanState }) {
  const borderColor =
    scanState === "success" ? SUCCESS :
    scanState === "duplicate" ? WARN :
    scanState === "notfound" ? DANGER :
    "rgba(255,255,255,0.15)";

  const bracketColor =
    scanState === "idle" ? BRAND :
    scanState === "success" ? SUCCESS :
    scanState === "duplicate" ? WARN :
    DANGER;

  return (
    <div style={{
      position: "relative",
      width: "100%",
      maxWidth: 340,
      aspectRatio: "1 / 1",
      borderRadius: 20,
      border: `2.5px solid ${borderColor}`,
      background: "rgba(255,255,255,0.03)",
      overflow: "hidden",
      transition: "border-color 0.3s",
      boxShadow: scanState === "success" ? `0 0 32px rgba(34,197,94,0.25)` :
                 scanState === "duplicate" ? `0 0 32px rgba(245,158,11,0.25)` :
                 scanState === "notfound" ? `0 0 32px rgba(239,68,68,0.25)` :
                 "0 0 40px rgba(0,0,0,0.6)",
    }}>
      {/* Corner brackets overlay */}
      <div style={{ position: "absolute", inset: 12, pointerEvents: "none" }}>
        <CornerBrackets color={bracketColor} size={28} thickness={3} />
      </div>

      {/* Simulated camera content */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #111 0%, #1a1a1a 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ opacity: 0.08 }}>
          <QrCode size={120} color="#fff" />
        </div>
      </div>

      {/* Scanning line — only in idle */}
      {scanState === "idle" && (
        <div style={{
          position: "absolute", left: 16, right: 16, height: 2,
          background: `linear-gradient(90deg, transparent, ${BRAND}, transparent)`,
          boxShadow: `0 0 8px ${BRAND}`,
          animation: "scanLine 2s ease-in-out infinite",
        }} />
      )}

      {/* State overlays */}
      {scanState === "success" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, background: "rgba(34,197,94,0.12)" }}>
          <CheckCircle2 size={56} color={SUCCESS} strokeWidth={1.5} />
          <span style={{ fontFamily: "var(--font-label)", fontSize: 16, fontWeight: 700, color: SUCCESS }}>Verified</span>
        </div>
      )}
      {scanState === "duplicate" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, background: "rgba(245,158,11,0.12)" }}>
          <AlertTriangle size={52} color={WARN} strokeWidth={1.5} />
          <span style={{ fontFamily: "var(--font-label)", fontSize: 15, fontWeight: 700, color: WARN }}>Already Checked In</span>
        </div>
      )}
      {scanState === "notfound" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, background: "rgba(239,68,68,0.12)" }}>
          <X size={52} color={DANGER} strokeWidth={1.5} />
          <span style={{ fontFamily: "var(--font-label)", fontSize: 15, fontWeight: 700, color: DANGER }}>Not Found</span>
        </div>
      )}
    </div>
  );
}

// ─── Member Card (slides up on scan) ─────────────────────────────────────────

function CheckInCard({ member, scanState }: {
  member: typeof MOCK_MEMBERS[0] | null;
  scanState: ScanState;
}) {
  if (!member || scanState === "idle") return null;

  const isLate = false; // would check against service start time

  const stateConfig = {
    success: { label: `Checked In — ${new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`, color: SUCCESS, bg: "rgba(34,197,94,0.12)" },
    duplicate: { label: `Already checked in at ${member.checkTime}`, color: WARN, bg: "rgba(245,158,11,0.10)" },
    notfound: { label: "Member not found — Try manual search", color: DANGER, bg: "rgba(239,68,68,0.10)" },
    idle: { label: "", color: "", bg: "" },
  }[scanState];

  return (
    <div style={{
      background: "#1A1A1A",
      borderRadius: 20,
      border: `1px solid rgba(255,255,255,0.10)`,
      padding: "20px 24px",
      display: "flex",
      alignItems: "center",
      gap: 18,
      animation: "slideUp 0.3s ease-out",
      boxShadow: "0 -8px 40px rgba(0,0,0,0.5)",
    }}>
      {scanState !== "notfound" ? (
        <>
          <Avatar initials={member.initials} color={member.color} size={56} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-label)", fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{member.name}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{member.ministry}</span>
              {isLate && <span style={{ fontFamily: "var(--font-label)", fontSize: 11, fontWeight: 600, color: WARN, background: "rgba(245,158,11,0.15)", padding: "2px 8px", borderRadius: 99 }}>Late</span>}
            </div>
            <div style={{ fontFamily: "var(--font-label)", fontSize: 14, fontWeight: 700, color: stateConfig.color, marginTop: 6 }}>{stateConfig.label}</div>
          </div>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: stateConfig.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {scanState === "success" && <CheckCircle2 size={24} color={SUCCESS} />}
            {scanState === "duplicate" && <AlertTriangle size={24} color={WARN} />}
          </div>
        </>
      ) : (
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-label)", fontSize: 15, fontWeight: 600, color: DANGER }}>{stateConfig.label}</div>
        </div>
      )}
    </div>
  );
}

// ─── Guest Check-in Modal ─────────────────────────────────────────────────────

function GuestModal({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }} />
      <div style={{ position: "relative", background: "#1A1A1A", borderRadius: 20, padding: "28px 28px", width: "min(460px, 90vw)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 24px 60px rgba(0,0,0,0.6)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <span style={{ fontFamily: "var(--font-label)", fontSize: 16, fontWeight: 700, color: "#fff" }}>Log First-Timer Guest</span>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 99, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={14} color="rgba(255,255,255,0.6)" />
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { label: "Full Name", placeholder: "Guest's full name", type: "text" },
            { label: "Phone Number", placeholder: "+233 …", type: "tel" },
          ].map(f => (
            <div key={f.label}>
              <label style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>{f.label}</label>
              <input type={f.type} placeholder={f.placeholder}
                style={{ background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "10px 14px", fontFamily: "var(--font-label)", fontSize: 13, color: "#fff", outline: "none", width: "100%", boxSizing: "border-box" as const }} />
            </div>
          ))}
          <div>
            <label style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>How did you hear about us?</label>
            <select style={{ background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "10px 14px", fontFamily: "var(--font-label)", fontSize: 13, color: "#fff", outline: "none", width: "100%" }}>
              <option>Friend / Family</option>
              <option>Social Media</option>
              <option>Walked in</option>
              <option>Online / YouTube</option>
              <option>Flyer / Billboard</option>
            </select>
          </div>
          <button style={{ background: BRAND, color: "#fff", border: "none", borderRadius: 99, padding: "12px", fontFamily: "var(--font-label)", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 4 }}>
            Log Guest Check-in
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main QR Attendance Page ──────────────────────────────────────────────────

export function QRAttendancePage() {
  const [mode, setMode] = useState<Mode>("scan");
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [scannedMember, setScannedMember] = useState<typeof MOCK_MEMBERS[0] | null>(null);
  const [checkedInCount, setCheckedInCount] = useState(142);
  const [liveFeed, setLiveFeed] = useState(LIVE_FEED_INIT);
  const [search, setSearch] = useState("");
  const [showGuest, setShowGuest] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filteredMembers = MOCK_MEMBERS.filter(m =>
    !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.id.toLowerCase().includes(search.toLowerCase())
  );

  function simulateScan(state: ScanState, member?: typeof MOCK_MEMBERS[0]) {
    setScanState(state);
    setScannedMember(member ?? null);
    if (state === "success" && member) {
      setCheckedInCount(c => c + 1);
      setLiveFeed(prev => [{ name: member.name, time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }), initials: member.initials, color: member.color }, ...prev.slice(0, 4)]);
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { setScanState("idle"); setScannedMember(null); }, 2500);
  }

  function manualCheckIn(member: typeof MOCK_MEMBERS[0]) {
    if (member.checkedIn) return;
    simulateScan("success", member);
  }

  const absent = 340 - checkedInCount;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: "#0A0A0A" }}>

      {/* ── Top bar ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
        {/* Logo + event */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: BRAND, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 800, color: "#fff" }}>GC</span>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 700, color: "#fff" }}>Sunday Morning Service</div>
            <div style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Jun 4, 2026</div>
          </div>
        </div>

        {/* Center: mode toggle */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.07)", borderRadius: 10, padding: 3, gap: 2 }}>
          {([{ key: "scan" as Mode, icon: Camera, label: "Scan QR" }, { key: "manual" as Mode, icon: Search, label: "Manual Search" }]).map(m => (
            <button key={m.key} onClick={() => { setMode(m.key); setScanState("idle"); }}
              style={{ padding: "7px 18px", borderRadius: 8, border: "none", background: mode === m.key ? "rgba(255,255,255,0.12)" : "transparent", color: mode === m.key ? "#fff" : "rgba(255,255,255,0.4)", fontFamily: "var(--font-label)", fontSize: 13, fontWeight: mode === m.key ? 700 : 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <m.icon size={14} />{m.label}
            </button>
          ))}
        </div>

        {/* Right: counter + offline + end */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {isOffline && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.15)", borderRadius: 99, padding: "5px 12px" }}>
              <WifiOff size={13} color={WARN} />
              <span style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: WARN }}>Offline — syncing when connected</span>
            </div>
          )}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "var(--font-label)", fontSize: 22, fontWeight: 800, color: BRAND }}>{checkedInCount}</div>
            <div style={{ fontFamily: "var(--font-label)", fontSize: 10, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Checked In</div>
          </div>
          <button style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 99, padding: "7px 16px", fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.6)", cursor: "pointer" }}>
            End Session
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* SCAN MODE */}
        {mode === "scan" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: "24px" }}>

            <ScanZone scanState={scanState} />

            <div style={{ fontFamily: "var(--font-label)", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
              Point camera at member's QR code
            </div>

            {/* Demo trigger buttons */}
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "rgba(255,255,255,0.25)", alignSelf: "center" }}>Simulate:</span>
              <button onClick={() => simulateScan("success", MOCK_MEMBERS[0])} style={{ ...demoBtn(SUCCESS), display: "flex", alignItems: "center", gap: 5 }}><Check size={13} /> Success</button>
              <button onClick={() => simulateScan("duplicate", MOCK_MEMBERS[1])} style={{ ...demoBtn(WARN), display: "flex", alignItems: "center", gap: 5 }}><AlertTriangle size={13} /> Duplicate</button>
              <button onClick={() => simulateScan("notfound")} style={{ ...demoBtn(DANGER), display: "flex", alignItems: "center", gap: 5 }}><X size={13} /> Not Found</button>
            </div>

            {/* Checked-in card */}
            <div style={{ width: "100%", maxWidth: 460 }}>
              <CheckInCard member={scannedMember} scanState={scanState} />
            </div>
          </div>
        )}

        {/* MANUAL SEARCH MODE */}
        {mode === "manual" && (
          <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
            <div style={{ maxWidth: 560, margin: "0 auto" }}>
              {/* Search bar */}
              <div style={{ position: "relative", marginBottom: 20 }}>
                <Search size={18} color="rgba(255,255,255,0.3)" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  autoFocus
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name, phone, or member ID…"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "14px 16px 14px 48px", fontFamily: "var(--font-label)", fontSize: 15, color: "#fff", outline: "none", width: "100%", boxSizing: "border-box" as const }}
                />
              </div>

              {/* Results */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {filteredMembers.map(m => (
                  <div key={m.id} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.09)", padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                    <Avatar initials={m.initials} color={m.color} size={40} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "var(--font-label)", fontSize: 14, fontWeight: 600, color: "#fff" }}>{m.name}</div>
                      <div style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{m.ministry} · {m.id}</div>
                    </div>
                    {m.checkedIn ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(34,197,94,0.12)", borderRadius: 99, padding: "6px 14px" }}>
                        <CheckCircle2 size={14} color={SUCCESS} />
                        <span style={{ fontFamily: "var(--font-label)", fontSize: 12, fontWeight: 600, color: SUCCESS }}>Checked In {m.checkTime}</span>
                      </div>
                    ) : (
                      <button onClick={() => manualCheckIn(m)}
                        style={{ background: BRAND, border: "none", borderRadius: 99, padding: "8px 20px", fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
                        Check In
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom panel ── */}
      <div style={{ background: "#111", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "14px 24px", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 0, alignItems: "stretch" }}>
          {/* Stats */}
          <div style={{ display: "flex", gap: 24, paddingRight: 24, borderRight: "1px solid rgba(255,255,255,0.08)" }}>
            {[
              { label: "Expected", value: "340", color: "rgba(255,255,255,0.6)" },
              { label: "Checked In", value: String(checkedInCount), color: BRAND },
              { label: "Absent", value: String(absent), color: "rgba(255,255,255,0.25)" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-label)", fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontFamily: "var(--font-label)", fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Live feed */}
          <div style={{ flex: 1, paddingLeft: 24, overflow: "hidden" }}>
            <div style={{ fontFamily: "var(--font-label)", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Recent Check-ins</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {liveFeed.slice(0, 4).map((entry, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, opacity: 1 - i * 0.18, animation: i === 0 ? "slideInFeed 0.3s ease-out" : "none" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: `${entry.color}30`, border: `1.5px solid ${entry.color}60`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: "var(--font-label)", fontSize: 7, fontWeight: 700, color: entry.color }}>{entry.initials}</span>
                  </div>
                  <span style={{ fontFamily: "var(--font-label)", fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{entry.name}</span>
                  <span style={{ fontFamily: "var(--font-label)", fontSize: 11, color: "rgba(255,255,255,0.3)", marginLeft: "auto" }}>{entry.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Guest button */}
          <div style={{ paddingLeft: 24, borderLeft: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center" }}>
            <button onClick={() => setShowGuest(true)}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.12)", borderRadius: 99, padding: "10px 18px", fontFamily: "var(--font-label)", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", cursor: "pointer" }}>
              <UserPlus size={15} />Log Guest
            </button>
          </div>
        </div>
      </div>

      {showGuest && <GuestModal onClose={() => setShowGuest(false)} />}

      <style>{`
        @keyframes scanLine {
          0% { top: 10%; }
          50% { top: 85%; }
          100% { top: 10%; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInFeed {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function demoBtn(color: string): React.CSSProperties {
  return {
    background: `${color}18`,
    border: `1.5px solid ${color}40`,
    borderRadius: 99,
    padding: "6px 14px",
    fontFamily: "var(--font-label)",
    fontSize: 12,
    fontWeight: 600,
    color,
    cursor: "pointer",
  };
}
