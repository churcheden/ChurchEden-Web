import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, ArrowLeft, Tag, Users, Calendar, Church, UserRound } from "lucide-react";
import { OnboardingLayout } from "../onboarding-layout";
import { EdenField, EdenSelect } from "../eden-field";
import { EdenButton } from "../eden-button";
import { useOnboarding } from "../onboarding-context";
import { churchBasicsSchema } from "../onboarding-schemas";
import churchLeadership from "@/assets/onboarding/church-leadership.jpg";

const DENOMINATION_OPTIONS = [
  { value: "Pentecostal", label: "Pentecostal" },
  { value: "Charismatic", label: "Charismatic" },
  { value: "Baptist", label: "Baptist" },
  { value: "Methodist", label: "Methodist" },
  { value: "Presbyterian", label: "Presbyterian" },
  { value: "Catholic", label: "Catholic" },
  { value: "Anglican", label: "Anglican" },
  { value: "Non-denominational", label: "Non-denominational" },
  { value: "Other", label: "Other" },
];

const CHURCH_SIZE_OPTIONS = [
  { value: "1–50", label: "1–50 members" },
  { value: "51–200", label: "51–200 members" },
  { value: "201–500", label: "201–500 members" },
  { value: "501–2,000", label: "501–2,000 members" },
  { value: "2,000+", label: "2,000+ members" },
];

export function ChurchBasicsStep() {
  const navigate = useNavigate();
  const { data, updateData } = useOnboarding();

  const [form, setForm] = useState({
    firstName: data.firstName,
    lastName: data.lastName,
    churchName: data.churchName,
    denomination: data.denomination,
    churchSize: data.churchSize,
    foundedYear: data.foundedYear,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});

    const result = churchBasicsSchema.safeParse(form);
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
    navigate("/onboarding/location-contact");
  };

  return (
    <OnboardingLayout
      stepPath="church-basics"
      stepNumber={1}
      totalSteps={5}
      title="Church Basics"
      subtitle="Tell us the basic information about your church."
      heroImage={churchLeadership}
      quoteIcon={<Users size={20} />}
      quoteTitle="You're building more than an organization, you're building a movement."
      quoteSubtitle="Let's set up your church profile so you can focus on what matters most."
      tipText="Your church size helps us suggest the right plan for your needs."
      footer={
        <>
          <EdenButton
            type="button"
            variant="outline"
            onClick={() => navigate("/onboarding/welcome")}
            className="text-slate-700 hover:bg-slate-50 border-slate-200 px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </EdenButton>
          <EdenButton
            type="submit"
            form="church-basics-form"
            className="bg-[#1B2A4A] hover:bg-[#0F1729] text-white shadow-md shadow-[#1B2A4A]/20 px-7 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <span>Next</span>
            <ArrowRight size={14} />
          </EdenButton>
        </>
      }
    >
      <form id="church-basics-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <EdenField
            id="first-name"
            label="First Name"
            placeholder="Enter first name"
            icon={<UserRound size={18} />}
            value={form.firstName}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, firstName: e.target.value }));
              if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: "" }));
            }}
            error={errors.firstName}
            required
          />

          <EdenField
            id="last-name"
            label="Last Name"
            placeholder="Enter last name"
            icon={<UserRound size={18} />}
            value={form.lastName}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, lastName: e.target.value }));
              if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: "" }));
            }}
            error={errors.lastName}
            required
          />
        </div>

        <EdenField
          id="church-name"
          label="Church Name"
          placeholder="Enter church name"
          icon={<Church size={18} />}
          value={form.churchName}
          onChange={(e) => {
            setForm((prev) => ({ ...prev, churchName: e.target.value }));
            if (errors.churchName) setErrors((prev) => ({ ...prev, churchName: "" }));
          }}
          error={errors.churchName}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <EdenSelect
            id="denomination"
            label="Denomination"
            placeholderOption="Select denomination"
            icon={<Tag size={18} />}
            options={DENOMINATION_OPTIONS}
            value={form.denomination}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, denomination: e.target.value }));
              if (errors.denomination) setErrors((prev) => ({ ...prev, denomination: "" }));
            }}
            error={errors.denomination}
            required
          />

          <EdenSelect
            id="church-size"
            label="Estimated Church Size"
            placeholderOption="Select size range"
            icon={<Users size={18} />}
            options={CHURCH_SIZE_OPTIONS}
            value={form.churchSize}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, churchSize: e.target.value }));
              if (errors.churchSize) setErrors((prev) => ({ ...prev, churchSize: "" }));
            }}
            error={errors.churchSize}
            required
          />
        </div>

        <EdenField
          id="founded-year"
          label="Founded Year (Optional)"
          type="number"
          placeholder="e.g. 2010"
          icon={<Calendar size={18} />}
          value={form.foundedYear}
          onChange={(e) => {
            setForm((prev) => ({ ...prev, foundedYear: e.target.value }));
            if (errors.foundedYear) setErrors((prev) => ({ ...prev, foundedYear: "" }));
          }}
          error={errors.foundedYear}
        />
      </form>
    </OnboardingLayout>
  );
}
