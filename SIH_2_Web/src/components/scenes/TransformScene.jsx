import CompareSlider from "../CompareSlider";
import SceneShell from "../ui/SceneShell";
import { Reveal, SectionHead } from "../ui/Primitives";

const STEPS = [
  {
    index: "01",
    title: "Source",
    detail: "A medium-resolution raster enters the pipeline.",
  },
  {
    index: "02",
    title: "Estimate",
    detail: "A deep learning model proposes finer spatial detail.",
  },
  {
    index: "03",
    title: "Review",
    detail: "Source and estimate stay side by side, open to evaluation.",
  },
];

/**
 * Scene 5 - the transformation. The comparison slider is the centrepiece of
 * the journey: a single frame revealing source and estimate on either side of
 * a draggable divider. Both sides are illustrative artwork, stated on frame.
 */
export default function TransformScene() {
  return (
    <SceneShell
      id="transform"
      className="section comparison section-anchor"
      index={4}
      total={11}
      label="TRANSFORMATION"
      tone="bright"
    >
      <div className="wrap compare-layout">
        <Reveal className="compare-copy">
          <SectionHead
            eyebrow="05 / TRANSFORMATION"
            title={
              <>
                A closer look,
                <br />
                <em>side by side.</em>
              </>
            }
          />
          <p className="body-copy">
            Move the divider to inspect the same sample area twice: the source
            view on one side, and a representation of the finer detail a
            super-resolution model would estimate on the other. The transition
            uses a magnifier so small differences are easier to read.
          </p>
          <div className="illustrative-note">
            <span>âœ³</span>
            <span>
              <b>Illustrative example</b>
              <br />
              No model result is shown here.
            </span>
          </div>
          <ol className="transform-steps">
            {STEPS.map((step) => (
              <li key={step.index}>
                <span className="transform-step-index">{step.index}</span>
                <span>
                  <b>{step.title}</b>
                  <small>{step.detail}</small>
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
        <Reveal className="compare-frame" delay={0.1}>
          <CompareSlider />
        </Reveal>
      </div>
    </SceneShell>
  );
}
