// Phone country catalogue used by the onboarding phone field (flag picker)
// and for mapping the selected country to the ISO code the backend expects.
import type { ChurchLanguage } from "@/types/api";

export interface PhoneCountry {
  name: string;
  iso: string; // ISO 3166-1 alpha-2, sent to the backend (used for phone parsing)
  dialCode: string; // e.g. "+233"
  defaultTimezone: string;
  defaultLanguage: string; // title-case, for the language select
  languageEnum: ChurchLanguage; // enum value sent to the backend
}

export const PHONE_COUNTRIES: PhoneCountry[] = [
  { name: "Ghana", iso: "GH", dialCode: "+233", defaultTimezone: "UTC+00:00 (Africa/Accra)", defaultLanguage: "English", languageEnum: "ENGLISH" },
  { name: "United Kingdom", iso: "GB", dialCode: "+44", defaultTimezone: "UTC+00:00 (Europe/London)", defaultLanguage: "English", languageEnum: "ENGLISH" },
  { name: "United States", iso: "US", dialCode: "+1", defaultTimezone: "UTC-05:00 (America/New_York)", defaultLanguage: "English", languageEnum: "ENGLISH" },
];

export const DEFAULT_PHONE_COUNTRY = PHONE_COUNTRIES[0]; // Ghana

// Emoji flag derived from an ISO alpha-2 code (regional indicator symbols).
export function countryFlagEmoji(iso: string): string {
  if (!iso || iso.length !== 2) return "🌐";
  return iso
    .toUpperCase()
    .replace(/./g, (ch) => String.fromCodePoint(127397 + ch.charCodeAt(0)));
}

export function findByDialCode(dial: string): PhoneCountry | undefined {
  const digits = dial.replace(/\D/g, "");
  return PHONE_COUNTRIES.find((c) => c.dialCode.replace(/\D/g, "") === digits);
}

// Build a clean E.164 phone from a dial code + local digits.
export function buildE164Phone(dialCode: string, local: string): string {
  const digits = local.replace(/[^\d]/g, "");
  const code = dialCode.replace(/[^\d]/g, "");
  return digits ? `+${code}${digits}` : "";
}
