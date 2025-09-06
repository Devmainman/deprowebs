// FILE: src/pages/tools.jsx
import React, { useMemo, useState } from "react";
import { GlassCard, Badge, ProgressBar, GlassStat, LabeledInput, SparkLine, BLUE } from "./shared/ui.jsx";

/* ===========================
   TOOLS — Signals Board (upgraded)
   =========================== */

export const ToolsSignals = () => {
  // Demo universe with tiny history for sparklines
  const baseUniverse = [
    { name: "EUR/USD",  kind: "momentum", hist: [1, 1.1, 1.05, 1.2, 1.3, 1.25, 1.35], tfScores: { M15: 72, H1: 82, H4: 64, D1: 58 } },
    { name: "BTC/USDT", kind: "breakout", hist: [1, 0.95, 1.1, 1.25, 1.22, 1.35, 1.4], tfScores: { M15: 65, H1: 74, H4: 77, D1: 70 } },
    { name: "XAU/USD",  kind: "mean",     hist: [1, 1.02, 0.98, 1.01, 1.0, 0.99, 1.02], tfScores: { M15: 55, H1: 65, H4: 60, D1: 62 } },
    { name: "AAPL",     kind: "breakout", hist: [1, 1.05, 1.08, 1.06, 1.1, 1.12, 1.15], tfScores: { M15: 61, H1: 71, H4: 68, D1: 73 } },
    { name: "SOL/USDT", kind: "momentum", hist: [1, 1.15, 1.2, 1.18, 1.22, 1.3, 1.28], tfScores: { M15: 62, H1: 68, H4: 74, D1: 66 } },
  ];

  const [tf, setTf] = useState("H1");
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("scoreDesc");
  const [watch, setWatch] = useState(() => new Set());

  const toggleWatch = (sym) => {
    setWatch((old) => {
      const n = new Set(old);
      if (n.has(sym)) n.delete(sym);
      else n.add(sym);
      return n;
    });
  };

  const universe = useMemo(
    () =>
      baseUniverse.map((u) => ({
        ...u,
        score: u.tfScores[tf],
        dir: u.hist[u.hist.length - 1] - u.hist[u.hist.length - 2] >= 0 ? "buy" : "sell",
      })),
    [baseUniverse, tf]
  );

  const filtered = useMemo(() => {
    return universe.filter(
      (u) =>
        (filter === "all" ? true : u.kind.startsWith(filter)) &&
        u.name.toLowerCase().includes(q.toLowerCase())
    );
  }, [universe, filter, q]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sort) {
      case "scoreAsc":  arr.sort((a, b) => a.score - b.score); break;
      case "scoreDesc": arr.sort((a, b) => b.score - a.score); break;
      case "nameAsc":   arr.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "nameDesc":  arr.sort((a, b) => b.name.localeCompare(a.name)); break;
      default: break;
    }
    return arr;
  }, [filtered, sort]);

  const watchedList = [...watch].filter((sym) => universe.some((u) => u.name === sym));

  return (
    <>
      <GlassCard
        title="Live signal board"
        kicker={<Badge>Signals</Badge>}
        right={
          <div className="flex items-center gap-1">
            {["M15", "H1", "H4", "D1"].map((code) => (
              <TFBtn key={code} code={code} active={tf === code} onClick={() => setTf(code)} />
            ))}
          </div>
        }
      >
        {/* Controls */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end mb-3">
          <div className="flex-1">
            <div className="text-xs opacity-70 mb-1">Search</div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="EUR, gold, BTC, AAPL…"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white placeholder:text-white/40"
            />
          </div>
          <div>
            <div className="text-xs opacity-70 mb-1">Filter</div>
            <div className="flex gap-2">
              {[
                { k: "all", label: "All" },
                { k: "momentum", label: "Momentum" },
                { k: "breakout", label: "Breakout" },
                { k: "mean", label: "Mean-rev" },
              ].map((f) => (
                <SegBtn key={f.k} active={filter === f.k} onClick={() => setFilter(f.k)}>
                  {f.label}
                </SegBtn>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs opacity-70 mb-1">Sort</div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white"
            >
              <option value="scoreDesc">Score ↓</option>
              <option value="scoreAsc">Score ↑</option>
              <option value="nameAsc">Name A–Z</option>
              <option value="nameDesc">Name Z–A</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr className="text-left">
                <th className="px-3 py-2 w-10">★</th>
                <th className="px-3 py-2">Symbol</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">TF</th>
                <th className="px-3 py-2">Trend</th>
                <th className="px-3 py-2">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => (
                <tr key={`${r.name}-${tf}`} className="border-t border-white/10">
                  <td className="px-3 py-2">
                    <button
                      aria-label="Toggle watch"
                      onClick={() => toggleWatch(r.name)}
                      className={`text-lg leading-none ${watch.has(r.name) ? "text-yellow-300" : "text-white/40 hover:text-white/70"}`}
                    >
                      {watch.has(r.name) ? "★" : "☆"}
                    </button>
                  </td>
                  <td className="px-3 py-2 font-semibold">{r.name}</td>
                  <td className="px-3 py-2">
                    <Tag tone={r.kind === "breakout" ? "blue" : r.kind === "momentum" ? "green" : "amber"}>
                      {r.kind}
                    </Tag>
                  </td>
                  <td className="px-3 py-2">{tf}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${r.dir === "buy" ? "text-emerald-400" : "text-rose-400"}`}>
                        {r.dir === "buy" ? "Buy bias" : "Sell bias"}
                      </span>
                      <div className="w-[100px]">
                        <SparkLine data={r.hist} />
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <ProgressBar value={r.score} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex gap-4 text-[11px] opacity-60 mt-2 flex-wrap">
          <span>Score is per timeframe (M15/H1/H4/D1)</span>
          <span>Trend = slope of recent history (demo)</span>
          <span>Watchlist is local (no backend)</span>
        </div>
      </GlassCard>

      {/* Quick Watchlist */}
      {watchedList.length > 0 && (
        <GlassCard title="Quick watchlist" kicker={<Badge>Favorites</Badge>} right={`${watchedList.length} items`}>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
            {watchedList.map((sym) => {
              const u = universe.find((x) => x.name === sym);
              if (!u) return null;
              return (
                <li key={sym} className="rounded-xl border border-white/10 p-3 bg-white/[.02] flex items-center gap-3">
                  <span className="font-semibold">{sym}</span>
                  <Tag tone="gray">{u.kind}</Tag>
                  <span className="ml-auto w-[120px]"><ProgressBar value={u.score} /></span>
                </li>
              );
            })}
          </ul>
        </GlassCard>
      )}
    </>
  );
};

/* ===========================
   TOOLS — Trading Calculator (upgraded)
   =========================== */

export const ToolsCalculator = () => {
  // Symbol-aware helpers (very rough presets)
  const presets = {
    "EUR/USD": { pip: 10, price: 1.085 },
    "GBP/USD": { pip: 10, price: 1.270 },
    "USD/JPY": { pip: 9.1, price: 157.2 },
    "XAU/USD": { pip: 1.0, price: 2395.5 }, // $1 per "pip" per lot as a rough demo
    "BTC/USDT": { pip: 1, price: 60000 },
  };

  const [symbol, setSymbol] = useState("EUR/USD");
  const [price, setPrice] = useState(presets[symbol].price);
  const [bal, setBal] = useState(5000);
  const [risk, setRisk] = useState(1);          // %
  const [stop, setStop] = useState(30);         // pips
  const [pip, setPip] = useState(presets[symbol].pip); // $/pip/lot
  const [rr, setRR] = useState(2);
  const [lev, setLev] = useState(20);           // leverage

  // Quick presets
  const applyPreset = (pct) => setRisk(pct);
  const setSymbolPreset = (sym) => {
    setSymbol(sym);
    setPip(presets[sym].pip);
    setPrice(presets[sym].price);
  };

  const riskAmt = useMemo(() => (bal * risk) / 100, [bal, risk]);
  const lots = useMemo(() => (stop > 0 ? riskAmt / (stop * pip) : 0), [riskAmt, stop, pip]);
  const units = useMemo(() => lots * 100_000, [lots]);
  const tpPips = useMemo(() => stop * rr, [stop, rr]);
  const estMargin = useMemo(() => (price && lev > 0 ? (units * price) / lev : 0), [units, price, lev]);

  return (
    <>
      <GlassCard
        title="Position & risk calculator"
        kicker={<Badge>Tools</Badge>}
        right={
          <div className="flex gap-1">
            {["0.5", "1", "2"].map((p) => (
              <button
                key={p}
                onClick={() => applyPreset(parseFloat(p))}
                className="px-2 py-1 rounded-md text-[11px] border bg-white/5"
                style={{ borderColor: "rgba(255,255,255,.12)" }}
              >
                Risk {p}%
              </button>
            ))}
          </div>
        }
      >
        <div className="grid sm:grid-cols-6 gap-3 items-end">
          {/* Symbol + quick selects */}
          <div className="sm:col-span-2">
            <div className="text-xs opacity-70 mb-1">Symbol</div>
            <div className="flex gap-2">
              <select
                value={symbol}
                onChange={(e) => setSymbolPreset(e.target.value)}
                className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white"
              >
                {Object.keys(presets).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button
                onClick={() => { setPip(presets[symbol].pip); setPrice(presets[symbol].price); }}
                className="px-3 py-2 rounded-xl border bg-white/5 text-xs"
                style={{ borderColor: "rgba(255,255,255,.12)" }}
                title="Reset pip/price from preset"
              >
                Reset
              </button>
            </div>
          </div>

          <LabeledInput label="Price" value={price} onChange={setPrice} />
          <LabeledInput label="Balance ($)" value={bal} onChange={setBal} />
          <LabeledInput label="Risk %" value={risk} onChange={setRisk} />
          <LabeledInput label="Stop (pips)" value={stop} onChange={setStop} />
          <LabeledInput label="Pip value ($/pip/lot)" value={pip} onChange={setPip} />

          <div className="sm:col-span-2">
            <div className="text-xs opacity-70 mb-1">R multiple</div>
            <input type="range" min={1} max={5} step={0.5} value={rr} onChange={(e) => setRR(+e.target.value)} className="w-full" />
            <div className="flex justify-between text-[11px] opacity-60 mt-1">
              <span>1</span><span>3</span><span>5</span>
            </div>
          </div>
          <LabeledInput label="Leverage (x)" value={lev} onChange={setLev} />
        </div>

        <div className="grid sm:grid-cols-4 gap-3 mt-4">
          <GlassStat label="Risk amount" value={`$${riskAmt.toFixed(2)}`} />
          <GlassStat label="Size (lots)" value={lots.toFixed(2)} />
          <GlassStat label="Units" value={units.toLocaleString(undefined, { maximumFractionDigits: 0 })} />
          <GlassStat label="TP distance" value={`${tpPips} pips`} />
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          <GlassStat label="Est. margin" value={`$${estMargin.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
          <div className="rounded-xl border border-white/10 p-3 bg-white/[.02]">
            <div className="text-xs opacity-70 mb-1">Notes</div>
            <div className="text-sm opacity-80">
              Lots assume 100k units. Pip presets are rough (USD-quoted ≈ $10, JPY pairs ≈ $9.1, XAU ≈ $1). Adjust as needed.
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Checklist */}
      <GlassCard title="Pre-trade checklist" kicker={<Badge>Discipline</Badge>} right="Stay consistent">
        <ul className="grid sm:grid-cols-3 gap-3 text-sm">
          {[
            "Setup matches plan (not FOMO)",
            "Fixed $ risk defined",
            "Entry/Stop/TP in platform",
            "No overlapping correlated risk",
            "Session/volatility suitable",
            "News risk checked",
          ].map((t) => (
            <li key={t} className="rounded-xl border border-white/10 p-3 bg-white/[.02]">{t}</li>
          ))}
        </ul>
      </GlassCard>
    </>
  );
};

/* ===========================
   Small helpers (local)
   =========================== */

function TFBtn({ code, active, onClick }) {
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

function SegBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-lg text-sm border ${active ? "bg-white/10" : "bg-white/5"}`}
      style={{ borderColor: "rgba(255,255,255,.12)" }}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

function Tag({ children, tone = "gray" }) {
  const tones = {
    blue:   { bg: "rgba(59,130,246,.15)",  fg: "rgba(96,165,250,1)" },
    green:  { bg: "rgba(16,185,129,.15)",  fg: "rgba(52,211,153,1)" },
    amber:  { bg: "rgba(245,158,11,.15)",  fg: "rgba(251,191,36,1)" },
    gray:   { bg: "rgba(255,255,255,.08)", fg: "rgba(255,255,255,.7)" },
  }[tone] || { bg: "rgba(255,255,255,.08)", fg: "rgba(255,255,255,.7)" };

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] capitalize"
      style={{ background: tones.bg, color: tones.fg }}
    >
      {children}
    </span>
  );
}
