// ------------------------------------------------------------
// src/ChartSection.jsx — Forex & Crypto themed, elevated visuals
// Keeps your brand blues; adds asset tabs, price chips, and richer motion.
// Drop-in: <ChartSection theme="dark" /> or "light". Defaults to dark.
// ------------------------------------------------------------
import React, { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { ArrowUpRight, ArrowDownRight, Sparkles } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";

const BLUE = { 900: "#00072D", 800: "#051650", 700: "#0A2472", 600: "#123499", 500: "#1A43BF" };

const fadeUp = { hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } } };

// ===== Mock data (stable for SSR) =====
// BTC & ETH (crypto), EURUSD & XAUUSD (forex/metal) — monthly-ish ticks
const mk = (pts) => pts.map(([t, v]) => ({ t, v }));
const BTC = mk([["Jan", 42],["Feb",48],["Mar",46],["Apr",54],["May",60],["Jun",58],["Jul",66],["Aug",72],["Sep",68],["Oct",75],["Nov",82],["Dec",88]]);
const ETH = mk([["Jan", 28],["Feb",32],["Mar",30],["Apr",34],["May",38],["Jun",40],["Jul",42],["Aug",45],["Sep",43],["Oct",48],["Nov",51],["Dec",56]]);
const EURUSD = mk([["Jan", 1.07],["Feb",1.08],["Mar",1.09],["Apr",1.08],["May",1.1],["Jun",1.09],["Jul",1.11],["Aug",1.12],["Sep",1.11],["Oct",1.13],["Nov",1.12],["Dec",1.14]]);
const XAUUSD = mk([["Jan", 2050],["Feb",2065],["Mar",2040],["Apr",2100],["May",2125],["Jun",2150],["Jul",2140],["Aug",2180],["Sep",2160],["Oct",2200],["Nov",2215],["Dec",2240]]);

const tinySeries = (arr) => arr.map((d, i) => ({ i, v: typeof d === "number" ? d : d.v }));

const KPI = (
  { label, value, up = true, note, dark }
) => (
  <div className={`rounded-2xl p-4 ${dark ? "bg-white/5" : "bg-gray-50"}`}>
    <div className="flex items-center justify-between">
      <span className={`text-sm ${dark ? "text-gray-300" : "text-gray-700"}`}>{label}</span>
      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${up ? "text-emerald-400" : "text-rose-400"}`}>
        {up ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
        {value}
      </span>
    </div>
    {note && <div className={`mt-1 text-xs ${dark ? "text-gray-400" : "text-gray-600"}`}>{note}</div>}
  </div>
);

const AssetBadge = ({ sym, label }) => (
  <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold bg-white/10 ring-1 ring-white/15 text-white">
    <span className="relative inline-flex h-2.5 w-2.5">
      <span className="absolute inset-0 rounded-full bg-white/60" />
      <span className="absolute inset-0 rounded-full animate-ping bg-white/30" />
    </span>
    {sym} <span className="opacity-80">•</span> {label}
  </span>
);

export default function ChartSection({ theme = "dark" }) {
  const prefersReduced = useReducedMotion();
  const dark = theme === "dark";

  // Asset tabs
  const tabs = [
    { key: "BTCUSD", label: "BTC/USD", data: BTC, unit: "$" },
    { key: "ETHUSD", label: "ETH/USD", data: ETH, unit: "$" },
    { key: "EURUSD", label: "EUR/USD", data: EURUSD, unit: "€" },
    { key: "XAUUSD", label: "XAU/USD", data: XAUUSD, unit: "$" },
  ];
  const [active, setActive] = useState(tabs[0]);

  const gradientStops = useMemo(() => ({ start: BLUE[500], end: BLUE[500] }), []);

  return (
    <section className="relative overflow-hidden" aria-labelledby="charts-heading">
      {/* Backdrop */}
      <div className={`absolute inset-0 z-0 ${dark ? "bg-black" : "bg-white"}`} />

      {/* Animated grid aura */}
      {!prefersReduced && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -top-28 -right-24 h-96 w-96 rounded-full blur-3xl opacity-30"
            style={{ background: dark ? "rgba(26,67,191,0.22)" : "rgba(26,67,191,0.12)" }}
            animate={{ scale: [1, 1.06, 1], rotate: [0, 8, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full blur-3xl opacity-30"
            style={{ background: dark ? "rgba(10,36,114,0.22)" : "rgba(10,36,114,0.1)" }}
            animate={{ scale: [1, 1.04, 1], rotate: [0, -10, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      <div className="relative z-30">
        <div className="container mx-auto px-6 py-20">
          {/* Heading */}
          <RevealOnScroll variants={fadeUp}>
            <h2
              id="charts-heading"
              className="text-center text-4xl md:text-5xl font-bold tracking-tight mb-3"
              style={{ color: dark ? "#FFFFFF" : BLUE[900] }}
            >
              Crypto × Forex — insight at a glance
            </h2>
            <p className={`text-center mb-12 ${dark ? "text-gray-300" : "text-gray-600"}`}>
              Price structure, momentum, and risk in one elegant view.
            </p>
          </RevealOnScroll>

          {/* Asset selector */}
          <RevealOnScroll variants={fadeUp}>
            <div className={`mx-auto mb-8 flex w-full max-w-2xl items-center justify-center gap-2 rounded-2xl p-1 ${dark ? "bg-white/5" : "bg-gray-100"}`}>
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActive(t)}
                  className={`relative flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition ${active.key === t.key ? (dark ? "text-white" : "text-gray-900") : (dark ? "text-gray-300" : "text-gray-600")}`}
                >
                  {active.key === t.key && (
                    <motion.span layoutId="pill" className="absolute inset-0 rounded-xl" style={{ background: dark ? "rgba(255,255,255,0.09)" : "white" }} />
                  )}
                  <span className="relative">{t.label}</span>
                </button>
              ))}
            </div>
          </RevealOnScroll>

          {/* Content grid */}
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className="grid lg:grid-cols-3 gap-6">
            {/* Big Price Structure (Area + Signal) */}
            <motion.article variants={fadeUp} className={`rounded-3xl p-6 ring-1 ${dark ? "bg-white/5 ring-white/10" : "bg-white ring-black/10"}`}>
              <header className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AssetBadge sym={active.key.includes("USD") ? active.key.replace("USD","/USD") : active.key} label={active.label} />
                  <span className={`hidden sm:inline text-xs ${dark ? "text-gray-400" : "text-gray-600"}`}>Structure & momentum</span>
                </div>
                <span className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>YTD</span>
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
                    <CartesianGrid stroke={dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"} vertical={false} />
                    <XAxis dataKey="t" tick={{ fill: dark ? "#CBD5E1" : "#475569", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: dark ? "#CBD5E1" : "#475569", fontSize: 12 }} axisLine={false} tickLine={false} width={36} />
                    <Tooltip cursor={{ stroke: BLUE[500], strokeOpacity: 0.2 }} contentStyle={{ borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 12px 28px rgba(0,0,0,0.18)" }} labelStyle={{ fontWeight: 700 }} />
                    <Area type="monotone" dataKey="v" stroke={BLUE[500]} strokeWidth={2} fill="url(#gPrimary)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* KPIs under the chart */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                {KPI({ label: "24h", value: active.key.includes("EUR") ? "+0.28%" : "+2.4%", dark })}
                {KPI({ label: "Volatility", value: active.key.includes("EUR") ? "Low" : "Med", note: "7‑day", dark })}
                {KPI({ label: "Bias", value: active.key.includes("XAU") ? "Neutral" : "Bullish", dark })}
              </div>
            </motion.article>

           

            {/* Micro‑trends: crypto vs fx sparks */}
            <motion.article variants={fadeUp} className={`rounded-3xl p-6 ring-1 ${dark ? "bg-white/5 ring-white/10" : "bg-white ring-black/10"}`}>
              <h3 className={`text-base font-semibold mb-4 ${dark ? "text-white" : "text-gray-900"}`}>Micro‑trends</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className={`${dark ? "bg-white/5" : "bg-gray-50"} rounded-2xl p-4`}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-gray-400">BTC momentum</span>
                    <span className="text-xs" style={{ color: BLUE[500] }}>+3.2%</span>
                  </div>
                  <div className="h-20">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={tinySeries(BTC)} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
                        <Line type="monotone" dataKey="v" stroke={BLUE[500]} strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className={`${dark ? "bg-white/5" : "bg-gray-50"} rounded-2xl p-4`}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-gray-400">EURUSD drift</span>
                    <span className="text-xs" style={{ color: BLUE[500] }}>+0.4%</span>
                  </div>
                  <div className="h-20">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={tinySeries(EURUSD)} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
                        <Line type="monotone" dataKey="v" stroke={BLUE[500]} strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <p className={`mt-4 text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}>Use sparks for intra‑week bias; align with your session.
              </p>

              {/* Session chips */}
              <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                <span className={`rounded-full px-3 py-1 ${dark ? "bg-white/5 text-gray-300" : "bg-gray-100 text-gray-700"}`}>London • Active</span>
                <span className={`rounded-full px-3 py-1 ${dark ? "bg-white/5 text-gray-300" : "bg-gray-100 text-gray-700"}`}>New York • Next</span>
                <span className={`rounded-full px-3 py-1 ${dark ? "bg-white/5 text-gray-300" : "bg-gray-100 text-gray-700"}`}>Asia • Cooling</span>
              </div>
            </motion.article>
          </motion.div>

          {/* Footnote */}
          <RevealOnScroll variants={fadeUp}>
            <p className={`mt-12 text-center text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}>
              Illustrative data. Connect your exchange/broker to see live markets.
            </p>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
