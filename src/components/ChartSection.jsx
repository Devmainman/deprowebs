// ------------------------------------------------------------
// src/ChartSection.jsx — Light-first (white), leaner content + “Show more”
// - Default theme: "light" (white section)
// - Optional animated light background via withBackground
// - Reduced imports/content, cleaner cards, subtle motion
// ------------------------------------------------------------
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from "recharts";
import RevealOnScroll from "./RevealOnScroll";
import BackgroundFX from "./BackgroundFX";
import { ArrowUpRight, ArrowDownRight, Sparkles } from "lucide-react";

const BLUE = { 900:"#00072D", 800:"#051650", 700:"#0A2472", 600:"#123499", 500:"#1A43BF" };

const fadeUp = { hidden:{opacity:0,y:20}, show:{opacity:1,y:0,transition:{duration:.45,ease:"easeOut"}} };
const stagger = { hidden:{}, show:{transition:{staggerChildren:.1,delayChildren:.05}} };

// ---- Mock data (stable) ----
const mk = (pts) => pts.map(([t, v]) => ({ t, v }));
const BTC = mk([["Jan", 42],["Feb",48],["Mar",46],["Apr",54],["May",60],["Jun",58],["Jul",66],["Aug",72],["Sep",68],["Oct",75],["Nov",82],["Dec",88]]);
const ETH = mk([["Jan", 28],["Feb",32],["Mar",30],["Apr",34],["May",38],["Jun",40],["Jul",42],["Aug",45],["Sep",43],["Oct",48],["Nov",51],["Dec",56]]);
const EURUSD = mk([["Jan",1.07],["Feb",1.08],["Mar",1.09],["Apr",1.08],["May",1.10],["Jun",1.09],["Jul",1.11],["Aug",1.12],["Sep",1.11],["Oct",1.13],["Nov",1.12],["Dec",1.14]]);
const XAUUSD = mk([["Jan",2050],["Feb",2065],["Mar",2040],["Apr",2100],["May",2125],["Jun",2150],["Jul",2140],["Aug",2180],["Sep",2160],["Oct",2200],["Nov",2215],["Dec",2240]]);
const tinySeries = (arr) => arr.map((d, i) => ({ i, v: typeof d === "number" ? d : d.v }));

const KPI = ({ label, value, up = true, note, light = true }) => (
  <div className={`rounded-2xl p-4 ${light ? "bg-gray-50" : "bg-white/5"}`}>
    <div className="flex items-center justify-between">
      <span className={`text-sm ${light ? "text-gray-700" : "text-gray-300"}`}>{label}</span>
      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${up ? "text-emerald-600" : "text-rose-600"}`}>
        {up ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
        {value}
      </span>
    </div>
    {note && <div className={`mt-1 text-xs ${light ? "text-gray-600" : "text-gray-400"}`}>{note}</div>}
  </div>
);

const Badge = ({ sym, label, light = true }) => (
  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${
    light ? "bg-white ring-black/10 text-gray-900" : "bg-white/10 ring-white/15 text-white"
  }`}>
    <span className="relative inline-flex h-2.5 w-2.5">
      <span className={`absolute inset-0 rounded-full ${light ? "bg-slate-500/60" : "bg-white/60"}`} />
      <span className={`absolute inset-0 rounded-full animate-ping ${light ? "bg-slate-400/30" : "bg-white/30"}`} />
    </span>
    {sym} <span className="opacity-60">•</span> {label}
  </span>
);

export default function ChartSection({
  theme = "light",        // <-- white by default
  withBackground = true,  // <-- turn on/off internal animated BG
}) {
  const light = theme === "light";

  const tabs = [
    { key:"BTCUSD", label:"BTC/USD", data:BTC, unit:"$" },
    { key:"ETHUSD", label:"ETH/USD", data:ETH, unit:"$" },
    { key:"EURUSD", label:"EUR/USD", data:EURUSD, unit:"€" },
    { key:"XAUUSD", label:"XAU/USD", data:XAUUSD, unit:"$" },
  ];
  const [active, setActive] = useState(tabs[0]);
  const [expanded, setExpanded] = useState(false); // “Show more” for micro-trends/KPIs

  const gradientStops = useMemo(() => ({ start: BLUE[500], end: BLUE[500] }), []);
  const micro = [
    { title:"BTC momentum", data: tinySeries(BTC), delta:"+3.2%" },
    { title:"EURUSD drift", data: tinySeries(EURUSD), delta:"+0.4%" },
    { title:"ETH strength", data: tinySeries(ETH), delta:"+1.1%" },
    { title:"Gold bias",    data: tinySeries(XAUUSD), delta:"+0.7%" },
  ];
  const visibleMicro = expanded ? micro : micro.slice(0, 2);

  return (
    <section className="relative overflow-hidden" aria-labelledby="charts-heading">
      {/* White/light animated background */}
      {withBackground && (
        <BackgroundFX variant="diagonal-sweep" theme={light ? "light" : "dark"} intensity={light ? 0.12 : 0.22} speed={36} />
      )}

      <div className="relative z-30">
        <div className="container mx-auto px-6 py-16">
          {/* Heading */}
          <RevealOnScroll variants={fadeUp}>
            <h2
              id="charts-heading"
              className={`text-center text-4xl md:text-5xl font-bold tracking-tight mb-3 ${light ? "text-slate-900" : "text-white"}`}
            >
              Crypto × Forex — insight at a glance
            </h2>
            <p className={`text-center mb-10 ${light ? "text-gray-600" : "text-gray-300"}`}>
              Price structure and momentum, simplified for quick decisions.
            </p>
          </RevealOnScroll>

          {/* Tabs */}
          <RevealOnScroll variants={fadeUp}>
            <div className={`mx-auto mb-8 flex w-full max-w-2xl items-center justify-center gap-2 rounded-2xl p-1 ${light ? "bg-gray-100" : "bg-white/5"}`}>
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActive(t)}
                  className={`relative flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    active.key === t.key ? (light ? "text-gray-900" : "text-white") : (light ? "text-gray-600" : "text-gray-300")
                  }`}
                >
                  {active.key === t.key && (
                    <motion.span layoutId="chart-pill" className="absolute inset-0 rounded-xl"
                                 style={{ background: light ? "#fff" : "rgba(255,255,255,0.09)" }} />
                  )}
                  <span className="relative">{t.label}</span>
                </button>
              ))}
            </div>
          </RevealOnScroll>

          {/* Content grid (leaner) */}
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: .25 }} className="grid lg:grid-cols-3 gap-6">
            {/* Main chart card */}
            <motion.article variants={fadeUp} className={`rounded-3xl p-6 ring-1 ${light ? "bg-white ring-black/10" : "bg-white/5 ring-white/10"}`}>
              <header className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge sym={active.key.includes("USD") ? active.key.replace("USD","/USD") : active.key} label={active.label} light={light} />
                  <span className={`hidden sm:inline text-xs ${light ? "text-gray-600" : "text-gray-400"}`}>Structure & momentum</span>
                </div>
                <span className={`text-xs ${light ? "text-gray-500" : "text-gray-400"}`}>YTD</span>
              </header>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={active.data} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gPrimary" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={gradientStops.start} stopOpacity={0.6} />
                        <stop offset="100%" stopColor={gradientStops.end} stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={light ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)"} vertical={false} />
                    <XAxis dataKey="t" tick={{ fill: light ? "#475569" : "#CBD5E1", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: light ? "#475569" : "#CBD5E1", fontSize: 12 }} axisLine={false} tickLine={false} width={36} />
                    <Tooltip
                      cursor={{ stroke: BLUE[500], strokeOpacity: 0.2 }}
                      contentStyle={{ borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 12px 28px rgba(0,0,0,0.18)" }}
                      labelStyle={{ fontWeight: 700 }}
                    />
                    <Area type="monotone" dataKey="v" stroke={BLUE[500]} strokeWidth={2} fill="url(#gPrimary)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* KPIs — trimmed; extra appears on “Show more” */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                {KPI({ label: "24h", value: active.key.includes("EUR") ? "+0.28%" : "+2.4%", light })}
                {KPI({ label: "Volatility", value: active.key.includes("EUR") ? "Low" : "Med", note: "7-day", light })}
                {expanded && KPI({ label: "Bias", value: active.key.includes("XAU") ? "Neutral" : "Bullish", light })}
              </div>
            </motion.article>

            {/* Micro-trends (compact) */}
            <motion.article variants={fadeUp} className={`rounded-3xl p-6 ring-1 ${light ? "bg-white ring-black/10" : "bg-white/5 ring-white/10"}`}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={16} className={light ? "text-gray-600" : "text-gray-300"} />
                <h3 className={`text-base font-semibold ${light ? "text-gray-900" : "text-white"}`}>Micro-trends</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {visibleMicro.map((m) => (
                  <div key={m.title} className={`${light ? "bg-gray-50" : "bg-white/5"} rounded-2xl p-4`}>
                    <div className="flex items-baseline justify-between">
                      <span className={`text-sm ${light ? "text-gray-600" : "text-gray-400"}`}>{m.title}</span>
                      <span className="text-xs" style={{ color: BLUE[500] }}>{m.delta}</span>
                    </div>
                    <div className="h-20">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={m.data} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
                          <Line type="monotone" dataKey="v" stroke={BLUE[500]} strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ))}
              </div>

              {/* Show more/less */}
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setExpanded(v => !v)}
                  className="btn-shine px-4 py-2 rounded-xl font-semibold text-sm text-white"
                  style={{ background: `linear-gradient(135deg, ${BLUE[500]}, ${BLUE[600]})` }}
                  aria-expanded={expanded}
                >
                  {expanded ? "Show less" : "Show more"}
                </button>
              </div>
            </motion.article>

            {/* Empty spacer on large screens to balance layout when collapsed */}
            <div className="hidden lg:block" />
          </motion.div>

          {/* Footnote */}
          <RevealOnScroll variants={fadeUp}>
            <p className={`mt-12 text-center text-sm ${light ? "text-gray-600" : "text-gray-300"}`}>
              Illustrative data. Connect your broker/exchange for live prices.
            </p>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
