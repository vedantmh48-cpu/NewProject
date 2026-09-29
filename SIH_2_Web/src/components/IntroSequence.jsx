import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Satellite } from "lucide-react";
import { siteConfig } from "../data/siteConfig";

const HOLD_MS = 1050;

/**
 * Brief cinematic opening. It self-dismisses in about a second, can always be
 * skipped with a click or the skip button, is skipped for reduced-motion users
 * and only plays once per browser session.
 */
export default function IntroSequence() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const timers = useRef([]);

  useEffect(() => {
    if (reduced) return undefined;
    try {
      if (sessionStorage.getItem("terrasrm-intro-seen")) return undefined;
      sessionStorage.setItem("terrasrm-intro-seen", "true");
    } catch {
      // The intro stays skippable when storage is unavailable.
    }
    const open = window.setTimeout(() => setVisible(true), 20);
    const close = window.setTimeout(() => setVisible(false), HOLD_MS);
    timers.current = [open, close];
    return () => timers.current.forEach((id) => window.clearTimeout(id));
  }, [reduced]);

  function skip() {
    timers.current.forEach((id) => window.clearTimeout(id));
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="cinematic-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.32 }}
          onClick={skip}
        >
          <motion.div
            className="intro-orbit"
            initial={{ rotate: -34, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: reduced ? 0 : 0.7 }}
            aria-hidden="true"
          >
            <svg viewBox="0 0 220 220">
              <motion.circle
                cx="110"
                cy="110"
                r="76"
                fill="none"
                stroke="currentColor"
                strokeWidth=".8"
                strokeDasharray="4 6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: reduced ? 0 : 0.8, ease: "easeInOut" }}
              />
              <motion.path
                d="M23 111c25-43 56-48 87-10s58 44 87 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: reduced ? 0 : 0.75,
                  delay: reduced ? 0 : 0.12,
                }}
              />
            </svg>
            <span>
              <Satellite size={17} />
            </span>
          </motion.div>
          <motion.div
            className="intro-copy"
            initial={{ opacity: 0, y: 9 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduced ? 0 : 0.45,
              delay: reduced ? 0 : 0.18,
            }}
          >
            <small>EARTH OBSERVATION / SIH 2026</small>
            <b>{siteConfig.name}</b>
            <span>A new perspective on Earth.</span>
          </motion.div>
          <span className="intro-track" aria-hidden="true">
            <motion.i
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: reduced ? 0 : HOLD_MS / 1000, ease: "linear" }}
            />
          </span>
          <button
            className="intro-skip"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              skip();
            }}
          >
            Skip intro <ArrowRight size={13} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
