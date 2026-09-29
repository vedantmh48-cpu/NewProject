import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

const INTERACTIVE_SELECTOR =
  "a, button, input, [data-cursor-label], [data-cursor]";

/**
 * Refined desktop cursor: precise inner dot, trailing outer ring, magnetic
 * pull towards controls that opt in with `data-magnet`, and a context label.
 * Never rendered on touch devices and never blocks pointer events.
 */
export default function CustomCursor() {
  const reduced = useReducedMotion();
  const [available, setAvailable] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [label, setLabel] = useState("");
  const [variant, setVariant] = useState("idle");
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const magnetX = useMotionValue(0);
  const magnetY = useMotionValue(0);
  const ringX = useSpring(x, { stiffness: 210, damping: 24, mass: 0.28 });
  const ringY = useSpring(y, { stiffness: 210, damping: 24, mass: 0.28 });
  const magnetSpringX = useSpring(magnetX, {
    stiffness: 170,
    damping: 20,
    mass: 0.3,
  });
  const magnetSpringY = useSpring(magnetY, {
    stiffness: 170,
    damping: 20,
    mass: 0.3,
  });
  const auraX = useTransform(
    [ringX, magnetSpringX],
    ([ring, magnet]) => ring + magnet,
  );
  const auraY = useTransform(
    [ringY, magnetSpringY],
    ([ring, magnet]) => ring + magnet,
  );

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setAvailable(media.matches && !reduced);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, [reduced]);

  useEffect(() => {
    if (!available) return undefined;
    document.documentElement.classList.add("has-custom-cursor");

    const move = (event) => {
      x.set(event.clientX);
      y.set(event.clientY);

      const target =
        event.target instanceof Element
          ? event.target.closest(INTERACTIVE_SELECTOR)
          : null;

      setLabel(target?.getAttribute("data-cursor-label") || "");
      setHovered(Boolean(target));
      setVariant(target?.getAttribute("data-cursor") || "idle");

      const magnet = target?.getAttribute("data-magnet");
      if (magnet && target) {
        const strength = Number(magnet) || 0.22;
        const rect = target.getBoundingClientRect();
        magnetX.set(
          Math.max(
            -16,
            Math.min(16, (rect.left + rect.width / 2 - event.clientX) * strength),
          ),
        );
        magnetY.set(
          Math.max(
            -16,
            Math.min(16, (rect.top + rect.height / 2 - event.clientY) * strength),
          ),
        );
      } else {
        magnetX.set(0);
        magnetY.set(0);
      }
    };

    const leave = () => {
      x.set(-200);
      y.set(-200);
      magnetX.set(0);
      magnetY.set(0);
      setHovered(false);
      setLabel("");
      setVariant("idle");
    };

    const onKeyDown = (event) => {
      if (event.key === "Tab") setHovered(true);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    document.addEventListener("blur", leave);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", move);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("blur", leave);
      window.removeEventListener("keydown", onKeyDown);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [available, magnetX, magnetY, x, y]);

  if (!available) return null;

  return (
    <div className="cursor-layer" aria-hidden="true">
      <motion.span
        className={`cursor-aura ${hovered ? "is-hovered" : ""} variant-${variant}`}
        style={{ x: auraX, y: auraY }}
      />
      <motion.span
        className={`cursor-dot ${hovered ? "is-hovered" : ""} variant-${variant}`}
        style={{ x, y }}
      />
      <AnimatePresence>
        {label && (
          <motion.span
            className="cursor-label"
            style={{ x: auraX, y: auraY }}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: reduced ? 0 : 0.16 }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
