import { useEffect, useRef, useState } from "react";
import { GLOBE_FRAGMENT_SOURCE, QUAD_VERTEX_SOURCE } from "./globeShader";
import {
  useDocumentVisible,
  useElementInView,
  useLatest,
} from "../../lib/hooks";

/** Longest edge of the WebGL backing store, in device pixels. */
const MAX_RENDER_SIZE = 720;
const MIN_QUALITY_SCALE = 0.55;
const MAX_QUALITY_SCALE = 1;
const SLOW_FRAME_MS = 26;
const FAST_FRAME_MS = 13.5;

const CONTEXT_ATTRIBUTES = {
  alpha: true,
  antialias: false,
  depth: false,
  stencil: false,
  premultipliedAlpha: false,
  powerPreference: "low-power",
};

function buildProgram(gl, vertexSource, fragmentSource) {
  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertex = compile(gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertex || !fragment) return null;

  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

/**
 * Interactive procedural globe.
 *
 * Renders one raymarched sphere per pixel on the GPU, pauses itself whenever
 * it leaves the viewport or the tab is hidden, scales its resolution down to
 * stay responsive on weak devices, and reports a missing WebGL context to the
 * parent so a static SVG fallback can take over.
 */
export default function GlobeCanvas({
  onUnsupported,
  reducedMotion = false,
  detail = 1,
  spinSpeed = 0.032,
  className = "",
}) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const detailRef = useRef(detail);
  const unsupportedRef = useLatest(onUnsupported);
  const reducedRef = useLatest(reducedMotion);
  const [contextReady, setContextReady] = useState(false);
  const [painted, setPainted] = useState(false);

  const inView = useElementInView(hostRef, { rootMargin: "240px" });
  const documentVisible = useDocumentVisible();

  detailRef.current = detail;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let gl = null;
    try {
      gl =
        canvas.getContext("webgl2", CONTEXT_ATTRIBUTES) ||
        canvas.getContext("webgl", CONTEXT_ATTRIBUTES);
    } catch {
      gl = null;
    }

    if (!gl) {
      unsupportedRef.current?.(true);
      return undefined;
    }

    const program = buildProgram(gl, QUAD_VERTEX_SOURCE, GLOBE_FRAGMENT_SOURCE);
    if (!program) {
      unsupportedRef.current?.(true);
      return undefined;
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );

    const attribute = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(attribute);
    gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);
    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    stateRef.current = {
      gl,
      program,
      buffer,
      uniforms: {
        resolution: gl.getUniformLocation(program, "uResolution"),
        time: gl.getUniformLocation(program, "uTime"),
        pointer: gl.getUniformLocation(program, "uPointer"),
        spin: gl.getUniformLocation(program, "uSpin"),
        detail: gl.getUniformLocation(program, "uDetail"),
        frameScale: gl.getUniformLocation(program, "uFrameScale"),
      },
      qualityScale: 0.9,
    };
    setContextReady(true);

    return () => {
      const state = stateRef.current;
      stateRef.current = null;
      setContextReady(false);
      setPainted(false);
      if (!state) return;
      const { gl: context } = state;
      context.deleteProgram(state.program);
      context.deleteBuffer(state.buffer);
      context.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [unsupportedRef]);

  useEffect(() => {
    const host = hostRef.current;
    if (!contextReady || !host) return undefined;

    const onPointerMove = (event) => {
      if (event.pointerType !== "mouse") return;
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointerRef.current.targetX = Math.max(
        -1,
        Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2),
      );
      pointerRef.current.targetY = Math.max(
        -1,
        Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2),
      );
    };

    const onPointerLeave = () => {
      pointerRef.current.targetX = 0;
      pointerRef.current.targetY = 0;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [contextReady]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const state = stateRef.current;
    if (!contextReady || !host || !canvas || !state) return undefined;

    const { gl, uniforms } = state;
    let frameId = 0;
    let elapsed = 0;
    let lastTimestamp = 0;
    let frameCount = 0;
    let frameTimeTotal = 0;
    let paintedOnce = false;

    function resize() {
      const rect = host.getBoundingClientRect();
      const cssSize = Math.min(rect.width || 0, rect.height || 0);
      if (!cssSize) return 0;
      const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 1.75);
      const target =
        Math.min(cssSize * devicePixelRatio, MAX_RENDER_SIZE) *
        state.qualityScale;
      const size = Math.max(160, Math.round(target));
      if (canvas.width !== size || canvas.height !== size) {
        canvas.width = size;
        canvas.height = size;
      }
      return size;
    }

    function draw() {
      const size = resize();
      if (!size) return;

      pointerRef.current.x +=
        (pointerRef.current.targetX - pointerRef.current.x) * 0.06;
      pointerRef.current.y +=
        (pointerRef.current.targetY - pointerRef.current.y) * 0.06;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(state.program);
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.time, elapsed);
      gl.uniform2f(uniforms.pointer, pointerRef.current.x, pointerRef.current.y);
      gl.uniform1f(uniforms.spin, elapsed * spinSpeed);
      gl.uniform1f(uniforms.detail, detailRef.current);
      gl.uniform1f(uniforms.frameScale, 0.6);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!paintedOnce) {
        paintedOnce = true;
        setPainted(true);
      }
    }

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            if (!frameId) {
              elapsed = 0;
              draw();
            }
          })
        : null;
    observer?.observe(host);

    if (reducedRef.current) {
      draw();
      return () => observer?.disconnect();
    }

    function tick(timestamp) {
      frameId = window.requestAnimationFrame(tick);
      if (!lastTimestamp) {
        lastTimestamp = timestamp;
        return;
      }
      const frameTime = timestamp - lastTimestamp;
      lastTimestamp = timestamp;
      elapsed += frameTime / 1000;
      draw();

      frameCount += 1;
      frameTimeTotal += frameTime;
      if (frameCount >= 40) {
        const average = frameTimeTotal / frameCount;
        frameCount = 0;
        frameTimeTotal = 0;
        if (average > SLOW_FRAME_MS && state.qualityScale > MIN_QUALITY_SCALE) {
          state.qualityScale = Math.max(
            MIN_QUALITY_SCALE,
            state.qualityScale * 0.85,
          );
        } else if (
          average < FAST_FRAME_MS &&
          state.qualityScale < MAX_QUALITY_SCALE
        ) {
          state.qualityScale = Math.min(
            MAX_QUALITY_SCALE,
            state.qualityScale * 1.08,
          );
        }
      }
    }

    if (inView && documentVisible) {
      frameId = window.requestAnimationFrame(tick);
    } else {
      draw();
    }

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      observer?.disconnect();
    };
  }, [contextReady, inView, documentVisible, reducedRef, spinSpeed]);

  return (
    <div className={`globe-host ${className}`} ref={hostRef}>
      <canvas
        ref={canvasRef}
        className="globe-canvas"
        data-painted={painted ? "true" : "false"}
        aria-hidden="true"
      />
    </div>
  );
}
