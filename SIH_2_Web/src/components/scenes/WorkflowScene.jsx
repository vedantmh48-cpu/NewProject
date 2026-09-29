import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { ArrowRight, Check, Cpu, Download, Globe2, Layers3, Satellite } from "lucide-react";
import SceneShell from "../ui/SceneShell";
import { Reveal, SectionHead } from "../ui/Primitives";
import { workflow } from "../../data/siteConfig";

const ICONS = [Satellite, Layers3, Cpu, Globe2, Check, Download];

/**
 * Hints reuse wording that already exists elsewhere on the site (capability
 * descriptions and the Sentinel-2 note) instead of inventing new claims.
 */
const HINTS = [
  "Sentinel-2 Â· potential source",
  "Prepare raster imagery for a consistent workflow",
  "Estimate finer spatial detail",
  "Explore layers in a map-oriented workspace",
  "Review image quality measures",
  "Prepare georeferenced outputs",
];

/**
 * Scene 6 - how it works. A scroll-linked sequence: the progress line and the
 * active stage follow the visitor through the proposed pipeline.
 */
export default function WorkflowScene() {
  const rowRef = useRef(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start 82%", "end 58%"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(
      workflow.length - 1,
      Math.max(0, Math.floor(value * workflow.length)),
    );
    setActive((current) => (current === next ? current : next));
  });

  return (
    <SceneShell
      id="workflow"
      className="section workflow section-anchor"
      index={5}
      total={11}
      label="HOW IT WORKS"
      tone="cool"
    >
      <div className="wrap">
        <SectionHead
          eyebrow="06 / HOW IT WORKS"
          title="From imagery to a geospatial result."
          description="A proposed sequence for preparing, reconstructing, evaluating and exporting satellite imagery."
          align="center"
        />
        <div className="workflow-board" ref={rowRef}>
          <div className="workflow-track" aria-hidden="true">
            <motion.i
              style={reduced ? { scaleX: 1 } : { scaleX: scrollYProgress }}
            />
          </div>
          <div className="workflow-row">
            {workflow.map((step, index) => {
              const Icon = ICONS[index];
              const state =
                index === active ? "active" : index < active ? "done" : "idle";
              return (
                <Reveal
                  as="article"
                  className="workflow-step"
                  key={step}
                  delay={index * 0.07}
                  data-state={state}
                >
                  <span className="step-number">0{index + 1}</span>
                  <span className="step-icon">
                    <Icon size={19} strokeWidth={1.5} />
                  </span>
                  <p>{step}</p>
                  <small className="step-hint">{HINTS[index]}</small>
                  {index < workflow.length - 1 && (
                    <ArrowRight className="step-arrow" size={15} />
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
        <Reveal className="workflow-note">
          <i /> Stages reflect the project proposal. Availability of each stage
          will be confirmed with the first release.
        </Reveal>
      </div>
    </SceneShell>
  );
}
