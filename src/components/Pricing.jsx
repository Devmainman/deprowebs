import { useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, Sparkles, Star } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";

// Theme palette — keep existing brand colors
const COLORS = {
  ink: "#00072D",
  navy: "#051650",
  primary: "#1A43BF",
  primarySoft: "#E9F0FF",
  ring: "rgba(26, 67, 191, 0.18)",
};

const TIERS = [
  { name: "Starter", price: { m: 0, y: 0 }, highlight: false, cta: "Start free", features: ["Basic charts", "Community", "Email support"] },
  { name: "Pro",     price: { m: 29, y: 24 }, highlight: true,  cta: "Start Pro", features: ["Advanced tools", "Priority support", "Copy trading"] },
  { name: "Elite",   price: { m: 79, y: 64 }, highlight: false, cta: "Go Elite", features: ["All features", "1:1 onboarding", "Strategy builder"] },
];

// Motion presets
const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } };

const springy = { type: "spring", stiffness: 420, damping: 32, mass: 0.8 };

export default function Pricing({ yearly = true, onToggle }) {
  const prefersReduced = useReducedMotion();

  const discountCopy = useMemo(() => (
    <span className="ml-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ background: COLORS.primarySoft, color: COLORS.primary }}>
      <Sparkles size={14} /> 20% off
    </span>
  ), []);

  return (
    <section className="relative py-20 overflow-hidden" style={{ background: "#FFFFFF" }}>
      {/* Decorative background accents */}
      {!prefersReduced && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full blur-3xl"
            style={{ background: COLORS.ring }}
            animate={{ scale: [1, 1.08, 1], rotate: [0, 8, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full blur-3xl"
            style={{ background: COLORS.ring }}
            animate={{ scale: [1, 1.06, 1], rotate: [0, -10, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      <div className="container mx-auto px-6 text-center">
        <RevealOnScroll variants={fadeUp}>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-3" style={{ color: COLORS.ink }}>
            Simple, transparent pricing
          </h2>
          <p className="text-gray-600 mb-8">Switch anytime. 14‑day free trial on paid plans.</p>
        </RevealOnScroll>

        {/* Billing Toggle */}
        <RevealOnScroll variants={fadeUp}>
          <div className="inline-flex items-center gap-4 mb-12 select-none" role="group" aria-label="Billing period">
            <span className={!yearly ? "font-semibold" : "text-gray-500"}>Monthly</span>
            <button
              onClick={onToggle}
              aria-pressed={yearly}
              aria-label="Toggle yearly pricing"
              className="relative inline-flex h-9 w-18 items-center rounded-full bg-gray-200/80 p-1 backdrop-blur transition focus:outline-none focus-visible:ring-4"
              style={{ boxShadow: `inset 0 0 0 1px rgba(0,0,0,0.06)`, outlineColor: COLORS.primary }}
            >
              <motion.span
                layout
                className="size-7 rounded-full bg-white shadow"
                style={{ boxShadow: "0 2px 10px rgba(26,67,191,0.15)" }}
                animate={{ x: yearly ? 28 : 0 }}
                transition={springy}
              />
            </button>
            <span className={yearly ? "font-semibold inline-flex items-center" : "text-gray-500 inline-flex items-center"}>
              Yearly {discountCopy}
            </span>
          </div>
        </RevealOnScroll>

        {/* Cards */}
        <RevealOnScroll variants={stagger}>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {TIERS.map((t) => {
              const price = yearly ? t.price.y : t.price.m;
              const isPopular = t.highlight;

              return (
                <motion.article
                  key={t.name}
                  variants={fadeUp}
                  className="group relative overflow-hidden rounded-3xl border p-8 text-left bg-white"
                  style={{ borderColor: isPopular ? "#C7D6FF" : "#E5E7EB" }}
                  whileHover={{ y: -6 }}
                >
                  {/* Glow ring on hover */}
                  {!prefersReduced && (
                    <motion.span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-3xl"
                      style={{ boxShadow: isPopular ? `0 0 0 2px ${COLORS.primarySoft}` : "none" }}
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}

                  {/* Popular badge */}
                  <AnimatePresence>
                    {isPopular && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute -right-4 top-6 rotate-45"
                      >
                        <span
                          className="inline-flex items-center gap-1 rounded-md bg-white/90 px-3 py-1 text-xs font-semibold shadow"
                          style={{ color: COLORS.primary, boxShadow: "0 4px 18px rgba(26,67,191,0.15)" }}
                        >
                          <Star size={14} /> Most popular
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Soft animated corner blob for highlight */}
                  {isPopular && !prefersReduced && (
                    <motion.div
                      className="absolute -top-16 -right-16 h-40 w-40 rounded-full opacity-10"
                      style={{ background: COLORS.primary }}
                      animate={{ scale: [1, 1.08, 1], rotate: [0, 8, 0] }}
                      transition={{ duration: 6, repeat: Infinity }}
                    />
                  )}

                  <header className="mb-6">
                    <h3 className="text-2xl font-bold" style={{ color: COLORS.navy }}>{t.name}</h3>
                    <div className="mt-4 flex items-end gap-2">
                      <span className="text-5xl font-extrabold tracking-tight" style={{ color: COLORS.primary }}>
                        {price}
                      </span>
                      <span className="mb-2 text-sm text-gray-500">{price === 0 ? "" : "/mo"}</span>
                    </div>
                  </header>

                  <ul className="mb-8 space-y-3">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-gray-700">
                        <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-100">
                          <Check size={14} color={COLORS.primary} />
                        </span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ y: -1 }}
                    className="w-full rounded-xl px-4 py-3 font-semibold transition focus:outline-none focus-visible:ring-4"
                    style={{
                      background: isPopular ? COLORS.primary : "transparent",
                      color: isPopular ? "#FFFFFF" : COLORS.navy,
                      border: isPopular ? "none" : "1px solid #D1D5DB",
                      boxShadow: isPopular ? "0 10px 30px rgba(26,67,191,0.25)" : "0 2px 10px rgba(0,0,0,0.04)",
                    }}
                  >
                    {t.cta}
                  </motion.button>

                  {/* Subtle gradient border on hover */}
                  {!prefersReduced && (
                    <motion.div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-3xl"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.35 }}
                      style={{
                        background: `linear-gradient(135deg, rgba(26,67,191,0.12), transparent 40%, rgba(26,67,191,0.12))`,
                        mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        padding: 1,
                      }}
                    />
                  )}
                </motion.article>
              );
            })}
          </div>
        </RevealOnScroll>

        {/* Footnote */}
        <RevealOnScroll variants={fadeUp}>
          <p className="mt-10 text-sm text-gray-500">Prices in USD. Taxes may apply.</p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
