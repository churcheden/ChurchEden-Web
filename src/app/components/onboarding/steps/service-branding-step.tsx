import { useRef, useState, type FormEvent, type ChangeEvent } from "react";
import { useNavigate } from "react-router";
import {
  Plus,
  Trash2,
  Upload,
  CheckCircle2,
  ArrowLeft,
  Heart,
} from "lucide-react";
import { OnboardingLayout } from "../onboarding-layout";
import { EdenButton } from "../eden-button";
import { useOnboarding, type ServiceTimeItem } from "../onboarding-context";
import { serviceBrandingSchema } from "../onboarding-schemas";
import churchWorship from "@/assets/onboarding/church-worship.jpg";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function ServiceBrandingStep() {
  const navigate = useNavigate();
  const { data, updateData } = useOnboarding();

  const [serviceTimes, setServiceTimes] = useState<ServiceTimeItem[]>(
    data.serviceTimes && data.serviceTimes.length > 0
      ? data.serviceTimes
      : [{ id: "1", label: "Sunday Service", day: "Sunday", time: "09:00" }]
  );

  const [logoFile, setLogoFile] = useState<File | null>(data.churchLogo);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddService = () => {
    const newId = String(Date.now());
    setServiceTimes((prev) => [
      ...prev,
      { id: newId, label: "Midweek Service", day: "Wednesday", time: "18:30" },
    ]);
  };

  const handleRemoveService = (id: string) => {
    if (serviceTimes.length <= 1) return;
    setServiceTimes((prev) => prev.filter((item) => item.id !== id));
  };

  const handleServiceChange = (id: string, field: keyof ServiceTimeItem, val: string) => {
    setServiceTimes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, logo: "Logo file size must be under 2MB." }));
      return;
    }

    setLogoFile(file);
    setErrors((prev) => ({ ...prev, logo: "" }));
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});

    const result = serviceBrandingSchema.safeParse({
      serviceTimes,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    updateData({
      serviceTimes,
      churchLogo: logoFile,
    });

    navigate("/onboarding/complete");
  };

  return (
    <OnboardingLayout
      stepPath="service-branding"
      stepNumber={3}
      totalSteps={4}
      title="Service Schedule & Branding"
      subtitle="Add your service times and upload your church logo."
      heroImage={churchWorship}
      quoteIcon={<Heart size={20} />}
      quoteTitle="Let's prepare your house to change lives."
      quoteSubtitle="Tell us about your church so we can help you impact more people for God's kingdom."
      tipText="Service schedule: You can add more service times or customize church settings anytime."
      footer={
        <>
          <EdenButton
            type="button"
            variant="outline"
            onClick={() => navigate("/onboarding/location-contact")}
            className="text-slate-700 hover:bg-slate-50 border-slate-200 px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </EdenButton>
          <EdenButton
            type="submit"
            form="service-branding-form"
            className="bg-[#1B2A4A] hover:bg-[#0F1729] text-white shadow-md shadow-[#1B2A4A]/20 px-8 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <span>Complete Setup</span>
            <CheckCircle2 size={16} />
          </EdenButton>
        </>
      }
    >
      <form id="service-branding-form" onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Service Times Group */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <span>Service Times</span>
              <span className="text-[#1B2A4A]">*</span>
            </label>
            <button
              type="button"
              onClick={handleAddService}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#1B2A4A] hover:text-[#0F1729] bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              <Plus size={13} />
              <span>Add another service</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {serviceTimes.map((service) => (
              <div
                key={service.id}
                className="p-3 bg-[#FAFAF8] border border-[#E5E3DC] rounded-xl transition-all flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Label
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. Sunday Service"
                    value={service.label}
                    onChange={(e) => handleServiceChange(service.id, "label", e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-[#E5E3DC] rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#1B2A4A]"
                  />
                </div>

                <div className="w-full sm:w-36">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Day
                  </span>
                  <select
                    value={service.day}
                    onChange={(e) => handleServiceChange(service.id, "day", e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-[#E5E3DC] rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#1B2A4A] cursor-pointer"
                  >
                    {DAYS_OF_WEEK.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full sm:w-32">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Time
                  </span>
                  <input
                    type="time"
                    value={service.time}
                    onChange={(e) => handleServiceChange(service.id, "time", e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-[#E5E3DC] rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#1B2A4A]"
                  />
                </div>

                {serviceTimes.length > 1 && (
                  <div className="flex sm:flex-col items-center justify-end sm:pt-4">
                    <button
                      type="button"
                      onClick={() => handleRemoveService(service.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove service"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {errors.serviceTimes && (
            <p className="text-xs text-red-500 font-medium">{errors.serviceTimes}</p>
          )}
        </div>

        {/* Church Logo Dropzone */}
        <div className="pt-2">
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Church Logo <span className="text-slate-400 font-normal text-[11px]">(Optional)</span>
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="h-32 rounded-2xl border-2 border-dashed border-[#E5E3DC] hover:border-[#1B2A4A] bg-[#FAFAF8] hover:bg-[#EFF6FF]/40 p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center relative overflow-hidden group"
          >
            {logoPreview ? (
              <div className="flex items-center gap-3">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-14 h-14 object-contain rounded-xl border border-slate-200 bg-white p-1"
                />
                <div className="text-left">
                  <p className="text-xs font-semibold text-slate-800 truncate max-w-[200px]">
                    {logoFile?.name}
                  </p>
                  <span className="text-[11px] text-[#1B2A4A] font-medium">Click to replace</span>
                </div>
              </div>
            ) : (
              <>
                <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#1B2A4A] flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                  <Upload size={18} />
                </div>
                <p className="text-xs font-semibold text-slate-700">Upload church logo</p>
                <p className="text-[10px] text-slate-400 mt-0.5">SVG, PNG or JPG (max 2MB)</p>
              </>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/svg+xml,image/png,image/jpeg"
              className="hidden"
              onChange={handleLogoChange}
            />
          </div>
          {errors.logo && <p className="text-xs text-red-500 mt-1">{errors.logo}</p>}
        </div>
      </form>
    </OnboardingLayout>
  );
}
