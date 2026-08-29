import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, CalendarHeart, ClipboardList, Users, Wallet } from "lucide-react";
import { EdenRing, type EdenState } from "./eden-ring";
import { EdenComposer } from "./eden-composer";
import { EdenConversation, type EdenMessage } from "./eden-conversation";
import "./eden-ai.css";

const QUICK_SUGGESTIONS = [
  "Prepare for Sunday service",
  "Why is attendance dropping?",
  "Draft a church announcement",
  "Summarize this week's giving",
];

const SUGGESTED_FOR_YOU = [
  { icon: ClipboardList, label: "Sunday prep checklist" },
  { icon: CalendarHeart, label: "Upcoming events plan" },
  { icon: Users, label: "Welcome new visitors" },
  { icon: Wallet, label: "Giving overview" },
];

const RESPONSES: { match: RegExp; text: string }[] = [
  {
    match: /sunday|service|prep|sermon|worship/i,
    text:
      "Here’s your Sunday prep checklist:\n\n1. Service order confirmed ✓\n2. Announcements reviewed • 3 pending\n3. Worship team notified ✓\n4. Welcome volunteers assigned ✓\n\nWant me to draft the announcement cards next?",
  },
  {
    match: /attendance|drop|decline|membership/i,
    text:
      "Attendance is down 12% vs last month, mostly in the 8am service.\n\nLikely drivers I can see:\n• Summer holiday dip\n• Parking strain on second service\n• No new-visitor follow-up in 3 weeks\n\nI can draft a re-engagement message or prep a survey — which would help?",
  },
  {
    match: /announcement|message|email|letter/i,
    text:
      "Draft announcement ready:\n\n“Join us this Sunday at 10am for a special worship experience. New visitors welcome — coffee in the foyer from 9:30. We’d love to see you there.”\n\nSay the word and I’ll tailor it for SMS, email, or your bulletin.",
  },
  {
    match: /giving|offering|tithe|finance|donation/i,
    text:
      "This week’s giving:\n\n• Total: $4,820\n• vs. last week: +8%\n• Online giving: 62% of total\n• Top fund: Building Fund\n\nNo anomalies detected. Want a week-over-week breakdown or a donor thank-you note?",
  },
  {
    match: /.*/,
    text:
      "I’ve taken note of that. Here’s how I can help with “{{q}}”:\n\n• Pull the relevant church data\n• Draft a message or plan\n• Recommend a next step\n\nLet me know which direction you’d like, or ask me a follow-up.",
  },
];

function buildResponse(prompt: string): string {
  const lower = prompt.toLowerCase();
  const entry = RESPONSES.find((r) => r.match.test(lower)) ?? RESPONSES[RESPONSES.length - 1];
  return entry.text.replace("{{q}}", prompt.trim());
}

export function EdenAIPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<EdenMessage[]>([]);
  const [edenState, setEdenState] = useState<EdenState>("idle");
  const streamingRef = useRef(false);
  const idRef = useRef(0);
  const nextId = () => `eden-${idRef.current++}`;

  const hasMessages = messages.length > 0;

  const handleSubmit = (prompt: string) => {
    if (!prompt || streamingRef.current) return;

    const userMsg: EdenMessage = { id: nextId(), role: "user", content: prompt };
    const replyText = buildResponse(prompt);
    const aiMsg: EdenMessage = { id: nextId(), role: "assistant", content: "" };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setEdenState("thinking");
    streamingRef.current = true;

    // Simulate streaming out the reply.
    let offset = 0;
    const tick = () => {
      offset += Math.min(6 + Math.floor(Math.random() * 10), replyText.length - offset);
      setMessages((prev) =>
        prev.map((m) => (m.id === aiMsg.id ? { ...m, content: replyText.slice(0, offset) } : m)),
      );
      if (offset >= replyText.length) {
        clearInterval(timer);
        setEdenState("idle");
        streamingRef.current = false;
      } else {
        setEdenState("responding");
      }
    };

    const timer = setInterval(tick, 70);
  };

  const suggested = useMemo(() => SUGGESTED_FOR_YOU, []);

  return (
    <div className="eden-ai-page">
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "16px 20px",
          flexShrink: 0,
        }}
      >
        <button type="button" className="eden-ai-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={15} />
          Back
        </button>
        {hasMessages && (
          <span style={{ fontFamily: "var(--font-label)", fontSize: "14px", fontWeight: 600, color: "var(--eden-on-surface)" }}>
            Eden AI
          </span>
        )}
      </div>

      {!hasMessages ? (
        <div className="eden-idle">
          <EdenRing state={edenState} />
          <div className="eden-idle__greeting">Good morning, Pastor Emmanuel</div>
          <div className="eden-idle__greeting-sub">Ask Eden anything about your church — data, plans, and messages.</div>

          <div className="eden-idle__composer">
            <EdenComposer autoFocus onSubmit={handleSubmit} />
          </div>

          <div className="eden-chips">
            {QUICK_SUGGESTIONS.map((s) => (
              <button key={s} type="button" className="eden-chip" onClick={() => handleSubmit(s)}>
                {s}
              </button>
            ))}
          </div>

          <div className="eden-suggested">
            <div className="eden-suggested__label">Suggested for you</div>
            <div className="eden-suggested__row">
              {suggested.map((c) => {
                const Icon = c.icon;
                return (
                  <button
                    key={c.label}
                    type="button"
                    className="eden-suggested__card"
                    onClick={() => handleSubmit(c.label)}
                  >
                    <div className="eden-suggested__icon">
                      <Icon size={17} />
                    </div>
                    <span className="eden-suggested__text">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="eden-chat__layout" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
          <EdenConversation messages={messages} state={edenState} streaming={streamingRef.current} />
          <div className="eden-chat__bottom">
            <div className="eden-chat__composer">
              <EdenComposer placeholder="Follow up or ask something else..." onSubmit={handleSubmit} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
