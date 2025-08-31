// src/components/PlatformsStrip.jsx
import React from "react";
import { motion } from "framer-motion";
import { Cpu, Smartphone, Bot, MonitorSmartphone } from "lucide-react";

const BLUE = { 500:"#1A43BF", 600:"#123499" };
const items = [
  { name: "MT5", icon: MonitorSmartphone, desc: "Pro-grade multi-asset" },
  { name: "DTrader", icon: Cpu, desc: "Sleek web terminal" },
  { name: "DBot", icon: Bot, desc: "No-code automation" },
  { name: "Mobile", icon: Smartphone, desc: "Trade on the go" },
];

export default function PlatformsStrip() {
  return (
    <section className="bg-white py-14">
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="h-display text-3xl font-bold mb-6" style={{ color: "#00072D" }}>
          Platforms that fit your flow
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.25 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="p-5 rounded-2xl border bg-white hover:shadow-md"
              style={{ borderColor: "#e5e7eb" }}
            >
              <div className="w-12 h-12 rounded-xl mb-3 flex items-center justify-center"
                   style={{ background: `${BLUE[500]}15` }}>
                <p.icon size={22} color={BLUE[500]} />
              </div>
              <div className="font-semibold" style={{ color: "#051650" }}>{p.name}</div>
              <div className="text-sm text-gray-600">{p.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
