// ------------------------------------------------------------
// src/Hybridhome.jsx (header polish + minor a11y, theme intact)
import React, { useState } from "react";
import { Menu } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ReactTyped } from "react-typed";

import Hero from "./Hero";

import RevealOnScroll from "./RevealOnScroll";
import Pricing from "./Pricing";
import Testimonials from "./Testimonials";
import PlatformsStrip from "./PlatformsStrip";
import HowItWorks from "./HowItWorks";
import TickerTape from "./TickerTape";
import FAQ from "./FAQ";
import ScrollProgressBar from "./ScrollProgressBar";
import Hybridfooter from "./Hybridfooter";
import GridOverlay from "./GridOverlay";

import ChartSection from "./ChartSection";
import MarketSummary from "./MarketSummary";     // improved
import BlogSection from "./BlogSection";
import ShootingStars from "./ShootingStars";
import heroBg from "../assets/space-trading.png";

const BLUE = { 900:"#00072D", 800:"#051650", 700:"#0A2472", 600:"#123499", 500:"#1A43BF" };
const fadeUp = { hidden:{opacity:0,y:26}, show:{opacity:1,y:0,transition:{duration:.6,ease:"easeOut"}} };
const stagger = { hidden:{}, show:{transition:{staggerChildren:.12, delayChildren:.05}} };

export default function Hybridhome(){
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0,300], [1,0.965]);
  const ls    = useTransform(scrollY, [0,300], ["-0.02em","0em"]);
  const [yearly, setYearly] = useState(true);

  return (
    <div id="top" className="min-h-screen flex flex-col bg-black">
      <ScrollProgressBar />

      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-transparent">
  {/* Scrim + blur lives behind the content but keeps the image visible */}
  <div className="absolute inset-0 pointer-events-none supports-[backdrop-filter]:backdrop-blur-xl bg-black/10" />
  <div className="relative max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <span
        className="h-display text-[28px] font-bold tracking-tight"
        style={{ color: BLUE[500] }}
        aria-label="deprowebs"
      >
        deprowebs
      </span>
      
    </div>
    <div className="flex items-center gap-3">
      <button
        className="hidden sm:inline-flex px-5 py-2 rounded-xl font-semibold border-2 transition-colors duration-200 text-white"
        style={{ borderColor: BLUE[500], background: "transparent" }}
        onMouseEnter={(e)=>{ e.currentTarget.style.background = BLUE[500]; }}
        onMouseLeave={(e)=>{ e.currentTarget.style.background = "transparent"; }}
      >
        Login
      </button>
      <button className="inline-flex sm:hidden p-2 rounded-lg border border-white/20 text-white" aria-label="Open menu">
        <Menu size={22}/>
      </button>
    </div>
  </div>
</header>


<Hero bgImage={heroBg} onPrimary={()=>{}} onSecondary={()=>{}} />

     {/* Market Summary section */}
<section className="relative overflow-hidden">
  <div className="absolute inset-0 z-0 bg-black" />
  <div className="absolute inset-0 z-10 pointer-events-none opacity-80">
    {/* switch to realistic night sky + white meteors */}
    <ShootingStars theme="dark" sky="night" meteorTint="white" density={1} meteorEvery={3000} />
  </div>
  
  <div className="relative z-30">
    <MarketSummary demo theme="dark" />
  </div>
</section>

      {/* LIGHT: Platforms (dark grid on top) */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-white" />
        <div className="relative z-30"><PlatformsStrip /></div>
        <GridOverlay variant="dark" layer="above" density={32} speed={22} opacity={0.18} />
      </section>


      {/* DARK: How it works (white grid under content + micro-grid in cards) */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black" />
       <div className="absolute inset-0 z-10 pointer-events-none opacity-80">
    {/* switch to realistic night sky + white meteors */}
    <ShootingStars theme="dark" sky="night" meteorTint="white" density={1} meteorEvery={3000} />
  </div>
        <div className="relative z-30">
          <HowItWorks theme="dark" cardGrid="soft" animatedCardGrid />
        </div>
      </section>

      {/* DARK: Ticker */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black" />
        <GridOverlay variant="light" layer="under" density={32} speed={22} opacity={0.18} />
        <div className="relative z-30"><TickerTape /></div>
      </section>

      {/* LIGHT: Pricing */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-white" />
        <div className="relative z-30"><Pricing yearly={yearly} onToggle={()=>setYearly(v=>!v)} /></div>
        <GridOverlay variant="dark" layer="above" density={32} speed={22} opacity={0.18} />
      </section>


<section className="relative overflow-hidden">
  <div className="absolute inset-0 z-0 bg-black" />
  <div className="absolute inset-0 z-10 pointer-events-none opacity-80">
    {/* switch to realistic night sky + white meteors */}
    <ShootingStars theme="dark" sky="night" meteorTint="white" density={1} meteorEvery={3000} />
  </div>
  
  <div className="relative z-30">
    <ChartSection demo theme="dark" />
  </div>
</section>

    

 {/* ===== Blog (light) ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-white" />
        <div className="relative z-30">
          <BlogSection theme="light" />
        </div>
        <GridOverlay variant="dark" layer="above" density={32} speed={22} opacity={0.12} />
      </section>

      {/* DARK: Testimonials */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black" />
        <GridOverlay variant="light" layer="above" density={32} speed={22} opacity={0.22} />
        <div className="relative z-30"><Testimonials /></div>
      </section>

     

      {/* LIGHT: FAQ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-white" />
        <div className="relative z-30"><FAQ /></div>
        <GridOverlay variant="dark" layer="above" density={32} speed={22} opacity={0.12} />
      </section>

      <Hybridfooter />
    </div>
  );
}


// ------------------------------------------------------------
// styles: keep your existing palette + utilities.
// Optional micro-additions (if you want accessible-only text):
// .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
