import { useEffect, useMemo, useRef, useState } from "react";

/** Tracks a CSS media query without layout thrash. */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, [query]);

  return matches;
}

/** True when the browser exposes a usable WebGL context. */
export function useWebGLAvailable() {
  const available = useMemo(() => {
    if (typeof document === "undefined") return false;
    try {
      const canvas = document.createElement("canvas");
      const context =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      if (!context) return false;
      const lose = context.getExtension("WEBGL_lose_context");
      lose?.loseContext();
      return true;
    } catch {
      return false;
    }
  }, []);

  return available;
}

/** Reports whether an element is inside (or near) the viewport. */
export function useElementInView(ref, { rootMargin = "220px" } = {}) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setInView(entry.isIntersecting));
      },
      { rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return inView;
}

/** True while the document is hidden (used to pause animation loops). */
export function useDocumentVisible() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const update = () => setVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  return visible;
}

/**
 * Tracks which scene section currently owns the viewport.
 * `ids` must be a stable reference (module-level array).
 */
export function useSceneTracker(ids) {
  const [active, setActive] = useState(ids[0] || "");

  useEffect(() => {
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!nodes.length || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];
        if (current) setActive(current.target.id);
      },
      { rootMargin: "-24% 0px -62% 0px", threshold: 0 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [ids]);

  const index = Math.max(0, ids.indexOf(active));
  return { active: active || ids[0], index, total: ids.length };
}

/** Keeps a stable ref to the latest callback (for animation loops). */
export function useLatest(value) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}
