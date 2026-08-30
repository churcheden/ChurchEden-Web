import { Check, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

const initialMembers = [
  { id: 1, name: "Kwabena Osei", initials: "KO", date: "May 31", branch: "Main Campus", color: "#2D1B69" },
  { id: 2, name: "Adwoa Frimpong", initials: "AF", date: "May 31", branch: "North Campus", color: "#0A4A3A" },
  { id: 3, name: "Yaw Mensah-Bonsu", initials: "YM", date: "May 30", branch: "East Campus", color: "#C8860A" },
  { id: 4, name: "Efua Asante", initials: "EA", date: "May 30", branch: "Main Campus", color: "#1A0533" },
  { id: 5, name: "Nii Armah", initials: "NA", date: "May 29", branch: "South Campus", color: "#2D1B69" },
];

export function PendingApprovals({ onViewAll }: { onViewAll?: () => void }) {
  const [members, setMembers] = useState(initialMembers);
  const [approved, setApproved] = useState<number[]>([]);

  const approve = (id: number) => {
    setApproved((prev) => [...prev, id]);
    setTimeout(() => setMembers((prev) => prev.filter((m) => m.id !== id)), 500);
  };

  const decline = (id: number) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="rounded-2xl p-5"
      style={{ background: "#FFFFFF", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span style={{ fontSize: "15px", fontWeight: 700, color: "#1A1A2E", fontFamily: "var(--font-label)" }}>
          Pending Approvals
        </span>
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: "rgba(200,134,10,0.12)" }}
        >
          <span style={{ fontSize: "12px", fontWeight: 700, color: "#C8860A", fontFamily: "var(--font-label)" }}>
            {members.length}
          </span>
        </div>
      </div>

      {/* Members */}
      <div className="space-y-2">
        <AnimatePresence>
          {members.map((member, _i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div
                className="flex items-center gap-2.5 p-3 rounded-xl"
                style={{ background: "#F7F7F8" }}
              >
                {/* Avatar */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: member.color }}
                >
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#FFFFFF", fontFamily: "var(--font-label)" }}>
                    {member.initials}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A2E", fontFamily: "var(--font-label)" }} className="truncate">
                    {member.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "var(--font-label)" }}>
                    {member.branch} · {member.date}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => approve(member.id)}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:opacity-90"
                    style={{ background: approved.includes(member.id) ? "#0A7A4A" : "#C8860A" }}
                  >
                    <Check size={12} color="#FFFFFF" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => decline(member.id)}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:bg-gray-200"
                    style={{ background: "#EEEEEE" }}
                  >
                    <X size={12} color="#6B7280" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {members.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-6"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
              style={{ background: "rgba(10,122,74,0.1)" }}
            >
              <Check size={18} color="#0A7A4A" />
            </div>
            <span style={{ fontSize: "13px", color: "#6B7280", fontFamily: "var(--font-label)" }}>All caught up!</span>
          </motion.div>
        )}
      </div>

      {members.length > 0 && (
        <button
          onClick={onViewAll}
          className="w-full mt-4 pt-3 text-center"
          style={{ borderTop: "1px solid #EEEEEE", fontSize: "12px", color: "#C8860A", fontFamily: "var(--font-label)", fontWeight: 500 }}
        >
          View all pending →
        </button>
      )}
    </motion.div>
  );
}
