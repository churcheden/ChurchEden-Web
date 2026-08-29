import type { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "motion/react";

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
>;

interface AmberButtonProps extends NativeButtonProps {
  children: ReactNode;
  variant?: "primary" | "glass";
}

export function AmberButton({ children, variant = "primary", className = "", ...props }: AmberButtonProps) {
  if (variant === "glass") {
    return (
      <motion.button
        className={`w-full px-6 py-3.5 rounded-full transition-all duration-300 ${className}`}
        style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          color: '#1a1a1a',
          fontFamily: 'var(--font-body)',
          fontWeight: 500,
        }}
        whileHover={{ scale: 1.02, background: 'rgba(255, 255, 255, 0.9)' }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }

  return (
    <motion.button
      className={`w-full px-6 py-3.5 rounded-full text-white transition-all duration-300 ${className}`}
      style={{
        background: 'linear-gradient(135deg, var(--aurora-amber) 0%, var(--aurora-gold) 100%)',
        boxShadow: '0 4px 20px rgba(200, 134, 10, 0.4)',
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 6px 30px rgba(200, 134, 10, 0.6)',
      }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
