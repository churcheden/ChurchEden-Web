import { useState } from "react";
import {
  Settings, Church, Palette, Globe, Plug, Bell, CreditCard,
  Shield, Database, Upload, Plus, Trash2, Check, ChevronDown,
  Facebook, Instagram, Youtube, Twitter, X, Phone, Mail,
  MapPin, Clock, ToggleLeft, ToggleRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const BRAND = "#C8860A";
const DARK = "#1A1A2E";

type SettingsSection =
  | "General"
  | "Church Profile"
  | "Branding & Theme"
  | "Language & Region"
  | "Notifications"
  | "Billing & Plan"
  | "Security"
  | "Data & Backups";

const navItems: { icon: LucideIcon; label: SettingsSection }[] = [
  { icon: Settings, label: "General" },
  { icon: Church, label: "Church Profile" },
  { icon: Palette, label: "Branding & Theme" },
  { icon: Globe, label: "Language & Region" },
  { icon: Bell, label: "Notifications" },
  { icon: CreditCard, label: "Billing & Plan" },
  { icon: Shield, label: "Security" },
  { icon: Database, label: "Data & Backups" },
];

function SaveButton() {
  const [saved, setSaved] = useState(false);
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  return (
    <button
      onClick={handleSave}
      className="flex items-center gap-2 px-5 py-2.5 rounded-full transition-all hover:opacity-90 active:scale-95"
      style={{ background: BRAND, color: "#fff", fontSize: "13px", fontWeight: 600, fontFamily: "var(--font-label)" }}
    >
      {saved ? <><Check size={14} /> Saved!</> : "Save Changes"}
    </button>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-6 mb-5" style={{ background: "#fff", border: "1px solid #EEEDE8" }}>
      <h3 style={{ fontSize: "15px", fontWeight: 700, color: DARK, fontFamily: "var(--font-heading)", marginBottom: "20px" }}>{title}</h3>
      {children}
    </div>
  );
}

function FieldRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", fontFamily: "var(--font-label)", display: "block", marginBottom: "6px" }}>
        {label}
        {hint && <span style={{ fontWeight: 400, color: "#9CA3AF", marginLeft: "6px" }}>{hint}</span>}
      </label>
      {children}
    </div>
  );
}

function StyledInput({ placeholder, defaultValue, type = "text" }: { placeholder?: string; defaultValue?: string; type?: string }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      defaultValue={defaultValue}
      className="w-full px-3.5 py-2.5 rounded-xl outline-none transition-all"
      style={{
        border: "1px solid #E5E3DC",
        background: "#FAFAF8",
        fontSize: "13px",
        color: DARK,
        fontFamily: "var(--font-label)",
      }}
      onFocus={e => (e.target.style.borderColor = BRAND)}
      onBlur={e => (e.target.style.borderColor = "#E5E3DC")}
    />
  );
}

function StyledSelect({ options, defaultValue }: { options: string[]; defaultValue?: string }) {
  return (
    <div className="relative">
      <select
        defaultValue={defaultValue}
        className="w-full px-3.5 py-2.5 rounded-xl outline-none appearance-none transition-all pr-9"
        style={{
          border: "1px solid #E5E3DC",
          background: "#FAFAF8",
          fontSize: "13px",
          color: DARK,
          fontFamily: "var(--font-label)",
          cursor: "pointer",
        }}
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#9CA3AF" }} />
    </div>
  );
}

function Toggle({ defaultOn = false, label, channel }: { defaultOn?: boolean; label: string; channel?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  const [ch, setCh] = useState("Email");
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid #F3F2ED" }}>
      <span style={{ fontSize: "13px", color: "#374151", fontFamily: "var(--font-label)" }}>{label}</span>
      <div className="flex items-center gap-3">
        {channel && on && (
          <div className="relative">
            <select
              value={ch}
              onChange={e => setCh(e.target.value)}
              className="text-xs rounded-lg px-2 py-1 outline-none appearance-none pr-5"
              style={{ border: "1px solid #E5E3DC", background: "#FAFAF8", fontFamily: "var(--font-label)", color: DARK, cursor: "pointer" }}
            >
              {["SMS", "WhatsApp", "Email"].map(v => <option key={v}>{v}</option>)}
            </select>
            <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#9CA3AF" }} />
          </div>
        )}
        <button onClick={() => setOn(!on)} className="flex-shrink-0">
          {on
            ? <ToggleRight size={24} style={{ color: BRAND }} />
            : <ToggleLeft size={24} style={{ color: "#D1D5DB" }} />}
        </button>
      </div>
    </div>
  );
}

// ─── Section: General ─────────────────────────────────────────────────────────
function GeneralSection() {
  return (
    <div>
      <SectionCard title="General Settings">
        <FieldRow label="Church Name"><StyledInput defaultValue="Redeemer's Chapel" /></FieldRow>
        <FieldRow label="Church Tagline / Motto" hint="(optional)"><StyledInput placeholder="e.g. Where Lives Are Transformed" /></FieldRow>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <FieldRow label="Date Founded"><StyledInput type="date" defaultValue="1998-03-15" /></FieldRow>
          <FieldRow label="Denomination">
            <StyledSelect options={["Pentecostal", "Baptist", "Methodist", "Anglican", "Non-denominational", "Other"]} defaultValue="Pentecostal" />
          </FieldRow>
          <FieldRow label="Church Size">
            <StyledSelect options={["Under 100", "100–500", "500–2000", "2000+"]} defaultValue="100–500" />
          </FieldRow>
          <FieldRow label="Primary Language">
            <StyledSelect options={["English", "Twi", "Ga", "Ewe", "Hausa", "French"]} defaultValue="English" />
          </FieldRow>
          <FieldRow label="Time Zone">
            <StyledSelect options={["Africa/Accra", "Africa/Lagos", "Africa/Nairobi", "Europe/London", "America/New_York"]} defaultValue="Africa/Accra" />
          </FieldRow>
        </div>
        <FieldRow label="Week Starts On">
          <WeekStartToggle />
        </FieldRow>
      </SectionCard>
      <SaveButton />
    </div>
  );
}

function WeekStartToggle() {
  const [start, setStart] = useState<"Sunday" | "Monday">("Sunday");
  return (
    <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid #E5E3DC", width: "fit-content" }}>
      {(["Sunday", "Monday"] as const).map(day => (
        <button
          key={day}
          onClick={() => setStart(day)}
          className="px-5 py-2 transition-all"
          style={{
            background: start === day ? BRAND : "#FAFAF8",
            color: start === day ? "#fff" : "#6B7280",
            fontSize: "13px",
            fontWeight: 600,
            fontFamily: "var(--font-label)",
          }}
        >
          {day}
        </button>
      ))}
    </div>
  );
}

// ─── Section: Church Profile ───────────────────────────────────────────────────
function ChurchProfileSection() {
  const [services, setServices] = useState([
    { id: 1, name: "Sunday Morning Service", day: "Sun", start: "09:00", end: "11:30" },
    { id: 2, name: "Wednesday Bible Study", day: "Wed", start: "18:00", end: "19:30" },
  ]);

  const addService = () => {
    setServices(s => [...s, { id: Date.now(), name: "", day: "Sun", start: "09:00", end: "11:00" }]);
  };

  const removeService = (id: number) => setServices(s => s.filter(x => x.id !== id));

  const socialPlatforms = [
    { icon: Facebook, label: "Facebook", placeholder: "https://facebook.com/yourchurch" },
    { icon: Instagram, label: "Instagram", placeholder: "https://instagram.com/yourchurch" },
    { icon: Youtube, label: "YouTube", placeholder: "https://youtube.com/@yourchurch" },
    { icon: Twitter, label: "Twitter / X", placeholder: "https://x.com/yourchurch" },
    { icon: X, label: "TikTok", placeholder: "https://tiktok.com/@yourchurch" },
  ];

  return (
    <div>
      <SectionCard title="Contact Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldRow label="Phone Number">
            <div className="flex gap-2">
              <div className="relative w-24 flex-shrink-0">
                <select className="w-full h-full px-2 rounded-xl outline-none appearance-none text-xs" style={{ border: "1px solid #E5E3DC", background: "#FAFAF8", fontFamily: "var(--font-label)", color: DARK }}>
                  <option>+233</option>
                  <option>+1</option>
                  <option>+44</option>
                  <option>+234</option>
                </select>
                <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#9CA3AF" }} />
              </div>
              <StyledInput placeholder="020 000 0000" />
            </div>
          </FieldRow>
          <FieldRow label="Email Address"><StyledInput placeholder="info@redeemerschapel.org" defaultValue="info@redeemerschapel.org" /></FieldRow>
          <FieldRow label="Website URL"><StyledInput placeholder="https://redeemerschapel.org" defaultValue="https://redeemerschapel.org" /></FieldRow>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldRow label="Street Address"><StyledInput defaultValue="14 Independence Ave" /></FieldRow>
          <FieldRow label="City"><StyledInput defaultValue="Accra" /></FieldRow>
          <FieldRow label="Region / State"><StyledInput defaultValue="Greater Accra" /></FieldRow>
          <FieldRow label="Country">
            <StyledSelect options={["Ghana", "Nigeria", "UK", "USA", "Canada"]} defaultValue="Ghana" />
          </FieldRow>
        </div>
        <div className="mt-4 rounded-xl overflow-hidden" style={{ border: "1px solid #E5E3DC", height: "180px" }}>
          <div className="w-full h-full flex items-center justify-center" style={{ background: "#F0EFE9" }}>
            <div className="text-center">
              <MapPin size={24} style={{ color: BRAND, margin: "0 auto 8px" }} />
              <span style={{ fontSize: "13px", color: "#9CA3AF", fontFamily: "var(--font-label)" }}>Google Maps preview will appear here</span>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Social Media Links">
        {socialPlatforms.map(({ icon: Icon, label, placeholder }) => (
          <div key={label} className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#F0EFE9" }}>
              <Icon size={15} style={{ color: BRAND }} />
            </div>
            <div className="flex-1"><StyledInput placeholder={placeholder} /></div>
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Service Times">
        {services.map((s) => (
          <div key={s.id} className="flex items-center gap-2 mb-3 flex-wrap">
            <div className="flex-1 min-w-36"><StyledInput defaultValue={s.name} placeholder="Service name" /></div>
            <div className="w-20">
              <StyledSelect options={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]} defaultValue={s.day} />
            </div>
            <div className="w-28"><StyledInput type="time" defaultValue={s.start} /></div>
            <div className="w-28"><StyledInput type="time" defaultValue={s.end} /></div>
            <button onClick={() => removeService(s.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
              <Trash2 size={14} style={{ color: "#EF4444" }} />
            </button>
          </div>
        ))}
        <button
          onClick={addService}
          className="flex items-center gap-1.5 transition-colors hover:opacity-80 mt-1"
          style={{ fontSize: "13px", color: BRAND, fontFamily: "var(--font-label)", fontWeight: 600 }}
        >
          <Plus size={14} /> Add Service Time
        </button>
      </SectionCard>
      <SaveButton />
    </div>
  );
}

// ─── Section: Branding & Theme ─────────────────────────────────────────────────
function BrandingSection() {
  const [primary, setPrimary] = useState("#C8860A");
  const [secondary, setSecondary] = useState("#1A1A2E");
  const [theme, setTheme] = useState<"Light" | "Dark" | "System">("Light");

  return (
    <div>
      <SectionCard title="Church Logo">
        <div className="rounded-xl p-8 text-center cursor-pointer hover:border-amber-400 transition-colors" style={{ border: "2px dashed #E5E3DC", background: "#FAFAF8" }}>
          <Upload size={28} style={{ color: BRAND, margin: "0 auto 8px" }} />
          <p style={{ fontSize: "13px", fontWeight: 600, color: DARK, fontFamily: "var(--font-label)" }}>Drag & drop or click to upload</p>
          <p style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "var(--font-label)", marginTop: "4px" }}>Recommended: 400×400px, PNG or SVG</p>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1A0533, #2D1B69)" }}>
            <span style={{ fontSize: "20px", fontWeight: 700, color: BRAND }}>H</span>
          </div>
          <span style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "var(--font-label)" }}>Current logo</span>
        </div>
      </SectionCard>

      <SectionCard title="Church Banner / Cover Image">
        <div className="rounded-xl p-8 text-center cursor-pointer hover:border-amber-400 transition-colors" style={{ border: "2px dashed #E5E3DC", background: "#FAFAF8" }}>
          <Upload size={28} style={{ color: "#9CA3AF", margin: "0 auto 8px" }} />
          <p style={{ fontSize: "13px", fontWeight: 600, color: DARK, fontFamily: "var(--font-label)" }}>Upload banner image</p>
          <p style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "var(--font-label)", marginTop: "4px" }}>Recommended: 1440×480px</p>
        </div>
      </SectionCard>

      <SectionCard title="Brand Colors">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", fontFamily: "var(--font-label)", display: "block", marginBottom: "8px" }}>Primary Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={primary} onChange={e => setPrimary(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-0" style={{ border: "1px solid #E5E3DC" }} />
              <StyledInput defaultValue={primary} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", fontFamily: "var(--font-label)", display: "block", marginBottom: "8px" }}>Secondary Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={secondary} onChange={e => setSecondary(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer" style={{ border: "1px solid #E5E3DC" }} />
              <StyledInput defaultValue={secondary} />
            </div>
          </div>
        </div>

        {/* Live preview */}
        <div className="rounded-xl p-4" style={{ background: "#F0EFE9", border: "1px solid #E5E3DC" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "#9CA3AF", fontFamily: "var(--font-label)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Live Preview</p>
          <div className="rounded-xl overflow-hidden" style={{ background: "#fff", border: "1px solid #EEEDE8" }}>
            <div className="h-10 flex items-center px-4 gap-3" style={{ background: secondary }}>
              <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: primary }}>
                <span style={{ fontSize: "10px", fontWeight: 700, color: "#fff" }}>CE</span>
              </div>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#fff", fontFamily: "var(--font-label)" }}>ChurchEden</span>
            </div>
            <div className="p-3 flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full" style={{ background: "#F0EFE9" }} />
              <button className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: primary, color: "#fff", fontFamily: "var(--font-label)" }}>Action</button>
            </div>
          </div>
        </div>
        <button className="mt-2 text-xs" style={{ color: "#9CA3AF", fontFamily: "var(--font-label)" }}>Reset to Default</button>
      </SectionCard>

      <SectionCard title="App Theme">
        <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid #E5E3DC", width: "fit-content" }}>
          {(["Light", "Dark", "System"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className="px-5 py-2.5 transition-all"
              style={{
                background: theme === t ? BRAND : "#FAFAF8",
                color: theme === t ? "#fff" : "#6B7280",
                fontSize: "13px",
                fontWeight: 600,
                fontFamily: "var(--font-label)",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Favicon">
        <div className="rounded-xl p-6 text-center cursor-pointer" style={{ border: "2px dashed #E5E3DC", background: "#FAFAF8", width: "200px" }}>
          <Upload size={20} style={{ color: "#9CA3AF", margin: "0 auto 6px" }} />
          <p style={{ fontSize: "12px", color: DARK, fontFamily: "var(--font-label)", fontWeight: 600 }}>Upload Favicon</p>
          <p style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "var(--font-label)" }}>32×32px icon</p>
        </div>
      </SectionCard>
      <SaveButton />
    </div>
  );
}

// ─── Section: Language & Region ────────────────────────────────────────────────
function LanguageSection() {
  const [multilingual, setMultilingual] = useState(false);
  const langs = ["English", "Twi", "Ga", "Ewe"];
  const [activeLangs, setActiveLangs] = useState<string[]>(["English"]);

  const toggle = (l: string) => setActiveLangs(a => a.includes(l) ? a.filter(x => x !== l) : [...a, l]);

  return (
    <div>
      <SectionCard title="Language & Region">
        <FieldRow label="Default App Language">
          <StyledSelect options={["English", "Twi", "Ga", "Ewe"]} defaultValue="English" />
        </FieldRow>
        <div className="flex items-center justify-between py-3 mb-4" style={{ borderBottom: "1px solid #F3F2ED" }}>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#374151", fontFamily: "var(--font-label)" }}>Enable multilingual support</p>
            <p style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "var(--font-label)" }}>Members can select their preferred language in the app</p>
          </div>
          <button onClick={() => setMultilingual(!multilingual)}>
            {multilingual
              ? <ToggleRight size={24} style={{ color: BRAND }} />
              : <ToggleLeft size={24} style={{ color: "#D1D5DB" }} />}
          </button>
        </div>
        {multilingual && (
          <div className="mb-5 grid grid-cols-2 gap-2">
            {langs.map(l => (
              <label key={l} className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-xl transition-colors" style={{ border: `1px solid ${activeLangs.includes(l) ? BRAND : "#E5E3DC"}`, background: activeLangs.includes(l) ? `rgba(200,134,10,0.06)` : "#FAFAF8" }}>
                <input type="checkbox" checked={activeLangs.includes(l)} onChange={() => toggle(l)} className="hidden" />
                <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0" style={{ background: activeLangs.includes(l) ? BRAND : "#E5E3DC" }}>
                  {activeLangs.includes(l) && <Check size={10} color="#fff" />}
                </div>
                <span style={{ fontSize: "13px", fontFamily: "var(--font-label)", color: DARK }}>{l}</span>
              </label>
            ))}
          </div>
        )}
        <FieldRow label="Currency">
          <div className="flex gap-2">
            {["GHS", "USD", "GBP"].map(c => (
              <CurrencyChip key={c} label={c} />
            ))}
          </div>
        </FieldRow>
        <FieldRow label="Date Format">
          <StyledSelect options={["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]} defaultValue="DD/MM/YYYY" />
        </FieldRow>
        <FieldRow label="Number Format">
          <StyledSelect options={["1,000.00", "1.000,00"]} defaultValue="1,000.00" />
        </FieldRow>
      </SectionCard>
      <SaveButton />
    </div>
  );
}

function CurrencyChip({ label }: { label: string }) {
  const [active, setActive] = useState(label === "GHS");
  return (
    <button
      onClick={() => setActive(!active)}
      className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
      style={{
        border: `1px solid ${active ? BRAND : "#E5E3DC"}`,
        background: active ? `rgba(200,134,10,0.08)` : "#FAFAF8",
        color: active ? BRAND : "#6B7280",
        fontFamily: "var(--font-label)",
        fontSize: "13px",
      }}
    >
      {label}
    </button>
  );
}

// ─── Section: Integrations ─────────────────────────────────────────────────────
const integrations = [
  { name: "Hubtel", desc: "SMS & MoMo payments", connected: true },
  { name: "Arkesel", desc: "Local SMS delivery", connected: false },
  { name: "Africa's Talking", desc: "Pan-African SMS", connected: false },
  { name: "Twilio", desc: "International SMS", connected: false },
  { name: "Flutterwave", desc: "MoMo + international cards", connected: true },
  { name: "Stripe", desc: "International card payments", connected: false },
  { name: "Paystack", desc: "Ghana/Nigeria + cards", connected: false },
  { name: "YouTube Live", desc: "Livestream embed", connected: false },
  { name: "Facebook Live", desc: "Livestream embed", connected: false },
  { name: "Mailchimp", desc: "Email campaigns", connected: false },
  { name: "Google Maps", desc: "Location embed", connected: true },
];

function IntegrationsSection() {
  const [conns, setConns] = useState(integrations.map(i => ({ ...i })));

  const toggle = (name: string) => {
    setConns(c => c.map(i => i.name === name ? { ...i, connected: !i.connected } : i));
  };

  return (
    <div>
      <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid #EEEDE8" }}>
        {conns.map((int, idx) => (
          <div
            key={int.name}
            className="flex items-center gap-4 px-5 py-4 hover:bg-[#FAFAF8] transition-colors"
            style={{ borderBottom: idx < conns.length - 1 ? "1px solid #F3F2ED" : undefined }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#F0EFE9" }}>
              <Plug size={16} style={{ color: BRAND }} />
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: "13px", fontWeight: 600, color: DARK, fontFamily: "var(--font-label)" }}>{int.name}</p>
              <p style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "var(--font-label)" }}>{int.desc}</p>
            </div>
            {int.connected ? (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(34,197,94,0.1)", color: "#16A34A", fontFamily: "var(--font-label)" }}>
                  <Check size={10} /> Connected
                </span>
                <button className="text-xs transition-colors hover:opacity-70" style={{ color: BRAND, fontFamily: "var(--font-label)", fontWeight: 600 }}>Configure</button>
                <button onClick={() => toggle(int.name)} className="text-xs transition-colors hover:opacity-70" style={{ color: "#EF4444", fontFamily: "var(--font-label)" }}>Disconnect</button>
              </div>
            ) : (
              <button
                onClick={() => toggle(int.name)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all hover:opacity-90"
                style={{ background: BRAND, color: "#fff", fontFamily: "var(--font-label)" }}
              >
                Connect
              </button>
            )}
          </div>
        ))}
      </div>
      <button className="mt-4 flex items-center gap-1.5 transition-colors hover:opacity-80" style={{ fontSize: "13px", color: BRAND, fontFamily: "var(--font-label)", fontWeight: 600 }}>
        <Plus size={14} /> Request Integration
      </button>
    </div>
  );
}

// ─── Section: Notifications ────────────────────────────────────────────────────
function NotificationsSection() {
  const [dndStart, setDndStart] = useState("22:00");
  const [dndEnd, setDndEnd] = useState("07:00");
  const [overrideUrgent, setOverrideUrgent] = useState(true);

  return (
    <div>
      <SectionCard title="System Notification Defaults">
        <Toggle defaultOn label="Birthday auto-wishes to members" channel />
        <Toggle defaultOn label="Anniversary auto-wishes" channel />
        <Toggle defaultOn label="Event reminders (24 hrs before)" channel />
        <Toggle defaultOn label="Giving receipt on transaction" channel />
        <Toggle label="Absence follow-up (after 3 misses)" channel />
        <Toggle defaultOn label="New member welcome message" channel />
        <Toggle defaultOn label="Fundraising goal reached alert — to admin" />
        <Toggle defaultOn label="Failed transaction alert — to admin" />
      </SectionCard>

      <SectionCard title="Notification Quiet Hours">
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", fontFamily: "var(--font-label)", display: "block", marginBottom: "4px" }}>Do Not Disturb From</label>
            <input type="time" value={dndStart} onChange={e => setDndStart(e.target.value)} className="px-3 py-2 rounded-xl outline-none" style={{ border: "1px solid #E5E3DC", background: "#FAFAF8", fontSize: "13px", fontFamily: "var(--font-label)" }} />
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", fontFamily: "var(--font-label)", display: "block", marginBottom: "4px" }}>To</label>
            <input type="time" value={dndEnd} onChange={e => setDndEnd(e.target.value)} className="px-3 py-2 rounded-xl outline-none" style={{ border: "1px solid #E5E3DC", background: "#FAFAF8", fontSize: "13px", fontFamily: "var(--font-label)" }} />
          </div>
        </div>
        <div className="flex items-center justify-between py-3">
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#374151", fontFamily: "var(--font-label)" }}>Override for urgent / emergency announcements</p>
          </div>
          <button onClick={() => setOverrideUrgent(!overrideUrgent)}>
            {overrideUrgent ? <ToggleRight size={24} style={{ color: BRAND }} /> : <ToggleLeft size={24} style={{ color: "#D1D5DB" }} />}
          </button>
        </div>
      </SectionCard>
      <SaveButton />
    </div>
  );
}

// ─── Section: Billing & Plan ───────────────────────────────────────────────────
function BillingSection() {
  const usageItems = [
    { label: "Members", used: 214, total: 500, color: BRAND },
    { label: "SMS this month", used: 1840, total: 3000, color: "#6366F1" },
    { label: "Storage", used: 2.4, total: 10, suffix: "GB", color: "#10B981" },
    { label: "Admin seats", used: 4, total: 10, color: "#F59E0B" },
  ];

  return (
    <div>
      <SectionCard title="Current Plan">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span style={{ fontSize: "20px", fontWeight: 700, color: DARK, fontFamily: "var(--font-heading)" }}>ChurchEden Pro</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: `rgba(200,134,10,0.12)`, color: BRAND, fontFamily: "var(--font-label)" }}>CURRENT PLAN</span>
            </div>
            <p style={{ fontSize: "24px", fontWeight: 700, color: DARK, fontFamily: "var(--font-heading)" }}>$299<span style={{ fontSize: "14px", fontWeight: 400, color: "#9CA3AF" }}>/month</span></p>
            <ul className="mt-3 space-y-1.5">
              {["Up to 500 members", "3,000 SMS/month", "10 GB storage", "10 admin seats", "All integrations", "Priority support"].map(f => (
                <li key={f} className="flex items-center gap-2">
                  <Check size={13} style={{ color: "#10B981" }} />
                  <span style={{ fontSize: "13px", color: "#374151", fontFamily: "var(--font-label)" }}>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-right">
            <p style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "var(--font-label)" }}>Next billing date</p>
            <p style={{ fontSize: "14px", fontWeight: 600, color: DARK, fontFamily: "var(--font-label)" }}>Jul 4, 2026</p>
            <p style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "var(--font-label)", marginTop: "8px" }}>Payment method</p>
            <p style={{ fontSize: "13px", fontWeight: 600, color: DARK, fontFamily: "var(--font-label)" }}>•••• 4782</p>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button className="px-4 py-2 rounded-full text-sm font-semibold transition-all hover:opacity-90" style={{ background: BRAND, color: "#fff", fontFamily: "var(--font-label)" }}>Upgrade Plan</button>
          <button className="px-4 py-2 rounded-full text-sm font-semibold transition-all hover:bg-gray-50" style={{ border: "1px solid #E5E3DC", color: DARK, fontFamily: "var(--font-label)" }}>Change Payment Method</button>
          <button className="px-4 py-2 rounded-full text-sm font-semibold transition-all hover:bg-gray-50" style={{ border: "1px solid #E5E3DC", color: DARK, fontFamily: "var(--font-label)" }}>Download Invoice</button>
        </div>
      </SectionCard>

      <SectionCard title="Usage">
        {usageItems.map(item => {
          const pct = Math.round((item.used / item.total) * 100);
          return (
            <div key={item.label} className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151", fontFamily: "var(--font-label)" }}>{item.label}</span>
                <span style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "var(--font-label)" }}>
                  {item.used}{item.suffix || ""} / {item.total}{item.suffix || ""}
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "#F0EFE9" }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: item.color }} />
              </div>
              <p style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "var(--font-label)", marginTop: "3px" }}>{pct}% used</p>
            </div>
          );
        })}
      </SectionCard>
    </div>
  );
}

// ─── Section: Security ─────────────────────────────────────────────────────────
function SecuritySection() {
  const [twoFA, setTwoFA] = useState(false);
  const [minLen, setMinLen] = useState(8);
  const sessions = [
    { device: "MacBook Pro — Chrome", location: "Accra, Ghana", time: "Active now", ip: "154.20.X.X" },
    { device: "iPhone 15 — Safari", location: "Accra, Ghana", time: "2 hours ago", ip: "154.20.X.X" },
    { device: "Windows PC — Edge", location: "London, UK", time: "Jun 1, 2026", ip: "82.10.X.X" },
  ];
  const loginLog = [
    { ip: "154.20.X.X", device: "Chrome / macOS", location: "Accra, GH", time: "Jun 4, 2026 · 9:14 AM" },
    { ip: "154.20.X.X", device: "Safari / iOS", location: "Accra, GH", time: "Jun 4, 2026 · 7:01 AM" },
    { ip: "82.10.X.X", device: "Edge / Windows", location: "London, UK", time: "Jun 1, 2026 · 6:23 PM" },
  ];

  return (
    <div>
      <SectionCard title="Two-Factor Authentication">
        <div className="flex items-center justify-between">
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#374151", fontFamily: "var(--font-label)" }}>Enable 2FA for your account</p>
            <p style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "var(--font-label)" }}>Protect your account with an authentication app</p>
          </div>
          <button onClick={() => setTwoFA(!twoFA)}>
            {twoFA ? <ToggleRight size={28} style={{ color: BRAND }} /> : <ToggleLeft size={28} style={{ color: "#D1D5DB" }} />}
          </button>
        </div>
        {twoFA && (
          <div className="mt-4 p-4 rounded-xl text-center" style={{ background: "#F0EFE9", border: "1px solid #E5E3DC" }}>
            <div className="w-32 h-32 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: "#fff", border: "1px solid #E5E3DC" }}>
              <Shield size={48} style={{ color: BRAND }} />
            </div>
            <p style={{ fontSize: "13px", fontFamily: "var(--font-label)", color: DARK }}>Scan this QR code with your authenticator app</p>
            <button className="mt-2 px-4 py-1.5 rounded-full text-xs font-semibold" style={{ background: BRAND, color: "#fff", fontFamily: "var(--font-label)" }}>Verify Setup</button>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Session Settings">
        <FieldRow label="Session Timeout">
          <StyledSelect options={["15 minutes", "30 minutes", "1 hour", "Never"]} defaultValue="1 hour" />
        </FieldRow>
      </SectionCard>

      <SectionCard title="Active Sessions">
        {sessions.map((s, i) => (
          <div key={i} className="flex items-center justify-between py-3" style={{ borderBottom: i < sessions.length - 1 ? "1px solid #F3F2ED" : undefined }}>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 600, color: DARK, fontFamily: "var(--font-label)" }}>{s.device}</p>
              <p style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "var(--font-label)" }}>{s.location} · {s.time} · {s.ip}</p>
            </div>
            {s.time !== "Active now" && (
              <button className="text-xs" style={{ color: "#EF4444", fontFamily: "var(--font-label)", fontWeight: 600 }}>Revoke</button>
            )}
            {s.time === "Active now" && (
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(34,197,94,0.1)", color: "#16A34A", fontFamily: "var(--font-label)", fontWeight: 600 }}>Current</span>
            )}
          </div>
        ))}
        <button className="mt-3 text-sm font-semibold" style={{ color: "#EF4444", fontFamily: "var(--font-label)" }}>Log out all other sessions</button>
      </SectionCard>

      <SectionCard title="Login Activity">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid #F3F2ED" }}>
                {["IP Address", "Device", "Location", "Date & Time"].map(h => (
                  <th key={h} className="text-left pb-2 pr-4" style={{ fontSize: "11px", fontWeight: 600, color: "#9CA3AF", fontFamily: "var(--font-label)", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loginLog.map((row, i) => (
                <tr key={i} style={{ borderBottom: i < loginLog.length - 1 ? "1px solid #F3F2ED" : undefined }}>
                  <td className="py-2.5 pr-4" style={{ fontSize: "12px", fontFamily: "var(--font-label)", color: DARK }}>{row.ip}</td>
                  <td className="py-2.5 pr-4" style={{ fontSize: "12px", fontFamily: "var(--font-label)", color: "#374151" }}>{row.device}</td>
                  <td className="py-2.5 pr-4" style={{ fontSize: "12px", fontFamily: "var(--font-label)", color: "#374151" }}>{row.location}</td>
                  <td className="py-2.5" style={{ fontSize: "12px", fontFamily: "var(--font-label)", color: "#9CA3AF" }}>{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Password Policy">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", fontFamily: "var(--font-label)" }}>Minimum Password Length: {minLen} characters</label>
          </div>
          <input type="range" min={6} max={20} value={minLen} onChange={e => setMinLen(+e.target.value)} className="w-full accent-amber-600" />
        </div>
        <Toggle defaultOn label="Require uppercase letters" />
        <Toggle defaultOn label="Require numbers" />
        <Toggle label="Require symbols" />
        <FieldRow label="Password Expiry">
          <StyledSelect options={["Never", "90 days", "180 days"]} defaultValue="Never" />
        </FieldRow>
      </SectionCard>
      <SaveButton />
    </div>
  );
}

// ─── Section: Data & Backups ───────────────────────────────────────────────────
function DataBackupsSection() {
  const [backups, setBackups] = useState(true);
  const [confirmName, setConfirmName] = useState("");
  const [showDanger, setShowDanger] = useState(false);

  return (
    <div>
      <SectionCard title="Data Export">
        <p style={{ fontSize: "13px", color: "#374151", fontFamily: "var(--font-label)", marginBottom: "16px" }}>
          Export all church data including members, giving records, attendance, and sermons as a ZIP archive.
        </p>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90" style={{ background: DARK, color: "#fff", fontFamily: "var(--font-label)" }}>
          <Database size={14} /> Export ZIP Archive
        </button>
      </SectionCard>

      <SectionCard title="Scheduled Backups">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#374151", fontFamily: "var(--font-label)" }}>Automatic Backups</p>
            <p style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "var(--font-label)", display: "flex", alignItems: "center", gap: 4 }}>Last backup: Jun 1, 2026 · 2:00 AM <Check size={13} style={{ color: "#16A34A" }} /></p>
          </div>
          <button onClick={() => setBackups(!backups)}>
            {backups ? <ToggleRight size={24} style={{ color: BRAND }} /> : <ToggleLeft size={24} style={{ color: "#D1D5DB" }} />}
          </button>
        </div>
        {backups && (
          <FieldRow label="Backup Frequency">
            <StyledSelect options={["Daily", "Weekly"]} defaultValue="Daily" />
          </FieldRow>
        )}
      </SectionCard>

      {/* Danger zone */}
      <div className="rounded-2xl p-6" style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.3)" }}>
        <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#DC2626", fontFamily: "var(--font-heading)", marginBottom: "8px" }}>Danger Zone</h3>
        <p style={{ fontSize: "13px", color: "#EF4444", fontFamily: "var(--font-label)", marginBottom: "16px" }}>
          Permanently delete your church workspace and all associated data. This action cannot be undone.
        </p>
        {!showDanger ? (
          <button
            onClick={() => setShowDanger(true)}
            className="px-5 py-2.5 rounded-full text-sm font-semibold"
            style={{ background: "rgba(239,68,68,0.1)", color: "#DC2626", border: "1px solid rgba(239,68,68,0.3)", fontFamily: "var(--font-label)" }}
          >
            Delete Church Workspace
          </button>
        ) : (
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#DC2626", fontFamily: "var(--font-label)", marginBottom: "8px" }}>
              Type your church name to confirm: <strong>Redeemer's Chapel</strong>
            </p>
            <StyledInput placeholder="Type church name here" />
            <div className="mt-3 flex gap-2">
              <button
                className="px-4 py-2 rounded-full text-sm font-semibold"
                style={{ background: confirmName === "Redeemer's Chapel" ? "#DC2626" : "rgba(239,68,68,0.2)", color: "#DC2626", fontFamily: "var(--font-label)", cursor: confirmName === "Redeemer's Chapel" ? "pointer" : "not-allowed" }}
                disabled={confirmName !== "Redeemer's Chapel"}
              >
                Confirm Delete
              </button>
              <button onClick={() => setShowDanger(false)} className="px-4 py-2 rounded-full text-sm" style={{ color: "#9CA3AF", fontFamily: "var(--font-label)" }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export function ChurchSettingsPage() {
  const [active, setActive] = useState<SettingsSection>("General");

  const sectionContent: Record<SettingsSection, React.ReactNode> = {
    "General": <GeneralSection />,
    "Church Profile": <ChurchProfileSection />,
    "Branding & Theme": <BrandingSection />,
    "Language & Region": <LanguageSection />,
    "Notifications": <NotificationsSection />,
    "Billing & Plan": <BillingSection />,
    "Security": <SecuritySection />,
    "Data & Backups": <DataBackupsSection />,
  };

  return (
    <div className="flex-1 flex overflow-hidden" style={{ background: "#F5F4EF" }}>
      {/* Left sticky nav */}
      <div className="hidden md:flex flex-col flex-shrink-0 overflow-y-auto py-6 px-3" style={{ width: "220px", borderRight: "1px solid #EEEDE8", background: "#fff" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", fontFamily: "var(--font-label)", paddingLeft: "12px", marginBottom: "8px" }}>SETTINGS</p>
        {navItems.map(item => {
          const isActive = active === item.label;
          return (
            <button
              key={item.label}
              onClick={() => setActive(item.label)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-0.5 text-left transition-all"
              style={{
                background: isActive ? `rgba(200,134,10,0.08)` : "transparent",
                borderLeft: isActive ? `3px solid ${BRAND}` : "3px solid transparent",
              }}
            >
              <item.icon size={17} color={isActive ? BRAND : "#6B7280"} />
              <span style={{ fontSize: "13px", fontWeight: isActive ? 600 : 400, color: isActive ? BRAND : "#6B7280", fontFamily: "var(--font-label)" }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mobile tab bar */}
      <div className="md:hidden absolute top-0 left-0 right-0 flex overflow-x-auto gap-1 px-4 py-2 z-10" style={{ background: "#fff", borderBottom: "1px solid #EEEDE8" }}>
        {navItems.map(item => (
          <button
            key={item.label}
            onClick={() => setActive(item.label)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap"
            style={{
              background: active === item.label ? BRAND : "#F0EFE9",
              color: active === item.label ? "#fff" : "#6B7280",
              fontFamily: "var(--font-label)",
            }}
          >
            <item.icon size={14} /> {item.label}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-6 md:pt-6 pt-16">
          <div className="mb-6">
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: DARK, fontFamily: "var(--font-heading)" }}>{active}</h2>
            <p style={{ fontSize: "13px", color: "#9CA3AF", fontFamily: "var(--font-label)", marginTop: "2px" }}>
              Manage your church's {active.toLowerCase()} settings
            </p>
          </div>
          {sectionContent[active]}
        </div>
      </div>
    </div>
  );
}
