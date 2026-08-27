import { motion } from "motion/react";

const INTEGRATIONS = ["MoMo", "Flutterwave", "Paystack", "Stripe", "PayPal"];

/**
 * Payment integrations logo strip — displayed between hero and features.
 */
export function LandingIntegrationsStrip() {
  return (
    <section className="border-y border-slate-100 bg-white py-5">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2 px-6 lg:px-10">
        <span className="mr-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Integrates with:
        </span>
        {INTEGRATIONS.map((name, i) => (
          <motion.span
            key={name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="rounded-full bg-slate-50 px-4 py-1.5 text-sm font-bold text-slate-600 ring-1 ring-slate-200"
          >
            {name}
          </motion.span>
        ))}
        <span className="ml-1 text-xs font-bold uppercase tracking-tighter text-slate-400">
          +More
        </span>
      </div>
    </section>
  );
}
