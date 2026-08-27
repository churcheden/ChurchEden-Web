import { motion } from "motion/react";
import { Star } from "lucide-react";
import justLogoTransparent from "@/assets/Just-logo-transparent.png";

export function BrandPanel() {
  const stats = [
    { value: "2,400+", label: "Churches" },
    { value: "180K+", label: "Members" },
    { value: "42", label: "Countries" },
  ];

  const testimonials = [
    { initial: "JM", color: "#C8860A" },
    { initial: "SK", color: "#2D1B69" },
    { initial: "RA", color: "#0A4A3A" },
  ];

  return (
    <div className="relative h-full flex flex-col justify-between p-12">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <img src={justLogoTransparent} alt="ChurchEden" className="w-11 h-11 object-contain" />
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 700, color: '#1a1a1a' }}>
          ChurchEden
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center max-w-xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '52px',
            fontWeight: 700,
            color: '#1a1a1a',
            lineHeight: 1.2,
            marginBottom: '20px',
          }}
        >
          Where your church family grows, and your mission finds its home.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '18px',
            color: 'rgba(0, 0, 0, 0.6)',
            marginBottom: '48px',
          }}
        >
          Church Management, Simplified
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-3 gap-4"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-4 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(200, 134, 10, 0.2)',
              }}
            >
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 700, color: 'var(--aurora-amber)' }}>
                {stat.value}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(0, 0, 0, 0.6)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Testimonials */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="flex items-center gap-4"
      >
        <div className="flex -space-x-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-white"
              style={{ background: testimonial.color }}
            >
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: 'white' }}>
                {testimonial.initial}
              </span>
            </div>
          ))}
        </div>
        <div>
          <div className="flex gap-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill="var(--aurora-amber)" stroke="var(--aurora-amber)" />
            ))}
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(0, 0, 0, 0.6)' }}>
            Trusted by church leaders across Africa and beyond
          </p>
        </div>
      </motion.div>
    </div>
  );
}
