// FILE: src/pages/trading.jsx
import React, { useMemo, useState } from "react";
import { GlassCard, Badge, GlassStat, LabeledInput, BLUE } from "./shared/ui.jsx";

/* ===========================
   TRADING — CFDs (improved)
   =========================== */

export const TradingCFDs = () => {
  // Inputs
  const [entry, setEntry] = useState(100);      // entry/underlying price
  const [stake, setStake] = useState(500);      // your margin/stake in $
  const [leverage, setLeverage] = useState(20); // x leverage
  const [direction, setDirection] = useState("long"); // long | short
  const [scenario, setScenario] = useState(2);  // underlying move in %

  // Risk plan
  const [stopPct, setStopPct] = useState(1.5);
  const [tpPct, setTpPct] = useState(3);

  // Derived
  const exposure = useMemo(() => stake * leverage, [stake, leverage]);             // notional
  const units = useMemo(() => (entry > 0 ? exposure / entry : 0), [exposure, entry]); // approx units
  const dir = direction === "long" ? 1 : -1;

  // Scenario P/L approximation: Exposure * move% * direction, capped at -stake to reflect limited liability with many CFD/stake products
  const pnlScenario = useMemo(() => {
    const val = exposure * (scenario / 100) * dir;
    return Math.max(-stake, val);
  }, [exposure, scenario, dir, stake]);

  // Risk/Reward from plan (approx)
  const riskUsd = useMemo(() => Math.min(stake, exposure * (stopPct / 100)), [exposure, stopPct, stake]);
  const rewardUsd = useMemo(() => exposure * (tpPct / 100), [exposure, tpPct]);
  const rr = useMemo(() => (riskUsd > 0 ? (rewardUsd / riskUsd).toFixed(2) : "—"), [riskUsd, rewardUsd]);

  return (
    <>
      <GlassCard title="CFDs — what & how" kicker={<Badge>Learn</Badge>} right="Speculation • Hedging">
        <ul className="grid sm:grid-cols-3 gap-3 text-sm">
          {[
            "Trade price moves without owning the asset",
            "Go long or short; use leverage sensibly",
            "Size risk in $ (not in hope) and pre-plan exits",
          ].map((t) => (
            <li key={t} className="rounded-xl border border-white/10 p-3 bg-white/[.02]">{t}</li>
          ))}
        </ul>
      </GlassCard>

      <GlassCard title="Position simulator" kicker={<Badge>CFD</Badge>} right="Instant what-if">
        <div className="grid sm:grid-cols-4 gap-3 items-end">
          <LabeledInput label="Entry price" value={entry} onChange={setEntry} />
          <LabeledInput label="Stake ($)" value={stake} onChange={setStake} />
          <LabeledInput label="Leverage (x)" value={leverage} onChange={setLeverage} />
          <div>
            <div className="text-xs opacity-70 mb-1">Direction</div>
            <div className="flex gap-2">
              <SegBtn active={direction === "long"} onClick={() => setDirection("long")}>Long</SegBtn>
              <SegBtn active={direction === "short"} onClick={() => setDirection("short")}>Short</SegBtn>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-white/10 p-4 bg-white/[.02]">
          <div className="grid sm:grid-cols-3 gap-3 items-center">
            <div className="sm:col-span-2">
              <div className="text-xs opacity-70 mb-1">Underlying move (%)</div>
              <input
                type="range"
                min={-10}
                max={10}
                step={0.1}
                value={scenario}
                onChange={(e) => setScenario(+e.target.value)}
                className="w-full"
              />
              <div className="flex justify-between text-[11px] opacity-60 mt-1">
                <span>-10%</span><span>0%</span><span>+10%</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs opacity-70">Scenario P/L</div>
              <div className={`${pnlScenario >= 0 ? "text-emerald-400" : "text-rose-400"} text-2xl font-bold`}>
                {pnlScenario >= 0 ? "+" : ""}${pnlScenario.toFixed(2)}
              </div>
              <div className="text-[11px] opacity-60">Exposure: ${exposure.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-4 gap-3 mt-4">
          <GlassStat label="Notional exposure" value={`$${exposure.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
          <GlassStat label="Approx. units" value={units.toLocaleString(undefined, { maximumFractionDigits: 0 })} />
          <GlassStat label="Risk @ stop" value={`$${riskUsd.toFixed(2)}`} />
          <GlassStat label="Reward @ TP" value={`$${rewardUsd.toFixed(2)} (${rr}:1)`} />
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          <LabeledInput label="Stop distance (%)" value={stopPct} onChange={setStopPct} />
          <LabeledInput label="Take profit (%)" value={tpPct} onChange={setTpPct} />
        </div>

        <p className="text-[11px] text-white/60 mt-2">
          Estimates only. Some CFD products cap losses to the stake; others require maintenance margin. Always check your broker’s specs.
        </p>
      </GlassCard>

      <GlassCard title="Risk banner" kicker={<Badge>Important</Badge>} right="Leverage">
        <p className="text-white/70 text-sm">
          CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. Trade with a plan: fixed risk %, predefined exit, and no revenge trades.
        </p>
      </GlassCard>
    </>
  );
};

/* ===========================
   TRADING — Options (improved)
   =========================== */

export const TradingOptions = () => {
  const [under, setUnder] = useState(100);
  const [strike, setStrike] = useState(105);
  const [premium, setPremium] = useState(2.5);
  const [type, setType] = useState("call"); // call | put

  // Payoff at expiry for long call/put
  const payoff = (S) => {
    if (type === "call") return Math.max(0, S - strike) - premium;
    return Math.max(0, strike - S) - premium; // long put
  };

  const points = useMemo(() => Array.from({ length: 41 }, (_, i) => under - 20 + i), [under]);
  const pay = useMemo(() => points.map((S) => payoff(S)), [points, strike, premium, type]);
  const max = Math.max(...pay, 0.1);
  const min = Math.min(...pay, -premium - 0.1);

  const chart = useMemo(() => {
    const W = 340, H = 160, pad = 10;
    const x = (i) => pad + (i / (points.length - 1)) * (W - 2 * pad);
    const y = (v) => H - pad - ((v - min) / (max - min || 1)) * (H - 2 * pad);
    const linePoints = pay.map((v, i) => `${x(i)},${y(v)}`).join(" ");
    const yZero = y(0);
    const xStrike = (() => {
      const idx = points.findIndex((s) => s >= strike);
      if (idx < 0) return null;
      return x(idx);
    })();
    const breakeven = type === "call" ? strike + premium : strike - premium;
    const xBE = (() => {
      const idx = points.findIndex((s) => s >= breakeven);
      if (idx < 0) return null;
      return x(idx);
    })();
    return { W, H, pad, linePoints, yZero, xStrike, xBE, breakeven };
  }, [points, pay, min, max, strike, premium, type]);

  const maxLoss = premium;
  const maxGain = type === "call" ? "Unlimited" : `$${(Math.max(0, strike) - premium).toFixed(2)} (to $0)`;
  const breakevenLabel = type === "call" ? `${(strike + premium).toFixed(2)}` : `${(strike - premium).toFixed(2)}`;

  return (
    <>
      <GlassCard title="Options lab" kicker={<Badge>Payoff</Badge>} right={<TypeSwitch type={type} setType={setType} />}>
        <div className="grid sm:grid-cols-4 gap-3 items-end">
          <LabeledInput label="Underlying (S)" value={under} onChange={setUnder} />
          <LabeledInput label="Strike (K)" value={strike} onChange={setStrike} />
          <LabeledInput label="Premium ($)" value={premium} onChange={setPremium} step={0.1} />
          <div className="rounded-xl border border-white/10 p-3 bg-white/[.02] text-sm">
            <div className="opacity-70 text-xs mb-1">Breakeven</div>
            <div className="font-semibold">{breakevenLabel}</div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-white/10 p-4 bg-white/[.02]">
          <svg width={chart.W} height={chart.H} className="block">
            <defs>
              <linearGradient id="opt" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor={BLUE[700]} />
                <stop offset="100%" stopColor={BLUE[500]} />
              </linearGradient>
            </defs>

            {/* zero P/L axis */}
            <line x1="0" x2={chart.W} y1={chart.yZero} y2={chart.yZero} stroke="rgba(255,255,255,.25)" strokeWidth="1" />

            {/* strike marker */}
            {chart.xStrike != null && (
              <line x1={chart.xStrike} x2={chart.xStrike} y1="0" y2={chart.H} stroke="rgba(255,255,255,.16)" strokeDasharray="4 3" />
            )}

            {/* breakeven marker */}
            {chart.xBE != null && (
              <line x1={chart.xBE} x2={chart.xBE} y1="0" y2={chart.H} stroke="rgba(80,200,255,.25)" strokeDasharray="4 3" />
            )}

            {/* payoff line */}
            <polyline points={chart.linePoints} fill="none" stroke="url(#opt)" strokeWidth="2" />
          </svg>
          <div className="text-[11px] opacity-60 mt-2">
            Payoff at expiry only (ignores time value & Greeks). Breakeven = {type === "call" ? "K + premium" : "K − premium"}.
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mt-4">
          <GlassStat label="Max loss" value={`$${maxLoss.toFixed(2)}`} />
          <GlassStat label="Max gain" value={maxGain} />
          <GlassStat label="Breakeven" value={breakevenLabel} />
        </div>

        <GlassCard title="Strategy ideas" kicker={<Badge>Playbook</Badge>} right="Vol regimes">
          <ul className="grid sm:grid-cols-3 gap-3 text-sm">
            {[
              { name: "Covered Call", note: "Income on long stock (short call)" },
              { name: "Protective Put", note: "Downside hedge on long stock" },
              { name: "Long Straddle", note: "Volatility bet (gamma +)" },
            ].map((s) => (
              <li key={s.name} className="rounded-xl border border-white/10 p-3 bg-white/[.02]">
                <div className="font-semibold">{s.name}</div>
                <div className="opacity-70 text-xs">{s.note}</div>
              </li>
            ))}
          </ul>
        </GlassCard>
      </GlassCard>
    </>
  );
};

/* ===========================
   TRADING — Multipliers (improved)
   =========================== */

export const TradingMultipliers = () => {
  const [stake, setStake] = useState(100);
  const [mult, setMult] = useState(5);
  const [move, setMove] = useState(1.2); // underlying move %
  const [direction, setDirection] = useState("up"); // up | down

  const exposure = useMemo(() => stake * mult, [stake, mult]);
  const sign = direction === "up" ? 1 : -1;
  const rawPL = useMemo(() => exposure * (move / 100) * sign, [exposure, move, sign]);
  const pnl = useMemo(() => Math.max(-stake, rawPL), [rawPL, stake]); // many multiplier products cap loss to stake

  return (
    <>
      <GlassCard title="Multipliers — amplify with guardrails" kicker={<Badge>Leverage</Badge>} right={`x${mult}`}>
        <div className="grid sm:grid-cols-3 gap-4 items-end">
          <LabeledInput label="Stake ($)" value={stake} onChange={setStake} />
          <div>
            <div className="text-xs opacity-70 mb-1">Multiplier</div>
            <input type="range" min={1} max={100} value={mult} onChange={(e) => setMult(+e.target.value)} className="w-full" />
            <div className="text-[11px] opacity-60 mt-1">Exposure: ${exposure.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs opacity-70 mb-1">Direction</div>
            <div className="flex gap-2">
              <SegBtn active={direction === "up"} onClick={() => setDirection("up")}>Up</SegBtn>
              <SegBtn active={direction === "down"} onClick={() => setDirection("down")}>Down</SegBtn>
            </div>
          </div>
        </div>

        <div className="mt-4 grid sm:grid-cols-3 gap-3 items-end">
          <div className="sm:col-span-2">
            <div className="text-xs opacity-70 mb-1">Underlying move (%)</div>
            <input type="range" min={0} max={10} step={0.1} value={move} onChange={(e) => setMove(+e.target.value)} className="w-full" />
            <div className="flex justify-between text-[11px] opacity-60 mt-1">
              <span>0%</span><span>5%</span><span>10%</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-70">Projected P/L</div>
            <div className={`${pnl >= 0 ? "text-emerald-400" : "text-rose-400"} text-2xl font-bold`}>
              {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
            </div>
            <div className="text-[11px] opacity-60">Loss typically capped to stake</div>
          </div>
        </div>

        <p className="text-[11px] text-white/60 mt-3">
          P/L ≈ stake × multiplier × move%. Always confirm product docs for caps, fees, and knock-out levels.
        </p>
      </GlassCard>
    </>
  );
};

/* ===========================
   Small helpers (local)
   =========================== */

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

function TypeSwitch({ type, setType }) {
  return (
    <div className="inline-flex items-center gap-2">
      <SegBtn active={type === "call"} onClick={() => setType("call")}>Long Call</SegBtn>
      <SegBtn active={type === "put"} onClick={() => setType("put")}>Long Put</SegBtn>
    </div>
  );
}
