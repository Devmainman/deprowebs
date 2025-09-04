// src/HeroClassicPro.jsx — trading‑focused hero with dark‑mode polish, ticker, stats & smarter copy
// Drop‑in replacement for your current <HeroClassic/>. Color palette preserved.
// Dependencies: framer-motion, react-typed, lucide-react, your existing RevealOnScroll & CSS helpers (noise, btn-shine).

import React from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ReactTyped } from "react-typed";
import RevealOnScroll from "./RevealOnScroll";
import { Play, TrendingUp, ShieldCheck, Zap, Globe, Activity } from "lucide-react";

const BLUE = { 900: "#00072D", 800: "#051650", 700: "#0A2472", 600: "#123499", 500: "#1A43BF" };

export default function HeroClassicPro({
  bgImage = "/assets/hero/space-trading.jpg",
  onPrimary = () => {},
  onSecondary = () => {},
}) {
  const prefersReduce = useReducedMotion();
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 300], [1, 0.965]);
  const ls = useTransform(scrollY, [0, 300], ["-0.02em", "0em"]);
  const parallax = useTransform(scrollY, [0, 600], [0, -60]);

  const fadeUp = {
    hidden: { opacity: 0, y: 26 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };
  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } } };

  // --- mock market data for hero chips ---
  const pairs = [
    { s: "EUR/USD", p: 1.0872, ch: +0.23 },
    { s: "GBP/USD", p: 1.2741, ch: -0.11 },
    { s: "USD/JPY", p: 156.92, ch: +0.07 },
    { s: "XAU/USD", p: 2421.5, ch: +0.45 },
    { s: "BTC/USD", p: 61042, ch: -1.26 },
    { s: "ETH/USD", p: 2481, ch: +0.83 },
  ];

  return (
    <section className="relative text-white overflow-hidden pt-28 md:pt-32 min-h-[100vh] md:min-h-[115vh]" aria-label="Hero">
      {/* Brand‑dark base */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-900 via-[#0b1743] to-black" />

      {/* Space/trading image (cinematic zoom + drift) */}
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <motion.div
          className="absolute inset-0"
          style={{
            y: parallax,
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.40,
            transformOrigin: "50% 40%",
            willChange: "transform, background-position",
          }}
          initial={{ scale: 1, backgroundPosition: "center center" }}
          animate={prefersReduce ? undefined : { scale: [1, 1.08, 1.14, 1.08, 1], backgroundPosition: [
            "center 55%",
            "center 50%",
            "center 45%",
            "center 50%",
            "center 55%",
          ] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

{/* Subtle animated grid overlay for trading vibe (lighter) */}
<div
  aria-hidden
  className="absolute inset-0 z-0 pointer-events-none"
  style={{
    // ↓ reduce stripe opacity from .04 → .02
    backgroundImage:
      "linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px)",
    backgroundSize: "40px 40px",
    // optional global fade (keeps animation but softens a bit more)
    opacity: 0.65,
    animation: "grid-pan 24s linear infinite",
    maskImage: "radial-gradient(60% 50% at 50% 35%, rgba(0,0,0,0.85), rgba(0,0,0,1))",
  }}
/>



      {/* top scrim for header contrast */}
      <div
        className="absolute inset-x-0 top-0 h-40 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0))" }}
      />

      {/* Blue glow + film grain to match your style */}
      <div className="absolute inset-0 z-10" style={{ background: `radial-gradient(600px 300px at 50% 30%, rgba(26,67,191,.25), transparent 60%)` }} />
      <div className="absolute inset-0 z-10 noise" />

      {/* Content */}
      <div className="relative z-20 container mx-auto mt-1 md:mt-20 px-6 pb-14">
        {/* Overline */}
        <RevealOnScroll variants={fadeUp}>
          <div className="text-center text-white/70 tracking-wide uppercase text-xs md:text-sm">Multi‑asset trading platform</div>
        </RevealOnScroll>

        {/* Headline + body */}
        <RevealOnScroll variants={stagger} className="text-center">
          <motion.h1
            className="h-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.95] mb-4"
            style={{ scale, letterSpacing: ls }}
          >
            Trade <span style={{ color: BLUE[500] }}>Forex</span>, Crypto & Indices with Confidence
          </motion.h1>

          <motion.p variants={fadeUp} className="mx-auto max-w-3xl text-white/80 text-base md:text-lg lg:text-xl mb-8">
            Tight spreads, fast execution and pro‑grade risk tools. Build, test and automate your edge with a platform
            designed for insight—<span className="font-semibold" style={{ color: BLUE[500] }}>not hype</span>.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              className="btn-shine px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg shadow-blue-900/30"
              style={{ background: `linear-gradient(135deg, ${BLUE[500]}, ${BLUE[600]})`, color: "#fff" }}
              onClick={onPrimary}
              aria-label="Open live trading account"
            >
              Open Live Account
            </button>

            <button
              className="px-8 py-4 rounded-2xl font-semibold text-lg border backdrop-blur-md"
              style={{ borderColor: "rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.06)" }}
              onClick={onSecondary}
              aria-label="Watch platform demo"
            >
              <span className="inline-flex items-center gap-2"><Play size={18} /> Watch Demo</span>
            </button>
          </motion.div>

          {/* Typed line */}
          <motion.div variants={fadeUp} className="mt-6 text-center text-white/90">
            Built for <span style={{ color: BLUE[500] }}>
              <ReactTyped
                strings={[
                  "FX scalpers & swing traders",
                  "crypto momentum strategies",
                  "multi‑asset portfolio hedging",
                ]}
                typeSpeed={60}
                backSpeed={34}
                backDelay={1500}
                loop
              />
            </span>
          </motion.div>
        </RevealOnScroll>

        {/* Live‑feel ticker (mock) */}
        <RevealOnScroll variants={fadeUp} className="mt-10">
          <Ticker pairs={pairs} />
        </RevealOnScroll>

        {/* Trust/feature stats */}
        <RevealOnScroll variants={stagger} className="mt-10">
          <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <Stat icon={<Zap className="opacity-90" size={18} />} label="Execution" value="<40ms avg" />
            <Stat icon={<Activity className="opacity-90" size={18} />} label="Uptime" value="99.99%" />
            <Stat icon={<Globe className="opacity-90" size={18} />} label="Markets" value="120+ symbols" />
            <Stat icon={<ShieldCheck className="opacity-90" size={18} />} label="Security" value="Encryption at rest" />
          </div>
        </RevealOnScroll>

        {/* Micro‑explainers */}
        <RevealOnScroll variants={stagger} className="mt-8">
          <ul className="mx-auto max-w-4xl grid gap-3 md:grid-cols-3 text-sm text-white/80">
            <FeatureCard
              title="Transparent pricing"
              body="See raw spreads and total costs before you trade. No hidden markups."
            />
            <FeatureCard
              title="Risk tools built‑in"
              body="Attach stop/limit orders, set alerts and simulate scenarios in one click."
            />
            <FeatureCard
              title="Automation‑ready"
              body="Backtest in the browser and deploy strategies with webhook or API in minutes."
            />
          </ul>
        </RevealOnScroll>

        {/* Risk disclaimer */}
        <div className="mx-auto max-w-3xl mt-8 text-center text-[12px] md:text-xs text-white/60">
          Trading involves risk. Your capital is at risk. Past performance does not guarantee future results.
        </div>
      </div>

      {/* Soft fade to next section */}
      <div className="absolute inset-x-0 bottom-0 h-24 z-20" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.6))" }} />
    </section>
  );
}

// ========= subcomponents =========
function Ticker({ pairs }) {
  // duplicate the list so the marquee looks seamless
  const row = [...pairs, ...pairs];
  return (
    <div className="relative">
      {/* glow */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-2xl"
        style={{ boxShadow: `0 0 0 1px rgba(255,255,255,.06) inset, 0 10px 40px ${BLUE[900]}50` }}
      />
      <div className="relative overflow-hidden rounded-2xl bg-[#0f1115]/70 backdrop-blur-md">
        <motion.div
          className="flex gap-3 py-3 px-3 min-w-max"
          animate={{ x: [0, -600] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        >
          {row.map((x, i) => (
            <PairChip key={`${x.s}-${i}`} {...x} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function PairChip({ s, p, ch }) {
  const up = ch >= 0;
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-xl border"
      style={{
        borderColor: "rgba(255,255,255,.08)",
        background: "linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03))",
      }}
      title={`${s} ${p} (${ch > 0 ? "+" : ""}${ch}%)`}
    >
      <span className="text-white/90 font-semibold">{s}</span>
      <span className="text-white/70 tabular-nums">{fmtPrice(p)}</span>
      <span className={`text-xs font-medium ${up ? "text-emerald-400" : "text-rose-400"}`}>
        {up ? <TrendingUp size={14} /> : <span className="inline-block rotate-180"><TrendingUp size={14} /></span>}
      </span>
      <span className={`text-xs tabular-nums ${up ? "text-emerald-400" : "text-rose-400"}`}>
        {up ? "+" : ""}{ch}%
      </span>
    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div
      className="rounded-2xl border px-4 py-3 text-white/80 flex items-center gap-3"
      style={{
        borderColor: "rgba(255,255,255,.08)",
        background: "linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03))",
      }}
    >
      <div
        className="grid place-items-center rounded-xl"
        style={{ width: 34, height: 34, background: `linear-gradient(135deg, ${BLUE[900]}66, transparent)` }}
        aria-hidden
      >
        {icon}
      </div>
      <div className="leading-tight">
        <div className="text-[11px] uppercase tracking-wide text-white/60">{label}</div>
        <div className="text-sm font-semibold text-white">{value}</div>
      </div>
    </div>
  );
}

function FeatureCard({ title, body }) {
  return (
    <li
      className="rounded-2xl border p-4 text-left"
      style={{
        borderColor: "rgba(255,255,255,.08)",
        background: "linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03))",
      }}
    >
      <div className="font-semibold text-white mb-1">{title}</div>
      <p className="text-white/70 text-sm">{body}</p>
    </li>
  );
}

function fmtPrice(n) {
  try {
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(n);
  } catch {
    return String(n);
  }
}
