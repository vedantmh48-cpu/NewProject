import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { MousePointerClick, MoveHorizontal } from "lucide-react";
import { useMediaQuery } from "../lib/hooks";

/**
 * Before / after comparison for the transformation scene.
 *
 * Both sides are illustrative artwork rather than model output, which is
 * stated directly on the frame. Supports pointer drag, keyboard (range input)
 * and a magnifier for fine pointers.
 */
export default function CompareSlider({ start = 58 }) {
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const [position, setPosition] = useState(start);
  const [dragging, setDragging] = useState(false);
  const [loupe, setLoupe] = useState(null);
  const [touched, setTouched] = useState(false);
  const frameRef = useRef(null);
  const rafRef = useRef(0);
  const swept = useRef(false);

  const cancelTween = useCallback(() => {
    if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
  }, []);

  const tweenTo = useCallback(
    (from, to, duration) =>
      new Promise((resolve) => {
        const begin = performance.now();
        function step(now) {
          const t = Math.min(1, (now - begin) / duration);
          const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
          setPosition(from + (to - from) * eased);
          if (t < 1) {
            rafRef.current = window.requestAnimationFrame(step);
          } else {
            rafRef.current = 0;
            resolve();
          }
        }
        rafRef.current = window.requestAnimationFrame(step);
      }),
    [],
  );

  // One demonstration sweep the first time the frame is properly in view.
  useEffect(() => {
    const node = frameRef.current;
    if (!node || reduced || typeof IntersectionObserver === "undefined") {
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || swept.current) return;
          swept.current = true;
          tweenTo(start, 26, 900).then(() => tweenTo(26, start, 900));
        });
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced, start, tweenTo]);

  useEffect(() => cancelTween, [cancelTween]);

  const positionFromPointer = useCallback((event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const next = ((event.clientX - bounds.left) / bounds.width) * 100;
    setPosition(Math.max(4, Math.min(96, next)));
  }, []);

  function handlePointerDown(event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    cancelTween();
    setTouched(true);
    setDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
    positionFromPointer(event);
  }

  function handlePointerMove(event) {
    if (finePointer && !dragging) {
      const bounds = event.currentTarget.getBoundingClientRect();
      setLoupe({
        x: ((event.clientX - bounds.left) / bounds.width) * 100,
        y: ((event.clientY - bounds.top) / bounds.height) * 100,
      });
    }
    if (!dragging) return;
    positionFromPointer(event);
  }

  function handlePointerUp(event) {
    setDragging(false);
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }


  return (
    <div className="compare-shell" ref={frameRef}>
      <div
        className="compare-picture"
        data-cursor="drag"
        data-cursor-label="DRAG TO COMPARE"
        data-dragging={dragging ? "true" : "false"}
        data-touched={touched ? "true" : "false"}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={() => {
          setLoupe(null);
        }}
        style={{ "--compare-pos": `${position}%` }}
      >
        <div className="compare-base" />
        <div className="compare-pixel-grid coarse" aria-hidden="true" />
        <div
          className="compare-top"
          style={{ clipPath: `inset(0 ${Math.max(0, 100 - position)}% 0 0)` }}
        />
        <div className="compare-pixel-grid fine" aria-hidden="true" />
        <div className="compare-divider" style={{ left: `${position}%` }}>
          <span>
            <MoveHorizontal size={15} />
          </span>
        </div>
        <span className="compare-label label-left">
          SOURCE VIEW · ILLUSTRATIVE
        </span>
        <span className="compare-label label-right">
          ESTIMATED VIEW · ILLUSTRATIVE
        </span>
        {loupe && (
          <span
            className="compare-loupe"
            aria-hidden="true"
            style={{
              left: `${loupe.x}%`,
              top: `${loupe.y}%`,
              "--loupe-origin": `${loupe.x}% ${loupe.y}%`,
            }}
          >
            <span className="compare-loupe-stage">
              <span className="compare-top" />
            </span>
            <em>ESTIMATE ×2.4</em>
          </span>
        )}
        {!touched && (
          <span className="compare-cue" aria-hidden="true">
            <MousePointerClick size={13} /> DRAG THE DIVIDER
          </span>
        )}
      </div>
      <label className="sr-only" htmlFor="compare-slider">
        Move the illustrative image comparison divider
      </label>
      <input
        id="compare-slider"
        className="compare-slider"
        type="range"
        min="4"
        max="96"
        value={Math.round(position)}
        style={{ "--slider-position": `${position}%` }}
        onChange={(event) => {
          cancelTween();
          setTouched(true);
          setPosition(Number(event.target.value));
        }}
      />
      <div className="compare-controls">
        <span>DRAG, TAP OR USE ARROW KEYS</span>
        <span>{Math.round(position)}%</span>
      </div>
    </div>
  );
}
