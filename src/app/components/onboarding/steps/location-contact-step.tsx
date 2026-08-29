import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { MapPin, Globe, Phone, Mail, Clock, Languages, ArrowRight, ArrowLeft, Church } from "lucide-react";
import { OnboardingLayout } from "../onboarding-layout";
import { EdenField, EdenSelect } from "../eden-field";
import { EdenButton } from "../eden-button";
import { useOnboarding } from "../onboarding-context";
import { locationContactSchema } from "../onboarding-schemas";
import churchExterior from "@/assets/onboarding/church-exterior.jpg";

interface CountryConfig {
  name: string;
  defaultTimezone: string;
  defaultLanguage: string;
  phonePrefix: string;
}

const COUNTRIES: CountryConfig[] = [
  { name: "Ghana", defaultTimezone: "UTC+00:00 (Africa/Accra)", defaultLanguage: "English", phonePrefix: "+233 " },
  { name: "Nigeria", defaultTimezone: "UTC+01:00 (Africa/Lagos)", defaultLanguage: "English", phonePrefix: "+234 " },
  { name: "Kenya", defaultTimezone: "UTC+03:00 (Africa/Nairobi)", defaultLanguage: "English", phonePrefix: "+254 " },
  { name: "South Africa", defaultTimezone: "UTC+02:00 (Africa/Johannesburg)", defaultLanguage: "English", phonePrefix: "+27 " },
  { name: "United Kingdom", defaultTimezone: "UTC+00:00 (Europe/London)", defaultLanguage: "English", phonePrefix: "+44 " },
  { name: "United States", defaultTimezone: "UTC-05:00 (America/New_York)", defaultLanguage: "English", phonePrefix: "+1 " },
  { name: "Canada", defaultTimezone: "UTC-05:00 (America/Toronto)", defaultLanguage: "English", phonePrefix: "+1 " },
  { name: "Liberia", defaultTimezone: "UTC+00:00 (Africa/Monrovia)", defaultLanguage: "English", phonePrefix: "+231 " },
  { name: "Sierra Leone", defaultTimezone: "UTC+00:00 (Africa/Freetown)", defaultLanguage: "English", phonePrefix: "+232 " },
  { name: "Ivory Coast", defaultTimezone: "UTC+00:00 (Africa/Abidjan)", defaultLanguage: "French", phonePrefix: "+225 " },
  { name: "Other", defaultTimezone: "UTC+00:00 (UTC)", defaultLanguage: "English", phonePrefix: "+" },
];

const TIMEZONES = [
  { value: "UTC+00:00 (Africa/Accra)", label: "UTC+00:00 — Accra, Monrovia, London (GMT)" },
  { value: "UTC+01:00 (Africa/Lagos)", label: "UTC+01:00 — Lagos, Abuja, London (BST)" },
  { value: "UTC+02:00 (Africa/Johannesburg)", label: "UTC+02:00 — Johannesburg, Harare, Cairo" },
  { value: "UTC+03:00 (Africa/Nairobi)", label: "UTC+03:00 — Nairobi, Kampala, Addis Ababa" },
  { value: "UTC+00:00 (Europe/London)", label: "UTC+00:00 — London, Dublin, Lisbon" },
  { value: "UTC-05:00 (America/New_York)", label: "UTC-05:00 — New York, Toronto, Miami (EST)" },
  { value: "UTC-06:00 (America/Chicago)", label: "UTC-06:00 — Chicago, Dallas (CST)" },
  { value: "UTC-08:00 (America/Los_Angeles)", label: "UTC-08:00 — Los Angeles, Vancouver (PST)" },
  { value: "UTC+00:00 (UTC)", label: "UTC (Coordinated Universal Time)" },
];

const LANGUAGES = [
  { value: "English", label: "English" },
  { value: "French", label: "French (Français)" },
  { value: "Twi", label: "Twi (Akan)" },
  { value: "Yoruba", label: "Yorùbá" },
  { value: "Igbo", label: "Igbo" },
  { value: "Hausa", label: "Hausa" },
  { value: "Swahili", label: "Kiswahili" },
  { value: "Spanish", label: "Spanish (Español)" },
  { value: "Portuguese", label: "Portuguese (Português)" },
];

export function LocationContactStep() {
  const navigate = useNavigate();
  const { data, updateData } = useOnboarding();

  const [form, setForm] = useState({
    country: data.country || "Ghana",
    city: data.city,
    address: data.address,
    churchPhone: data.churchPhone || "+233 ",
    churchEmail: data.churchEmail,
    primaryLanguage: data.primaryLanguage || "English",
    timezone: data.timezone || "UTC+00:00 (Africa/Accra)",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCountryChange = (selectedCountry: string) => {
    const config = COUNTRIES.find((c) => c.name === selectedCountry);
    setForm((prev) => ({
      ...prev,
      country: selectedCountry,
      timezone: config ? config.defaultTimezone : prev.timezone,
      primaryLanguage: config ? config.defaultLanguage : prev.primaryLanguage,
      churchPhone:
        prev.churchPhone === "" || COUNTRIES.some((c) => prev.churchPhone === c.phonePrefix)
          ? config?.phonePrefix || "+ "
          : prev.churchPhone,
    }));
    if (errors.country) setErrors((prev) => ({ ...prev, country: "" }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});

    const result = locationContactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const pathKey = String(issue.path[0]);
        if (!fieldErrors[pathKey]) {
          fieldErrors[pathKey] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    updateData(result.data);
    navigate("/onboarding/service-branding");
  };

  return (
    <OnboardingLayout
      stepPath="location-contact"
      stepNumber={2}
      totalSteps={4}
      title="Location & Contact"
      subtitle="Where is your church and how can people reach you?"
      heroImage={churchExterior}
      quoteIcon={<Church size={20} />}
      quoteTitle="Every great ministry starts with a strong foundation."
      quoteSubtitle="Let's capture the basics about your church so we can serve you better."
      tipText="We'll use your country to suggest your language, time zone, and dialing code."
      footer={
        <>
          <EdenButton
            type="button"
            variant="outline"
            onClick={() => navigate("/onboarding/church-basics")}
            className="text-slate-700 hover:bg-slate-50 border-slate-200 px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </EdenButton>
          <EdenButton
            type="submit"
            form="location-contact-form"
            className="bg-[#1B2A4A] hover:bg-[#0F1729] text-white shadow-md shadow-[#1B2A4A]/20 px-7 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <span>Next</span>
            <ArrowRight size={14} />
          </EdenButton>
        </>
      }
    >
      <form id="location-contact-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <EdenSelect
            id="country"
            label="Country"
            icon={<Globe size={18} />}
            options={COUNTRIES.map((c) => ({ value: c.name, label: c.name }))}
            value={form.country}
            onChange={(e) => handleCountryChange(e.target.value)}
            error={errors.country}
            required
          />

          <EdenField
            id="city"
            label="City"
            placeholder="e.g. Accra"
            icon={<MapPin size={18} />}
            value={form.city}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, city: e.target.value }));
              if (errors.city) setErrors((prev) => ({ ...prev, city: "" }));
            }}
            error={errors.city}
            required
          />
        </div>

        <EdenField
          id="address"
          label="Address"
          placeholder="Enter physical church address"
          icon={<MapPin size={18} />}
          value={form.address}
          onChange={(e) => {
            setForm((prev) => ({ ...prev, address: e.target.value }));
            if (errors.address) setErrors((prev) => ({ ...prev, address: "" }));
          }}
          error={errors.address}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <EdenField
            id="church-phone"
            label="Church Phone"
            type="tel"
            placeholder="+233 24 123 4567"
            icon={<Phone size={18} />}
            value={form.churchPhone}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, churchPhone: e.target.value }));
              if (errors.churchPhone) setErrors((prev) => ({ ...prev, churchPhone: "" }));
            }}
            error={errors.churchPhone}
            required
          />

          <EdenField
            id="church-email"
            label="Church Email"
            type="email"
            placeholder="info@yourchurch.org"
            icon={<Mail size={18} />}
            value={form.churchEmail}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, churchEmail: e.target.value }));
              if (errors.churchEmail) setErrors((prev) => ({ ...prev, churchEmail: "" }));
            }}
            error={errors.churchEmail}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <EdenSelect
            id="primary-language"
            label="Primary Language"
            icon={<Languages size={18} />}
            options={LANGUAGES}
            value={form.primaryLanguage}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, primaryLanguage: e.target.value }));
              if (errors.primaryLanguage) setErrors((prev) => ({ ...prev, primaryLanguage: "" }));
            }}
            error={errors.primaryLanguage}
            required
          />

          <EdenSelect
            id="timezone"
            label="Time Zone"
            icon={<Clock size={18} />}
            options={TIMEZONES}
            value={form.timezone}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, timezone: e.target.value }));
              if (errors.timezone) setErrors((prev) => ({ ...prev, timezone: "" }));
            }}
            error={errors.timezone}
            required
          />
        </div>
      </form>
    </OnboardingLayout>
  );
}
