import { useEffect, useState } from "react";
import { Users, CheckCircle, Clock, CalendarDays } from "lucide-react";
import { motion } from "motion/react";

function useCountUp(target: number, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

function SparkDots({ pattern }: { pattern: number[] }) {
  return (
    <div className="grid gap-0.5" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
      {pattern.map((v, i) => (
        <div
          key={i}
          className="rounded-sm"
          style={{
            width: "7px",
            height: "7px",
            background: v > 0.6 ? "#C8860A" : v > 0.3 ? "rgba(200,134,10,0.4)" : "#EEEEEE",
          }}
        />
      ))}
    </div>
  );
}

const sparkPatterns = [
  [0.2, 0.5, 0.8, 0.3, 0.9, 0.4, 0.7, 0.2, 0.6, 0.8, 0.3, 0.7, 0.9, 0.5],
  [0.7, 0.9, 0.5, 0.8, 0.6, 0.9, 0.7, 0.8, 0.9, 0.6, 0.8, 0.9, 0.7, 0.9],
  [0.1, 0.2, 0.3, 0.4, 0.5, 0.3, 0.2, 0.1, 0.3, 0.2, 0.4, 0.6, 0.3, 0.2],
  [0.3, 0.5, 0.4, 0.6, 0.7, 0.5, 0.8, 0.6, 0.7, 0.5, 0.8, 0.6, 0.7, 0.9],
];

const cards = [
  {
    icon: Users,
    label: "Total Members",
    value: 1248,
    sub: "+34 this month",
    subColor: "#0A7A4A",
    pattern: sparkPatterns[0],
    iconBg: "rgba(45,27,105,0.1)",
    iconColor: "#2D1B69",
  },
  {
    icon: CheckCircle,
    label: "Verified Members",
    value: 1102,
    sub: "88% of total",
    subColor: "#0A7A4A",
    pattern: sparkPatterns[1],
    iconBg: "rgba(10,74,58,0.1)",
    iconColor: "#0A4A3A",
  },
  {
    icon: Clock,
    label: "Pending Approvals",
    value: 46,
    sub: "Tap to review",
    subColor: "#C8860A",
    pattern: sparkPatterns[2],
    iconBg: "rgba(200,134,10,0.1)",
    iconColor: "#C8860A",
  },
  {
    icon: CalendarDays,
    label: "Upcoming Events",
    value: 7,
    sub: "Next: Sunday Service",
    subColor: "#6B7280",
    pattern: sparkPatterns[3],
    iconBg: "rgba(26,5,51,0.08)",
    iconColor: "#1A0533",
  },
];

function StatCard({ card, delay, onClick }: { card: typeof cards[0]; delay: number; onClick?: () => void }) {
  const count = useCountUp(card.value, 1500 + delay * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.08 }}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}
      onClick={onClick}
      className={`rounded-2xl p-5 flex flex-col gap-3 ${onClick ? "cursor-pointer" : "cursor-default"}`}
      style={{
        background: "#FFFFFF",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: card.iconBg }}
        >
          <card.icon size={18} style={{ color: card.iconColor }} />
        </div>
        <SparkDots pattern={card.pattern} />
      </div>
      <div>
        <div style={{ fontSize: "28px", fontWeight: 700, color: "#1A1A2E", fontFamily: "var(--font-label)", lineHeight: 1.1 }}>
          {card.value === 1248 || card.value === 1102
            ? count.toLocaleString()
            : count}
        </div>
        <div style={{ fontSize: "13px", color: "#6B7280", fontFamily: "var(--font-label)", marginTop: "2px" }}>
          {card.label}
        </div>
      </div>
      <div
        className="inline-flex items-center"
        style={{ fontSize: "12px", color: card.subColor, fontFamily: "var(--font-label)", fontWeight: 500 }}
      >
        {card.sub}
      </div>
    </motion.div>
  );
}

export function StatCards({ onPendingClick, onMembersClick }: { onPendingClick?: () => void; onMembersClick?: () => void }) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const handleClick =
          card.label === "Pending Approvals"
            ? onPendingClick
            : card.label === "Total Members" || card.label === "Verified Members"
            ? onMembersClick
            : undefined;
        return <StatCard key={card.label} card={card} delay={i} onClick={handleClick} />;
      })}
    </div>
  );
}
