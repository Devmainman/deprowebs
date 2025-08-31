import React from "react";
import { motion } from "framer-motion";
import { UserPlus, CreditCard, TrendingUp } from "lucide-react";

const steps = [
  { title: "Create account", icon: UserPlus, desc: "Sign up in minutes — no friction." },
  { title: "Fund securely", icon: CreditCard, desc: "Cards, wallets & local methods." },
  { title: "Start trading", icon: TrendingUp, desc: "Pick a market, place your trade." },
];

export default function HowItWorks({
  theme = "dark",
}) {
  const titleColor = theme === "dark" ? "text-white" : "text-slate-900";
  const textColor  = theme === "dark" ? "text-white/80" : "text-slate-600";

  return (
    <section className={`${theme === "dark" ? "bg-transparent" : "bg-white"} py-16 relative overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <h3 className={`h-display text-3xl font-bold mb-10 ${titleColor}`}>How it works</h3>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: .5, delay: i * 0.05 }}
              className={`relative p-6 rounded-2xl border border-white/10 bg-transparent`}
            >
              <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-white/10">
                <s.icon size={22} className={titleColor}/>
              </div>

              <div className={`h-display text-xl mb-1 ${titleColor}`}>{s.title}</div>
              <p className={textColor}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
