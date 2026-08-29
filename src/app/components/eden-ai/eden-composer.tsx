import { useEffect, useRef, useState } from "react";
import { Mic, ArrowUp } from "lucide-react";

interface EdenComposerProps {
  initialValue?: string;
  placeholder?: string;
  autoFocus?: boolean;
  onSubmit: (text: string) => void;
}

/**
 * The primary input element. A rounded pill with a mic (left) that expands a
 * voice session panel and a submit arrow (right). Enter submits, Shift+Enter
 * inserts a newline. The textarea auto-grows up to a few lines.
 */
export function EdenComposer({
  initialValue = "",
  placeholder = "What would you like me to help with?",
  autoFocus = false,
  onSubmit,
}: EdenComposerProps) {
  const [value, setValue] = useState(initialValue);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const canSubmit = value.trim().length > 0;

  const handleSubmit = () => {
    const text = value.trim();
    if (!text) return;
    setValue("");
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
    }
    onSubmit(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const autoGrow = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  const finishVoice = () => {
    setVoiceOpen(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <>
      <div className="eden-composer">
        <button
          type="button"
          className={["eden-composer__btn", "eden-composer__mic", voiceOpen ? "active" : ""].join(" ")}
          aria-label="Start a voice session"
          onClick={() => setVoiceOpen((v) => !v)}
        >
          <Mic size={17} />
        </button>
        <textarea
          ref={textareaRef}
          className="eden-composer__input"
          placeholder={placeholder}
          rows={1}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            autoGrow();
          }}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className={["eden-composer__btn", "eden-composer__submit"].join(" ")}
          aria-label="Send message"
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          <ArrowUp size={18} />
        </button>
      </div>

      {voiceOpen && (
        <div className="eden-voice-panel" role="dialog" aria-label="Voice session">
          <div className="eden-voice-panel__dot">
            <Mic size={20} />
          </div>
          <div style={{ fontFamily: "var(--font-label)", fontSize: "14px", fontWeight: 600, color: "var(--eden-on-surface)" }}>
            Listening…
          </div>
          <div style={{ fontFamily: "var(--font-label)", fontSize: "12px", color: "var(--eden-on-surface-variant)" }}>
            Speak now — your message will be transcribed.
          </div>
          <button type="button" className="eden-chip" style={{ marginTop: "2px" }} onClick={finishVoice}>
            Tap to finish
          </button>
        </div>
      )}
    </>
  );
}
