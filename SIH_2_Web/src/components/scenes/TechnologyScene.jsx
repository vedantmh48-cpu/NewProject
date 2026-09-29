import {
  ArrowRight,
  Check,
  Code2,
  Cpu,
  Globe2,
  Layers3,
  Satellite,
} from "lucide-react";
import SceneShell from "../ui/SceneShell";
import { Reveal, SectionHead } from "../ui/Primitives";
import { technologies } from "../../data/siteConfig";

/**
 * Grouping of the existing technology list. Status text is read from
 * siteConfig so the "Planned" / "Website" labelling stays single-sourced.
 */
const STACK = [
  {
    group: "Experience layer",
    caption: "The project website and planned analysis workspace.",
    icon: Code2,
    items: ["React"],
  },
  {
    group: "Model layer",
    caption: "Planned deep-learning tools for image enhancement.",
    icon: Cpu,
    items: ["Python", "PyTorch"],
  },
  {
    group: "Service layer",
    caption: "Planned application programming interface.",
    icon: Layers3,
    items: ["FastAPI"],
  },
  {
    group: "Geospatial layer",
    caption: "Planned raster processing and map visualization.",
    icon: Globe2,
    items: ["GDAL", "Rasterio", "MapLibre GL JS"],
  },
];

function statusOf(name) {
  const match = technologies.find((technology) => technology.name === name);
  return match ? match.status : "Planned";
}

/**
 * Scene 7 - an honest view of the current and planned application stack.
 */
export default function TechnologyScene() {
  return (
    <SceneShell
      id="technology"
      className="section technology section-anchor"
      index={6}
      total={11}
      label="TECHNOLOGY"
      tone="bright"
    >
      <div className="wrap technology-layout">
        <div className="technology-heading">
          <SectionHead
            eyebrow="07 / TECHNOLOGY"
            title={
              <>
                A clear stack.
                <br />
                <em>Built for Earth data.</em>
              </>
            }
            description="A transparent view of the tools behind OrbitSRM. Only React currently powers this website; all application technologies remain planned."
          />
          <div className="technology-legend" aria-label="Technology status key">
            <span><i className="is-current" /> In use</span>
            <span><i /> Planned</span>
          </div>
        </div>
      </div>

      <div className="wrap tech-architecture">
        {STACK.map((layer, index) => (
          <Reveal
            as="article"
            className="tech-layer"
            key={layer.group}
            delay={index * 0.05}
          >
            <span className="tech-layer-topline">
              <span className="tech-layer-index">0{index + 1}</span>
              <layer.icon size={19} strokeWidth={1.6} aria-hidden="true" />
            </span>
            <h3>{layer.group}</h3>
            <p>{layer.caption}</p>
            <div className="tech-layer-items">
              {layer.items.map((item) => (
                <span key={item} className="tech-chip">
                  {item}
                  <em
                    className={
                      statusOf(item) === "Website" ? "is-current" : undefined
                    }
                  >
                    {statusOf(item) === "Website" && <Check size={11} />}
                    {statusOf(item)}
                  </em>
                </span>
              ))}
            </div>
            {index < STACK.length - 1 && (
              <ArrowRight className="tech-layer-arrow" size={17} aria-hidden="true" />
            )}
          </Reveal>
        ))}
      </div>
      <Reveal className="wrap technology-footnote">
        <Satellite size={16} strokeWidth={1.6} aria-hidden="true" />
        <span>Planned layers describe the intended product architecture, not released functionality.</span>
      </Reveal>
    </SceneShell>
  );
}
