import { motion, useReducedMotion } from "framer-motion";
import { scenes } from "../data/journey";

/**
 * Scene rail: a restrained control-panel element that shows the position in
 * the journey and jumps between scenes. Rendered as real links so it is
 * keyboard accessible; purely decorative detail is aria-hidden.
 */
export default function JourneyRail({ activeScene = "home" }) {
  const reduced = useReducedMotion();
  const activeIndex = Math.max(
    0,
    scenes.findIndex((scene) => scene.id === activeScene),
  );
  const progress = (activeIndex + 1) / scenes.length;

  return (
    <nav className="journey-rail" aria-label="Scene navigation">
      <span className="journey-track" aria-hidden="true">
        <motion.i
          animate={{ scaleY: progress }}
          transition={{ duration: reduced ? 0 : 0.5, ease: "easeOut" }}
        />
      </span>
      <ul>
        {scenes.map((scene, index) => {
          const isActive = index === activeIndex;
          return (
            <li key={scene.id}>
              <a
                href={`#${scene.id}`}
                className={isActive ? "is-active" : ""}
                aria-current={isActive ? "true" : undefined}
                aria-label={`Scene ${index + 1}: ${scene.label}`}
                data-cursor-label={scene.label.toUpperCase()}
                data-magnet="0.1"
              >
                <span className="rail-num">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="rail-tick" aria-hidden="true" />
                <span className="rail-label">{scene.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
