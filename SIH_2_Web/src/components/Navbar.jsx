import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import { navItems } from "../data/journey";
import { MagneticLink, Mark } from "./ui/Primitives";

/**
 * Floating navigation. Links map to real section ids, the scene readout shows
 * where the visitor is in the journey, and the mobile menu keeps the same
 * anchors reachable on touch devices.
 */
export default function Navbar({ activeScene = "home" }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 12));

  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  useEffect(() => {
    if (!open || !isMobile) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isMobile, open]);

  const showInlineNavigation = !isMobile && !scrolled;

  return (
    <motion.header
      className={`topbar ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}
      data-active-scene={activeScene}
    >
      <div className="wrap nav-wrap">
        <Mark />
        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        <AnimatePresence initial={false}>
          {(showInlineNavigation || open) && (
            <motion.nav
              id="primary-navigation"
              key="nav"
              className={`nav-links ${open ? "open" : ""} ${scrolled ? "is-island-nav" : ""}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: reduced ? 0 : 0.18 }}
            >
              {navItems.map(({ id, nav: label }) => (
                <a
                  key={id}
                  className={activeScene === id ? "is-active" : ""}
                  href={`#${id}`}
                  data-magnet="0.16"
                  onClick={() => setOpen(false)}
                >
                  {label}
                  {activeScene === id && (
                    <motion.span
                      className="nav-active-indicator"
                      layoutId="nav-active-indicator"
                    />
                  )}
                </a>
              ))}
              <a href="#contact" onClick={() => setOpen(false)}>
                Contact
              </a>
              <MagneticLink
                className="button button-small"
                href="#download"
                onClick={() => setOpen(false)}
                data-cursor-label="DOWNLOAD"
                data-magnet="0.2"
              >
                Download <Download size={14} />
              </MagneticLink>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
