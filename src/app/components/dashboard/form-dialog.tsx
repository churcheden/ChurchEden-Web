import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

export const DIALOG_GOLD = "#C8860A";
export const DIALOG_INK = "#1A1A1A";
export const DIALOG_MUTED = "#9CA3AF";
export const DIALOG_BODY = "#4B5563";
export const DIALOG_BORDER = "#E8E4DE";
export const DIALOG_BORDER_SOFT = "#EDEAE6";
export const DIALOG_FONT = "var(--font-label)";

export interface FormDialogFooterButton {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  icon?: ReactNode;
  loading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  danger?: boolean;
}

export function FormDialog({
  open,
  onClose,
  icon,
  title,
  description,
  maxWidth = "max-w-2xl",
  bodyId,
  submitFormId,
  submitting = false,
  primaryButton,
  footer,
  children,
}: {
  open: boolean;
  onClose: () => void;
  icon: ReactNode;
  title: string;
  description?: string;
  maxWidth?: string;
  bodyId?: string;
  submitFormId?: string;
  submitting?: boolean;
  primaryButton?: FormDialogFooterButton;
  footer?: ReactNode;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, submitting, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{ background: "rgba(20,16,16,0.45)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.99 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full ${maxWidth} flex flex-col max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-3rem)] overflow-hidden rounded-2xl`}
            style={{ background: "#FFFFFF", boxShadow: "0 30px 70px rgba(0,0,0,0.28)", border: "1px solid rgba(255,255,255,0.4)" }}
          >
            <div className="flex items-start gap-3.5 px-6 sm:px-7 pt-6 pb-5 flex-shrink-0" style={{ borderBottom: `1px solid ${DIALOG_BORDER_SOFT}`, background: "#FFFFFF" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(200,134,10,0.10)" }}>
                {icon}
              </div>
              <div className="min-w-0 flex-1">
                <h2 style={{ fontSize: "18px", fontWeight: 700, color: DIALOG_INK, fontFamily: DIALOG_FONT, letterSpacing: "-0.01em" }}>
                  {title}
                </h2>
                {description && (
                  <p style={{ fontSize: "13px", color: DIALOG_MUTED, fontFamily: DIALOG_FONT, marginTop: "2px" }}>
                    {description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-[#F0EEE9]"
                style={{ color: DIALOG_MUTED }}
              >
                <X size={18} />
              </button>
            </div>

            <div id={bodyId} className="overflow-y-auto flex-1 bg-white">
              {children}
            </div>

            <div className="flex items-center justify-end gap-3 px-6 sm:px-7 py-5 flex-shrink-0" style={{ borderTop: `1px solid ${DIALOG_BORDER_SOFT}`, background: "#FFFFFF" }}>
              {footer ? (
                footer
              ) : primaryButton ? (
              <>
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl transition-all hover:bg-[#F0EEE9] active:scale-[0.98] disabled:opacity-50"
                style={{ fontSize: "13.5px", fontWeight: 600, color: DIALOG_BODY, fontFamily: DIALOG_FONT, border: `1px solid ${DIALOG_BORDER}`, background: "#FFFFFF" }}
              >
                Cancel
              </button>
              <button
                type={submitFormId ? "submit" : "button"}
                onClick={submitFormId ? undefined : primaryButton.onClick}
                form={submitFormId}
                disabled={submitting || primaryButton.disabled}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: submitting
                    ? primaryButton.danger ? "rgba(179,38,30,0.7)" : "rgba(200,134,10,0.7)"
                    : primaryButton.danger
                      ? "linear-gradient(135deg, #B3261E 0%, #D43A2F 100%)"
                      : `linear-gradient(135deg, ${DIALOG_GOLD} 0%, #D99A20 100%)`,
                  boxShadow: primaryButton.danger
                    ? "0 6px 16px rgba(179,38,30,0.22)"
                    : `0 6px 16px rgba(200,134,10,0.28)`,
                  fontSize: "13.5px", fontWeight: 700, color: "#FFFFFF", fontFamily: DIALOG_FONT,
                }}
              >
                {submitting ? (
                  <>
                    <motion.span
                      className="inline-block w-4 h-4 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                      style={{ border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#FFFFFF" }}
                    />
                    {primaryButton.loadingLabel || "Working..."}
                  </>
                ) : (
                  <>
                    {primaryButton.icon}
                    {primaryButton.label}
                  </>
                )}
              </button>
              </>
              ) : null}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
