import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { ArrowDown } from "lucide-react";

export function PageProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="page-progress"
      style={{ scaleX: scrollYProgress }}
      aria-hidden="true"
    />
  );
}

export function BackToTop() {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => setVisible(value > 650));

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          className="back-to-top"
          href="#home"
          aria-label="Back to top"
          data-cursor-label="TOP"
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
          transition={{ duration: reduced ? 0 : 0.2 }}
        >
          <ArrowDown className="back-to-top-icon" size={17} />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
