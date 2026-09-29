import { useReducedMotion } from "framer-motion";
import { Cpu, Layers3, Satellite } from "lucide-react";
import SceneShell from "../ui/SceneShell";
import { Reveal, SectionHead } from "../ui/Primitives";

const stages = [
  {
    number: "01",
    title: "Satellite Input",
    detail: "Medium-resolution imagery enters the proposed workflow.",
    tag: "INPUT / RASTER",
    Icon: Satellite,
    className: "mission-input",
  },
  {
    number: "02",
    title: "AI Reconstruction",
    detail: "A planned deep learning model estimates finer spatial detail.",
    tag: "PROCESS / PROPOSED",
    Icon: Cpu,
    className: "mission-process",
  },
  {
    number: "03",
    title: "Enhanced Output",
    detail: "Review an estimated image alongside geospatial context.",
    tag: "OUTPUT / ESTIMATE",
    Icon: Layers3,
    className: "mission-output",
  },
];

export default function MissionScene() {
  const reduced = useReducedMotion();

  return (
    <SceneShell
      id="mission"
      className="section mission-scene section-anchor"
      index={2}
      total={11}
      label="AI MISSION"
      tone="bright"
    >
      <div className="wrap">
        <SectionHead
          eyebrow="03 / INSIDE THE MISSION"
          title="Inside the AI Mission."
          description="A conceptual view of the proposed OrbitSRM process, from satellite input to model-estimated detail."
          align="center"
        />

        <div className="mission-flow" aria-label="Illustrative OrbitSRM process">
          <div className="mission-flow-line" aria-hidden="true">
            {!reduced && <i />}
          </div>
          {stages.map(({ number, title, detail, tag, Icon, className }, index) => (
            <Reveal
              as="article"
              className={`mission-stage ${className}`}
              key={number}
              delay={index * 0.12}
            >
              <div className="mission-stage-visual">
                <span className="mission-coordinate" aria-hidden="true">
                  {index === 0 ? "18Â° 55â€² N" : index === 2 ? "72Â° 49â€² E" : "MODEL / CONCEPT"}
                </span>
                {index === 1 ? (
                  <div className="mission-reactor" aria-hidden="true">
                    <i className="reactor-orbit reactor-orbit-a" />
                    <i className="reactor-orbit reactor-orbit-b" />
                    <span className="reactor-core"><Icon size={27} strokeWidth={1.5} /></span>
                    <i className="reactor-node reactor-node-a" />
                    <i className="reactor-node reactor-node-b" />
                    <i className="reactor-node reactor-node-c" />
                  </div>
                ) : (
                  <div className={`mission-raster ${index === 0 ? "raster-source" : "raster-estimate"}`} aria-hidden="true">
                    <i /><i /><i /><i /><i /><i /><i /><i /><i />
                    <span className="raster-focus" />
                  </div>
                )}
                <span className="mission-visual-icon"><Icon size={15} /></span>
              </div>
              <div className="mission-stage-copy">
                <span className="mission-stage-tag">{number} / {tag}</span>
                <h3>{title}</h3>
                <p>{detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mission-disclaimer">
          <span /> Illustrative process visualization. OrbitSRM model processing and outputs are not available in this preview.
        </p>
      </div>
    </SceneShell>
  );
}
