// FILE: src/pages/platforms.jsx
import React, { useState } from "react";
import { GlassCard, Badge, BLUE } from "./shared/ui.jsx";
import workspacePreview from "../assets/sl_022321_41020_26.jpg";

/* ===========================
   PLATFORMS — MT5 (enhanced)
   =========================== */

export const PlatformsMT5 = () => {
  const [os, setOs] = useState("Windows"); // Windows | macOS | Linux
  const version = "v5.0.0 (demo)";
  const dlLink = "#"; // wire up later

  const features = [
    { t: "Multi-asset", k: "FX · Indices · Commodities · Crypto" },
    { t: "Execution", k: "Fast fills, DoM, partials" },
    { t: "Analysis",  k: "Timeframes, templates, alerts" },
    { t: "Algo",      k: "EAs, MQL5/MT5, strategy tester" },
    { t: "Risk",      k: "Hedging / netting modes" },
    { t: "Workspace", k: "Multi-chart layouts & profiles" },
  ];

  const reqs = {
    Windows: [
      ["OS", "Windows 10/11 (64-bit)"],
      ["CPU", "x64 dual-core+"],
      ["RAM", "4 GB (8 GB recommended)"],
      ["Disk", "500 MB free"],
      ["Network", "Broadband, <100ms latency preferred"],
    ],
    macOS: [
      ["OS", "macOS 12+ (Monterey)"],
      ["CPU", "Apple Silicon / Intel x64"],
      ["RAM", "4 GB (8 GB recommended)"],
      ["Disk", "500 MB free"],
      ["Network", "Broadband, <100ms latency preferred"],
    ],
    Linux: [
      ["OS", "Ubuntu 22.04+ / Fedora (Wine)"],
      ["CPU", "x64 dual-core+"],
      ["RAM", "4 GB (8 GB recommended)"],
      ["Disk", "1 GB free"],
      ["Network", "Broadband, <100ms latency preferred"],
    ],
  };

  return (
    <>
      <GlassCard title="Why traders choose MT5" kicker={<Badge>Platforms</Badge>} right="Multi-asset">
        <ul className="grid sm:grid-cols-3 gap-3 text-sm">
          {features.map((f) => (
            <li key={f.t} className="rounded-xl border border-white/10 p-3 bg-white/[.02]">
              <div className="font-semibold">{f.t}</div>
              <div className="opacity-70">{f.k}</div>
            </li>
          ))}
        </ul>

        {/* OS selector + downloads */}
        <div className="mt-5 grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-2xl border border-white/10 p-4 bg-white/[.02]">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm opacity-80">Choose your OS</div>
              <div className="flex gap-2">
                {["Windows", "macOS", "Linux"].map((opt) => (
                  <SegBtn key={opt} active={os === opt} onClick={() => setOs(opt)}>{opt}</SegBtn>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <a
                href={dlLink}
                className="btn-shine px-4 py-3 rounded-xl font-semibold text-white text-center"
                style={{ background: `linear-gradient(135deg, ${BLUE[500]}, ${BLUE[600]})` }}
              >
                Download for {os}
              </a>
              <a
                href="#"
                className="px-4 py-3 rounded-xl font-semibold text-white/90 border text-center"
                style={{ borderColor: "rgba(255,255,255,.18)", background: "rgba(255,255,255,.06)" }}
              >
                Open Web Terminal
              </a>
            </div>

            <div className="mt-3 text-xs text-white/60">
              {version} · SHA256: <span className="opacity-70">••• demo hash •••</span>
            </div>
          </div>

          {/* Requirements */}
          <div className="rounded-2xl border border-white/10 p-4 bg-white/[.02]">
            <div className="text-sm font-semibold mb-2">System requirements — {os}</div>
            <table className="w-full text-xs">
              <tbody>
                {reqs[os].map(([k, v]) => (
                  <tr key={k} className="border-t border-white/10 first:border-0">
                    <td className="py-1.5 pr-3 opacity-70">{k}</td>
                    <td className="py-1.5">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </GlassCard>

      <GlassCard title="Workspace" kicker={<Badge>Preview</Badge>} right="Screens">
        <div className="aspect-[16/9] w-full rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 grid place-items-center">
          <img src={workspacePreview} alt="Workspace preview" className="w-full h-auto rounded-xl border border-white/10" />
        </div>
      </GlassCard>

      <GlassCard title="Tooling & integrations" kicker={<Badge>Power tools</Badge>} right="Extend">
        <div className="grid sm:grid-cols-3 gap-3 text-sm">
          {[
            ["Strategy Tester", "Backtest + optimize EAs"],
            ["MQL5 Marketplace", "Indicators, EAs, utilities"],
            ["Data Export", "CSV/JSON for research"],
            ["Depth of Market", "L2, partial fills"],
            ["Alerts & Signals", "Price, indicator, news"],
            ["Multi-account", "Hedge or netting modes"],
          ].map(([t, d]) => (
            <div key={t} className="rounded-xl border border-white/10 p-3 bg-white/[.02]">
              <div className="font-semibold">{t}</div>
              <div className="opacity-70">{d}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </>
  );
};

/* ===========================
   PLATFORMS — Bot Trader (enhanced)
   =========================== */

export const PlatformsBot = () => {
  const palette = [
    { t: "Signal", d: "RSI < 30 (M15)", tone: "green" },
    { t: "Signal", d: "Breakout H1", tone: "blue" },
    { t: "Filter", d: "Session = London", tone: "gray" },
    { t: "Filter", d: "Spread < 1.0", tone: "gray" },
    { t: "Risk",   d: "1% per trade", tone: "amber" },
    { t: "Risk",   d: "Max 3 open trades", tone: "amber" },
    { t: "Action", d: "Market Buy", tone: "green" },
    { t: "Action", d: "Set SL/TP", tone: "blue" },
  ];

  const [flow, setFlow] = useState([
    { t: "Signal", d: "RSI < 30 (M15)", tone: "green" },
    { t: "Filter", d: "Session = London", tone: "gray" },
    { t: "Risk",   d: "1% per trade", tone: "amber" },
    { t: "Action", d: "Market Buy", tone: "green" },
    { t: "Action", d: "Set SL/TP", tone: "blue" },
  ]);

  const addBlock = (b) => setFlow((f) => [...f, b]);
  const removeAt = (i) => setFlow((f) => f.filter((_, idx) => idx !== i));

  const flowJson = JSON.stringify(
    {
      version: "1.0",
      strategy: flow.map((b) => ({ type: b.t.toLowerCase(), detail: b.d })),
    },
    null,
    2
  );

  return (
    <>
      <GlassCard title="Visual strategy builder" kicker={<Badge>Automation</Badge>} right="No code">
        {/* Palette */}
        <div className="rounded-2xl border border-white/10 p-4 bg-white/[.02] mb-4">
          <div className="text-sm font-semibold mb-2">Palette</div>
          <div className="grid sm:grid-cols-4 gap-2">
            {palette.map((b, i) => (
              <button
                key={`${b.t}-${b.d}-${i}`}
                onClick={() => addBlock(b)}
                className="rounded-lg border px-3 py-2 text-left text-sm"
                style={{ borderColor: "rgba(255,255,255,.12)", background: "rgba(255,255,255,.04)" }}
                title="Click to add to flow"
              >
                <Tag tone={b.tone} className="mb-1">{b.t}</Tag>
                <div className="opacity-80">{b.d}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Flow canvas */}
        <div className="rounded-2xl border border-white/10 p-4 bg-white/[.02]">
          <div className="text-sm font-semibold mb-2">Flow</div>
          {flow.length === 0 ? (
            <div className="text-white/60 text-sm">Add blocks from the palette to build your bot.</div>
          ) : (
            <ul className="space-y-2">
              {flow.map((b, idx) => (
                <li key={`${b.t}-${idx}`} className="flex items-center gap-3">
                  <div className="flex-1 rounded-lg border px-3 py-2"
                    style={{ borderColor: "rgba(255,255,255,.12)", background: "rgba(255,255,255,.04)" }}>
                    <div className="flex items-center gap-2">
                      <Tag tone={b.tone}>{b.t}</Tag>
                      <span className="opacity-80 text-sm">{b.d}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeAt(idx)}
                    className="px-2 py-1 rounded-md border text-xs text-white/80"
                    style={{ borderColor: "rgba(255,255,255,.18)", background: "rgba(255,255,255,.06)" }}
                    title="Remove block"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Export preview */}
          <div className="mt-4 grid lg:grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 p-3 bg-white/[.02]">
              <div className="text-xs opacity-70 mb-1">Export (JSON)</div>
              <pre className="text-[11px] whitespace-pre-wrap leading-5 opacity-90">{flowJson}</pre>
            </div>
            <div className="rounded-xl border border-white/10 p-3 bg-white/[.02]">
              <div className="text-xs opacity-70 mb-1">Suggested actions</div>
              <ul className="text-sm space-y-1 opacity-80">
                <li>• Backtest with out-of-sample split</li>
                <li>• Check slippage & spread assumptions</li>
                <li>• Start on demo; promote to live gradually</li>
              </ul>
              <div className="mt-2 text-[11px] text-white/60">
                Bots can amplify mistakes just as fast as edge. Keep risk per trade small and diversify signal logic.
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard title="Deploy & environments" kicker={<Badge>Pipeline</Badge>} right="Safe rollout">
        <ul className="grid sm:grid-cols-3 gap-3 text-sm">
          {[
            ["Paper", "Simulated fills; validate logic & metrics"],
            ["Demo", "Exchange/Broker demo accounts"],
            ["Live", "Small size; monitor slippage & latency"],
          ].map(([t, d]) => (
            <li key={t} className="rounded-xl border border-white/10 p-3 bg-white/[.02]">
              <div className="font-semibold">{t}</div>
              <div className="opacity-70">{d}</div>
            </li>
          ))}
        </ul>
      </GlassCard>
    </>
  );
};

/* ===========================
   Local helpers
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

function Tag({ children, tone = "gray", className = "" }) {
  const tones = {
    blue:   { bg: "rgba(59,130,246,.15)",  fg: "rgba(96,165,250,1)" },
    green:  { bg: "rgba(16,185,129,.15)",  fg: "rgba(52,211,153,1)" },
    amber:  { bg: "rgba(245,158,11,.15)",  fg: "rgba(251,191,36,1)" },
    gray:   { bg: "rgba(255,255,255,.08)", fg: "rgba(255,255,255,.7)" },
  }[tone] || { bg: "rgba(255,255,255,.08)", fg: "rgba(255,255,255,.7)" };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] ${className}`}
      style={{ background: tones.bg, color: tones.fg }}
    >
      {children}
    </span>
  );
}
