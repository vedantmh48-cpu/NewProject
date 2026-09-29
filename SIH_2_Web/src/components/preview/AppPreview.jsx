import {
  ArrowRight,
  FileImage,
  Globe2,
  Layers3,
} from "lucide-react";

const LABELS = {
  workspace: [
    "WORKSPACE / STUDY AREA",
    "SOURCE IMAGE · ILLUSTRATIVE",
    "Layer details",
  ],
  comparison: [
    "COMPARE / SOURCE & ESTIMATE",
    "COMPARISON · ILLUSTRATIVE",
    "Compare layers",
  ],
  evaluation: [
    "RESULTS / QUALITY REVIEW",
    "EVALUATION · CONCEPT",
    "Review results",
  ],
};

/**
 * Abstract interface mockup used for previews and gallery placeholders.
 * Deliberately labelled as a concept: it is not an application screenshot.
 */
export default function AppPreview({ mode = "workspace" }) {
  const [path, imageLabel, panelTitle] = LABELS[mode] || LABELS.workspace;

  return (
    <div className={`app-preview preview-${mode}`}>
      <div className="preview-top">
        <div className="window-dots">
          <i />
          <i />
          <i />
        </div>
        <span>{path}</span>
        <span className="preview-live">
          <b /> PREVIEW
        </span>
      </div>
      <div className="preview-body">
        <aside className="preview-tools" aria-hidden="true">
          <div className="tool-active">
            <Layers3 size={15} />
          </div>
          <div>
            <Globe2 size={15} />
          </div>
          <div>
            <FileImage size={15} />
          </div>
        </aside>
        <div className="map-pane">
          <div className="map-image">
            <div className="map-grid" />
            <span className="map-tag">{imageLabel}</span>
            <span className="map-coord">
              18° 55′ N<br />
              72° 49′ E
            </span>
            <div className="map-crosshair" aria-hidden="true">
              +
            </div>
          </div>
          <div className="map-footer">
            <span>
              <i className="legend-dot" /> Coastal study area
            </span>
            <span>Sentinel-2 · potential source</span>
          </div>
        </div>
        <aside className="preview-panel">
          <div className="panel-title">{panelTitle}</div>
          <div className="preview-meta-grid">
            <span>
              <small>SCENE</small>
              <b>Sample area</b>
            </span>
            <span>
              <small>DATE</small>
              <b>To be set</b>
            </span>
          </div>
          {mode === "comparison" && (
            <div className="preview-view-key">
              <span>
                <i /> Original
              </span>
              <span>
                <i /> Estimate · concept
              </span>
            </div>
          )}
          <span className="panel-muted">QUALITY EVALUATION</span>
          <b className="preview-quality">Not computed</b>
          <span className="panel-muted">PROCESSING</span>
          <span className="status-chip">Idle · illustrative UI</span>
          <span className="panel-action">
            {mode === "comparison"
              ? "Compare views"
              : mode === "evaluation"
                ? "View evaluation"
                : "Open project"}{" "}
            <ArrowRight size={12} />
          </span>
        </aside>
      </div>
    </div>
  );
}
