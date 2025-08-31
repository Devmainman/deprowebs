// src/HeroClassic.jsx — keeps your original copy + ReactTyped + RevealOnScroll, adds space/trading background
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ReactTyped } from "react-typed";
import RevealOnScroll from "./RevealOnScroll";
import { Play } from "lucide-react";

const BLUE = { 900:"#00072D", 800:"#051650", 700:"#0A2472", 600:"#123499", 500:"#1A43BF" };

export default function HeroClassic({
  bgImage = "/assets/hero/space-trading.jpg",
  onPrimary = () => {},
  onSecondary = () => {},
}){
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0,300], [1,0.965]);
  const ls    = useTransform(scrollY, [0,300], ["-0.02em","0em"]);
  const parallax = useTransform(scrollY, [0, 600], [0, -60]);

  const fadeUp = { hidden:{opacity:0,y:26}, show:{opacity:1,y:0,transition:{duration:.6,ease:"easeOut"}} };
  const stagger = { hidden:{}, show:{transition:{staggerChildren:.12, delayChildren:.05}} };

  return (
   <section className="relative text-white overflow-hidden pt-28 md:pt-32 min-h-[100vh] md:min-h-[115vh]" aria-label="Hero">
      {/* Brand-dark base */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-900 via-[#0b1743] to-black" />
    {/* Space/trading image (cinematic zoom + drift) */}
<div className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
  <motion.div
    // INNER layer actually animates
    className="absolute inset-0"
    style={{
      y: parallax,                       // parallax from scroll
      backgroundImage: `url(${bgImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      opacity: 0.42,
      transformOrigin: "50% 40%",        // slightly above center feels nicer
      willChange: "transform, background-position",
    }}
    initial={{ scale: 1, backgroundPosition: "center center" }}
    animate={{
      scale: [1, 1.08, 1.14, 1.08, 1],    // slow zoom in/out
      backgroundPosition: [
        "center 55%", "center 50%", "center 45%", "center 50%", "center 55%",
      ],                                  // gentle vertical drift
    }}
    transition={{
      duration: 30,                       // very slow = cinematic
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
</div>


      {/* top scrim for header contrast */}
<div
  className="absolute inset-x-0 top-0 h-40 z-10 pointer-events-none"
  style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0))" }}
/>

      {/* Blue glow + film grain to match your existing style */}
      <div className="absolute inset-0 z-10" style={{ background:"radial-gradient(600px 300px at 50% 30%, rgba(26,67,191,.25), transparent 60%)" }} />
      <div className="absolute inset-0 z-10 noise" />

      <div className="relative z-20 container mx-auto mt-20 px-6 pb-14">
        <RevealOnScroll variants={fadeUp}>
          <div className="text-center text-white/80 mb-4">Experience the future of trading</div>
        </RevealOnScroll>

        <RevealOnScroll variants={stagger} className="text-center">
          <motion.h1
            className="h-display text-5xl md:text-7xl font-bold leading-[0.95] mb-4"
            style={{ scale, letterSpacing: ls }}
          >
            Biggest<br/>Largest<br/>Profitable
          </motion.h1>

          <motion.p variants={fadeUp} className="mx-auto max-w-2xl text-white/80 text-lg md:text-xl mb-8">
            Widest range of products, markets, and platforms with{" "}
            <span className="font-semibold" style={{ color: BLUE[500] }}>24/7 support</span>.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="btn-shine px-8 py-4 rounded-2xl font-semibold text-lg"
                    style={{ background:`linear-gradient(135deg, ${BLUE[500]}, ${BLUE[600]})`, color:"#fff" }}
                    onClick={onPrimary}>
              Open Account
            </button>
            <button className="px-8 py-4 rounded-2xl font-semibold text-lg border"
                    style={{ borderColor:"rgba(255,255,255,0.2)", background:"rgba(255,255,255,0.06)" }}
                    onClick={onSecondary}>
              <span className="inline-flex items-center gap-2"><Play size={18}/> Watch Demo</span>
            </button>
          </motion.div>
        </RevealOnScroll>

        <RevealOnScroll variants={fadeUp} className="mt-8 text-center">
          <div className="text-white/90">
            Trading for{" "}
            <span style={{ color: BLUE[500] }}>
              <ReactTyped strings={["Anyone","Anywhere","Anytime"]} typeSpeed={70} backSpeed={40} backDelay={1500} loop />
            </span>
          </div>
        </RevealOnScroll>
      </div>

      {/* Soft fade to next section */}
      <div className="absolute inset-x-0 bottom-0 h-24 z-20" style={{background:"linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.6))"}} />
    </section>
  );
}

// USAGE: in Hybridhome.jsx, replace ONLY the hero <section> with:
// <HeroClassic bgImage="/assets/hero/space-trading.jpg" onPrimary={()=>{}} onSecondary={()=>{}} />
