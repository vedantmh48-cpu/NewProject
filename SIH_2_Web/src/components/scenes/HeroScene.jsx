import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Download } from "lucide-react";
import SceneShell from "../ui/SceneShell";
import { MagneticLink } from "../ui/Primitives";

const words = ["See", "beyond", "the", "resolution."];

/**
 * Scene 1 - the Earth. The globe rotates on the GPU and the whole scene is
 * scroll-linked, so the camera appears to fall towards the surface as the
 * visitor moves into scene 2.
 */
export default function HeroScene() {
  const heroRef = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const copyY = useTransform(scrollYProgress, [0, 1], [0, -56]);
  const copyOpacity = useTransform(scrollYProgress, [0.45, 0.95], [1, 0.15]);

  return (
    <SceneShell
      id="home"
      sectionRef={heroRef}
      className="hero section-anchor"
      index={0}
      total={11}
      label="OVERVIEW"
      bare
    >
      <div className="hero-orb hero-orb-one" />
      <div className="hero-orb hero-orb-two" />
      <div className="wrap hero-layout hero-layout-copy-only">
        <motion.div
          className="hero-copy"
          style={reduced ? undefined : { y: copyY, opacity: copyOpacity }}
        >
          <motion.div
            className="eyebrow hero-kicker"
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.55 }}
          >
            <span className="eyebrow-dot" /> EARTH OBSERVATION / MISSION PREVIEW
          </motion.div>
          <h1 aria-label="See beyond the resolution.">
            {words.map((word, index) => (
              <motion.span
                className={`title-word ${index === words.length - 1 ? "title-word-last" : ""}`}
                key={word + index}
                initial={reduced ? false : { opacity: 0, y: 32, rotateX: -18 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: reduced ? 0 : 0.65,
                  delay: reduced ? 0 : 0.08 + index * 0.07,
                  ease: [0.2, 0.75, 0.25, 1],
                }}
              >
                {word}
                {index < words.length - 1 ? " " : ""}
              </motion.span>
            ))}
          </h1>
          <motion.p
            className="hero-lede"
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 0.64, duration: reduced ? 0 : 0.65 }}
          >
            Explore how OrbitSRM proposes to estimate finer spatial detail from medium-resolution satellite imagery through deep learning-based super-resolution.
          </motion.p>
          <motion.div
            className="hero-actions"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 0.78, duration: reduced ? 0 : 0.55 }}
          >
            <MagneticLink
              className="button button-primary"
              href="#download"
              data-cursor-label="DOWNLOAD"
              data-magnet="0.22"
            >
              <Download size={16} /> Download
            </MagneticLink>
            <a className="button button-secondary" href="#features" data-magnet="0.14" data-cursor-label="FEATURES">
              Explore Features <ArrowUpRight size={15} />
            </a>
            <a className="text-link" href="#technology" data-magnet="0.14" data-cursor-label="TECHNOLOGY">
              Discover the technology <ArrowDownRight size={16} />
            </a>
          </motion.div>
          <motion.div
            className="hero-footnote"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduced ? 0 : 1.1, duration: reduced ? 0 : 0.3 }}
          >
            <span>SIH 2026</span>
            <i /> <span>Problem statement SIH26142</span>
          </motion.div>
          <div className="hero-scope-strip" aria-label="Project overview">
            <div><span>INPUT</span><b>Satellite imagery</b></div>
            <div><span>APPROACH</span><b>Deep-learning estimates</b></div>
            <div><span>STATUS</span><b>Research preview</b></div>
          </div>
        </motion.div>
      </div>
      <a className="scroll-cue" href="#about" data-cursor-label="SCROLL">
        <span>SCROLL TO EXPLORE</span>
        <span className="scroll-line"><i /></span>
      </a>
    </SceneShell>
  );
}
