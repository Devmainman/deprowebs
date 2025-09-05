import { motion, useAnimationFrame } from "framer-motion";
import { useRef } from "react";
import RevealOnScroll from "./RevealOnScroll";

const ITEMS = [
  { q: "Execution is lightning fast. Love the UI.", a: "Amaka O." },
  { q: "Best platform for indices 24/7.", a: "Kenny A." },
  { q: "Support is actually helpful. Wild.", a: "Rita K." },
  { q: "Charts + tools are chef’s kiss.", a: "Ibrahim S." },
];

export default function Testimonials() {
  const base = [...ITEMS, ...ITEMS];
  const ref = useRef(null);

  useAnimationFrame(() => {
    const el = ref.current; if (!el) return;
    el.scrollLeft += 0.5; // speed
    if (el.scrollLeft >= el.scrollWidth / 2) el.scrollLeft = 0;
  });

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      <div className="container mx-auto px-6">
        <RevealOnScroll variants={{hidden:{opacity:0,y:26},show:{opacity:1,y:0,transition:{duration:.6}}}}>
          <h2 className="h-display text-4xl md:text-5xl font-bold text-white mb-10">Loved by traders</h2>
        </RevealOnScroll>
      </div>

     <div
  ref={ref}
  className="no-scrollbar flex gap-6 overflow-x-auto px-6"
  style={{ scrollBehavior: "auto" }}
>
  {base.map((t,i)=>(
    <motion.div key={i} whileHover={{ y:-6 }}
      className="min-w-[320px] max-w-[360px] rounded-3xl p-6 border"
      style={{ background:"rgba(255,255,255,0.04)", borderColor:"rgba(255,255,255,0.1)" }}
    >
      <p className="text-white/90 text-lg mb-4">&ldquo;{t.q}&rdquo;</p>
      <p className="text-white/60 text-sm">— {t.a}</p>
    </motion.div>
  ))}
</div>

    </section>
  );
}
