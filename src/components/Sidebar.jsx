// FILE: src/components/Sidebar.jsx (switch anchors to <Link/>)
import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { X, Menu, ChevronDown, ChevronRight, LogIn } from "lucide-react";

const BLUE = { 900: "#00072D", 800: "#051650", 700: "#0A2472", 600: "#123499", 500: "#1A43BF" };

const SidebarCtx = createContext(null);
export function SidebarProvider({ children }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onEsc = (e) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [close]);

  return <SidebarCtx.Provider value={{ open, setOpen, toggle, close }}>{children}</SidebarCtx.Provider>;
}
export function useSidebar(){
  const ctx = useContext(SidebarCtx);
  if (!ctx) return { open:false, toggle:()=>{}, close:()=>{} };
  return ctx;
}

export function SidebarTrigger({ className = "", children, ...props }) {
  const { toggle } = useSidebar();
  return (
    <button aria-label="Open menu" onClick={toggle} className={`p-2 rounded-lg border border-white/20 text-white bg-black/30 backdrop-blur ${className}`} {...props}>
      {children ?? <Menu size={22} />}
    </button>
  );
}

export default function Sidebar() {
  const { open, close } = useSidebar();
  const closeBtnRef = useRef(null);
  useEffect(() => { if (open) closeBtnRef.current?.focus(); }, [open]);

  const groups = [
    {
      id: "markets",
      label: "Markets",
      items: [
        { label: "Forex", to: "/markets/forex" },
        { label: "Stocks", to: "/markets/stocks" },
        { label: "Indices", to: "/markets/indices" },
        { label: "Commodities", to: "/markets/commodities" },
        { label: "Cryptocurrencies", to: "/markets/crypto" },
        { label: "ETFs", to: "/markets/etfs" },
      ],
    },
    {
      id: "trading",
      label: "Trading",
      items: [
        { label: "CFDs", to: "/trading/cfds" },
        { label: "Options", to: "/trading/options" },
        { label: "Multipliers", to: "/trading/multipliers" },
      ],
    },
    {
      id: "tools",
      label: "Tools",
      items: [
        { label: "Trading Signals", to: "/tools/signals" },
        { label: "Trading Calculator", to: "/tools/calculator" },
      ],
    },
    {
      id: "platforms",
      label: "Platforms",
      items: [
        { label: "MT5", to: "/platforms/mt5" },
        { label: "Bot Trader", to: "/platforms/bot" },
      ],
    },
  ];

  const [openId, setOpenId] = useState(null);
  const toggleGroup = (id) => setOpenId((cur) => (cur === id ? null : id));

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="overlay" className="fixed inset-0 z-[90] bg-black/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} />
          <motion.aside key="panel" role="dialog" aria-modal="true" className="fixed inset-y-0 left-0 z-[95] w-[88%] max-w-[360px] border-r"
            style={{ borderColor: "rgba(255,255,255,.08)", background: `linear-gradient(180deg, rgba(15,17,21,.92), rgba(5,12,34,.92))`, boxShadow: `0 10px 40px ${BLUE[900]}80`, backdropFilter: "blur(10px)" }}
            initial={{ x: -420 }} animate={{ x: 0 }} exit={{ x: -420 }} transition={{ type: "spring", stiffness: 380, damping: 38 }}>
            <div className="flex items-center justify-between px-4 py-4 border-b" style={{ borderColor: "rgba(255,255,255,.08)" }}>
              <div className="flex items-center gap-2">
                <span className="h-display text-xl font-bold tracking-tight" style={{ color: BLUE[500] }}>deprowebs</span>
                <span className="text-white/60 text-xs">Trading Platform</span>
              </div>
              <button ref={closeBtnRef} onClick={close} aria-label="Close menu" className="p-2 rounded-lg border border-white/10 text-white/90"><X size={20} /></button>
            </div>
            <nav className="px-2 py-3">
              {groups.map((g) => {
                const expanded = openId === g.id;
                return (
                  <div key={g.id} className="mb-2">
                    <button onClick={() => toggleGroup(g.id)} aria-expanded={expanded} aria-controls={`panel-${g.id}`} className="w-full group flex items-center gap-3 px-3 py-3 rounded-xl text-white/90 border"
                      style={{ borderColor: "rgba(255,255,255,.06)", background: "linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.03))" }}>
                      <span className="font-semibold">{g.label}</span>
                      <span className="ml-auto text-white/60">{expanded ? <ChevronDown size={18}/> : <ChevronRight size={18}/>}</span>
                    </button>
                    <AnimatePresence initial={false}>
                      {expanded && (
                        <motion.div id={`panel-${g.id}`} role="region" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="overflow-hidden mt-1 ml-2">
                          <ul className="pl-1">
                            {g.items.map((it) => (
                              <li key={it.to} className="mt-1">
                                <Link to={it.to} onClick={close} className="block px-3 py-2 rounded-lg text-white/80 hover:text-white border" style={{ borderColor: "rgba(255,255,255,.05)", background: "rgba(255,255,255,.03)" }}>
                                  {it.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
              <Link to="/contact" onClick={close} className="mt-2 block px-3 py-3 rounded-xl text-white/90 border" style={{ borderColor: "rgba(255,255,255,.06)", background: "linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.03))" }}>
                Contact Us
              </Link>
            </nav>
            <div className="mt-auto px-4 py-4 border-t" style={{ borderColor: "rgba(255,255,255,.08)" }}>
              <div className="flex gap-2">
                <Link to="#open-account" onClick={close} className="btn-shine flex-1 px-4 py-3 rounded-xl font-semibold text-white text-center" style={{ background: `linear-gradient(135deg, ${BLUE[500]}, ${BLUE[600]})` }}>
                  Open Account
                </Link>
                <Link to="/login" onClick={close} className="px-4 py-3 rounded-xl font-semibold text-white/90 border" style={{ borderColor: "rgba(255,255,255,.18)", background: "rgba(255,255,255,.06)" }}>
                  <span className="inline-flex items-center gap-2"><LogIn size={18}/> Login</span>
                </Link>
              </div>
              <div className="mt-3 text-[11px] text-white/50">Secure login · Encryption at rest</div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

