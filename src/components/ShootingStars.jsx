// src/ShootingStars.jsx — lightweight canvas background with shooting stars (now with dark "night" sky option)
import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

// Brand blues (fallbacks if CSS vars are unavailable)
const BLUE = { 900:"#00072D", 800:"#051650", 700:"#0A2472", 600:"#123499", 500:"#1A43BF" };

// Neutral night palette
const NIGHT = { 900:"#06080d", 800:"#0a0d14", 700:"#0f1320" };

function readCSSVar(name, fallback){
  if (typeof window === 'undefined') return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

/**
 * <ShootingStars />
 * Canvas-based starfield + occasional meteors.
 * Props:
 * - theme: "dark" | "light" (affects contrast)
 * - sky:   "brand" | "night"  (brand = blue gradient, night = near-black)
 * - density: star density scalar
 * - meteorEvery: avg ms between meteor spawns
 * - meteorTint: "brand" | "white" | hex color
 */
export default function ShootingStars({
  theme = "dark",
  sky = "brand",
  density = 1,
  meteorEvery = 3000,
  meteorTint = "brand",
}){
  const ref = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let raf; let timer; let width = 0; let height = 0; let dpr = Math.min(devicePixelRatio || 1, 2);

    const stars = []; // {x,y,sz,spd,tw,twD}
    const meteors = []; // {x,y,vx,vy,len,life,ttl,width}

    // Resolve palettes lazily from CSS vars (if defined) with fallbacks
    const brand = {
      900: readCSSVar('--blue-900', BLUE[900]),
      800: readCSSVar('--blue-800', BLUE[800]),
      700: readCSSVar('--blue-700', BLUE[700]),
      600: readCSSVar('--blue-600', BLUE[600]),
      500: readCSSVar('--blue-500', BLUE[500]),
    };

    const palette = sky === 'night'
      ? [NIGHT[900], NIGHT[800], NIGHT[700]]
      : theme === 'dark'
        ? [brand[900], brand[800], brand[700]]
        : ["#0b1220", "#10213d", brand[600]];

    const meteorColor = meteorTint === 'brand'
      ? brand[500]
      : meteorTint === 'white' ? '#ffffff' : meteorTint;

    function resize(){
      const rect = canvas.parentElement.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function rand(a,b){ return a + Math.random()*(b-a); }

    function seed(){
      stars.length = 0;
      const base = Math.round((width * height) / 18000 * density); // auto scale by area
      for (let i=0;i<base;i++){
        stars.push({
          x: Math.random()*width,
          y: Math.random()*height,
          sz: rand(0.6,1.8),
          spd: rand(0.02,0.08),
          tw: Math.random(),
          twD: rand(0.002,0.01)
        });
      }
    }

    function drawBackground(){
      // subtle vertical vignette
      const g = ctx.createLinearGradient(0,0,0,height);
      g.addColorStop(0, palette[0]);
      g.addColorStop(0.6, palette[1]);
      g.addColorStop(1, palette[2]);
      ctx.fillStyle = g;
      ctx.fillRect(0,0,width,height);
    }

    function drawStars(){
      ctx.save();
      ctx.fillStyle = '#ffffff';
      for (const s of stars){
        s.y += s.spd; // slow drift
        if (s.y > height + 2) { s.y = -2; s.x = Math.random()*width; }
        s.tw += s.twD;
        const a = 0.35 + 0.65 * Math.abs(Math.sin(s.tw * Math.PI));
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.sz, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.restore();
    }

    function drawMeteors(){
      for (let i = meteors.length - 1; i >= 0; i--){
        const m = meteors[i];
        m.x += m.vx; m.y += m.vy; m.life++;
        if (m.life > m.ttl || m.x < -m.len || m.y > height + m.len) { meteors.splice(i,1); continue; }
        const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx*m.len, m.y - m.vy*m.len);
        grad.addColorStop(0, 'rgba(255,255,255,0.95)');
        grad.addColorStop(0.2, 'rgba(255,255,255,0.7)');
        // fade into chosen meteor tint
        const [r,gc,b] = hexToRgb(meteorColor);
        grad.addColorStop(1, `rgba(${r},${gc},${b},0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = m.width;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.vx*m.len, m.y - m.vy*m.len);
        ctx.stroke();
      }
    }

    function hexToRgb(hex){
      const v = hex.replace('#','');
      const bigint = parseInt(v.length===3 ? v.split('').map(c=>c+c).join('') : v, 16);
      return [(bigint>>16)&255, (bigint>>8)&255, bigint&255];
    }

    function spawnMeteor(){
      const speed = rand(6, 10);
      const angle = rand(Math.PI*0.62, Math.PI*0.78); // heading down-right
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const startX = rand(-40, width * 0.15);
      const startY = rand(-20, height * 0.25);
      meteors.push({ x:startX, y:startY, vx, vy, len: rand(40, 140), life:0, ttl: rand(30, 70), width: rand(1.2, 2.2) });
    }

    function loop(){
      drawBackground();
      drawStars();
      drawMeteors();
      raf = requestAnimationFrame(loop);
    }

    function start(){
      resize();
      if (!reduce){
        loop();
        timer = setInterval(spawnMeteor, meteorEvery + (Math.random()*meteorEvery|0));
      } else {
        // static starfield for reduced motion users
        drawBackground();
        drawStars();
      }
    }
    function stop(){ if (raf) cancelAnimationFrame(raf); if (timer) clearInterval(timer); }

    const onVis = () => { document.hidden ? stop() : start(); };
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVis);
    start();

    return () => { stop(); document.removeEventListener('visibilitychange', onVis); window.removeEventListener('resize', resize); };
  }, [theme, sky, density, meteorEvery, meteorTint, reduce]);

  return <canvas ref={ref} className="w-full h-full" aria-hidden />;
}

