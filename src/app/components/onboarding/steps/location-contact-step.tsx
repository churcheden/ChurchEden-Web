import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { MapPin, Globe, Mail, Clock, Languages, ArrowRight, ArrowLeft, Church, Loader2 } from "lucide-react";
import { OnboardingLayout } from "../onboarding-layout";
import { EdenField, EdenSelect } from "../eden-field";
import { EdenButton } from "../eden-button";
import { EdenPhoneField } from "../eden-phone-field";
import { useOnboarding } from "../onboarding-context";
import { locationContactSchema } from "../onboarding-schemas";
import { saveStep2 } from "@/lib/onboarding-api";
import { isAppError } from "@/lib/apiClient";
import { toast } from "sonner";
import {
  PHONE_COUNTRIES,
  DEFAULT_PHONE_COUNTRY,
  buildE164Phone,
  type PhoneCountry,
} from "@/app/lib/phone-countries";
import type { ChurchLanguage } from "@/types/api";
import churchExterior from "@/assets/onboarding/church-exterior.jpg";

const TIMEZONES = [
  { value: "UTC+00:00 (Africa/Accra)", iana: "Africa/Accra", label: "UTC+00:00 — Accra, Monrovia, London (GMT)" },
  { value: "UTC+01:00 (Africa/Lagos)", iana: "Africa/Lagos", label: "UTC+01:00 — Lagos, Abuja, London (BST)" },
  { value: "UTC+02:00 (Africa/Johannesburg)", iana: "Africa/Johannesburg", label: "UTC+02:00 — Johannesburg, Harare, Cairo" },
  { value: "UTC+03:00 (Africa/Nairobi)", iana: "Africa/Nairobi", label: "UTC+03:00 — Nairobi, Kampala, Addis Ababa" },
  { value: "UTC+00:00 (Europe/London)", iana: "Europe/London", label: "UTC+00:00 — London, Dublin, Lisbon" },
  { value: "UTC-05:00 (America/New_York)", iana: "America/New_York", label: "UTC-05:00 — New York, Toronto, Miami (EST)" },
  { value: "UTC-06:00 (America/Chicago)", iana: "America/Chicago", label: "UTC-06:00 — Chicago, Dallas (CST)" },
  { value: "UTC-08:00 (America/Los_Angeles)", iana: "America/Los_Angeles", label: "UTC-08:00 — Los Angeles, Vancouver (PST)" },
  { value: "UTC+00:00 (UTC)", iana: "UTC", label: "UTC (Coordinated Universal Time)" },
];

const LANGUAGES = [
  { value: "English", label: "English" },
  { value: "French", label: "French (Français)" },
  { value: "Spanish", label: "Spanish (Español)" },
];

const LANGUAGE_ENUM: Record<string, ChurchLanguage> = {
  English: "ENGLISH",
  French: "FRENCH",
  Spanish: "SPANISH",
};

export function LocationContactStep() {
  const navigate = useNavigate();
  const { data, updateData } = useOnboarding();

  const initialCountry =
    PHONE_COUNTRIES.find((c) => c.name === data.country) ?? DEFAULT_PHONE_COUNTRY;

  const [form, setForm] = useState({
    country: initialCountry.name,
    city: data.city,
    address: data.address,
    churchPhone: data.churchPhone || initialCountry.dialCode,
    churchEmail: data.churchEmail,
    primaryLanguage: data.primaryLanguage || initialCountry.defaultLanguage,
    timezone: data.timezone || initialCountry.defaultTimezone,
  });

  const [phoneLocal, setPhoneLocal] = useState(() => {
    const dial = initialCountry.dialCode;
    return data.churchPhone && data.churchPhone.startsWith(dial)
      ? data.churchPhone.slice(dial.length)
      : "";
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const currentCountry: PhoneCountry =
    PHONE_COUNTRIES.find((c) => c.name === form.country) ?? DEFAULT_PHONE_COUNTRY;

  const applyCountry = (country: PhoneCountry) => {
    setForm((prev) => ({
      ...prev,
      country: country.name,
      timezone: country.defaultTimezone,
      primaryLanguage: country.defaultLanguage,
      churchPhone: buildE164Phone(country.dialCode, phoneLocal),
    }));
    if (errors.country) setErrors((prev) => ({ ...prev, country: "" }));
  };

  const handleLocalChange = (local: string) => {
    setPhoneLocal(local);
    setForm((prev) => ({
      ...prev,
      churchPhone: buildE164Phone(currentCountry.dialCode, local),
    }));
    if (errors.churchPhone) setErrors((prev) => ({ ...prev, churchPhone: "" }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setSubmitting(true);

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
      setSubmitting(false);
      return;
    }

    updateData(result.data);
    try {
      const timeZone =
        TIMEZONES.find((t) => t.value === result.data.timezone)?.iana ?? "UTC";
      await saveStep2({
        country: currentCountry.iso,
        city: result.data.city,
        address: result.data.address,
        phone: result.data.churchPhone || buildE164Phone(currentCountry.dialCode, phoneLocal),
        email: result.data.churchEmail,
        primaryLanguage: LANGUAGE_ENUM[result.data.primaryLanguage] ?? currentCountry.languageEnum,
        timeZone,
      });
      navigate("/onboarding/service-branding");
    } catch (error) {
      if (isAppError(error) && error.code === "STEP_1_REQUIRED") {
        navigate("/onboarding/church-basics");
        return;
      }
      toast.error("Failed to save location & contact. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <OnboardingLayout
      stepPath="location-contact"
      stepNumber={2}
      totalSteps={5}
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
            disabled={submitting}
            onClick={() => navigate("/onboarding/church-basics")}
            className="text-slate-700 hover:bg-slate-50 border-slate-200 px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </EdenButton>
          <EdenButton
            type="submit"
            form="location-contact-form"
            disabled={submitting}
            className="bg-[#1B2A4A] hover:bg-[#0F1729] text-white shadow-md shadow-[#1B2A4A]/20 px-7 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>Next</span>
                <ArrowRight size={14} />
              </>
            )}
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
            options={PHONE_COUNTRIES.map((c) => ({ value: c.name, label: c.name }))}
            value={form.country}
            disabled={submitting}
            onChange={(e) => {
              applyCountry(PHONE_COUNTRIES.find((c) => c.name === e.target.value) ?? DEFAULT_PHONE_COUNTRY);
            }}
            error={errors.country}
            required
          />

          <EdenField
            id="city"
            label="City"
            placeholder="e.g. Accra"
            icon={<MapPin size={18} />}
            disabled={submitting}
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
          disabled={submitting}
          value={form.address}
          onChange={(e) => {
            setForm((prev) => ({ ...prev, address: e.target.value }));
            if (errors.address) setErrors((prev) => ({ ...prev, address: "" }));
          }}
          error={errors.address}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <EdenPhoneField
            id="church-phone"
            label="Church Phone"
            selected={currentCountry}
            local={phoneLocal}
            onCountryChange={applyCountry}
            onLocalChange={handleLocalChange}
            disabled={submitting}
            error={errors.churchPhone}
            hint="Select your country flag, then enter your local number."
          />

          <EdenField
            id="church-email"
            label="Church Email"
            type="email"
            placeholder="info@yourchurch.org"
            icon={<Mail size={18} />}
            disabled={submitting}
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
            disabled={submitting}
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
            disabled={submitting}
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
