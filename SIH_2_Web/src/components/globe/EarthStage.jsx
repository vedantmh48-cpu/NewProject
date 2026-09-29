import { useCallback, useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Satellite } from "lucide-react";
import GlobeCanvas from "./GlobeCanvas";
import GlobeFallback from "./GlobeFallback";
import { useWebGLAvailable } from "../../lib/hooks";

/**
 * Scene 1 globe composition: atmosphere, orbit annotations, live procedural
 * globe, orbital markers and telemetry readouts. Everything visual here is
 * labelled as illustrative in the surrounding copy.
 */
export default function EarthStage({ interactive = false }) {
  const reduced = useReducedMotion();
  const webgl = useWebGLAvailable();
  const [unsupported, setUnsupported] = useState(false);
  const [quality, setQuality] = useState(1);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateY = useSpring(useTransform(pointerX, [-1, 1], [-4, 4]), {
    stiffness: 90,
    damping: 22,
  });
  const rotateX = useSpring(useTransform(pointerY, [-1, 1], [3, -3]), {
    stiffness: 90,
    damping: 22,
  });

  const handleUnsupported = useCallback(() => setUnsupported(true), []);

  useEffect(() => {
    const cores = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory ?? 4;
    if (cores <= 3 || memory <= 2) setQuality(0.4);
  }, []);

  function parallax(event) {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * 2);
    pointerY.set(((event.clientY - rect.top) / rect.height - 0.5) * 2);
  }

  const live = webgl && !unsupported;

  return (
    <div
      className="earth-stage"
      onPointerMove={interactive ? parallax : undefined}
      onPointerLeave={
        interactive
          ? () => {
              pointerX.set(0);
              pointerY.set(0);
            }
          : undefined
      }
    >
      <div className="earth-halo" />
      <div className="earth-rings" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <motion.div
        className="earth-system"
        style={reduced || !interactive ? {} : { rotateX, rotateY }}
      >
        <div className="earth-orbit orbit-one" />
        <div className="earth-orbit orbit-two" />
        <div className={`earth-ball ${live ? "is-webgl" : "is-fallback"}`} data-live={live ? "true" : "false"}>
          <GlobeFallback spin={!live} />
          {live ? (
            <GlobeCanvas
              className="globe-layer"
              onUnsupported={handleUnsupported}
              reducedMotion={Boolean(reduced)}
              detail={quality}
            />
          ) : null}
        </div>
        <motion.span
          className="earth-satellite satellite-a"
          animate={reduced ? {} : { y: [0, -7, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Satellite size={22} />
        </motion.span>
        <span className="earth-marker marker-a">
          <i /> 18° 55′ N
        </span>
        <span className="earth-marker marker-b">
          <i /> ORBITAL / 01
        </span>
        <span className="earth-data data-a">
          73.2401° E<br />
          OBSERVATION WINDOW
        </span>
        <span className="earth-data data-b">
          PROCEDURAL RENDER
          <br />
          NOT SATELLITE DATA
        </span>
      </motion.div>
      <motion.div
        className="earth-caption"
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduced ? 0 : 0.8, duration: reduced ? 0 : 0.7 }}
      >
        <span className="caption-dot" />{" "}
        {live ? "Procedural globe · illustrative" : "Illustrative globe"} · a
        new perspective on our planet
      </motion.div>
    </div>
  );
}
