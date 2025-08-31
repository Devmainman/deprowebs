import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

export default function RevealOnScroll({ children, variants, amount = 0.4, className = "" }) {
  const ref = useRef(null);
  const controls = useAnimation();
  const inView = useInView(ref, { amount });

  useEffect(() => {
    if (inView) controls.start("show");
    else controls.start("hidden"); // <- resets when you scroll away
  }, [inView, controls]);

  return (
    <motion.div ref={ref} className={className} variants={variants} initial="hidden" animate={controls}>
      {children}
    </motion.div>
  );
}
