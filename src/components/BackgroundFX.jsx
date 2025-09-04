

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const BLUE = { 900: "#00072D", 800: "#051650", 700: "#0A2472", 600: "#123499", 500: "#1A43BF" };

export default function BackgroundFX({
  variant = "conic-orb",
  theme = "dark",            // "dark" | "light"
  intensity = 0.35,           // 0..1 overall opacity scaling
  speed = 80,                 // seconds per full cycle (when applicable)
  className = "",
}) {
  const reduce = useReducedMotion();
  const isDark = theme !== "light";
  const baseBg = isDark ? "#000" : "#fff";
  const fxOpacity = clamp(intensity, 0, 1);

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden ${className}`} aria-hidden>
      {/* Base colour to guarantee contrast with content */}
      <div className="absolute inset-0" style={{ background: baseBg }} />

      {variant === "conic-orb" && (
        <ConicOrb reduce={reduce} speed={speed} opacity={fxOpacity} />
      )}

      {variant === "radial-aurora" && (
        <RadialAurora reduce={reduce} speed={speed} opacity={fxOpacity} dark={isDark} />
      )}

      {variant === "grid-pulse" && (
        <GridPulse speed={speed} opacity={fxOpacity} dark={isDark} />
      )}

      {variant === "ring" && (
        <RingSpin reduce={reduce} speed={speed} opacity={fxOpacity} />
      )}

      {variant === "diagonal-sweep" && (
        <DiagonalSweep reduce={reduce} speed={speed} opacity={fxOpacity} dark={isDark} />
      )}

      {variant === "noise-glow" && (
        <NoiseGlow opacity={fxOpacity} />
      )}
    </div>
  );
}

// ========== Helpers ==========
function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }

// ========== Variant: Conic Orb (slow rotating conic with soft radial mask) ==========
function ConicOrb({ reduce, speed, opacity }){
  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{
        width: "200vmax",
        height: "200vmax",
        translateX: "-50%",
        translateY: "-50%",
        background: `conic-gradient(from 0deg, ${BLUE[900]} 0deg, ${BLUE[700]} 90deg, ${BLUE[600]} 180deg, ${BLUE[500]} 270deg, ${BLUE[900]} 360deg)`,
        opacity: 0.35 * opacity,
        filter: "blur(40px)",
        maskImage: "radial-gradient(closest-side at 50% 50%, #000 45%, transparent 70%)",
        WebkitMaskImage: "radial-gradient(closest-side at 50% 50%, #000 45%, transparent 70%)",
        willChange: "transform",
      }}
      initial={false}
      animate={reduce ? { rotate: 0 } : { rotate: 360 }}
      transition={{ repeat: Infinity, ease: "linear", duration: Math.max(20, speed) }}
    />
  );
}

// ========== Variant: Radial Aurora (two soft blobs drifting) ==========
function RadialAurora({ reduce, speed, opacity, dark }){
  const blob = (x, y, c, s) => (
    <motion.div
      key={`${x}-${y}`}
      className="absolute rounded-full"
      style={{
        width: s,
        height: s,
        left: x,
        top: y,
        background: `radial-gradient(circle at 30% 30%, ${c}AA, transparent 60%)`,
        filter: "blur(20px)",
        opacity: 0.9 * opacity,
        willChange: "transform",
      }}
      animate={reduce ? {} : { x: [0, 30, -30, 0], y: [0, -20, 20, 0] }}
      transition={{ duration: Math.max(20, speed * 0.6), repeat: Infinity, ease: "easeInOut" }}
    />
  );
  const c1 = dark ? BLUE[600] : "#2563eb"; // blue-600
  const c2 = dark ? BLUE[500] : "#7c3aed"; // violet accent on light
  return (
    <>
      {blob("20%", "30%", c1, "44vmax")}
      {blob("60%", "50%", c2, "52vmax")}
    </>
  );
}

// ========== Variant: Grid Pulse (your micro-grid with gentle pan + glow) ==========
function GridPulse({ speed, opacity, dark }){
  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          animation: `grid-pan ${Math.max(14, speed * 0.3)}s linear infinite`,
          opacity: 0.65 * opacity,
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(600px 300px at 50% 30%, ${dark ? "rgba(26,67,191,.28)" : "rgba(30,64,175,.25)"}, transparent 60%)` }}
      />
    </div>
  );
}

// ========== Variant: Ring Spin (thin conic ring around content) ==========
function RingSpin({ reduce, speed, opacity }){
  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{
        width: "180vmax",
        height: "180vmax",
        translateX: "-50%",
        translateY: "-50%",
        background: `conic-gradient(from 0deg, transparent 0 60deg, ${BLUE[500]} 120deg, transparent 180deg, ${BLUE[700]} 240deg, transparent 360deg)`,
        opacity: 0.35 * opacity,
        filter: "blur(22px)",
        maskImage: "radial-gradient(closest-side at 50% 50%, transparent 52%, #000 55%, #000 60%, transparent 63%)",
        WebkitMaskImage: "radial-gradient(closest-side at 50% 50%, transparent 52%, #000 55%, #000 60%, transparent 63%)",
        willChange: "transform",
      }}
      initial={false}
      animate={reduce ? { rotate: 0 } : { rotate: -360 }}
      transition={{ repeat: Infinity, ease: "linear", duration: Math.max(16, speed * 0.5) }}
    />
  );
}

// ========== Variant: Diagonal Sweep (subtle animated gradient stripes) ==========
function DiagonalSweep({ reduce, speed, opacity, dark }){
  return (
    <motion.div
      className="absolute inset-0"
      style={{
        backgroundImage: `repeating-linear-gradient(135deg, ${dark ? "rgba(255,255,255,.045)" : "rgba(0,0,0,.06)"} 0 12px, transparent 12px 32px)`,
        opacity: 0.5 * opacity,
        willChange: "transform",
      }}
      initial={false}
      animate={reduce ? { x: 0 } : { x: [0, -40, 0] }}
      transition={{ duration: Math.max(14, speed * 0.35), repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ========== Variant: Noise Glow (film grain + gentle center glow) ==========
function NoiseGlow({ opacity }){
  return (
    <>
      <div className="absolute inset-0" style={{ background: `radial-gradient(600px 300px at 50% 30%, rgba(26,67,191,.25), transparent 60%)`, opacity }} />
      <div className="absolute inset-0 noise" style={{ opacity: 0.25 * opacity }} />
    </>
  );
}
