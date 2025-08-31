import { motion, useScroll, useTransform } from "framer-motion";

export default function GridFX() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, -100]);
  const opacity = useTransform(scrollY, [0, 800], [0.35, 0.15]);

  return <motion.div className="pointer-events-none absolute inset-0 bg-grid-animate" style={{ y, opacity }} />;
}
