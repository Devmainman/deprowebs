// src/MarketSummary.jsx — light-first, leaner UI + “Show more” effect + subtle background
import React, { useMemo, useState, useEffect, useRef, memo, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, RefreshCw, Sparkles } from "lucide-react";
import BackgroundFX from "./BackgroundFX";

/* ===== Utilities ===== */
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const fmt = (n) => (typeof n === "number" ? n.toLocaleString() : n);
const rgba = (hex, alpha) =>
  `rgba(${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)},${alpha})`;

/* Count-up (respects reduced motion) */
function CountUp({ value, duration = 0.5, className }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  const reduce = useReducedMotion();

  useEffect(() => {
    const from = prev.current, to = value;
    if (from === to) return;
    if (reduce) {
      setDisplay(to);
      prev.current = to;
      return;
    }
    const start = performance.now();
    let raf;
    const step = (t) => {
      const p = clamp((t - start) / (duration * 1000), 0, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setDisplay(from + (to - from) * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    prev.current = to;
    return () => raf && cancelAnimationFrame(raf);
  }, [value, duration, reduce]);

  return <span className={className}>{fmt(+Number(display).toFixed(4))}</span>;
}

/* Sparkline (gradient fill, glow, last-point dot) */
const Sparkline = memo(function Sparkline({ data = [], stroke = "#16a34a", fillAlpha = 0.14 }) {
  const w = 140, h = 46, pad = 4;
  const uid = React.useId();

  const [min, max] = useMemo(() => {
    if (!data.length) return [0, 1];
    let mi = Math.min(...data), ma = Math.max(...data);
    if (mi === ma) { mi -= 1; ma += 1; }
    return [mi, ma];
  }, [data]);

  const xy = useCallback((v, i) => {
    const x = pad + (i * (w - pad * 2)) / Math.max(1, data.length - 1);
    const y = pad + (h - pad * 2) * (1 - (v - min) / (max - min));
    return [x, y];
  }, [data.length, min, max]);

  const { path, area, lastXY } = useMemo(() => {
    if (!data.length) return { path: "", area: "", lastXY: [0, 0] };
    const top = data.map((v, i) => {
      const [x, y] = xy(v, i);
      return `${i ? "L" : "M"}${x},${y}`;
    }).join(" ");
    const area = `${top} L${w - pad},${h - pad} L${pad},${h - pad} Z`;
    const last = data[data.length - 1];
    const lastXY = xy(last, data.length - 1);
    return { path: top, area, lastXY };
  }, [data, xy]);

  const [lx, ly] = lastXY;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-12" aria-hidden>
      <defs>
        <linearGradient id={`${uid}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor={stroke} stopOpacity={fillAlpha} />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
        <filter id={`${uid}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="2.6" floodColor={stroke} floodOpacity="0.35" />
        </filter>
      </defs>

      <motion.path d={area} fill={`url(#${uid}-fill)`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .4 }} />
      <motion.path d={path} fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"
        style={{ filter: `url(#${uid}-glow)` }} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: .65 }} />
      {data.length > 1 && (
        <g>
          <circle cx={lx} cy={ly} r="2.75" fill="#111827" opacity=".9" />
          <circle cx={lx} cy={ly} r="5.5" fill={stroke} opacity=".22">
            <animate attributeName="r" values="4.5;7;4.5" dur="1.6s" repeatCount="indefinite" />
          </circle>
        </g>
      )}
    </svg>
  );
});

/* Demo feed jitter (illustrative; pause when tab hidden) */
function useDemoFeed(initial, enabled = true) {
  const [rows, setRows] = useState(initial);
  useEffect(() => setRows(initial), [initial]);
  useEffect(() => {
    if (!enabled) return;
    let id;
    const tick = () =>
      setRows(prev =>
        prev.map(item => {
          const drift = (Math.random() - 0.5) * 0.5; // ±0.5%
          const last = item.history[item.history.length - 1] ?? item.price;
          const nPrice = +(last * (1 + drift / 100)).toFixed(4);
          const nextHist = [...item.history.slice(-39), nPrice];
          return { ...item, change: +(item.change + drift).toFixed(2), price: nPrice, history: nextHist };
        })
      );
    const start = () => { id = setInterval(tick, 1100); };
    const stop  = () => { if (id) clearInterval(id); };
    const vis = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener("visibilitychange", vis);
    return () => { stop(); document.removeEventListener("visibilitychange", vis); };
  }, [enabled]);
  return rows;
}

/* Ticker (compact) */
function MoversTicker({ items = [], theme = "light" }) {
  const reduce = useReducedMotion();
  const pos = (c) => c >= 0;
  const col = theme === "light" ? "rgba(0,0,0,.035)" : "rgba(255,255,255,.06)";
  const border = theme === "light" ? "rgba(0,0,0,.08)" : "rgba(255,255,255,.08)";
  const baseText = theme === "light" ? "text-slate-900" : "text-white";
  const dimText  = theme === "light" ? "text-slate-600" : "text-white/70";
  const content = [...items, ...items]; // fewer copies = less visual noise

  return (
    <div className="relative overflow-hidden rounded-xl border mb-5"
         style={{ borderColor: border, background: col }}>
      <motion.div
        className={`flex gap-6 whitespace-nowrap py-2 px-4 ${baseText}`}
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={reduce ? undefined : { duration: 22, repeat: Infinity, ease: "linear" }}
      >
        {content.map((m, i) => (
          <div key={i} className="inline-flex items-center gap-2 text-sm">
            <span className="font-semibold">{m.symbol}</span>
            <span className={dimText}>{fmt(m.price)}</span>
            <span
              className={`px-2 py-0.5 rounded-full ${pos(m.change) ? "text-emerald-600" : "text-rose-600"}`}
              style={{ background: pos(m.change) ? rgba('#10b981', .16) : rgba('#f43f5e', .16) }}
            >
              {m.change > 0 ? "+" : ""}{m.change}%
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ===== Component ===== */
export default function MarketSummary({
  demo = true,
  onRefresh = () => {},
  data: externalData,
  // leaner default tabs
  categories = ["FX","Crypto","Indices"],
  theme = "light",    // <-- light by default
  withBackground = true, 
}) {
  /* Demo seed (trimmed rows for a cleaner grid) */
  const DEMO = useMemo(() => ({
    FX: [
      { symbol:"EURUSD", name:"EUR / USD", price:1.0832, change:+0.24, history:[1.078,1.079,1.081,1.082,1.083] },
      { symbol:"GBPUSD", name:"GBP / USD", price:1.2753, change:-0.12, history:[1.279,1.277,1.276,1.276,1.275] },
      { symbol:"USDJPY", name:"USD / JPY", price:149.23, change:+0.35, history:[148.8,148.9,149.0,149.1,149.2] },
      { symbol:"XAUUSD", name:"Gold",     price:2340,   change:+0.28, history:[2325,2330,2334,2338,2340] },
    ],
    Crypto: [
      { symbol:"BTCUSD", name:"Bitcoin",  price:64420, change:+1.6, history:[63200,63700,64000,64200,64420] },
      { symbol:"ETHUSD", name:"Ethereum", price:3270,  change:+0.9, history:[3210,3225,3250,3260,3270] },
      { symbol:"SOLUSD", name:"Solana",   price:148,   change:-1.2, history:[152,151,150,149,148] },
      { symbol:"XRPUSD", name:"XRP",      price:0.57,  change:+0.3, history:[0.56,0.56,0.565,0.568,0.57] },
    ],
    Indices: [
      { symbol:"SPX",    name:"S&P 500",    price:5520,  change:+0.42, history:[5480,5495,5505,5512,5520] },
      { symbol:"NDX",    name:"Nasdaq 100", price:19620, change:+0.55, history:[19420,19480,19550,19590,19620] },
      { symbol:"FTSE",   name:"FTSE 100",   price:8250,  change:-0.14, history:[8280,8270,8260,8255,8250] },
      { symbol:"DAX",    name:"DAX 40",     price:18540, change:+0.21, history:[18480,18500,18510,18530,18540] },
    ],
  }), []);

  const [tab, setTab] = useState(categories[0]);
  const [expanded, setExpanded] = useState(false);
  const allRows = externalData?.[tab] ?? DEMO[tab];
  const rows = useDemoFeed(allRows, demo);

  const up = (v) => v >= 0;
  const borderCol = theme === "light" ? "rgba(0,0,0,.08)" : "rgba(255,255,255,.10)";
  const textMain  = theme === "light" ? "text-slate-900" : "text-white";
  const textDim   = theme === "light" ? "text-slate-600" : "text-white/70";
  const baseCard  = theme === "light" ? "rgba(0,0,0,.035)" : "rgba(255,255,255,.05)";

  // choose top movers for ticker
  const movers = useMemo(() => [...rows].sort((a,b)=>Math.abs(b.change)-Math.abs(a.change)).slice(0,5), [rows]);

  // keyboard tabs
  const onKeyTabs = (e) => {
    const idx = categories.indexOf(tab);
    if (e.key === 'ArrowRight') setTab(categories[(idx + 1) % categories.length]);
    if (e.key === 'ArrowLeft')  setTab(categories[(idx - 1 + categories.length) % categories.length]);
  };

  // visible slice
  const visible = expanded ? rows : rows.slice(0, 4);

  return (
    <div className="relative">
      {withBackground && (            // <-- wrap the BG
        <BackgroundFX variant="diagonal-sweep" theme={theme} intensity={0.12} speed={36} />
      )}
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Title row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Sparkles className={textDim} size={18} aria-hidden />
            <h3 className={`h-display text-3xl font-bold tracking-tight ${textMain}`}>Market snapshot</h3>
          </div>
          <button
            onClick={onRefresh}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl border"
            style={{ borderColor: borderCol, background: baseCard }}
          >
            <RefreshCw size={16} aria-hidden /> Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="relative mb-4">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Market categories" onKeyDown={onKeyTabs}>
            {categories.map((c) => {
              const active = tab === c;
              return (
                <button
                  key={c}
                  onClick={() => { setTab(c); setExpanded(false); }}
                  role="tab"
                  aria-selected={active}
                  aria-controls={`panel-${c}`}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold relative transition-colors ${
                    active ? "text-white" : textDim
                  }`}
                  style={{
                    background: active
                      ? "linear-gradient(135deg, #1A43BF, #123499)"
                      : baseCard,
                    border: `1px solid ${borderCol}`,
                  }}
                >
                  {c}
                  {active && (
                    <motion.span
                      layoutId="tab-underline"
                      className="absolute left-2 right-2 -bottom-1 h-[2px] rounded-full"
                      style={{ background: "linear-gradient(90deg,#60a5fa,#1A43BF)" }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ticker */}
        <MoversTicker items={movers} theme={theme} />

        {/* Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: .2 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          id={`panel-${tab}`} role="tabpanel" aria-labelledby={tab}
        >
          <AnimatePresence mode="popLayout">
            {visible.map((r) => {
              const pos = up(r.change);
              const tone = pos ? "#16a34a" : "#ef4444"; // emerald / rose
              const aura = pos ? rgba('#10b981', .16) : rgba('#f43f5e', .16);
              const auraHover = pos ? rgba('#10b981', .22) : rgba('#f43f5e', .22);
              return (
                <motion.div
                  key={r.symbol}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  whileHover={{ y: -4 }}
                  transition={{ duration: .25 }}
                  className="relative rounded-2xl border overflow-hidden"
                  style={{ borderColor: borderCol, background: baseCard }}
                >
                  {/* aura */}
                  <motion.div
                    className="absolute inset-0 opacity-0 pointer-events-none"
                    style={{ background: `radial-gradient(120% 120% at 80% 0%, ${aura}, transparent)` }}
                    whileHover={{ opacity: 1 }}
                  />
                  <div className="p-5 relative">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className={`h-display text-lg leading-none ${textMain}`}>{r.name}</div>
                        <div className={`text-xs mt-1 ${textDim}`}>{r.symbol}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold ${textMain}`}>
                          <CountUp value={r.price} />
                        </div>
                        <div
                          className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                          style={{ background: auraHover, color: tone }}
                          aria-label={`Change ${r.change > 0 ? 'up' : 'down'} ${Math.abs(r.change)} percent`}
                        >
                          {pos ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
                          <AnimatePresence initial={false} mode="wait">
                            <motion.span
                              key={r.change}
                              initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }}
                              transition={{ duration: .22 }}
                            >
                              {r.change > 0 ? "+" : ""}{r.change}%
                            </motion.span>
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    {/* sparkline */}
                    <div className="mt-4">
                      <Sparkline data={r.history} stroke={tone} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Show more / less */}
        {rows.length > 4 && (
          <div className="mt-5 flex justify-center">
            <button
              onClick={() => setExpanded(v => !v)}
              className="btn-shine px-5 py-2 rounded-xl font-semibold text-sm text-white"
              style={{ background: "linear-gradient(135deg, #1A43BF, #123499)" }}
              aria-expanded={expanded}
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          </div>
        )}

        <div className={`mt-6 text-xs ${textDim}`}>
          Demo visuals. Connect your live data provider when ready.
        </div>
      </div>
    </div>
  );
}
