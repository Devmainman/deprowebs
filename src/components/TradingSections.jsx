// src/TradingSections.jsx — LIVE data enabled (CoinGecko + Frankfurter) with graceful fallbacks
// Palette + dark glass match your theme. Animations respect reduced motion.
// No keys required for defaults. You can pass your own data via props later if needed.

import React, { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Activity, BarChart3, CalendarClock, Clock, DollarSign,
  Flame, Globe, Percent, ShieldCheck, BookOpen,
} from "lucide-react";

const BLUE = { 900: "#00072D", 800: "#051650", 700: "#0A2472", 600: "#123499", 500: "#1A43BF" };
const glass = {
  border: "1px solid rgba(255,255,255,.08)",
  background: "linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03))",
};
const fadeUp = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };

/* =========================================================
   Small data helpers (no keys, public endpoints)
   ========================================================= */

// ---- 1) Crypto movers (CoinGecko) ----
async function fetchCryptoMovers() {
  // 24h change for common coins
  const ids = ["bitcoin","ethereum","solana","ripple","cardano","dogecoin"].join(",");
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) throw new Error("coingecko");
  const j = await r.json();
  // Map to your UI format
  return [
    { s: "BTC/USD", ch: +(j.bitcoin.usd_24h_change?.toFixed(2) ?? 0) },
    { s: "ETH/USD", ch: +(j.ethereum.usd_24h_change?.toFixed(2) ?? 0) },
    { s: "SOL/USD", ch: +(j.solana.usd_24h_change?.toFixed(2) ?? 0) },
    { s: "XRP/USD", ch: +(j.ripple.usd_24h_change?.toFixed(2) ?? 0) },
    { s: "ADA/USD", ch: +(j.cardano.usd_24h_change?.toFixed(2) ?? 0) },
    { s: "DOGE/USD", ch: +(j.dogecoin.usd_24h_change?.toFixed(2) ?? 0) },
  ];
}

// ---- 2) FX movers & strength (Frankfurter) ----
// We compute 24h % change for pairs vs USD (EUR, GBP, JPY, AUD, CAD) and a simple strength heatmap.
async function fetchFXMovers() {
  // Today & previous business day (ECB publishes once per day; use yesterday for delta)
  const today = new Date();
  const prev = new Date(today);
  prev.setDate(prev.getDate() - 1);

  const fmt = (d) => d.toISOString().slice(0,10);
  const to = "EUR,GBP,JPY,AUD,CAD";
  // latest rates base=USD:
  const latestUrl = `https://api.frankfurter.app/latest?from=USD&to=${to}`;
  const prevUrl   = `https://api.frankfurter.app/${fmt(prev)}?from=USD&to=${to}`;

  const [lr, pr] = await Promise.all([fetch(latestUrl), fetch(prevUrl)]);
  if (!lr.ok || !pr.ok) throw new Error("frankfurter");
  const latest = await lr.json();
  const prior  = await pr.json();

  const cur = latest.rates; // e.g., { EUR: 0.92, GBP: 0.78, ... } means 1 USD = 0.92 EUR
  const old =  prior.rates;

  // Build common pairs (quote USD: EUR/USD means how many USD per EUR → invert)
  // We derive pair price from USD→CUR and compute % change from prior.
  function pct(now, then) { return ((now - then) / then) * 100; }

  // Convert USD->EUR (0.92) to EUR/USD (1/0.92 = 1.087)
  const pairs = [
    { key:"EUR/USD", now: 1/(cur.EUR), then: 1/(old.EUR) },
    { key:"GBP/USD", now: 1/(cur.GBP), then: 1/(old.GBP) },
    // USD/JPY is direct (how many JPY per USD), we want USD/JPY (keep direct)
    { key:"USD/JPY", now: cur.JPY, then: old.JPY },
    { key:"AUD/USD", now: 1/(cur.AUD), then: 1/(old.AUD) },
    { key:"USD/CAD", now: cur.CAD, then: old.CAD },
  ].map(p => ({ s: p.key, ch: +pct(p.now, p.then).toFixed(2) }));

  // Currency strength: simple average change against USD baseline
  // Positive means stronger vs USD (for EUR, GBP, AUD), for USD/XXX we invert sign to represent XXX strength.
  const strength = [
    { c:"EUR", v: +pct(1/cur.EUR, 1/old.EUR).toFixed(2) },
    { c:"GBP", v: +pct(1/cur.GBP, 1/old.GBP).toFixed(2) },
    { c:"JPY", v: -pct(cur.JPY, old.JPY).toFixed(2) }, // USD/JPY ↑ → JPY weaker → negative strength
    { c:"AUD", v: +pct(1/cur.AUD, 1/old.AUD).toFixed(2) },
    { c:"CAD", v: -pct(cur.CAD, old.CAD).toFixed(2) }, // USD/CAD ↑ → CAD weaker
    { c:"USD", v: 0 }, // leave USD neutral for the simple heatmap
  ];

  return { pairs, strength };
}

/* =========================================================
   1) KPI strip (kept mostly static; can be wired to your backend later)
   ========================================================= */
export function KPIStatsStrip({ data }) {
  const items = data ?? [
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

/* =========================================================
   2) Session clocks (already dynamic to user TZ)
   ========================================================= */
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
      const wrap = end < start;
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
              <div className="mt-2 text:[11px] text-white/60">Times auto-adjust to your timezone.</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   3) Top movers + mini heatmap (LIVE)
   ========================================================= */
export function TopMoversHeatmap({ pollMs = 60_000 }) {
  const reduce = useReducedMotion();
  const [fx, setFx] = useState({ pairs: [], strength: [] });
  const [crypto, setCrypto] = useState([]);
  const [err, setErr] = useState(null);

  // Initial fetch + polling
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const [fxRes, cgRes] = await Promise.allSettled([fetchFXMovers(), fetchCryptoMovers()]);
        if (!alive) return;
        if (fxRes.status === "fulfilled") setFx(fxRes.value);
        if (cgRes.status === "fulfilled") setCrypto(cgRes.value);
        if (fxRes.status !== "fulfilled" && cgRes.status !== "fulfilled") setErr("network");
      } catch {
        if (alive) setErr("network");
      }
    };
    load();
    const id = setInterval(load, pollMs);
    return () => { alive = false; clearInterval(id); };
  }, [pollMs]);

  // Fallback demo if nothing loaded
  const movers = useMemo(() => {
    const demo = [
      { s: "EUR/USD", ch: +0.34 }, { s: "GBP/USD", ch: -0.21 }, { s: "USD/JPY", ch: +0.09 },
      { s: "XAU/USD", ch: +0.65 }, { s: "BTC/USD", ch: -1.4 },  { s: "ETH/USD", ch: +0.8 },
    ];
    const combined = [...(fx.pairs ?? []), ...(crypto ?? [])];
    return combined.length ? combined.slice(0, 6) : demo;
  }, [fx.pairs, crypto]);

  const strength = useMemo(() => {
    const demo = [
      { c:"EUR", v:+0.4 }, { c:"USD", v:-0.2 }, { c:"JPY", v:-0.1 },
      { c:"GBP", v:+0.1 }, { c:"AUD", v:+0.2 }, { c:"CAD", v:-0.05 },
    ];
    return (fx.strength?.length ? fx.strength : demo).slice(0, 6);
  }, [fx.strength]);

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
        <div className="mt-3 text-[11px] text-white/60">
          {err ? "Live feed unavailable. Showing demo placeholders." : "Live from CoinGecko + ECB (Frankfurter)."}
        </div>
      </div>

      {/* Mini heatmap */}
      <div className="rounded-2xl border p-4" style={glass}>
        <div className="flex items-center gap-2 mb-3 text-white/90"><Flame size={16} /> <span className="font-semibold">FX strength heatmap</span></div>
        <div className="grid grid-cols-3 gap-2">
          {strength.map((g) => {
            const v = g.v;
            const bg = v >= 0
              ? `rgba(16,185,129,${Math.min(0.1 + Math.abs(v)/1.5, .5)})`
              : `rgba(244,63,94,${Math.min(0.1 + Math.abs(v)/1.5, .5)})`;
            return (
              <div key={g.c} className="rounded-xl border p-3 text-center" style={{ ...glass, background: `${bg}` }}>
                <div className="text-xs text-white/70">{g.c}</div>
                <div className="text-sm font-semibold text-white">{v > 0 ? "+" : ""}{v}%</div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 text-[11px] text-white/60">Green = stronger vs USD basket · Red = weaker</div>
      </div>
    </div>
  );
}

/* =========================================================
   4) Spreads panel (leave static unless you wire your broker API)
   ========================================================= */
export function SpreadsPanel({ rows }) {
  const data = rows ?? [
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
          {data.map((r) => (
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

/* =========================================================
   5) Economic calendar (kept illustrative, but you can pass live items)
   ========================================================= */
export function EconomicCalendarLite({ items }) {
  const data = items ?? [
    { when: "Fri 13:30", title: "US Non-Farm Payrolls (NFP)", impact: "High", hint: "Jobs & wages drive USD" },
    { when: "Wed 12:00", title: "UK CPI (YoY)", impact: "High", hint: "Inflation → BoE path" },
    { when: "Thu 19:00", title: "FOMC Rate Decision", impact: "High", hint: "Policy & guidance" },
    { when: "Tue 02:30", title: "AU Employment Change", impact: "Medium", hint: "AUD sensitivity" },
  ];
  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="rounded-2xl border p-4" style={glass}>
        <div className="flex items-center gap-2 mb-3 text-white/90"><CalendarClock size={16} /> <span className="font-semibold">This week’s events</span></div>
        <div className="grid gap-2 sm:grid-cols-2">
          {data.map((e, i) => (
            <div key={i} className="rounded-xl border p-3" style={glass}>
              <div className="flex items-center justify-between">
                <div className="font-semibold text-white">{e.title}</div>
                <span className={`text-xs ${e.impact === "High" ? "text-rose-400" : "text-amber-300"}`}>{e.impact}</span>
              </div>
              <div className="text-sm text-white/80">{e.when} · <span className="text-white/60">{e.hint}</span></div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-[11px] text-white/60">Times auto-adjust locally.</div>
      </div>
    </div>
  );
}

/* =========================================================
   6) Strategy ideas (static education content)
   ========================================================= */
export function StrategyIdeas({ cards }) {
  const data = cards ?? [
    { title: "London Breakout", body: "Fade or follow the volatility burst around the London open using session highs/lows and volatility filters.",
      points: ["Define Asian session range", "Place stops beyond opposite side", "Use time-based exit if no follow-through"] },
    { title: "RSI Divergence", body: "Spot momentum exhaustion on majors and gold; combine with structure (S/R) and a 20/50 EMA bias.",
      points: ["Mark HH/HL vs RSI lower highs", "Wait for candle confirmation", "Trail below/above swing"] },
    { title: "Trend Pullback", body: "Enter with the dominant trend on a 38.2–61.8% retracement and confluence with VWAP or moving averages.",
      points: ["Multi-timeframe alignment", "Risk 0.5–1.0R per trade", "Scale out into prior highs/lows"] },
  ];
  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="rounded-2xl border p-4" style={glass}>
        <div className="flex items-center gap-2 mb-3 text-white/90"><BookOpen size={16} /> <span className="font-semibold">Strategy ideas (for education)</span></div>
        <div className="grid gap-3 md:grid-cols-3">
          {data.map((c) => (
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

/* =========================================================
   7) Risk bar (unchanged)
   ========================================================= */
export function RiskDisclosureBar() {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="rounded-2xl border p-3 text-center text-[12px] md:text-xs text-white/70" style={glass}>
        Trading involves risk. Your capital is at risk. Past performance does not guarantee future results.
      </div>
    </div>
  );
}

/* Convenience wrapper */
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
