import React from "react";

export const BLUE = { 900:"#00072D", 800:"#051650", 700:"#0A2472", 600:"#123499", 500:"#1A43BF" };

export const GlassCard = ({ title, kicker, right, children, light = false }) => (
  <div
    className={`${light ? "bg-white" : "bg-white/[.03]"} rounded-2xl border p-5 shadow-xl ${
      light ? "border-black/10" : "border-white/10 text-white"
    }`}
    style={{ boxShadow: light ? "0 10px 30px rgba(0,0,0,.08)" : "0 10px 30px rgba(0,0,0,.35)" }}
  >
    <div className="flex items-start gap-3 mb-3">
      <div className={`text-xs uppercase tracking-wider ${light ? "text-black/60" : "text-white/60"}`}>{kicker}</div>
      <div className="ml-auto text-sm opacity-70">{right}</div>
    </div>
    {title && <div className={`${light ? "text-[#051650]" : "text-white"} text-lg font-semibold mb-3`}>{title}</div>}
    {children}
  </div>
);

export const Badge = ({ children }) => (
  <span
    className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold"
    style={{ color: "#fff", background: `linear-gradient(135deg, ${BLUE[700]}, ${BLUE[500]})` }}
  >
    {children}
  </span>
);

export const SparkLine = ({ data = [1,3,2,5,4,7,6], width = 140, height = 40 }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (width - 6) + 3;
    const y = height - ((v - min) / (max - min || 1)) * (height - 6) - 3;
    return `${x},${y}`;
  });
  return (
    <svg width={width} height={height} className="block">
      <defs>
        <linearGradient id="grad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={BLUE[700]} />
          <stop offset="100%" stopColor={BLUE[500]} />
        </linearGradient>
      </defs>
      <polyline points={pts.join(" ")} fill="none" stroke="url(#grad)" strokeWidth="2" />
    </svg>
  );
};

export const ProgressBar = ({ value = 50 }) => (
  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
    <div
      className="h-full rounded-full"
      style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: `linear-gradient(90deg, ${BLUE[700]}, ${BLUE[500]})` }}
    />
  </div>
);

export function LabeledInput({ label, value, onChange, step = 1 }) {
  return (
    <div>
      <div className="text-xs opacity-70 mb-1">{label}</div>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10"
      />
    </div>
  );
}

export function GlassStat({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 p-3 bg-white/[.02]">
      <div className="text-xs opacity-70 mb-1">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}
