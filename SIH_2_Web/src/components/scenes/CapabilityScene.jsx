import {
  ArrowUpRight,
  ChartNoAxesCombined,
  Columns2,
  Cpu,
  Layers3,
  MapPinned,
  ScanLine,
} from "lucide-react";
import SceneShell from "../ui/SceneShell";
import { Reveal, SectionHead } from "../ui/Primitives";
import { features } from "../../data/siteConfig";

const featureIcons = [Layers3, MapPinned, Columns2, ChartNoAxesCombined, ScanLine];

function FeatureVisual() {
  return (
    <div className="feature-visual" aria-hidden="true">
      <div className="feature-orbit orbit-a" />
      <div className="feature-orbit orbit-b" />
      <div className="feature-image">
        <div className="feature-map-lines" />
        <span className="feature-map-pin">
          <i />
        </span>
        <span className="feature-map-axis">
          0.5 KM <i />
        </span>
      </div>
      <span className="feature-float float-a">MODEL-GENERATED ESTIMATE</span>
      <span className="feature-float float-b">SOURCE / 10 M</span>
    </div>
  );
}

/**
 * Scene 4 - capabilities. Unchanged content from the previous feature showcase,
 * renumbered to match the journey, plus the same honest "Planned" labelling.
 */
export default function CapabilityScene() {
  return (
    <SceneShell
      id="features"
      className="section features section-anchor"
      index={3}
      total={11}
      label="CAPABILITIES"
      tone="cool"
    >
      <div className="wrap">
        <SectionHead
          eyebrow="04 / CAPABILITIES"
          title={
            <>
              Tools for a <em>finer view.</em>
            </>
          }
          description="A planned feature set shaped around satellite image analysis, geospatial viewing and research."
        />
        <div className="feature-showcase">
          <Reveal className="feature-spotlight">
            <div className="spotlight-copy">
              <span className="feature-label">
                <Cpu size={14} /> PLANNED CAPABILITY
              </span>
              <h3>
                Deep learning
                <br />
                super-resolution.
              </h3>
              <p>
                Estimate finer spatial detail from medium-resolution satellite
                imagery, while keeping the source image in view.
              </p>
              <span className="feature-more">
                01 <ArrowUpRight size={14} />
              </span>
            </div>
            <FeatureVisual />
          </Reveal>
          <div className="feature-list">
            {features.slice(1).map(([title, description, status], index) => {
              const FeatureIcon = featureIcons[index];
              return (
              <Reveal
                as="article"
                className="feature-row"
                key={title}
                delay={index * 0.055}
              >
                <span className="feature-symbol" aria-hidden="true">
                  <FeatureIcon size={19} strokeWidth={1.6} />
                </span>
                <span className="feature-row-copy">
                  <b>{title}</b>
                  <small>{description}</small>
                </span>
                <span className="planned-tag">{status}</span>
                <ArrowUpRight className="feature-row-arrow" size={16} />
              </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </SceneShell>
  );
}
