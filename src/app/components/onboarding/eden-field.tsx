import type { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../ui/utils";

interface EdenFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  error?: string;
  hint?: string;
  requiredBadge?: boolean;
}

export function EdenField({
  label,
  icon,
  error,
  hint,
  requiredBadge,
  className,
  id,
  required,
  ...props
}: EdenFieldProps) {
  return (
    <div className="space-y-1.5 text-left">
      <label htmlFor={id} className="block text-sm font-medium text-eden-on-surface">
        {label}
        {(required || requiredBadge) && <span className="text-amber-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-eden-outline pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          className={cn(
            "w-full px-3.5 py-2.5 bg-white/90 border rounded-xl text-sm text-slate-800 placeholder:text-slate-400 shadow-xs transition-all outline-none",
            "focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500",
            error ? "border-red-400 ring-2 ring-red-400/20" : "border-[#E5E3DC]",
            icon && "pl-10",
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {hint && !error && <p className="text-xs text-eden-outline">{hint}</p>}
    </div>
  );
}

interface EdenSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  icon?: ReactNode;
  error?: string;
  hint?: string;
  requiredBadge?: boolean;
  options?: Array<{ value: string; label: string }>;
  placeholderOption?: string;
}

export function EdenSelect({
  label,
  icon,
  error,
  hint,
  requiredBadge,
  options,
  placeholderOption = "Select option",
  className,
  id,
  required,
  children,
  ...props
}: EdenSelectProps) {
  return (
    <div className="space-y-1.5 text-left">
      <label htmlFor={id} className="block text-sm font-medium text-eden-on-surface">
        {label}
        {(required || requiredBadge) && <span className="text-amber-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-eden-outline pointer-events-none">
            {icon}
          </div>
        )}
        <select
          id={id}
          className={cn(
            "w-full px-3.5 py-2.5 bg-white/90 border rounded-xl text-sm text-slate-800 shadow-xs transition-all outline-none appearance-none cursor-pointer pr-10",
            "focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500",
            error ? "border-red-400 ring-2 ring-red-400/20" : "border-[#E5E3DC]",
            icon && "pl-10",
            className,
          )}
          {...props}
        >
          {placeholderOption && (
            <option value="" disabled className="text-slate-400">
              {placeholderOption}
            </option>
          )}
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} className="text-slate-800">
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <ChevronDown size={16} />
        </div>
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {hint && !error && <p className="text-xs text-eden-outline">{hint}</p>}
    </div>
  );
}
