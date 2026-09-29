import { useCallback, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Shared frame for every scroll scene.
 *
 * Adds the scene index annotation, an atmospheric depth layer and an optional
 * scroll-linked parallax offset without changing the underlying section
 * classes, so the established layout rules keep applying.
 */
export default function SceneShell({
  id,
  className = "section",
  index = 0,
  total = 9,
  label = "",
  tone = "plain",
  drift = 28,
  bare = false,
  sectionRef,
  children,
}) {
  const localRef = useRef(null);
  const reduced = useReducedMotion();

  const attachRef = useCallback(
    (node) => {
      localRef.current = node;
      if (typeof sectionRef === "function") sectionRef(node);
      else if (sectionRef) sectionRef.current = node;
    },
    [sectionRef],
  );

  const { scrollYProgress } = useScroll({
    target: localRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [drift, -drift]);
  const gridY = useTransform(scrollYProgress, [0, 1], [drift * 0.5, -drift * 0.5]);

  const sceneNumber = String(index + 1).padStart(2, "0");

  return (
    <section
      id={id}
      ref={attachRef}
      className={`scene ${className}`}
      data-scene-index={index}
      data-scene-tone={tone}
    >
      {tone !== "plain" && (
        <div className="scene-atmosphere" aria-hidden="true">
          <motion.div className="scene-glow" style={reduced ? undefined : { y }} />
          <motion.div
            className="scene-grid"
            style={reduced ? undefined : { y: gridY }}
          />
        </div>
      )}
      <div className="scene-marker" aria-hidden="true">
        <span className="scene-marker-count">{sceneNumber}</span>
        <span className="scene-marker-total">
          / {String(total).padStart(2, "0")}
        </span>
        {label && <span className="scene-marker-label">{label}</span>}
      </div>
      {bare ? (
        children
      ) : (
        <div className="scene-content">{children}</div>
      )}
    </section>
  );
}
