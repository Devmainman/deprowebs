// src/components/TickerTape.jsx
import React from "react";

const items = [
  "99.99% uptime", "40+ FX pairs", "150+ stocks", "24/7 support", "Ultra-fast execution", "Tight spreads",
];

export default function TickerTape() {
  return (
    <div className="bg-black text-white overflow-hidden border-y border-white/10">
      <div className="whitespace-nowrap py-3 animate-[ticker_28s_linear_infinite]">
        {items.concat(items).map((t, i) => (
          <span key={i} className="mx-8 text-white/80">{t}</span>
        ))}
      </div>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
