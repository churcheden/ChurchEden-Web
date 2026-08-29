import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { EdenRing } from "./eden-ring";
import type { EdenState } from "./eden-ring";

export interface EdenMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface EdenConversationProps {
  messages: EdenMessage[];
  state: EdenState;
  streaming: boolean;
}

function MessageBubble({ message, streaming }: { message: EdenMessage; streaming: boolean }) {
  const streamingDone = streaming && message.role === "assistant" && message.content.length === 0;
  return (
    <div className={message.role === "user" ? "eden-msg eden-msg--user" : "eden-msg eden-msg--ai"}>
      {message.role === "assistant" && (
        <div className="eden-msg__avatar">
          <Sparkles size={15} />
        </div>
      )}
      <div className="eden-msg__bubble">
        {message.content}
        {streamingDone && <span className="eden-msg__cursor" />}
      </div>
    </div>
  );
}

export function EdenConversation({ messages, state, streaming }: EdenConversationProps) {
  const threadRef = useRef<HTMLDivElement>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
    // Skip the jump on first mount (when the view just switched to chat).
    if (!initialized) setInitialized(true);
  }, [messages, state, initialized]);

  return (
    <div className="eden-chat">
      <div className="eden-chat__head">
        <div className="eden-chat__brand">
          <EdenRing state={state} size="small" />
          Eden AI
        </div>
      </div>
      <div className="eden-chat__thread" ref={threadRef}>
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} streaming={streaming} />
        ))}
      </div>
    </div>
  );
}
