// src/TopNav.jsx
import React, { useId, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { SidebarTrigger } from "./Sidebar";
import logo from "../assets/dpw.png";

const BLUE = { 900:"#00072D", 800:"#051650", 700:"#0A2472", 600:"#123499", 500:"#1A43BF" };

/** Desktop nav model (matches your groups & order) */
const NAV = [
  {
    key: "markets",
    label: "Markets",
    cols: [
      {
        title: "Tradeable assets",
        items: [
          { label: "Forex", href: "#markets-forex" },
          { label: "Stocks", href: "#markets-stocks" },
          { label: "Indices", href: "#markets-indices" },
          { label: "Commodities", href: "#markets-commodities" },
          { label: "Cryptocurrencies", href: "#markets-crypto" },
          { label: "ETFs", href: "#markets-etfs" },
        ],
      },
    ],
  },
  {
    key: "trading",
    label: "Trading",
    cols: [
      {
        title: "Instruments",
        items: [
          { label: "CFDs", href: "#trading-cfds" },
          { label: "Options", href: "#trading-options" },
          { label: "Multipliers", href: "#trading-multipliers" },
        ],
      },
    ],
  },
  {
    key: "tools",
    label: "Tools",
    cols: [
      {
        title: "Trader’s toolkit",
        items: [
          { label: "Trading Signals", href: "#tools-signals" },
          { label: "Trading Calculator", href: "#tools-calculator" },
        ],
      },
    ],
  },
  {
    key: "platforms",
    label: "Platforms",
    cols: [
      {
        title: "Choose your platform",
        items: [
          { label: "MT5", href: "#platforms-mt5" },
          { label: "Bot Trader", href: "#platforms-bot" },
        ],
      },
    ],
  },
];

export default function TopNav({
  brand = "deprowebs",
  href = "#top",
  onLogin = () => {},
}) {
  // Subtle scroll polish
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 80], ["rgba(0,0,0,.18)", "rgba(0,0,0,.60)"]);
  const br = useTransform(scrollY, [0, 80], ["rgba(255,255,255,.10)", "rgba(255,255,255,.18)"]);
  const shadow = useTransform(scrollY, [0, 80], ["0 0 0 rgba(0,0,0,0)", "0 8px 24px rgba(0,0,0,.35)"]);

  const [openKey, setOpenKey] = useState(null);
  const closeAll = () => setOpenKey(null);

  return (
    <motion.header className="fixed top-0 inset-x-0 z-[100]" style={{ backgroundColor: bg, boxShadow: shadow }}>
      <div className="absolute inset-0 pointer-events-none supports-[backdrop-filter]:backdrop-blur-xl" />
      <motion.div
        className="relative max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between border-b"
        style={{ borderColor: br }}
      >
        {/* Left: brand */}
        <a href={href} className="flex items-center gap-2" aria-label={brand} onMouseEnter={closeAll}>
          <img src={logo} alt={brand} className="block h-10 w-auto select-none" />
        </a>

        {/* Center nav — desktop only */}
        <nav className="hidden lg:flex items-center gap-1 relative" onMouseLeave={closeAll}>
          {NAV.map((g) => (
            <TopItem
              key={g.key}
              group={g}
              open={openKey === g.key}
              setOpen={() => setOpenKey(g.key)}
              close={closeAll}
            />
          ))}

          {/* Single link (no dropdown) */}
          <a
            href="#contact"
            className="relative px-3 py-2 rounded-md text-white/80 hover:text-white transition-colors"
            onMouseEnter={closeAll}
          >
            Contact Us
          </a>
        </nav>

        {/* Right: CTA + mobile trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={onLogin}
            className="btn-shine px-3 py-2 rounded-xl font-semibold text-sm text-white shadow-lg shadow-blue-900/30"
            style={{ background: `linear-gradient(135deg, ${BLUE[500]}, ${BLUE[600]})` }}
            aria-label="Login"
          >
            Login
          </button>
          <SidebarTrigger className="p-2 rounded-lg border border-white/20 text-white lg:hidden" aria-label="Open menu" />
        </div>
      </motion.div>
    </motion.header>
  );
}

/* ---------- Desktop Top Item with refined dropdown ---------- */

function TopItem({ group, open, setOpen, close }) {
  const uid = useId();
  const btnRef = useRef(null);

  return (
    <div className="relative group">
      {/* Top label */}
      <button
        ref={btnRef}
        id={`${uid}-button`}
        aria-haspopup="true"
        aria-expanded={open}
        onMouseEnter={setOpen}
        onFocus={setOpen}
        className={`relative px-3 py-2 rounded-md text-sm font-semibold transition-colors
                    ${open ? "text-white" : "text-white/80 hover:text-white"}`}
      >
        {group.label}
        {/* active underline */}
        <span
          className="pointer-events-none absolute left-2 right-2 -bottom-0.5 h-[2px] rounded-full transition-opacity"
          style={{
            background: `linear-gradient(90deg, ${BLUE[700]}, ${BLUE[500]})`,
            opacity: open ? 1 : 0,
          }}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-labelledby={`${uid}-button`}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute left-1/2 -translate-x-1/2 mt-3 w-[420px] rounded-2xl overflow-hidden"
            onMouseLeave={close}
            onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) close(); }}
            style={{
              border: "1px solid rgba(255,255,255,.10)",
              background: "linear-gradient(180deg, rgba(15,17,21,.92), rgba(5,12,34,.92))",
              boxShadow: `0 24px 60px ${BLUE[900]}80`,
              backdropFilter: "blur(10px)",
            }}
          >
            {/* caret */}
            <div
              className="absolute -top-2 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45"
              style={{
                background: "rgba(15,17,21,.92)",
                borderLeft: "1px solid rgba(255,255,255,.10)",
                borderTop: "1px solid rgba(255,255,255,.10)",
              }}
            />
            {/* accent bar */}
            <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${BLUE[700]}, ${BLUE[500]})` }} />

            {/* content (single column, roomy pills) */}
            <div className="p-4">
              {group.cols.map((col, i) => (
                <div key={i} className={i > 0 ? "mt-2" : ""}>
                  <div className="text-white/70 text-xs uppercase tracking-wider mb-3">{col.title}</div>
                  <ul className="space-y-2">
                    {col.items.map((it) => (
                      <li key={it.href}>
                        <a
                          href={it.href}
                          className="flex items-center gap-3 rounded-xl px-3 py-3 text-white/90 hover:text-white transition
                                     ring-1 ring-white/10 hover:ring-white/20"
                          style={{
                            background: "linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.035))",
                          }}
                        >
                          {/* dot bullet */}
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ background: `linear-gradient(135deg, ${BLUE[700]}, ${BLUE[500]})` }}
                            aria-hidden
                          />
                          <span className="font-semibold">{it.label}</span>

                          {/* EXPLORE tag — spaced to the right */}
                          <span className="ml-auto text-[10px] uppercase tracking-wide text-white/55">
                            Explore
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
