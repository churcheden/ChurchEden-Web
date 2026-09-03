import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import {
  Plus,
  Search,
  Check,
  Pencil,
  Trash2,
  X,
  ArrowLeft,
  CheckCircle2,
  Layers,
  Church,
} from "lucide-react";
import { OnboardingLayout } from "../onboarding-layout";
import { EdenButton } from "../eden-button";
import { useOnboarding, type CustomMinistryItem } from "../onboarding-context";
import { ensureCachedUpTo } from "../onboarding-guard";
import { saveStep4 } from "@/lib/onboarding-api";
import { toast } from "sonner";
import {
  PREDEFINED_GROUPS,
  MINISTRY_ICON_PICKER,
  resolveMinistryIcon,
  type MinistryType,
} from "@/app/lib/ministries";
import churchWorship from "@/assets/onboarding/church-worship.jpg";

export function MinistriesStep() {
  const navigate = useNavigate();
  const { data, updateData } = useOnboarding();

  const [selectedIds, setSelectedIds] = useState<string[]>(data.selectedMinistryIds ?? []);
  const [custom, setCustom] = useState<CustomMinistryItem[]>(data.customMinistries ?? []);
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState<"create" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const selectedCount = selectedIds.length + custom.length;

  const toggle = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const nameExists = (name: string, ignoreId?: string) => {
    const n = name.trim().toLowerCase();
    if (!n) return false;
    const inPredefined = PREDEFINED_GROUPS.some((g) =>
      g.items.some((it) => it.name.toLowerCase() === n)
    );
    const inCustom = custom.some((c) => c.name.toLowerCase() === n && c.id !== ignoreId);
    return inPredefined || inCustom;
  };

  const deleteCustom = (id: string) => {
    setCustom((prev) => prev.filter((c) => c.id !== id));
  };

  const query = search.trim().toLowerCase();
  const matches = (name: string) => !query || name.toLowerCase().includes(query);

  const visibleGroups = PREDEFINED_GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((it) => matches(it.name)),
  })).filter((g) => g.items.length > 0);

  const visibleCustom = custom.filter((c) => matches(c.name));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const missingBefore = await ensureCachedUpTo("ministries");
    if (missingBefore) {
      navigate(`/onboarding/${missingBefore}`);
      return;
    }

    updateData({
      selectedMinistryIds: selectedIds,
      customMinistries: custom,
    });

    try {
      await saveStep4({
        ministryIds: selectedIds,
        customMinistries: custom.map((c) => ({
          name: c.name,
          type: c.type,
          description: c.description,
          icon: c.icon,
        })),
      });
      navigate("/onboarding/complete");
    } catch (error) {
      toast.error("Failed to save ministries. Please try again.");
    }
  };

  return (
    <OnboardingLayout
      stepPath="ministries"
      stepNumber={4}
      totalSteps={5}
      title="Ministries & Departments"
      subtitle="Select the ministries and departments that make up your church. You can change this anytime in Settings."
      heroImage={churchWorship}
      quoteIcon={<Layers size={20} />}
      quoteTitle="A church is stronger when everyone is engaged."
      quoteSubtitle="Set up your ministries now so you can start organizing members, events, and volunteers."
      tipText="Ministries are optional — select none or as many as you like. You can manage them anytime in Settings."
      footer={
        <>
          <EdenButton
            type="button"
            variant="outline"
            onClick={() => navigate("/onboarding/service-branding")}
            className="text-slate-700 hover:bg-slate-50 border-slate-200 px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </EdenButton>
          <EdenButton
            type="submit"
            form="ministries-form"
            className="bg-[#1B2A4A] hover:bg-[#0F1729] text-white shadow-md shadow-[#1B2A4A]/20 px-8 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <span>Complete Setup</span>
            <CheckCircle2 size={16} />
          </EdenButton>
        </>
      }
    >
      <form id="ministries-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
            <span>Ministries &amp; Departments</span>
            <span className="text-slate-400 font-normal text-[11px]">(Select all that apply)</span>
          </label>
          <span className="text-[11px] font-semibold text-[#1B2A4A]">{selectedCount} selected</span>
        </div>

        {selectedCount === 0 && (
          <p className="text-[11px] text-slate-400">
            Select the ministries and departments that make up your church.
          </p>
        )}

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#9CA3AF" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ministries & departments..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-[#E5E3DC] rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#1B2A4A]"
          />
        </div>

        {visibleGroups.map((group) => (
          <div key={group.key}>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {group.title}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {group.items.map((it) => (
                <MinistryCard
                  key={it.id}
                  name={it.name}
                  description={it.description}
                  icon={it.icon}
                  selected={selectedIds.includes(it.id)}
                  onToggle={() => toggle(it.id)}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Custom group */}
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Custom
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {visibleCustom.map((c) => (
              <MinistryCard
                key={c.id}
                name={c.name}
                description={c.description}
                icon={c.icon}
                selected
                onToggle={() => {}}
                onEdit={() => {
                  setEditingId(c.id);
                  setDialog("edit");
                }}
                onDelete={() => deleteCustom(c.id)}
              />
            ))}
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setDialog("create");
              }}
              className="rounded-xl p-4 text-center cursor-pointer hover:border-[#1B2A4A] border-2 border-dashed border-[#E5E3DC] bg-[#FAFAF8] hover:bg-[#EFF6FF]/40 transition-all flex flex-col items-center justify-center gap-1.5 min-h-[92px]"
            >
              <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#1B2A4A] flex items-center justify-center">
                <Plus size={16} />
              </div>
              <span className="text-xs font-semibold text-slate-700">
                Create Custom Ministry or Department
              </span>
            </button>
          </div>
        </div>
      </form>

      {dialog && (
        <CustomMinistryDialog
          onClose={() => setDialog(null)}
          editing={dialog === "edit" ? custom.find((c) => c.id === editingId) : undefined}
          nameExists={nameExists}
          onSave={(entry, id) => {
            setCustom((prev) => {
              if (id) {
                return prev.map((c) => (c.id === id ? { ...c, ...entry } : c));
              }
              const existing = prev.find(
                (c) => c.name.trim().toLowerCase() === entry.name.trim().toLowerCase()
              );
              if (existing) {
                return prev.map((c) => (c.id === existing.id ? { ...c, ...entry } : c));
              }
              return [...prev, { ...entry, id: `custom-${Date.now()}` }];
            });
            setDialog(null);
          }}
        />
      )}
    </OnboardingLayout>
  );
}

// ─── Selectable ministry card ──────────────────────────────────────────────────
function MinistryCard({
  name,
  description,
  icon,
  selected,
  onToggle,
  onEdit,
  onDelete,
}: {
  name: string;
  description?: string;
  icon?: string;
  selected: boolean;
  onToggle: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const IconCmp = resolveMinistryIcon(icon);
  const [focused, setFocused] = useState(false);

  return (
    <div
      className="relative group rounded-xl flex flex-col"
      style={{
        background: selected ? "color-mix(in srgb, var(--eden-primary) 8%, transparent)" : "#fff",
        border: `1px solid ${selected ? "var(--eden-primary)" : "var(--eden-outline-variant)"}`,
        boxShadow: focused ? `0 0 0 2px var(--eden-outline)` : "none",
        transition: "border-color 0.18s ease, background-color 0.18s ease",
      }}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={selected}
        aria-label={`${selected ? "Deselect" : "Select"} ${name}`}
        onClick={onToggle}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full text-left flex items-center gap-2.5 rounded-xl cursor-pointer"
        style={{ background: "transparent", border: "none", padding: "12px", fontFamily: "var(--font-label)" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: selected ? "var(--eden-primary)" : "#F0EFE9", transition: "background-color 0.18s ease" }}
        >
          <IconCmp size={15} style={{ color: selected ? "#fff" : "#1B2A4A" }} />
        </div>
        <div className="flex-1 min-w-0">
          <div style={{ fontSize: "12px", fontWeight: 600, color: "#1E293B" }}>{name}</div>
          {description && (
            <div style={{ fontSize: "11px", color: "#64748B", marginTop: "2px", lineHeight: 1.3 }}>
              {description}
            </div>
          )}
        </div>
        <div
          className="rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            border: selected ? "none" : "1px solid var(--eden-outline-variant)",
            background: selected ? "var(--eden-primary)" : "transparent",
            transition: "background-color 0.18s ease",
            width: 18,
            height: 18,
          }}
        >
          {selected && <Check size={11} color="#fff" strokeWidth={3} />}
        </div>
      </button>
      {(onEdit || onDelete) && (
        <div className="absolute top-1.5 right-1.5 flex items-center gap-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity">
          {onEdit && (
            <button
              type="button"
              aria-label={`Edit ${name}`}
              onClick={onEdit}
              className="w-6 h-6 rounded-md flex items-center justify-center transition-colors hover:bg-[#F0EEE9] bg-white"
              style={{ color: "#64748B" }}
            >
              <Pencil size={11} />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              aria-label={`Delete ${name}`}
              onClick={onDelete}
              className="w-6 h-6 rounded-md flex items-center justify-center transition-colors hover:bg-red-50 bg-white"
              style={{ color: "#EF4444" }}
            >
              <Trash2 size={11} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Create / edit custom ministry dialog ──────────────────────────────────────
function CustomMinistryDialog({
  onClose,
  editing,
  nameExists,
  onSave,
}: {
  onClose: () => void;
  editing?: CustomMinistryItem;
  nameExists: (name: string, ignoreId?: string) => boolean;
  onSave: (entry: Omit<CustomMinistryItem, "id">, id?: string) => void;
}) {
  const [name, setName] = useState(editing?.name ?? "");
  const [type, setType] = useState<MinistryType>(editing?.type ?? "MINISTRY");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [icon, setIcon] = useState<string | undefined>(editing?.icon ?? "Users");
  const [error, setError] = useState("");

  const isEditing = !!editing;

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name is required.");
      return;
    }
    if (nameExists(trimmed, editing?.id)) {
      setError("A ministry or department with this name already exists. Please choose a different name.");
      return;
    }
    onSave(
      { name: trimmed, type, description: description.trim() || undefined, icon },
      editing?.id
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0" style={{ background: "rgba(15,23,42,0.45)", backdropFilter: "blur(3px)" }} onClick={onClose} />
      <div
        className="relative w-full max-w-md rounded-2xl bg-white overflow-hidden flex flex-col max-h-[90vh]"
        style={{ boxShadow: "0 30px 70px rgba(0,0,0,0.28)", border: "1px solid #E5E3DC" }}
      >
        <div className="flex items-start gap-3 px-6 pt-5 pb-4 flex-shrink-0" style={{ borderBottom: "1px solid #EDEAE6" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#EFF6FF]">
            <Church size={17} color="#1B2A4A" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold text-slate-900">
              {isEditing ? "Edit Ministry / Department" : "Create Custom Ministry or Department"}
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Custom entries are scoped strictly to your church.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#F0EEE9] text-slate-400">
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. Hospitality Ministry"
              className="w-full px-3 py-2 bg-white border border-[#E5E3DC] rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#1B2A4A]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Type <span className="text-red-500">*</span>
            </label>
            <div className="inline-flex rounded-lg overflow-hidden border border-[#E5E3DC]">
              {(["MINISTRY", "DEPARTMENT"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className="px-4 py-2 text-xs font-semibold transition-colors cursor-pointer"
                  style={{
                    background: type === t ? "#1B2A4A" : "#fff",
                    color: type === t ? "#fff" : "#64748B",
                  }}
                >
                  {t === "MINISTRY" ? "Ministry" : "Department"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Describe this ministry or department..."
              className="w-full px-3 py-2 bg-white border border-[#E5E3DC] rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#1B2A4A] resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Icon <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5">
              {MINISTRY_ICON_PICKER.map((n) => {
                const IconCmp = resolveMinistryIcon(n);
                const active = icon === n;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setIcon(n)}
                    aria-label={`Select icon ${n}`}
                    className="h-9 rounded-lg flex items-center justify-center cursor-pointer transition-all"
                    style={{
                      background: active ? "#EFF6FF" : "#FAFAF8",
                      border: active ? "1px solid #1B2A4A" : "1px solid #E5E3DC",
                    }}
                  >
                    <IconCmp size={15} style={{ color: active ? "#1B2A4A" : "#64748B" }} />
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="px-3 py-2 rounded-lg text-[11.5px] font-medium text-red-600" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.3)" }}>
              {error}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2.5 px-6 py-4 flex-shrink-0" style={{ borderTop: "1px solid #EDEAE6" }}>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:bg-[#F0EEE9] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 transition-all hover:opacity-90 cursor-pointer"
            style={{ background: "#1B2A4A" }}
          >
            <Check size={13} />
            {isEditing ? "Save Changes" : "Add Ministry"}
          </button>
        </div>
      </div>
    </div>
  );
}
