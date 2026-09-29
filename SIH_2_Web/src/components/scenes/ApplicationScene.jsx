import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import SceneShell from "../ui/SceneShell";
import AppPreview from "../preview/AppPreview";
import { SectionHead } from "../ui/Primitives";
import { siteConfig } from "../../data/siteConfig";

const CONCEPTS = [
  {
    mode: "workspace",
    title: "Workspace concept",
    detail: "Project layer and study area",
  },
  {
    mode: "comparison",
    title: "Comparison concept",
    detail: "A proposed source and estimate view",
  },
  {
    mode: "evaluation",
    title: "Evaluation concept",
    detail: "A planned quality review panel",
  },
];

/**
 * Scene 8 - the application. Real screenshots are rendered when
 * `siteConfig.screenshots` is populated; until then clearly stamped interface
 * concepts are shown instead. No fictional screenshots are substituted.
 */
export default function ApplicationScene() {
  const reduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(null);
  const closeButton = useRef(null);
  const trigger = useRef(null);
  const rail = useRef(null);
  const galleryDrag = useRef(null);
  const suppressClick = useRef(false);

  const realScreenshots = siteConfig.screenshots || [];
  const slides = realScreenshots.length ? realScreenshots : CONCEPTS;
  const active = activeIndex === null ? null : slides[activeIndex];

  function step(direction) {
    setActiveIndex((current) => {
      if (current === null) return current;
      return (current + direction + slides.length) % slides.length;
    });
  }

  useEffect(() => {
    if (activeIndex === null) return undefined;
    closeButton.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
        trigger.current?.focus();
      }
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "Tab") {
        event.preventDefault();
        closeButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, slides.length]);

  function closeLightbox() {
    setActiveIndex(null);
    trigger.current?.focus();
  }

  function scrollRail(direction) {
    rail.current?.scrollBy({
      left: direction * rail.current.clientWidth * 0.76,
      behavior: "smooth",
    });
  }

  function startGalleryDrag(event) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    galleryDrag.current = {
      x: event.clientX,
      scrollLeft: event.currentTarget.scrollLeft,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveGalleryDrag(event) {
    if (!galleryDrag.current) return;
    const delta = event.clientX - galleryDrag.current.x;
    if (Math.abs(delta) > 5) galleryDrag.current.moved = true;
    if (galleryDrag.current.moved) {
      event.currentTarget.scrollLeft = galleryDrag.current.scrollLeft - delta;
    }
  }

  function endGalleryDrag(event) {
    if (galleryDrag.current?.moved) suppressClick.current = true;
    galleryDrag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function suppressDraggedClick(event) {
    if (!suppressClick.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClick.current = false;
  }

  return (
    <SceneShell
      id="screenshots"
      className="section screenshots section-anchor"
      index={7}
      total={11}
      label="APPLICATION"
      tone="cool"
    >
      <div className="wrap">
        <div className="gallery-heading">
          <SectionHead
            eyebrow="08 / THE APPLICATION"
            title={
              <>
                A workspace,
                <br />
                <em>taking shape.</em>
              </>
            }
            description={
              realScreenshots.length
                ? "Application screenshots from the current release."
                : "These interface concepts suggest a direction for the desktop application. They are mockups, not screenshots of a released product."
            }
          />
          <div
            className="gallery-controls"
            aria-label="Screenshot gallery controls"
          >
            <button
              type="button"
              aria-label="Scroll gallery left"
              onClick={() => scrollRail(-1)}
            >
              <ArrowLeft size={17} />
            </button>
            <button
              type="button"
              aria-label="Scroll gallery right"
              onClick={() => scrollRail(1)}
            >
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
        <div
          className="gallery-rail"
          ref={rail}
          onPointerDown={startGalleryDrag}
          onPointerMove={moveGalleryDrag}
          onPointerUp={endGalleryDrag}
          onPointerCancel={endGalleryDrag}
          onClickCapture={suppressDraggedClick}
        >
          {slides.map((slide, index) => {
            const title = slide.title || "Application screenshot";
            const isReal = Boolean(slide.src);
            return (
              <button
                className="gallery-card"
                type="button"
                data-cursor-label="VIEW"
                key={slide.src || slide.mode || index}
                onClick={(event) => {
                  trigger.current = event.currentTarget;
                  setActiveIndex(index);
                }}
                aria-label={`Enlarge ${title}${isReal ? "" : ", illustrative interface mockup"}`}
              >
                <span className="gallery-image">
                  {isReal ? (
                    <img loading="lazy" src={slide.src} alt={title} />
                  ) : (
                    <AppPreview mode={slide.mode} />
                  )}
                  {!isReal && (
                    <span className="mockup-stamp">ILLUSTRATIVE UI MOCKUP</span>
                  )}
                </span>
                <span className="gallery-caption">
                  <span>
                    <b>{title}</b>
                    <small>
                      {slide.detail ||
                        (isReal
                          ? "Application screenshot"
                          : "Illustrative interface concept")}
                    </small>
                  </span>
                  <ArrowUpRight size={16} />
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <AnimatePresence>
        {active && (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
            onClick={closeLightbox}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? { opacity: 1 } : { opacity: 0 }}
          >
            <motion.div
              className="lightbox-content"
              onClick={(event) => event.stopPropagation()}
              initial={reduced ? false : { opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 1 } : { opacity: 0, y: 10, scale: 0.99 }}
              transition={{ duration: reduced ? 0 : 0.25 }}
            >
              {active.src ? (
                <img
                  className="lightbox-screenshot"
                  src={active.src}
                  alt={active.title}
                />
              ) : (
                <AppPreview mode={active.mode} />
              )}
              <p>
                {active.src
                  ? active.title
                  : `${active.title} Â· illustrative mockup, not an application screenshot`}
              </p>
            </motion.div>
            <div
              className="lightbox-actions"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Previous view"
                onClick={() => step(-1)}
              >
                <ArrowLeft size={17} />
              </button>
              <button type="button" aria-label="Next view" onClick={() => step(1)}>
                <ArrowRight size={17} />
              </button>
            </div>
            <motion.button
              ref={closeButton}
              className="lightbox-close"
              type="button"
              aria-label="Close"
              onClick={closeLightbox}
              initial={reduced ? false : { opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={reduced ? { opacity: 1 } : { opacity: 0 }}
            >
              <X />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </SceneShell>
  );
}

