import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import SceneShell from "../ui/SceneShell";
import { Reveal, SectionHead } from "../ui/Primitives";

/**
 * Scene 2 - the project context and its illustrative study area.
 */
export default function ProblemScene() {
  const reduced = useReducedMotion();

  return (
    <SceneShell
      id="about"
      className="section about section-anchor"
      index={1}
      total={11}
      label="THE PROBLEM"
      tone="cool"
    >
      <div className="wrap about-grid">
        <Reveal className="about-copy">
          <SectionHead
            eyebrow="02 / THE PROBLEM"
            title={
              <>
                From Pixels to
                <br />
                <em>Perspective.</em>
              </>
            }
          />
          <p className="body-copy">
            OrbitSRM is a deep learning-based satellite image super-resolution
            project developed for Smart India Hackathon 2026 problem statement{" "}
            <b>SIH26142</b>, submitted by the National Technical Research
            Organisation (NTRO).
          </p>
          <p className="body-copy">
            The project explores how models can estimate finer spatial details
            from medium-resolution imagery, with Sentinel-2 among the potential
            input sources. It is intended for satellite image analysis,
            geospatial visualization and research.
          </p>
          <div className="estimate-note">
            <span className="note-mark">i</span>
            <p>
              Enhanced details are model-generated estimates. They are not newly
              captured satellite measurements.
            </p>
          </div>
          <ResolutionBridge />
        </Reveal>
        <Reveal className="about-visual" delay={0.12}>
          <div className="terrain-window" data-cursor-label="EXPLORE">
            <div className="terrain-raster" />
            <div className="terrain-grid" />
            <svg
              className="terrain-lines"
              viewBox="0 0 600 440"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M-20 80C110 25 142 137 253 86S418 35 630 102M-10 143C115 81 182 186 281 140S450 91 616 160M-20 212C86 157 187 253 306 205s204-61 317-10M-10 288c124-73 206 38 334-13s172-51 291-4M-20 361c153-93 203 37 360-16s171-51 274-13" />
              <path d="M90-20c48 93 38 149 3 223s-29 149 26 265M198-20c38 92 31 167-6 245s-25 131 24 231M432-20c-39 93-23 160 14 231s24 146-22 254" />
            </svg>
            <motion.span
              className="terrain-pin"
              animate={reduced ? {} : { scale: [1, 1.14, 1] }}
              transition={{
                duration: reduced ? 0 : 2.7,
                repeat: reduced ? 0 : Infinity,
              }}
            >
              <i />
            </motion.span>
            <span className="terrain-meta terrain-meta-top">
              STUDY AREA / 01
              <br />
              <b>18Â° 55â€² 12â€³ N</b>
            </span>
            <span className="terrain-meta terrain-meta-bottom">
              ILLUSTRATIVE EARTH OBSERVATION VISUAL
            </span>
            <span className="terrain-coordinate">72Â° 49â€² E</span>
          </div>
          <div className="visual-caption">
            <span>Satellite imagery, with context.</span>
            <span>
              Illustrative visual <ArrowUpRight size={14} />
            </span>
          </div>
        </Reveal>
      </div>
    </SceneShell>
  );
}

function ResolutionBridge() {
  return (
    <div
      className="resolution-bridge"
      aria-label="Illustration of source pixels becoming finer model estimates"
    >
      <span className="bridge-heading">A CHANGE IN REPRESENTATION</span>
      <div className="bridge-flow">
        <div className="bridge-stage">
          <span>MEDIUM-RES SOURCE</span>
          <div className="pixel-grid coarse" aria-hidden="true">
            {Array.from({ length: 16 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
        </div>
        <motion.div
          className="bridge-arrow"
          aria-hidden="true"
          initial={{ opacity: 0.4, x: -3 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <ArrowRight size={16} />
        </motion.div>
        <div className="bridge-stage">
          <span>FINER ESTIMATE</span>
          <div className="pixel-grid fine" aria-hidden="true">
            {Array.from({ length: 64 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
        </div>
      </div>
      <small>Illustrative diagram Â· added detail is estimated</small>
    </div>
  );
}

