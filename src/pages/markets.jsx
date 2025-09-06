// FILE: src/pages/markets.jsx
import React, { useMemo, useState } from "react";
import { GlassCard, Badge, SparkLine, ProgressBar, GlassStat } from "./shared/ui.jsx";

/* ===========================
   MARKETS — Forex (improved)
   =========================== */

export const MarketsForex = () => {
  const pairs = [
    { pair: "EUR/USD", price: 1.0850, change: +0.34, spread: 0.6, atr: 72, pipValue: 10,  data: [1, 2, 1.5, 2.3, 2.1, 2.7, 2.9] },
    { pair: "GBP/USD", price: 1.2704, change: -0.12, spread: 0.8, atr: 98, pipValue: 10,  data: [2, 1.7, 1.9, 2.1, 1.8, 1.6, 1.9] },
    { pair: "USD/JPY", price: 157.21, change: +0.51, spread: 0.3, atr: 65, pipValue: 9.1, data: [1, 1.2, 1.1, 1.3, 1.7, 1.6, 1.9] },
    { pair: "XAU/USD", price: 2395.5, change: +0.08, spread: 10.2, atr: 210, pipValue: 1.0, data: [3, 3.2, 3.1, 3.6, 3.3, 3.9, 4.1] },
  ];

  // UI state
  const [query, setQuery] = useState("");
  const [tf, setTf] = useState("H1");
  const [sort, setSort] = useState("changeDesc");
  const [selected, setSelected] = useState(pairs[0]);

  // Risk calc state
  const [account, setAccount] = useState(1000);
  const [riskPct, setRiskPct] = useState(1);
  const [stopPips, setStopPips] = useState(25);
  const [leverage, setLeverage] = useState(20);

  // Derived lists
  const filtered = useMemo(
    () => pairs.filter((p) => p.pair.toLowerCase().includes(query.toLowerCase())),
    [pairs, query]
  );

  const sorted = useMemo(() => {
    const base = [...filtered];
    switch (sort) {
      case "spreadAsc": base.sort((a, b) => a.spread - b.spread); break;
      case "spreadDesc": base.sort((a, b) => b.spread - a.spread); break;
      case "changeAsc": base.sort((a, b) => a.change - b.change); break;
      case "changeDesc": base.sort((a, b) => b.change - a.change); break;
      default: break;
    }
    return base;
  }, [filtered, sort]);

  // Currency strength (simple basket score from % changes)
  const strength = useMemo(() => computeCurrencyStrength(pairs), [pairs]);

  // Position sizing (uses selected pair’s pipValue + price)
  const riskAmount = useMemo(() => (account * riskPct) / 100, [account, riskPct]);
  const lots = useMemo(
    () => (stopPips > 0 ? riskAmount / (stopPips * (selected?.pipValue ?? 10)) : 0),
    [riskAmount, stopPips, selected]
  );
  const units = useMemo(() => lots * 100_000, [lots]);
  const estMargin = useMemo(
    () => (selected ? Math.max(0, (units * selected.price) / Math.max(1, leverage)) : 0),
    [units, selected, leverage]
  );

  return (
    <>
      {/* ====== FX Dashboard ====== */}
      <GlassCard
        title="FX dashboard"
        kicker={<Badge>Markets • Forex</Badge>}
        right={
          <div className="flex items-center gap-1">
            {["M15", "H1", "H4", "D1"].map((code) => (
              <TFButton key={code} code={code} active={tf === code} onClick={() => setTf(code)} />
            ))}
          </div>
        }
      >
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pair (e.g., EUR, JPY, Gold)"
            className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white placeholder:text-white/40"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white"
          >
            <option value="changeDesc">Change ↓</option>
            <option value="changeAsc">Change ↑</option>
            <option value="spreadAsc">Spread ↑</option>
            <option value="spreadDesc">Spread ↓</option>
          </select>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {sorted.map((p) => (
            <PairTile
              key={p.pair}
              pair={p}
              active={selected?.pair === p.pair}
              onSelect={() => setSelected(p)}
            />
          ))}
        </div>
      </GlassCard>

      {/* ====== Position Sizer Pro ====== */}
      <GlassCard title="Position sizing (pro)" kicker={<Badge>Risk</Badge>} right={selected?.pair ?? ""}>
        <div className="grid sm:grid-cols-5 gap-3 items-end">
          <NumInput label="Account ($)" value={account} onChange={setAccount} />
          <NumInput label="Risk %" value={riskPct} onChange={setRiskPct} />
          <NumInput label="Stop (pips)" value={stopPips} onChange={setStopPips} />
          <NumInput label="Leverage" value={leverage} onChange={setLeverage} />
          <div className="rounded-xl border border-white/10 p-3 bg-white/[.02]">
            <div className="text-xs opacity-70 mb-1">Selected pair info</div>
            <div className="text-sm">
              <span className="opacity-80">Price:</span>{" "}
              {selected?.price?.toLocaleString(undefined, {
                maximumFractionDigits: selected?.price > 10 ? 2 : 4,
              })}
            </div>
            <div className="text-sm">
              <span className="opacity-80">Pip value (per lot):</span> ${selected?.pipValue?.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-4 gap-3 mt-4">
          <GlassStat label="Risk amount" value={`$${riskAmount.toFixed(2)}`} />
          <GlassStat label="Size (lots)" value={lots.toFixed(2)} />
          <GlassStat label="Units" value={units.toLocaleString(undefined, { maximumFractionDigits: 0 })} />
          <GlassStat label="Est. margin" value={`$${estMargin.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
        </div>
        <div className="text-[11px] text-white/60 mt-2">
          * Estimates for illustration (assumes 100k units per lot; margin ≈ price×units÷leverage).
        </div>
      </GlassCard>

      {/* ====== Currency Strength ====== */}
      <GlassCard title="Currency strength (demo)" kicker={<Badge>Heatmap</Badge>} right="vs. basket">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(strength).map(([ccy, score]) => (
            <div key={ccy} className="rounded-xl border border-white/10 p-3 bg-white/[.02]">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">{ccy}</div>
                <div className={`text-xs ${score >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {score >= 0 ? "▲" : "▼"} {Math.abs(score).toFixed(2)}
                </div>
              </div>
              <ProgressBar value={Math.max(0, Math.min(100, 50 + score * 10))} />
              <div className="text-[11px] opacity-60 mt-1">Aggregated from pair % changes</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </>
  );
};

/* ---------- tiny helpers (scoped here) ---------- */
function TFButton({ code, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-lg border text-xs ${active ? "bg-white/10" : "bg-white/5"}`}
      style={{ borderColor: "rgba(255,255,255,.12)" }}
      aria-pressed={active}
    >
      {code}
    </button>
  );
}

function NumInput({ label, value, onChange, step = 1 }) {
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

function PairTile({ pair, active, onSelect }) {
  const priceDigits = pair.price > 10 ? 2 : 4;
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-xl p-3 bg-white/[.02] transition ring-1 ${
        active ? "ring-white/30" : "ring-white/10 hover:ring-white/20"
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="font-semibold">{pair.pair}</div>
        <span
          className={`text-[11px] px-2 py-0.5 rounded-md ${
            pair.change >= 0 ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"
          }`}
        >
          {pair.change >= 0 ? "▲" : "▼"} {pair.change.toFixed(2)}%
        </span>
      </div>
      <SparkLine data={pair.data} />
      <div className="mt-2 flex items-center gap-3 text-xs text-white/70">
        <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">Spread {pair.spread}p</span>
        <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">ATR {pair.atr}p</span>
        <span className="ml-auto opacity-70">
          ${pair.price.toLocaleString(undefined, { maximumFractionDigits: priceDigits })}
        </span>
      </div>
    </button>
  );
}

function computeCurrencyStrength(pairs) {
  const scores = {};
  pairs.forEach((p) => {
    const [base, quote] = p.pair.split("/");
    const ch = p.change || 0;
    scores[base] = (scores[base] || 0) + ch;
    scores[quote] = (scores[quote] || 0) - ch;
  });
  return scores;
}

/* ===========================
   MARKETS — Other pages
   =========================== */

export const MarketsStocks = () => {
  const sectors = [
    { name: "Tech", w: 22, ch: +1.2 },
    { name: "Energy", w: 8, ch: -0.8 },
    { name: "Finance", w: 15, ch: +0.4 },
    { name: "Health", w: 13, ch: +0.1 },
    { name: "Industrial", w: 12, ch: -0.2 },
    { name: "Consumer", w: 18, ch: +0.6 },
    { name: "Utilities", w: 5, ch: -0.1 },
  ];
  return (
    <>
      <GlassCard title="Sector heat tiles" kicker={<Badge>Equities</Badge>} right="Weighted">
        <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
          {sectors.map((s) => (
            <div
              key={s.name}
              className="rounded-xl p-3 text-center border border-white/10"
              style={{
                background:
                  s.ch >= 0
                    ? "linear-gradient(135deg, rgba(16,185,129,.15), rgba(16,185,129,.08))"
                    : "linear-gradient(135deg, rgba(244,63,94,.15), rgba(244,63,94,.08))",
              }}
            >
              <div className="text-xs opacity-70">{s.name}</div>
              <div className="text-lg font-bold">{s.w}%</div>
              <div className={`${s.ch >= 0 ? "text-emerald-400" : "text-rose-400"} text-xs`}>
                {s.ch > 0 ? "+" : ""}
                {s.ch}%
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard title="Earnings this week" kicker={<Badge>Calendar</Badge>} right="Preview">
        <ul className="grid sm:grid-cols-2 gap-3 text-sm">
          {[
            { c: "AAPL", d: "Tue", note: "After close" },
            { c: "MSFT", d: "Wed", note: "Before open" },
            { c: "NVDA", d: "Thu", note: "After close" },
            { c: "TSLA", d: "Fri", note: "After close" },
          ].map((e) => (
            <li
              key={e.c}
              className="rounded-xl border border-white/10 px-3 py-2 bg-white/[.02] flex items-center justify-between"
            >
              <span className="font-semibold">{e.c}</span>
              <span className="opacity-70">
                {e.d} · {e.note}
              </span>
            </li>
          ))}
        </ul>
      </GlassCard>
    </>
  );
};

export const MarketsIndices = () => {
  const indices = [
    { name: "S&P 500",   ch: +0.42, data: [1, 1.3, 1.1, 1.6, 1.9, 2.1, 2.0] },
    { name: "NASDAQ 100", ch: +0.77, data: [2, 2.2, 2.1, 2.5, 2.6, 2.9, 3.2] },
    { name: "FTSE 100",   ch: -0.11, data: [1, 1.1, 1.0, 0.9, 1.1, 1.0, 0.8] },
  ];
  return (
    <>
      <GlassCard title="Global index pulse" kicker={<Badge>Macro</Badge>} right="Futures">
        <div className="grid sm:grid-cols-3 gap-4">
          {indices.map((i) => (
            <div key={i.name} className="rounded-xl border border-white/10 p-4 bg-white/[.02]">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">{i.name}</div>
                <div className={`${i.ch >= 0 ? "text-emerald-400" : "text-rose-400"}`}>{i.ch}%</div>
              </div>
              <SparkLine data={i.data} />
              <div className="mt-3">
                <div className="text-xs opacity-70 mb-1">Overnight session</div>
                <ProgressBar value={50 + i.ch * 10} />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </>
  );
};

export const MarketsCommodities = () => {
  const comms = [
    { name: "Crude Oil",   unit: "bbl",   ch: +0.9, data: [1, 1.2, 1.5, 1.4, 1.6, 1.8, 1.7] },
    { name: "Gold",        unit: "oz",    ch: +0.2, data: [2, 2.1, 2.2, 2.4, 2.6, 2.5, 2.7] },
    { name: "Silver",      unit: "oz",    ch: -0.5, data: [1, 1.1, 1.0, 0.9, 1.2, 1.1, 1.0] },
    { name: "Natural Gas", unit: "mmBtu", ch: +1.4, data: [1, 1.3, 1.7, 1.4, 1.9, 2.2, 2.0] },
  ];
  return (
    <>
      <GlassCard title="Supply & demand watch" kicker={<Badge>Commodities</Badge>} right="Flows">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {comms.map((c) => (
            <div key={c.name} className="rounded-xl border border-white/10 p-4 bg-white/[.02]">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">{c.name}</div>
                <div className={`${c.ch >= 0 ? "text-emerald-400" : "text-rose-400"}`}>{c.ch}%</div>
              </div>
              <SparkLine data={c.data} />
              <div className="mt-2 text-xs opacity-70">Unit: {c.unit}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </>
  );
};

export const MarketsCrypto = () => {
  const coins = [
    { sym: "BTC", dom: 52, ch: +1.8, data: [1, 1.4, 1.2, 1.9, 1.7, 2.1, 2.5] },
    { sym: "ETH", dom: 18, ch: +0.7, data: [1, 1.2, 1.3, 1.6, 1.4, 1.7, 1.9] },
    { sym: "SOL", dom:  4, ch: -2.4, data: [2, 1.9, 2.1, 1.8, 1.7, 1.6, 1.4] },
    { sym: "BNB", dom:  5, ch: +0.3, data: [1, 1.1, 1.2, 1.4, 1.3, 1.5, 1.7] },
  ];
  const totalDom = coins.reduce((a, b) => a + b.dom, 0);
  return (
    <>
      <GlassCard title="Market mosaic" kicker={<Badge>Crypto</Badge>} right={`Coverage ${totalDom}%`}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {coins.map((c) => (
            <div key={c.sym} className="rounded-xl border border-white/10 p-4 bg-white/[.02]">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">{c.sym}</div>
                <div className={`${c.ch >= 0 ? "text-emerald-400" : "text-rose-400"}`}>{c.ch}%</div>
              </div>
              <SparkLine data={c.data} />
              <div className="mt-2 text-xs opacity-70">Dominance</div>
              <ProgressBar value={c.dom} />
            </div>
          ))}
        </div>
      </GlassCard>
    </>
  );
};

export const MarketsETFs = () => {
  const lists = [
    { name: "Broad Market", items: ["SPY", "VOO", "VTI", "QQQ"] },
    { name: "Sectors",      items: ["XLE", "XLK", "XLV", "XLF"] },
    { name: "Themes",       items: ["ARKK", "IBB", "IYR", "ICLN"] },
  ];
  return (
    <>
      <GlassCard title="Quick screener" kicker={<Badge>ETFs</Badge>} right="Categories">
        <div className="grid sm:grid-cols-3 gap-4">
          {lists.map((l) => (
            <div key={l.name} className="rounded-xl border border-white/10 p-4 bg-white/[.02]">
              <div className="font-semibold mb-2">{l.name}</div>
              <ul className="space-y-1 text-sm opacity-80">
                {l.items.map((t) => (
                  <li key={t} className="flex items-center justify-between">
                    <span>{t}</span>
                    <span className="text-xs opacity-70">+{(Math.random() * 2).toFixed(2)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </GlassCard>
    </>
  );
};
