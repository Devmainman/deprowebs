

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Menu, LogIn, Play } from "lucide-react";

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

  const value = { open, setOpen, toggle, close };
  return <SidebarCtx.Provider value={value}>{children}</SidebarCtx.Provider>;
}
export function useSidebar(){
  const ctx = useContext(SidebarCtx);
  if (!ctx) return { open:false, toggle:()=>{}, close:()=>{} };
  return ctx;
}

export function SidebarTrigger({ className = "", children, ...props }) {
  const { toggle } = useSidebar();
  return (
    <button
      aria-label="Open menu"
      onClick={toggle}
      className={`p-2 rounded-lg border border-white/20 text-white bg-black/30 backdrop-blur ${className}`}
      {...props}
    >
      {children ?? <Menu size={22} />}
    </button>
  );
}

export default function Sidebar({ links = defaultLinks }) {
  const { open, close } = useSidebar();
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (open) closeBtnRef.current?.focus();
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            className="fixed inset-0 z-[90] bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />

          {/* Panel */}
          <motion.aside
            key="panel"
            role="dialog"
            aria-modal="true"
            className="fixed inset-y-0 left-0 z-[95] w-[88%] max-w-[360px] border-r"
            style={{
              borderColor: "rgba(255,255,255,.08)",
              background: `linear-gradient(180deg, rgba(15,17,21,.92), rgba(5,12,34,.92))`,
              boxShadow: `0 10px 40px ${BLUE[900]}80`,
              backdropFilter: "blur(10px)",
            }}
            initial={{ x: -420 }}
            animate={{ x: 0 }}
            exit={{ x: -420 }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
          >
            <div className="flex items-center justify-between px-4 py-4 border-b" style={{ borderColor: "rgba(255,255,255,.08)" }}>
              <div className="flex items-center gap-2">
                <span className="h-display text-xl font-bold tracking-tight" style={{ color: BLUE[500] }}>deprowebs</span>
                <span className="text-white/60 text-xs">Trading Platform</span>
              </div>
              <button
                ref={closeBtnRef}
                onClick={close}
                aria-label="Close menu"
                className="p-2 rounded-lg border border-white/10 text-white/90"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="px-2 py-2">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={close}
                  className="group flex items-center gap-3 px-3 py-3 rounded-xl text-white/80 border mb-2"
                  style={{
                    borderColor: "rgba(255,255,255,.06)",
                    background: "linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.03))",
                  }}
                >
                  <span className="w-7 grid place-items-center opacity-90">{l.icon}</span>
                  <span className="font-medium">{l.label}</span>
                  <span className="ml-auto text-[11px] text-white/50">{l.kicker}</span>
                </a>
              ))}
            </nav>

            <div className="mt-auto px-4 py-4 border-t" style={{ borderColor: "rgba(255,255,255,.08)" }}>
              <div className="flex gap-2">
                <a
                  href="#open-account"
                  onClick={close}
                  className="btn-shine flex-1 px-4 py-3 rounded-xl font-semibold text-white text-center"
                  style={{ background: `linear-gradient(135deg, ${BLUE[500]}, ${BLUE[600]})` }}
                >
                  Open Account
                </a>
                <a
                  href="#login"
                  onClick={close}
                  className="px-4 py-3 rounded-xl font-semibold text-white/90 border"
                  style={{ borderColor: "rgba(255,255,255,.18)", background: "rgba(255,255,255,.06)" }}
                >
                  <span className="inline-flex items-center gap-2"><LogIn size={18}/> Login</span>
                </a>
              </div>
              <div className="mt-3 text-[11px] text-white/50">Secure login · Encryption at rest</div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

const defaultLinks = [
  { label: "Markets", href: "#markets", kicker: "Forex · Crypto", icon: <Play size={16} /> },
  { label: "Platforms", href: "#platforms", kicker: "Web · Mobile", icon: <Play size={16} /> },
  { label: "How it works", href: "#how", kicker: "2 min", icon: <Play size={16} /> },
  { label: "Pricing", href: "#pricing", kicker: "Transparent", icon: <Play size={16} /> },
  { label: "Education", href: "#education", kicker: "Academy", icon: <Play size={16} /> },
  { label: "Blog", href: "#blog", kicker: "Insights", icon: <Play size={16} /> },
  { label: "Support", href: "#support", kicker: "24/7", icon: <Play size={16} /> },
];


