// src/Hybridhome.jsx
import React, { useState } from "react";

import Hero from "./Hero";               // ⬅ swap to "./Hero" if using your old hero
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
import MarketSummary from "./MarketSummary";
import ShootingStars from "./ShootingStars";
import heroBg from "../assets/space-trading.png";

import BackgroundFX from "./BackgroundFX";



import Sidebar, { SidebarProvider, SidebarTrigger } from "./Sidebar";
import TopNav from "./TopNav";

import {
  KPIStatsStrip,
  SessionClocks,
  TopMoversHeatmap,
  SpreadsPanel,
  EconomicCalendarLite,
  StrategyIdeas,
  RiskDisclosureBar,
  TradingLifeBundle, // optional convenience
} from "./TradingSections";


export default function Hybridhome() {
  const [yearly, setYearly] = useState(true);

  // keep links in-sync with section IDs below
  const sidebarLinks = [
    { label: "Markets", href: "#markets", kicker: "Forex · Crypto" },
    { label: "Platforms", href: "#platforms", kicker: "Web · Mobile" },
    { label: "How it works", href: "#how", kicker: "Overview" },
    { label: "FAQ", href: "#faq", kicker: "Answers" },
    // Add back if you re-enable Pricing section:
    // { label: "Pricing", href: "#pricing", kicker: "Transparent" },
  ];

  return (
    <SidebarProvider>
      <div id="top" className="min-h-screen flex flex-col bg-black">
       <ScrollProgressBar />
      <TopNav brand="deprowebs" /* logoSrc="/assets/logo.svg" if you have one */ />


        {/* Hero */}
        <Hero bgImage={heroBg} onPrimary={() => {}} onSecondary={() => {}} />

   <section className="relative overflow-hidden">
  <BackgroundFX variant="conic-orb" speed={90} intensity={0.4} />
  <div className="relative z-30 space-y-6 py-6">
    <KPIStatsStrip />
    <SessionClocks />
  </div>
</section>



<section id="markets" className="relative overflow-hidden bg-white">
  <BackgroundFX variant="diagonal-sweep" theme="light" intensity={0.14} speed={34} />
  <div className="relative z-30 space-y-6">
    <MarketSummary demo theme="light" withBackground={false} />
  </div>
  <GridOverlay variant="dark" layer="above" density={32} speed={22} opacity={0.08} />
</section>

     <section id="how" className="relative overflow-hidden">
  <BackgroundFX variant="radial-aurora" speed={70} intensity={0.35} />
  <div className="absolute inset-0 z-10 pointer-events-none opacity-80">
    <ShootingStars theme="dark" sky="night" meteorTint="white" density={1} meteorEvery={3000} />
  </div>
  <div className="relative z-30">
    <HowItWorks theme="dark" cardGrid="soft" animatedCardGrid />
  </div>
</section>





        <section id="platforms" className="relative overflow-hidden">
  <BackgroundFX variant="diagonal-sweep" theme="light" intensity={0.18} speed={40} />
  <div className="relative z-30"><PlatformsStrip /></div>
  <GridOverlay variant="dark" layer="above" density={32} speed={22} opacity={0.18} />
</section>


 


   <section className="relative overflow-hidden">
  <BackgroundFX variant="diagonal-sweep" speed={50} intensity={0.28} />
  <div className="relative z-30 py-6">
    <SpreadsPanel />
  </div>
</section>


       <section className="relative overflow-hidden">
  <BackgroundFX variant="ring" speed={30} intensity={0.35} />
  <GridOverlay variant="light" layer="under" density={32} speed={22} opacity={0.18} />
  <div className="relative z-30"><TickerTape /></div>
</section>






        {/* ===== Pricing (light) — disabled for now ===== */}
        {false && (
          <section id="pricing" className="relative overflow-hidden">
            <div className="absolute inset-0 z-0 bg-white" />
            <div className="relative z-30">
              <Pricing yearly={yearly} onToggle={() => setYearly(v => !v)} />
            </div>
            <GridOverlay variant="dark" layer="above" density={32} speed={22} opacity={0.18} />
          </section>
        )}


<section className="relative overflow-hidden bg-white">
  {/* You can rely on ChartSection’s internal BG (withBackground=true), or set withBackground={false}
      and put <BackgroundFX ... /> here if you prefer section-level control like MarketSummary */}
  <ChartSection theme="light" withBackground={true} />
</section>

 <section className="relative overflow-hidden">
  <BackgroundFX variant="radial-aurora" speed={80} intensity={0.3} />
  <div className="relative z-30 space-y-6 py-6">
    <EconomicCalendarLite />
    <StrategyIdeas />
  </div>
</section>



       <section className="relative overflow-hidden">
  <BackgroundFX variant="grid-pulse" speed={55} intensity={0.3} />
  <GridOverlay variant="light" layer="above" density={32} speed={22} opacity={0.22} />
  <div className="relative z-30"><Testimonials /></div>
</section>


    <section id="faq" className="relative overflow-hidden">
  <BackgroundFX variant="diagonal-sweep" theme="light" intensity={0.14} speed={36} />
  <div className="relative z-30"><FAQ /></div>
  <GridOverlay variant="dark" layer="above" density={32} speed={22} opacity={0.12} />
</section>



<section className="relative overflow-hidden">
  <BackgroundFX variant="noise-glow" intensity={0.35} />
  <div className="relative z-30 py-6">
    <RiskDisclosureBar />
  </div>
</section>


        <Hybridfooter />

        {/* Mount the sidebar last so it overlays everything */}
        <Sidebar links={sidebarLinks} />
      </div>
    </SidebarProvider>
  );
}
