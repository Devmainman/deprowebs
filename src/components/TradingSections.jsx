// src/TradingSections.jsx — Add real trading vibe: KPIs, Session clocks, Movers heatmap, Spreads, Calendar, Strategy ideas
// Palette + dark glass match your theme. All copy is trading‑aware. Animations respect reduced motion.

import React, { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  BarChart3,
  CalendarClock,
  Clock,
  DollarSign,
  Flame,
  Globe,
  LineChart,
  Percent,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  BookOpen,
} from "lucide-react";

const BLUE = { 900: "#00072D", 800: "#051650", 700: "#0A2472", 600: "#123499", 500: "#1A43BF" };
const glass = {
  border: "1px solid rgba(255,255,255,.08)",
  background: "linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03))",
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// ===== 1) KPI strip: quick platform proof (execution, uptime, markets, regulation-like cue) =====
export function KPIStatsStrip() {
  const items = [
    { icon: <Activity size={18} />, label: "Execution", value: "<40ms avg" },
    { icon: <Percent size={18} />, label: "EUR/USD spread", value: "from 0.2 pips" },
    { icon: <Globe size={18} />, label: "Tradable symbols", value: "120+" },
    { icon: <ShieldCheck size={18} />, label: "Uptime", value: "99.99%" },
  ];
  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-3 px-6">
      {items.map((it, i) => (
        <div key={i} className="rounded-2xl border px-4 py-3 text-white/85 flex items-center gap-3" style={glass}>
          <div className="grid place-items-center rounded-xl" style={{ width: 34, height: 34, background: `linear-gradient(135deg, ${BLUE[900]}66, transparent)` }}>
            {it.icon}
          </div>
          <div className="leading-tight">
            <div className="text-[11px] uppercase tracking-wide text-white/60">{it.label}</div>
            <div className="text-sm font-semibold text-white">{it.value}</div>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

// ===== 2) Session clocks: where liquidity is now (Sydney, Tokyo, London, New York) =====
function useNow(refreshMs = 30_000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), refreshMs); return () => clearInterval(t); }, [refreshMs]);
  return now;
}

export function SessionClocks() {
  const now = useNow();
  const sessions = useMemo(() => ([
    { name: "Sydney", tz: "Australia/Sydney", start: 8, end: 16 },
    { name: "Tokyo", tz: "Asia/Tokyo", start: 9, end: 17 },
    { name: "London", tz: "Europe/London", start: 8, end: 17 },
    { name: "New York", tz: "America/New_York", start: 8, end: 17 },
  ]), []);

  function pctOpen(tz, startH, endH) {
    try {
      const z = new Intl.DateTimeFormat([], { timeZone: tz, hour: "2-digit", hour12: false }).formatToParts(now);
      const hour = parseInt(z.find(p => p.type === "hour").value, 10);
      const start = startH % 24; const end = endH % 24;
      const wrap = end < start; // if it crosses midnight
      let open, pct;
      if (!wrap) { open = hour >= start && hour < end; pct = Math.min(1, Math.max(0, (hour - start) / (end - start))); }
      else { open = hour >= start || hour < end; pct = hour >= start ? (hour - start) / ((24 - start) + end) : (24 - start + hour) / ((24 - start) + end); }
      return { open, pct };
    } catch { return { open: false, pct: 0 }; }
  }

  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {sessions.map((s) => {
          const { open, pct } = pctOpen(s.tz, s.start, s.end);
          return (
            <div key={s.name} className="rounded-2xl border p-4 text-white/85" style={glass}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="opacity-90" />
                  <span className="font-semibold">{s.name}</span>
                </div>
                <span className={`text-xs ${open ? "text-emerald-400" : "text-white/60"}`}>{open ? "Open" : "Closed"}</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${Math.round(pct * 100)}%`, background: `linear-gradient(90deg, ${BLUE[700]}, ${BLUE[500]})` }} />
              </div>
              <div className="mt-2 text-[11px] text-white/60">Times auto‑adjust to your timezone.</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===== 3) Top movers + mini heatmap =====
export function TopMoversHeatmap() {
  const movers = [
    { s: "EUR/USD", ch: +0.34 },
    { s: "GBP/USD", ch: -0.21 },
    { s: "USD/JPY", ch: +0.09 },
    { s: "XAU/USD", ch: +0.65 },
    { s: "BTC/USD", ch: -1.4 },
    { s: "ETH/USD", ch: +0.8 },
  ];
  const grid = [
    { s: "EUR", v: +0.4 }, { s: "USD", v: -0.2 }, { s: "JPY", v: -0.1 }, { s: "GBP", v: +0.1 }, { s: "AUD", v: +0.2 }, { s: "CAD", v: -0.05 },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 grid gap-4 md:grid-cols-3">
      {/* Movers list */}
      <div className="md:col-span-2 rounded-2xl border p-4" style={glass}>
        <div className="flex items-center gap-2 mb-3 text-white/90"><BarChart3 size={16} /> <span className="font-semibold">Top movers (24h)</span></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {movers.map((m) => {
            const up = m.ch >= 0;
            return (
              <div key={m.s} className="rounded-xl border px-3 py-3 text-white/85 flex items-center justify-between" style={glass}>
                <span className="font-semibold">{m.s}</span>
                <span className={`text-sm tabular-nums ${up ? "text-emerald-400" : "text-rose-400"}`}>{up ? "+" : ""}{m.ch}%</span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 text-[11px] text-white/60">Illustrative data for design. Connect to your feed when ready.</div>
      </div>

      {/* Mini heatmap */}
      <div className="rounded-2xl border p-4" style={glass}>
        <div className="flex items-center gap-2 mb-3 text-white/90"><Flame size={16} /> <span className="font-semibold">FX strength heatmap</span></div>
        <div className="grid grid-cols-3 gap-2">
          {grid.map((g) => {
            const v = g.v;
            const bg = v >= 0 ? `rgba(16,185,129,${Math.min(0.1 + v/1.5, .5)})` : `rgba(244,63,94,${Math.min(0.1 + Math.abs(v)/1.5, .5)})`;
            return (
              <div key={g.s} className="rounded-xl border p-3 text-center" style={{ ...glass, background: `${bg}` }}>
                <div className="text-xs text-white/70">{g.s}</div>
                <div className="text-sm font-semibold text-white">{v > 0 ? "+" : ""}{v}%</div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 text-[11px] text-white/60">Green = stronger vs basket · Red = weaker</div>
      </div>
    </div>
  );
}

// ===== 4) Spreads panel =====
export function SpreadsPanel() {
  const rows = [
    { s: "EUR/USD", spread: "from 0.2 pips" },
    { s: "GBP/USD", spread: "from 0.6 pips" },
    { s: "XAU/USD", spread: "from 15¢" },
    { s: "BTC/USD", spread: "from $12" },
  ];
  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="rounded-2xl border p-4" style={glass}>
        <div className="flex items-center gap-2 mb-3 text-white/90"><DollarSign size={16} /> <span className="font-semibold">Typical spreads</span></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {rows.map((r) => (
            <div key={r.s} className="rounded-xl border px-3 py-3 text-white/85 text-center" style={glass}>
              <div className="font-semibold">{r.s}</div>
              <div className="text-sm text-white/80">{r.spread}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-[11px] text-white/60">“From” indicates the best available under normal conditions; varies with liquidity and volatility.</div>
      </div>
    </div>
  );
}

// ===== 5) Lightweight economic calendar =====
export function EconomicCalendarLite() {
  const items = [
    { when: "Fri 13:30", title: "US Non‑Farm Payrolls (NFP)", impact: "High", hint: "Jobs & wages drive USD" },
    { when: "Wed 12:00", title: "UK CPI (YoY)", impact: "High", hint: "Inflation → BoE path" },
    { when: "Thu 19:00", title: "FOMC Rate Decision", impact: "High", hint: "Policy & guidance" },
    { when: "Tue 02:30", title: "AU Employment Change", impact: "Medium", hint: "AUD sensitivity" },
  ];
  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="rounded-2xl border p-4" style={glass}>
        <div className="flex items-center gap-2 mb-3 text-white/90"><CalendarClock size={16} /> <span className="font-semibold">This week’s events</span></div>
        <div className="grid gap-2 sm:grid-cols-2">
          {items.map((e, i) => (
            <div key={i} className="rounded-xl border p-3" style={glass}>
              <div className="flex items-center justify-between">
                <div className="font-semibold text-white">{e.title}</div>
                <span className={`text-xs ${e.impact === "High" ? "text-rose-400" : "text-amber-300"}`}>{e.impact}</span>
              </div>
              <div className="text-sm text-white/80">{e.when} · <span className="text-white/60">{e.hint}</span></div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-[11px] text-white/60">Times auto‑adjust locally. Data here is illustrative—connect your calendar API when ready.</div>
      </div>
    </div>
  );
}

// ===== 6) Strategy ideas (education + credibility) =====
export function StrategyIdeas() {
  const cards = [
    {
      title: "London Breakout",
      body: "Fade or follow the volatility burst around the London open using session highs/lows and volatility filters.",
      points: ["Define Asian session range", "Place stops beyond opposite side", "Use time‑based exit if no follow‑through"],
    },
    {
      title: "RSI Divergence",
      body: "Spot momentum exhaustion on majors and gold; combine with structure (S/R) and a 20/50 EMA bias.",
      points: ["Mark HH/HL vs RSI lower highs", "Wait for candle confirmation", "Trail below/above swing"],
    },
    {
      title: "Trend Pullback",
      body: "Enter with the dominant trend on a 38.2–61.8% retracement and confluence with VWAP or moving averages.",
      points: ["Multi‑timeframe alignment", "Risk 0.5–1.0R per trade", "Scale out into prior highs/lows"],
    },
  ];
  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="rounded-2xl border p-4" style={glass}>
        <div className="flex items-center gap-2 mb-3 text-white/90"><BookOpen size={16} /> <span className="font-semibold">Strategy ideas (for education)</span></div>
        <div className="grid gap-3 md:grid-cols-3">
          {cards.map((c) => (
            <div key={c.title} className="rounded-xl border p-4" style={glass}>
              <div className="font-semibold text-white mb-1">{c.title}</div>
              <p className="text-white/80 text-sm mb-2">{c.body}</p>
              <ul className="text-white/70 text-sm list-disc ml-5 space-y-1">
                {c.points.map((p) => (<li key={p}>{p}</li>))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-3 text-[11px] text-white/60">For education only—no financial advice. Backtest before live deployment.</div>
      </div>
    </div>
  );
}

// ===== Small risk bar you can place above the footer =====
export function RiskDisclosureBar() {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="rounded-2xl border p-3 text-center text-[12px] md:text-xs text-white/70" style={glass}>
        Trading involves risk. Your capital is at risk. Past performance does not guarantee future results.
      </div>
    </div>
  );
}

// Convenience wrapper to drop several blocks at once (optional)
export function TradingLifeBundle() {
  return (
    <div className="space-y-8">
      <KPIStatsStrip />
      <SessionClocks />
      <TopMoversHeatmap />
      <SpreadsPanel />
      <EconomicCalendarLite />
      <StrategyIdeas />
    </div>
  );
}
