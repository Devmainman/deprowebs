// src/TopNavMega.jsx — premium mega dropdown nav (Deriv-inspired, darker & cleaner in your blue theme)
// - Logo left, center desktop nav with classic dropdowns, right‑side Login + hamburger (SidebarTrigger)
// - Keyboard accessible (Tab/Shift+Tab, Esc), hover‑intent on desktop, click‑to‑open on touch
// - Dark glass, soft borders, Montserrat font; matches your palette; respects reduced motion
// Requires: framer-motion, tailwind (your setup), lucide-react, Sidebar.{Provider,Trigger}

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { SidebarTrigger } from "./Sidebar";
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Globe, Wallet, Layers, BookOpen, ShieldCheck, LineChart, Terminal } from "lucide-react";

const BLUE = { 900: "#00072D", 800: "#051650", 700: "#0A2472", 600: "#123499", 500: "#1A43BF" };

// ---- Data model: edit to change menu content ----
const NAV = [
  {
    label: "Markets",
    icon: <Globe size={16} className="opacity-90" />,
    panel: {
      cols: [
        {
          heading: "Forex",
          items: [
            { label: "Major pairs", href: "#markets", note: "Low spreads, deep liquidity" },
            { label: "Minor & exotics", href: "#markets", note: "200+ crosses" },
            { label: "Metals (XAU/XAG)", href: "#markets", note: "Hedge & diversify" },
          ],
        },
        {
          heading: "Crypto",
          items: [
            { label: "Spot", href: "#markets", note: "BTC, ETH, more" },
            { label: "Perps (USDT)", href: "#markets", note: "Up to 50x" },
            { label: "Indices & baskets", href: "#markets", note: "Thematic exposure" },
          ],
        },
        {
          heading: "Indices & more",
          items: [
            { label: "US/EU indices", href: "#markets", note: "S&P 500, DAX, FTSE" },
            { label: "Energies", href: "#markets", note: "Brent, WTI, NatGas" },
            { label: "Bonds", href: "#markets", note: "UST, Bund" },
          ],
        },
      ],
      promo: {
        title: "120+ symbols · 24/5 FX · 24/7 crypto",
        body: "Tight spreads with institutional routing and <40ms average execution.",
      },
    },
  },
  {
    label: "Platforms",
    icon: <Layers size={16} className="opacity-90" />,
    panel: {
      cols: [
        {
          heading: "Trade anywhere",
          items: [
            { label: "Web platform", href: "#platforms", note: "Charts, depth, hotkeys" },
            { label: "iOS & Android", href: "#platforms", note: "Push alerts, biometrics" },
            { label: "Desktop Pro", href: "#platforms", note: "Multi‑monitor layout" },
          ],
        },
        {
          heading: "Automate",
          items: [
            { label: "Strategy builder", href: "#platforms", note: "No‑code backtests" },
            { label: "Webhooks & API", href: "#platforms", note: "Deploy in minutes" },
            { label: "Paper trading", href: "#platforms", note: "Risk‑free simulation" },
          ],
        },
        {
          heading: "Secure & compliant",
          items: [
            { label: "Encryption at rest", href: "#platforms", note: "AES‑256" },
            { label: "2FA & device locks", href: "#platforms", note: "Account protection" },
            { label: "Audit trails", href: "#platforms", note: "Full transparency" },
          ],
        },
      ],
      promo: {
        title: "Pro tools, clean UI",
        body: "From first trade to automation—one workspace, zero clutter.",
      },
    },
  },
  {
    label: "Resources",
    icon: <BookOpen size={16} className="opacity-90" />,
    panel: {
      cols: [
        {
          heading: "Learn",
          items: [
            { label: "Academy", href: "#education", note: "Structured paths" },
            { label: "Webinars", href: "#education", note: "Live, weekly" },
            { label: "Glossary", href: "#education", note: "Key concepts" },
          ],
        },
        {
          heading: "Insights",
          items: [
            { label: "Daily brief", href: "#blog", note: "Macro & technicals" },
            { label: "Strategy ideas", href: "#blog", note: "Backtested setups" },
            { label: "News & updates", href: "#blog", note: "Platform releases" },
          ],
        },
        {
          heading: "Support",
          items: [
            { label: "Help centre", href: "#support", note: "24/7 chat" },
            { label: "Status page", href: "#support", note: "99.99% uptime" },
            { label: "API docs", href: "#support", note: "Start building" },
          ],
        },
      ],
      promo: {
        title: "Trade smarter",
        body: "Short videos, real examples, and tools you’ll actually use.",
      },
    },
  },
];

export default function TopNavMega({ brand = "deprowebs", logoSrc = null, href = "#top", onLogin = () => {}, onOpenAccount = () => {} }) {
  const idNS = useId();
  const prefersReduce = useReducedMotion();
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 80], ["rgba(0,0,0,.18)", "rgba(0,0,0,.60)"]);
  const br = useTransform(scrollY, [0, 80], ["rgba(255,255,255,.10)", "rgba(255,255,255,.18)"]);
  const shadow = useTransform(scrollY, [0, 80], ["0 0 0 rgba(0,0,0,0)", "0 8px 24px rgba(0,0,0,.35)"]);

  // which dropdown is open
  const [openIdx, setOpenIdx] = useState(-1);
  const [usingMouse, setUsingMouse] = useState(false);
  const menuRef = useRef(null);
  const closeAll = () => setOpenIdx(-1);

  // close on escape / outside click
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && closeAll();
    const onDoc = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) closeAll();
    };
    document.addEventListener("keydown", onEsc);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("touchstart", onDoc);
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("touchstart", onDoc);
    };
  }, []);

  // hover intent
  const timers = useRef({});
  const hoverOpen = (i) => {
    setUsingMouse(true);
    clearTimeout(timers.current[i]);
    timers.current[i] = setTimeout(() => setOpenIdx(i), 80);
  };
  const hoverClose = (i) => {
    clearTimeout(timers.current[i]);
    timers.current[i] = setTimeout(() => setOpenIdx((v) => (v === i ? -1 : v)), 120);
  };

  return (
    <motion.header className="fixed top-0 inset-x-0 z-[100]" style={{ backgroundColor: bg, boxShadow: shadow }}>
      <div className="absolute inset-0 pointer-events-none supports-[backdrop-filter]:backdrop-blur-xl" />
      <motion.div ref={menuRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between border-b" style={{ borderColor: br }}>
        {/* Left: Logo */}
        <a href={href} className="flex items-center gap-2" aria-label={brand}>
          {logoSrc ? (
            <img src={logoSrc} alt={brand} className="h-7 w-auto" />
          ) : (
            <span className="h-display text-[22px] sm:text-[24px] font-bold tracking-tight" style={{ color: BLUE[500] }}>{brand}</span>
          )}
        </a>

        {/* Center: Desktop navigation */}
        <nav className="hidden lg:flex items-center gap-2" role="menubar" aria-label="Primary">
          {NAV.map((m, i) => (
            <div key={`${idNS}-${i}`} className="relative" onMouseEnter={() => hoverOpen(i)} onMouseLeave={() => hoverClose(i)}>
              <button
                type="button"
                role="menuitem"
                aria-haspopup="true"
                aria-expanded={openIdx === i}
                onClick={() => setOpenIdx((v) => (v === i ? -1 : i))}
                className="group inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-white/90"
                style={{ borderColor: openIdx === i ? "rgba(255,255,255,.22)" : "rgba(255,255,255,.12)", background: openIdx === i ? "rgba(255,255,255,.08)" : "transparent" }}
              >
                <span className="opacity-90">{m.icon}</span>
                <span className="font-medium">{m.label}</span>
                <ChevronDown size={16} className={`transition-transform ${openIdx === i ? "rotate-180" : "rotate-0"}`} />
              </button>

              {/* Dropdown panel */}
              <AnimatePresence>
                {openIdx === i && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.99 }}
                    animate={{ opacity: 1, y: 4, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.99 }}
                    transition={{ duration: prefersReduce ? 0 : 0.18, ease: "easeOut" }}
                    className="absolute left-0 top-[110%] w-[680px] rounded-2xl border shadow-2xl"
                    style={{
                      borderColor: "rgba(255,255,255,.10)",
                      background: "linear-gradient(180deg, rgba(17,19,23,.96), rgba(6,10,28,.96))",
                      boxShadow: `0 30px 80px ${BLUE[900]}B3`,
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <div className="grid grid-cols-3 gap-4 p-4">
                      {m.panel.cols.map((col, ci) => (
                        <div key={ci} className="">
                          <div className="text-[11px] uppercase tracking-wide text-white/50 mb-2">{col.heading}</div>
                          <ul className="space-y-1">
                            {col.items.map((it, ii) => (
                              <li key={ii}>
                                <a href={it.href} className="group flex items-start gap-2 rounded-xl px-3 py-2 border text-white/85 hover:text-white transition-colors"
                                  style={{ borderColor: "rgba(255,255,255,.06)", background: "linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.02))" }}
                                >
                                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full" style={{ background: BLUE[500] }} />
                                  <div>
                                    <div className="text-sm font-medium">{it.label}</div>
                                    <div className="text-xs text-white/60">{it.note}</div>
                                  </div>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between gap-3 px-4 py-3 border-t" style={{ borderColor: "rgba(255,255,255,.08)" }}>
                      <div className="text-sm text-white/80">
                        <span className="font-semibold" style={{ color: BLUE[500] }}>{m.panel.promo.title}</span>
                        <span className="ml-2 text-white/70">{m.panel.promo.body}</span>
                      </div>
                      <a href="#open-account" onClick={onOpenAccount} className="btn-shine px-4 py-2 rounded-xl font-semibold text-white"
                        style={{ background: `linear-gradient(135deg, ${BLUE[500]}, ${BLUE[600]})` }}>
                        Open account
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Right: Login + hamburger */}
        <div className="flex items-center gap-2">
          <button onClick={onLogin} className="hidden sm:inline-flex btn-shine px-4 py-2 rounded-xl font-semibold text-sm text-white shadow-lg shadow-blue-900/30" style={{ background: `linear-gradient(135deg, ${BLUE[500]}, ${BLUE[600]})` }}>Login</button>
          <SidebarTrigger className="p-2 rounded-lg border border-white/20 text-white" aria-label="Open menu" />
        </div>
      </motion.div>
    </motion.header>
  );
}
