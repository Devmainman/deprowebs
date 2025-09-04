// src/TopNav.jsx
import React from "react";
import { SidebarTrigger } from "./Sidebar";
import { motion, useScroll, useTransform } from "framer-motion";
import logo from "../assets/dpw.png"; // if this file lives in /src/components, use: ../assets/dpw.png

const BLUE = { 900:"#00072D", 800:"#051650", 700:"#0A2472", 600:"#123499", 500:"#1A43BF" };

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

  return (
    <motion.header className="fixed top-0 inset-x-0 z-[100]" style={{ backgroundColor: bg, boxShadow: shadow }}>
      <div className="absolute inset-0 pointer-events-none supports-[backdrop-filter]:backdrop-blur-xl" />
      <motion.div
        className="relative max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between border-b"
        style={{ borderColor: br }}
      >
        {/* Left: brand / logo */}
        <a href={href} className="flex items-center gap-2" aria-label={brand}>
          <img src={logo} alt={brand} className="block h-10 w-auto select-none" />
        </a>

        {/* Right: Login + hamburger (side-by-side) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onLogin}
            className="btn-shine px-3 py-2 rounded-xl font-semibold text-sm text-white shadow-lg shadow-blue-900/30"
            style={{ background: `linear-gradient(135deg, ${BLUE[500]}, ${BLUE[600]})` }}
            aria-label="Login"
          >
            Login
          </button>

          <SidebarTrigger className="p-2 rounded-lg border border-white/20 text-white" aria-label="Open menu" />
        </div>
      </motion.div>
    </motion.header>
  );
}
