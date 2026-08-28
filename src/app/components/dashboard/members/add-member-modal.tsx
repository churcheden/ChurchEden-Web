import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  UserPlus, UploadCloud, Calendar, MapPin, Briefcase,
  ChevronDown, Check, Search, Mail, Phone, Trash2,
} from "lucide-react";
import type { Member } from "./mock-data";
import { FormDialog } from "../form-dialog";

// ─── Design tokens (match dashboard) ─────────────────────────────────────────
const GOLD          = "#C8860A";
const INK           = "#1A1A1A";
const MUTED         = "#9CA3AF";
const BORDER        = "#E8E4DE";
const BORDER_SOFT   = "#EDEAE6";
const ERROR         = "#B3261E";
const FONT          = "var(--font-label)";

const MINISTRIES = [
  "Choir",
  "Ushering",
  "Prayer Team",
  "Media & Tech",
  "Youth Ministry",
  "Evangelism",
  "Children's Ministry",
  "Welfare Committee",
  "Men's Fellowship",
  "Women's Fellowship",
];

const GENDERS = ["Male", "Female", "Other / Prefer not to say"];

const AVATAR_COLORS = ["#C8860A", "#2D1B69", "#0A4A3A", "#7C3AED", "#1A0533", "#0A7A4A"];

// ─── Small primitives ────────────────────────────────────────────────────────

function FieldLabel({ required, children }: { required?: boolean; children: React.ReactNode }) {
  return (
    <label
      style={{ fontSize: "12.5px", fontWeight: 600, color: INK, fontFamily: FONT, letterSpacing: "0.01em", marginBottom: "7px", display: "block" }}
    >
      {children}
      {required && <span style={{ color: GOLD, fontWeight: 700, marginLeft: "2px" }}>*</span>}
    </label>
  );
}

function ErrorText({ message }: { message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{ fontSize: "12px", color: ERROR, fontFamily: FONT, marginTop: "6px", display: "flex", alignItems: "center", gap: "5px" }}
        >
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: ERROR, flexShrink: 0 }} />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function IconInput({
  icon,
  value,
  onChange,
  onBlur,
  placeholder,
  invalid,
  type = "text",
  maxLength,
  ariaLabel,
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  invalid?: boolean;
  type?: string;
  maxLength?: number;
  ariaLabel?: string;
}) {
  const [focused, setFocused] = useState(false);
  const borderColor = focused ? GOLD : invalid ? ERROR : value ? GOLD : BORDER;
  const boxShadow = focused
    ? "0 0 0 3px rgba(200,134,10,0.12)"
    : invalid
    ? "0 0 0 3px rgba(179,38,30,0.08)"
    : "none";
  return (
    <div className="relative">
      <span
        className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center"
        style={{ color: focused ? GOLD : MUTED, transition: "color 0.18s ease" }}
      >
        {icon}
      </span>
      <input
        type={type}
        value={value}
        maxLength={maxLength}
        aria-label={ariaLabel}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => { setFocused(false); onBlur?.(); }}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          fontSize: "13.5px",
          color: INK,
          fontFamily: FONT,
          padding: "11px 14px",
          paddingLeft: "40px",
          borderRadius: "10px",
          border: `1px solid ${borderColor}`,
          background: "#FFFFFF",
          outline: "none",
          boxShadow,
          transition: "border-color 0.18s ease, box-shadow 0.18s ease",
        }}
      />
    </div>
  );
}

// ─── Gender / single select dropdown ─────────────────────────────────────────
function SelectField({
  label, placeholder, value, options, onChange, required,
}: {
  label: string; placeholder: string; value: string; options: string[]; onChange: (v: string) => void; required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <FieldLabel required={required}>{label}</FieldLabel>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="w-full flex items-center justify-between rounded-[10px] transition-colors"
          style={{
            padding: "11px 14px",
            fontSize: "13.5px",
            fontFamily: FONT,
            color: value ? INK : MUTED,
            background: "#FFFFFF",
            border: `1px solid ${value ? GOLD : BORDER}`,
            textAlign: "left",
          }}
        >
          <span>{value || placeholder}</span>
          <ChevronDown size={15} color={MUTED} style={{ transition: "transform 0.18s ease", transform: open ? "rotate(180deg)" : "none" }} />
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div
              className="absolute top-full mt-1.5 left-0 right-0 z-20 rounded-xl py-1.5 overflow-hidden"
              style={{ background: "#FFFFFF", boxShadow: "0 12px 32px rgba(0,0,0,0.12)", border: `1px solid ${BORDER}` }}
            >
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => { onChange(opt); setOpen(false); }}
                  className="w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-[#FAFAF8] transition-colors"
                  style={{ fontSize: "13.5px", fontFamily: FONT, color: opt === value ? GOLD : INK, fontWeight: opt === value ? 600 : 400 }}
                >
                  {opt}
                  {opt === value && <Check size={15} color={GOLD} />}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Searchable dropdown (Department / Ministry) ─────────────────────────────
function SearchableSelect({
  label, placeholder, value, options, onChange,
}: {
  label: string; placeholder: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filtered = options.filter((o) => o.toLowerCase().includes(query.toLowerCase()));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="w-full flex items-center justify-between rounded-[10px] transition-colors"
          style={{
            padding: "11px 14px",
            fontSize: "13.5px",
            fontFamily: FONT,
            color: value ? INK : MUTED,
            background: "#FFFFFF",
            border: `1px solid ${value ? GOLD : BORDER}`,
            textAlign: "left",
          }}
        >
          <span>{value || placeholder}</span>
          <ChevronDown size={15} color={MUTED} style={{ transition: "transform 0.18s ease", transform: open ? "rotate(180deg)" : "none" }} />
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div
              className="absolute top-full mt-1.5 left-0 right-0 z-30 rounded-xl overflow-hidden"
              style={{ background: "#FFFFFF", boxShadow: "0 12px 32px rgba(0,0,0,0.12)", border: `1px solid ${BORDER}` }}
            >
              <div className="flex items-center gap-2 border-b px-3.5 py-2.5" style={{ borderColor: BORDER_SOFT, background: "#FAFAF8" }}>
                <Search size={14} color={MUTED} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search ministries..."
                  className="bg-transparent outline-none flex-1"
                  style={{ fontSize: "13px", fontFamily: FONT, color: INK }}
                />
              </div>
              <div className="max-h-48 overflow-y-auto py-1">
                {filtered.length === 0 ? (
                  <div className="px-4 py-4 text-center" style={{ fontSize: "12.5px", color: MUTED, fontFamily: FONT }}>
                    No ministry matches “{query}”
                  </div>
                ) : (
                  filtered.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => { onChange(opt); setOpen(false); setQuery(""); }}
                      className="w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-[#FAFAF8] transition-colors"
                      style={{ fontSize: "13.5px", fontFamily: FONT, color: opt === value ? GOLD : INK, fontWeight: opt === value ? 600 : 400 }}
                    >
                      {opt}
                      {opt === value && <Check size={15} color={GOLD} />}
                    </button>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Date of birth picker (inline calendar) ──────────────────────────────────
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function DateOfBirthField({
  value, onChange, invalid,
}: {
  value: string; onChange: (v: string) => void; invalid?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState({ year: new Date().getFullYear() - 30, month: new Date().getMonth() });
  const today = new Date();

  const parse = (s: string) => (s ? new Date(s) : null);
  const sel = parse(value);

  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const firstDay = new Date(view.year, view.month, 1).getDay();

  const buildDate = (y: number, m: number, d: number) => {
    const dt = new Date(y, m, d);
    return dt.toISOString().slice(0, 10);
  };

  const pick = (day: number) => {
    onChange(buildDate(view.year, view.month, day));
    setOpen(false);
  };

  return (
    <div>
      <FieldLabel>Date of Birth</FieldLabel>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: MUTED }}>
          <Calendar size={16} />
        </span>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full text-left rounded-[10px] transition-colors"
          style={{
            padding: "11px 14px",
            paddingLeft: "40px",
            fontSize: "13.5px",
            fontFamily: FONT,
            color: sel ? INK : MUTED,
            background: "#FFFFFF",
            border: `1px solid ${invalid ? ERROR : sel ? GOLD : BORDER}`,
          }}
        >
          {sel ? `${MONTHS[sel.getMonth()]} ${sel.getDate()}, ${sel.getFullYear()}` : "Select date of birth"}
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div
              className="absolute top-full mt-1.5 left-0 z-30 rounded-xl overflow-hidden w-[300px]"
              style={{ background: "#FFFFFF", boxShadow: "0 12px 32px rgba(0,0,0,0.12)", border: `1px solid ${BORDER}` }}
            >
              <div className="flex items-center justify-between px-3 py-2.5" style={{ borderBottom: `1px solid ${BORDER_SOFT}` }}>
                <button
                  type="button"
                  onClick={() => { const m = view.month - 1; if (m < 0) setView({ year: view.year - 1, month: 11 }); else setView({ ...view, month: m }); }}
                  className="w-8 h-8 rounded-lg hover:bg-[#FAFAF8] transition-colors flex items-center justify-center"
                  style={{ color: MUTED }}
                  aria-label="Previous month"
                >
                  ‹
                </button>
                <div style={{ fontSize: "13.5px", fontWeight: 600, color: INK, fontFamily: FONT }}>
                  {MONTHS[view.month]} {view.year}
                </div>
                <button
                  type="button"
                  onClick={() => { const m = view.month + 1; if (m > 11) setView({ year: view.year + 1, month: 0 }); else setView({ ...view, month: m }); }}
                  className="w-8 h-8 rounded-lg hover:bg-[#FAFAF8] transition-colors flex items-center justify-center"
                  style={{ color: MUTED }}
                  aria-label="Next month"
                >
                  ›
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 px-3 pt-2.5">
                {["S","M","T","W","T","F","S"].map((d, i) => (
                  <div key={i} className="text-center" style={{ fontSize: "10px", fontWeight: 600, color: MUTED, fontFamily: FONT, paddingBottom: 4 }}>
                    {d}
                  </div>
                ))}
                {Array.from({ length: firstDay }).map((_, i) => <div key={`b${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dt = buildDate(view.year, view.month, day);
                  const isSel = sel && sel.toISOString().slice(0, 10) === dt;
                  const isFuture = new Date(view.year, view.month, day) > today;
                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={isFuture}
                      onClick={() => pick(day)}
                      className="flex items-center justify-center rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{
                        height: 32,
                        fontSize: "12.5px",
                        fontFamily: FONT,
                        color: isSel ? "#FFFFFF" : isFuture ? MUTED : INK,
                        background: isSel ? GOLD : "transparent",
                        fontWeight: isSel ? 700 : 400,
                      }}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
              <div className="px-3 pb-2.5 pt-1.5 text-right">
                <button
                  type="button"
                  onClick={() => { setOpen(false); onChange(""); }}
                  className="text-[12px] hover:underline"
                  style={{ color: MUTED, fontFamily: FONT }}
                >
                  Clear
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Photo upload ────────────────────────────────────────────────────────────
function PhotoUpload({ value, onChange }: { value: string | null; onChange: (d: string | null) => void }) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <FieldLabel>Profile Photo</FieldLabel>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files?.[0]); }}
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
        aria-label="Upload profile photo"
        className="relative w-full rounded-xl flex items-center gap-3 transition-all cursor-pointer overflow-hidden group"
        style={{
          border: `1.5px dashed ${dragOver ? GOLD : BORDER}`,
          background: dragOver ? "rgba(200,134,10,0.05)" : "#FAFAF8",
          minHeight: "92px",
          padding: "16px",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {value ? (
          <>
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 relative" style={{ border: `1px solid ${BORDER}` }}>
              <img src={value} alt="Profile preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div style={{ fontSize: "13px", fontWeight: 600, color: INK, fontFamily: FONT }}>Photo ready</div>
              <div style={{ fontSize: "11.5px", color: MUTED, fontFamily: FONT }}>Click or drop to replace</div>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(null); }}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#F0EEE9] transition-colors flex-shrink-0"
              style={{ color: MUTED }}
              aria-label="Remove photo"
            >
              <Trash2 size={15} />
            </button>
          </>
        ) : (
          <>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
              style={{ background: "rgba(200,134,10,0.10)" }}
            >
              <UploadCloud size={20} color={GOLD} />
            </div>
            <div className="min-w-0">
              <div style={{ fontSize: "13px", fontWeight: 600, color: INK, fontFamily: FONT }}>Upload photo</div>
              <div style={{ fontSize: "11.5px", color: MUTED, fontFamily: FONT }}>JPG, PNG or WEBP · Max 5MB</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Date joined info card ───────────────────────────────────────────────────
function DateJoinedCard() {
  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3.5"
      style={{ background: "rgba(200,134,10,0.07)", border: `1px solid rgba(200,134,10,0.18)` }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(200,134,10,0.12)" }}
      >
        <Calendar size={16} color={GOLD} />
      </div>
      <div className="min-w-0">
        <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#8A5E08", fontFamily: FONT }}>Date Joined</div>
        <div style={{ fontSize: "12px", color: "#A0772B", fontFamily: FONT, marginTop: "1px" }}>
          This will be set automatically when the member is added.
        </div>
      </div>
    </div>
  );
}

// ─── Main modal ──────────────────────────────────────────────────────────────
interface FormState {
  firstName: string; lastName: string; phone: string;
  email: string; gender: string; dob: string; address: string;
  occupation: string; ministry: string; photo: string | null;
}

export function AddMemberModal({
  open, onClose, onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (member: Member) => void;
}) {
  const [form, setForm] = useState<FormState>({
    firstName: "", lastName: "", phone: "", email: "", gender: "", dob: "", address: "", occupation: "", ministry: "", photo: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({ firstName: "", lastName: "", phone: "", email: "", gender: "", dob: "", address: "", occupation: "", ministry: "", photo: null });
      setErrors({});
      setSubmitting(false);
    }
  }, [open]);

  const set = (key: keyof FormState, value: string | null) => {
    setForm((f) => ({ ...f, [key]: value as never }));
    setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  };

  const validate = (f: FormState) => {
    const e: Record<string, string> = {};
    if (!f.firstName.trim()) e.firstName = "First name is required.";
    if (!f.lastName.trim()) e.lastName = "Last name is required.";
    const digits = f.phone.replace(/\D/g, "");
    if (!f.phone.trim()) e.phone = "Phone number is required.";
    else if (digits.length < 9 || digits.length > 14) e.phone = "Enter a valid phone number.";
    if (f.email.trim()) {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim());
      if (!ok) e.email = "Enter a valid email address.";
    }
    if (f.dob) {
      const d = new Date(f.dob);
      if (d > new Date()) e.dob = "Date of birth cannot be in the future.";
    }
    return e;
  };

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSubmitting(true);
    const first = form.firstName.trim();
    const last = form.lastName.trim();
    const name = `${first} ${last}`;
    const phone = form.phone.trim();

    setTimeout(() => {
      const now = new Date();
      const joinDate = `${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
      const member: Member = {
        id: `new-${Date.now()}`,
        name,
        initials: `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase(),
        avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
        phone,
        email: form.email.trim(),
        ministry: form.ministry || "Choir",
        ministries: form.ministry ? [form.ministry] : [],
        joinDate,
        status: "Active",
        gender: (form.gender === "Male" ? "Male" : form.gender === "Female" ? "Female" : "Male") as Member["gender"],
        address: form.address.trim(),
        birthday: form.dob ? formatDate(form.dob) : "",
        baptismDate: "",
        confirmationDate: "",
        salvationDate: "",
        children: [],
        totalGivingYTD: 0,
        attendanceRate: 0,
        eventsAttended: 0,
        streak: 0,
        givingHistory: [],
        serviceAttendance: [],
        milestones: [],
        notes: [],
      };
      setTimeout(() => {
        onAdd(member);
        onClose();
        setSubmitting(false);
      }, 300);
    }, 600);
  };

  // Focus first field on open
  const firstNameRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open) setTimeout(() => firstNameRef.current?.querySelector("input")?.focus(), 50);
  }, [open]);

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      icon={<UserPlus size={20} color={GOLD} />}
      title="Add New Member"
      description="Add a new member to your church directory."
      submitFormId="add-member-form"
      submitting={submitting}
      primaryButton={{
        label: "Add Member",
        icon: <UserPlus size={15} color="#FFFFFF" />,
        loadingLabel: "Adding...",
        onClick: () => {},
      }}
    >
      <form id="add-member-form" onSubmit={handleSubmit} className="px-6 sm:px-7 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">
                {/* First name */}
                <div ref={firstNameRef}>
                  <FieldLabel required>First Name</FieldLabel>
                  <IconInput
                    icon={<UserPlus size={15} />}
                    ariaLabel="First name"
                    placeholder="e.g. Emmanuel"
                    value={form.firstName}
                    onChange={(v) => set("firstName", v)}
                    onBlur={() => { if (!form.firstName.trim()) setErrors((e) => ({ ...e, firstName: "First name is required." })); }}
                    invalid={!!errors.firstName}
                  />
                  <ErrorText message={errors.firstName} />
                </div>

                {/* Last name */}
                <div>
                  <FieldLabel required>Last Name</FieldLabel>
                  <IconInput
                    icon={<UserPlus size={15} />}
                    ariaLabel="Last name"
                    placeholder="e.g. Asante"
                    value={form.lastName}
                    onChange={(v) => set("lastName", v)}
                    onBlur={() => { if (!form.lastName.trim()) setErrors((e) => ({ ...e, lastName: "Last name is required." })); }}
                    invalid={!!errors.lastName}
                  />
                  <ErrorText message={errors.lastName} />
                </div>

                {/* Phone */}
                <div>
                  <FieldLabel required>Phone Number</FieldLabel>
                  <IconInput
                    icon={<Phone size={15} />}
                    ariaLabel="Phone number"
                    placeholder="e.g. +233 24 123 4567"
                    type="tel"
                    value={form.phone}
                    onChange={(v) => set("phone", v)}
                    onBlur={() => {
                      const d = form.phone.replace(/\D/g, "");
                      if (!form.phone.trim()) setErrors((e) => ({ ...e, phone: "Phone number is required." }));
                      else if (d.length < 9 || d.length > 14) setErrors((e) => ({ ...e, phone: "Enter a valid phone number." }));
                    }}
                    invalid={!!errors.phone}
                  />
                  <ErrorText message={errors.phone} />
                </div>

                {/* Email */}
                <div>
                  <FieldLabel>Email Address</FieldLabel>
                  <IconInput
                    icon={<Mail size={15} />}
                    ariaLabel="Email address"
                    placeholder="name@church.com"
                    type="email"
                    value={form.email}
                    onChange={(v) => set("email", v)}
                    onBlur={() => {
                      const v = form.email.trim();
                      if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) setErrors((e) => ({ ...e, email: "Enter a valid email address." }));
                    }}
                    invalid={!!errors.email}
                  />
                  <ErrorText message={errors.email} />
                </div>

                {/* Gender */}
                <div>
                  <SelectField
                    label="Gender"
                    placeholder="Select gender"
                    value={form.gender}
                    options={GENDERS}
                    onChange={(v) => set("gender", v)}
                  />
                </div>

                {/* Date of birth */}
                <div>
                  <DateOfBirthField value={form.dob} onChange={(v) => set("dob", v)} invalid={!!errors.dob} />
                  <ErrorText message={errors.dob} />
                </div>

                {/* Address */}
                <div>
                  <FieldLabel>Address</FieldLabel>
                  <IconInput
                    icon={<MapPin size={15} />}
                    ariaLabel="Address"
                    placeholder="e.g. 12 Ashanti Road, Kumasi"
                    value={form.address}
                    onChange={(v) => set("address", v)}
                    invalid={!!errors.address}
                  />
                </div>

                {/* Occupation */}
                <div>
                  <FieldLabel>Occupation</FieldLabel>
                  <IconInput
                    icon={<Briefcase size={15} />}
                    ariaLabel="Occupation"
                    placeholder="e.g. Teacher, Engineer"
                    value={form.occupation}
                    onChange={(v) => set("occupation", v)}
                    invalid={!!errors.occupation}
                  />
                </div>

                {/* Department / Ministry */}
                <div>
                  <SearchableSelect
                    label="Department / Ministry"
                    placeholder="Search or select ministry"
                    value={form.ministry}
                    options={MINISTRIES}
                    onChange={(v) => set("ministry", v)}
                  />
                </div>

                {/* Profile photo - spans full width on desktop for prominence */}
                <div className="md:col-span-2">
                  <PhotoUpload value={form.photo} onChange={(d) => set("photo", d)} />
                </div>

                {/* Date joined info card */}
                <div className="md:col-span-2">
                  <DateJoinedCard />
                </div>
              </div>
            </form>
    </FormDialog>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
