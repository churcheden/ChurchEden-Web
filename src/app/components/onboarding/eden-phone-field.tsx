import { useState } from "react";
import { ChevronDown, Phone } from "lucide-react";
import { cn } from "../ui/utils";
import {
  PHONE_COUNTRIES,
  countryFlagEmoji,
  type PhoneCountry,
} from "@/app/lib/phone-countries";

interface EdenPhoneFieldProps {
  id?: string;
  label: string;
  error?: string;
  hint?: string;
  selected: PhoneCountry;
  local: string;
  onCountryChange: (country: PhoneCountry) => void;
  onLocalChange: (local: string) => void;
  disabled?: boolean;
}

export function EdenPhoneField({
  id,
  label,
  error,
  hint,
  selected,
  local,
  onCountryChange,
  onLocalChange,
  disabled,
}: EdenPhoneFieldProps) {
  const [open, setOpen] = useState(false);

  const handleLocal = (value: string) => {
    onLocalChange(value.replace(/[^\d]/g, "").slice(0, 15));
  };

  return (
    <div className="space-y-1.5 text-left">
      <label htmlFor={id} className="block text-sm font-medium text-eden-on-surface">
        {label} <span className="text-amber-500 ml-0.5">*</span>
      </label>
      <div
        className={cn(
          "flex items-stretch bg-white/90 border rounded-xl shadow-xs transition-all overflow-hidden",
          "focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500",
          error ? "border-red-400 ring-2 ring-red-400/20" : "border-[#E5E3DC]",
        )}
      >
        {/* Country flag + dial code picker */}
        <div className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="h-full flex items-center gap-1.5 px-3 text-sm text-slate-700 border-r border-[#E5E3DC] bg-slate-50/60 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-haspopup="listbox"
            aria-expanded={open}
            title={`${selected.name} ${selected.dialCode}`}
          >
            <span className="text-lg leading-none">{countryFlagEmoji(selected.iso)}</span>
            <span className="font-medium text-xs">{selected.dialCode}</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <ul
                role="listbox"
                className="absolute left-0 top-full mt-1 z-20 w-64 max-h-60 overflow-auto rounded-xl border border-[#E5E3DC] bg-white shadow-xl py-1"
              >
                {PHONE_COUNTRIES.map((c) => (
                  <li key={c.iso}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={c.name === selected.name}
                      onClick={() => {
                        onCountryChange(c);
                        setOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-[#F5F1E8] transition-colors cursor-pointer",
                        c.name === selected.name ? "bg-[#EFF6FF]" : "",
                      )}
                    >
                      <span className="text-lg leading-none">{countryFlagEmoji(c.iso)}</span>
                      <span className="flex-1 font-medium text-slate-800">{c.name}</span>
                      <span className="text-xs text-slate-400">{c.dialCode}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Local number input */}
        <div className="relative flex-1">
          <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-eden-outline pointer-events-none" />
          <input
            id={id}
            type="tel"
            inputMode="tel"
            placeholder="24 123 4567"
            value={local}
            disabled={disabled}
            onChange={(e) => handleLocal(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
          />
        </div>
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {hint && !error && <p className="text-xs text-eden-outline">{hint}</p>}
    </div>
  );
}
