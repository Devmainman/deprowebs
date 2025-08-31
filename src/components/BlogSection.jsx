import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const VARS = {
  item: { hidden:{opacity:0, y:16}, show:{opacity:1, y:0, transition:{duration:.4}} },
  grid: { hidden:{}, show:{ transition:{ staggerChildren:.08, delayChildren:.1 } } }
};

export default function BlogSection({ posts = [] , theme="light" }) {
  const textDim = theme === "dark" ? "text-white/70" : "text-black/60";
  const borderCol = theme === "dark" ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.08)";
  const cardBg = theme === "dark" ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.03)";

  const demo = posts.length ? posts : [
    { id:1, title:"5 common mistakes new traders make", tag:"Education", time:"6 min", img:null },
    { id:2, title:"How to build a rules-based strategy", tag:"Strategy", time:"8 min", img:null },
    { id:3, title:"Risk management that actually works", tag:"Risk", time:"7 min", img:null },
  ];

  return (
    <section className={`${theme === "dark" ? "bg-black text-white" : "bg-white text-black"} py-16 relative overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h3 className="h-display text-3xl font-bold">From the blog</h3>
            <p className={`mt-1 ${textDim}`}>Insights, tutorials, and market ideas from our team.</p>
          </div>
          <a href="#" className="inline-flex items-center gap-2 text-sm font-semibold hover:opacity-80">
            View all <ArrowRight size={16}/>
          </a>
        </div>

        <motion.div variants={VARS.grid} initial="hidden" whileInView="show" viewport={{ once:false, amount:.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demo.map((p, i) => (
            <motion.a
              key={p.id}
              variants={VARS.item}
              href="#"
              className="group rounded-2xl border overflow-hidden block"
              style={{ borderColor: borderCol, background: cardBg }}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type:"spring", stiffness: 380, damping: 28 }}
            >
              {/* Header image placeholder with shimmer line */}
              <div className="h-40 relative overflow-hidden">
                <div className={`absolute inset-0 ${theme === "dark" ? "bg-white/5" : "bg-black/5"}`} />
                <motion.div
                  className="absolute -inset-x-10 -top-10 h-16 opacity-20 blur-xl"
                  style={{ background: "linear-gradient(90deg, transparent, #1A43BF, transparent)" }}
                  animate={{ x: ["-30%","130%"] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              {/* Body */}
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-semibold">{p.tag}</span>
                  <span className={textDim}>{p.time} read</span>
                </div>
                <div className="h-display text-lg mt-2 leading-snug group-hover:underline underline-offset-4">
                  {p.title}
                </div>
                <div className={`text-sm mt-2 ${textDim}`}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Learn key ideas to level up.
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
