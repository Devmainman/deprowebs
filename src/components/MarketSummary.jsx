// src/MarketSummary.jsx (improved, theme + palette preserved)
import React, { useMemo, useState, useEffect, useRef, useId, memo, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, RefreshCw, Sparkles } from "lucide-react";

/** ===== Utilities ===== */
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const fmt = (n) => (typeof n === "number" ? n.toLocaleString() : n);
const rgba = (hex, alpha) => `rgba(${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)},${alpha})`;

/** Count-up number (subtle, respects reduced motion) */
function CountUp({ value, duration = 0.6, className }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  const reduce = useReducedMotion();

  useEffect(() => {
    const from = prev.current;
    const to = value;
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
      const cur = from + (to - from) * eased;
      setDisplay(cur);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    prev.current = value;
    return () => raf && cancelAnimationFrame(raf);
  }, [value, duration, reduce]);

  return <span className={className}>{fmt(+Number(display).toFixed(4))}</span>;
}

/** Sparkline with gradient fill + glow + last-point dot (SSR-safe ids) */
const Sparkline = memo(function Sparkline({ data = [], stroke = "#22c55e", fillAlpha = 0.18 }) {
  const w = 140, h = 46, pad = 4;
  const uid = useId();

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
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={stroke} floodOpacity="0.45" />
        </filter>
      </defs>

      {/* area */}
      <motion.path
        d={area}
        fill={`url(#${uid}-fill)`}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .6 }}
      />
      {/* line */}
      <motion.path
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ filter: `url(#${uid}-glow)` }}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: .8 }}
      />
      {/* last point */}
      {data.length > 1 && (
        <g>
          <circle cx={lx} cy={ly} r="2.75" fill="#fff" opacity=".9" />
          <circle cx={lx} cy={ly} r="5.5" fill={stroke} opacity=".25">
            <animate attributeName="r" values="4.5;7;4.5" dur="1.6s" repeatCount="indefinite" />
          </circle>
        </g>
      )}
    </svg>
  );
});

/** Demo feed jitter (replace with real data fetch). Pauses when tab is hidden. */
function useDemoFeed(initial, enabled = true) {
  const [rows, setRows] = useState(initial);

  useEffect(() => setRows(initial), [initial]);

  useEffect(() => {
    if (!enabled) return;
    let id;
    const tick = () => setRows(prev => prev.map(item => {
      const drift = (Math.random() - 0.5) * 0.6;  // ±0.6%
      const nextChange = +(item.change + drift).toFixed(2);
      const last = item.history[item.history.length - 1] ?? item.price;
      const nPrice = +(last * (1 + drift / 100)).toFixed(4);
      const nextHist = [...item.history.slice(-39), nPrice];
      return { ...item, change: nextChange, price: nPrice, history: nextHist };
    }));

    const start = () => { id = setInterval(tick, 1000); };
    const stop  = () => { if (id) clearInterval(id); };

    const vis = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener('visibilitychange', vis);
    return () => { stop(); document.removeEventListener('visibilitychange', vis); };
  }, [enabled]);
  return rows;
}

const VARIANTS = {
  grid: { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: .45 } } },
  card: { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: .35 } } },
};

/** Micro ticker (animated marquee of top movers) */
/** Micro ticker (animated marquee of top movers) */
function MoversTicker({ items = [], theme = "dark" }) {
  const reduce = useReducedMotion();
  const pos = (c) => c >= 0;
  const col = theme === "dark" ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.05)";
  const content = [...items, ...items, ...items]; // extra copies for seamless loop

  const baseText = theme === "dark" ? "text-white" : "text-slate-800";
  const dimText  = theme === "dark" ? "text-white/70" : "text-black/60";

  return (
    <div
      className={`relative overflow-hidden rounded-xl border mb-6`}
      style={{ borderColor: theme==="dark" ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)", background: col }}
    >
      <motion.div
        className={`flex gap-6 whitespace-nowrap py-2 px-4 ${baseText}`}
        animate={reduce ? undefined : { x: ["0%", "-66.666%"] }}
        transition={reduce ? undefined : { duration: 24, repeat: Infinity, ease: "linear" }}
      >
        {content.map((m, i) => (
          <div key={i} className="inline-flex items-center gap-2 text-sm">
            <span className="font-semibold">{m.symbol}</span>
            <span className={dimText}>{fmt(m.price)}</span>
            <span
              className={`px-2 py-0.5 rounded-full ${pos(m.change) ? "text-emerald-400" : "text-rose-400"}`}
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


export default function MarketSummary({
  demo = true,
  onRefresh = () => {},
  data: externalData,
  categories = ["FX","Crypto","Indices","Commodities","Stocks"],
  theme = "dark",            // "dark" | "light"
  gridDensity = 32,
}) {
  /** ---- Demo seed (swap with your feed) ---- */
  const DEMO = useMemo(() => ({
    FX: [
      { symbol:"EURUSD", name:"EUR / USD", price:1.0832, change:+0.24, history:[1.078,1.079,1.081,1.082,1.083] },
      { symbol:"GBPUSD", name:"GBP / USD", price:1.2753, change:-0.12, history:[1.279,1.277,1.276,1.276,1.275] },
      { symbol:"USDJPY", name:"USD / JPY", price:149.23, change:+0.35, history:[148.8,148.9,149.0,149.1,149.2] },
      { symbol:"AUDUSD", name:"AUD / USD", price:0.6742, change:+0.08, history:[0.671,0.672,0.673,0.673,0.674] },
      { symbol:"USDCAD", name:"USD / CAD", price:1.361, change:-0.18, history:[1.365,1.364,1.363,1.362,1.361] },
      { symbol:"EURJPY", name:"EUR / JPY", price:161.53, change:+0.41, history:[160.8,161.0,161.1,161.4,161.5] },
    ],
    Crypto: [
      { symbol:"BTCUSD", name:"Bitcoin", price:64420, change:+1.6, history:[63200,63700,64000,64200,64420] },
      { symbol:"ETHUSD", name:"Ethereum", price:3270, change:+0.9, history:[3210,3225,3250,3260,3270] },
      { symbol:"SOLUSD", name:"Solana", price:148, change:-1.2, history:[152,151,150,149,148] },
      { symbol:"XRPUSD", name:"XRP", price:0.57, change:+0.3, history:[0.56,0.56,0.565,0.568,0.57] },
      { symbol:"ADAUSD", name:"Cardano", price:0.44, change:+0.1, history:[0.432,0.438,0.439,0.441,0.44] },
      { symbol:"DOGEUSD", name:"Dogecoin", price:0.124, change:-0.4, history:[0.126,0.125,0.125,0.124,0.124] },
    ],
    Indices: [
      { symbol:"SPX", name:"S&P 500", price:5520, change:+0.42, history:[5480,5495,5505,5512,5520] },
      { symbol:"NDX", name:"Nasdaq 100", price:19620, change:+0.55, history:[19420,19480,19550,19590,19620] },
      { symbol:"DJI", name:"Dow Jones", price:39880, change:+0.18, history:[39740,39790,39820,39860,39880] },
      { symbol:"FTSE", name:"FTSE 100", price:8250, change:-0.14, history:[8280,8270,8260,8255,8250] },
      { symbol:"DAX", name:"DAX 40", price:18540, change:+0.21, history:[18480,18500,18510,18530,18540] },
      { symbol:"NIKKEI", name:"Nikkei 225", price:40650, change:+0.73, history:[40300,40420,40500,40600,40650] },
    ],
    Commodities: [
      { symbol:"XAUUSD", name:"Gold", price:2340, change:+0.28, history:[2325,2330,2334,2338,2340] },
      { symbol:"XAGUSD", name:"Silver", price:28.4, change:-0.32, history:[28.7,28.6,28.5,28.45,28.4] },
      { symbol:"WTI", name:"Crude Oil", price:78.9, change:+0.52, history:[77.9,78.1,78.3,78.6,78.9] },
      { symbol:"BRENT", name:"Brent", price:82.4, change:+0.31, history:[81.7,81.9,82.0,82.2,82.4] },
      { symbol:"NG", name:"Nat Gas", price:2.62, change:-0.7, history:[2.71,2.69,2.66,2.64,2.62] },
      { symbol:"COCOA", name:"Cocoa", price:8260, change:+1.2, history:[8140,8180,8200,8230,8260] },
    ],
    Stocks: [
      { symbol:"AAPL", name:"Apple", price:238.7, change:+0.8, history:[236,237,237.8,238.2,238.7] },
      { symbol:"MSFT", name:"Microsoft", price:462.2, change:+0.6, history:[458.9,460.2,461.0,461.7,462.2] },
      { symbol:"NVDA", name:"NVIDIA", price:129.1, change:+1.7, history:[126.1,127.2,127.8,128.3,129.1] },
      { symbol:"TSLA", name:"Tesla", price:261.3, change:-0.9, history:[266.8,265.2,263.9,262.8,261.3] },
      { symbol:"GOOGL", name:"Alphabet", price:185.2, change:+0.4, history:[183.8,184.1,184.6,185.0,185.2] },
      { symbol:"AMZN", name:"Amazon", price:202.4, change:+0.3, history:[200.1,200.9,201.5,202.0,202.4] },
    ],
  }), []);

  const [tab, setTab] = useState(categories[0]);
  const rows = useDemoFeed(externalData?.[tab] ?? DEMO[tab], demo);

  const up = (v) => v >= 0;
  const borderCol = theme === "dark" ? "rgba(255,255,255,.10)" : "rgba(0,0,0,.08)";
  const textDim = theme === "dark" ? "text-white/70" : "text-black/60";
  const baseCard = theme === "dark" ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.04)";

  // pick movers for ticker
  const movers = useMemo(() => [...rows].sort((a,b)=>Math.abs(b.change)-Math.abs(a.change)).slice(0,6), [rows]);

  // accessibility: keyboard tabs
  const onKeyTabs = (e) => {
    const idx = categories.indexOf(tab);
    if (e.key === 'ArrowRight') setTab(categories[(idx + 1) % categories.length]);
    if (e.key === 'ArrowLeft')  setTab(categories[(idx - 1 + categories.length) % categories.length]);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-14">
      {/* Title row */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Sparkles className={theme==="dark" ? "text-white/70" : "text-black/70"} size={18} aria-hidden />
          <h3 className="h-display text-3xl font-bold text-white tracking-tight">Market summary</h3>
        </div>
        <button
          onClick={onRefresh}
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl border btn-shine"
          style={{ borderColor: borderCol, background: baseCard }}
        >
          <RefreshCw size={16} aria-hidden /> Refresh
        </button>
      </div>

      {/* Tabs with animated underline */}
      <div className="relative mb-4">
        <div className="flex flex-wrap gap-2 relative" role="tablist" aria-label="Market categories" onKeyDown={onKeyTabs}>
          {categories.map((c) => {
            const active = tab === c;
            return (
              <button
                key={c}
                onClick={() => setTab(c)}
                role="tab"
                aria-selected={active}
                aria-controls={`panel-${c}`}
                className={`px-4 py-2 rounded-xl text-sm font-semibold relative transition-colors ${
                  active ? "text-white" : (theme === "dark" ? "text-white/70" : "text-black/70")
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

      {/* Movers ticker */}
      <MoversTicker items={movers} theme={theme} />

      {/* Cards grid */}
      <motion.div
        variants={VARIANTS.grid}
        initial="hidden" whileInView="show" viewport={{ once: false, amount: .2 }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        id={`panel-${tab}`} role="tabpanel" aria-labelledby={tab}
      >
        <AnimatePresence mode="popLayout">
          {rows.map((r) => {
            const pos = up(r.change);
            const tone = pos ? "#16a34a" : "#ef4444"; // emerald / rose
            const aura = pos ? rgba('#10b981', .18) : rgba('#f43f5e', .18);
            const auraHover = pos ? rgba('#10b981', .24) : rgba('#f43f5e', .24);
            return (
              <motion.div
                key={r.symbol}
                variants={VARIANTS.card}
                layout
                whileHover={{ y: -6, rotateX: -2, rotateY: 2 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                className="relative rounded-2xl border backdrop-blur-md overflow-hidden will-change-transform"
                style={{ borderColor: borderCol, background: baseCard, transformStyle: "preserve-3d" }}
              >
                {/* aura glow */}
                <motion.div
                  className="absolute inset-0 opacity-0 pointer-events-none"
                  style={{ background: `radial-gradient(120% 120% at 80% 0%, ${aura}, transparent)` }}
                  whileHover={{ opacity: 1 }}
                />
                {/* diagonal shine */}
                <motion.div
                  className="absolute -inset-x-10 -top-12 h-12 opacity-25 blur-xl pointer-events-none"
                  style={{ background: `linear-gradient(90deg, transparent, ${tone}, transparent)` }}
                  animate={{ x: ["-20%","120%"] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="p-5 relative">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className={`h-display text-lg leading-none ${theme==="dark" ? "text-white" : "text-black"}`}>{r.name}</div>
                      <div className={`text-xs mt-1 ${textDim}`}>{r.symbol}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-bold ${theme==="dark" ? "text-white" : "text-black"}`}>
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
                            transition={{ duration: .25 }}
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

                  {/* bottom meta strip */}
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className={textDim}>Grid {gridDensity}px • live</span>
                    <span className={textDim}>vol ~ {(Math.abs(r.change) * 3 + 10).toFixed(0)}%</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <div className={`mt-6 text-xs ${textDim}`}>
        Demo stream shown. Hook your licensed provider to go live.
      </div>
    </div>
  );
}
