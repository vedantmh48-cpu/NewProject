import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, UserRound, X } from "lucide-react";

export default function TeamMember({ member }) {
  const { name, role, photo, github, linkedin, focus } = member;
  const [isOpen, setIsOpen] = useState(false);
  const openButton = useRef(null);
  const closeButton = useRef(null);
  const reduced = useReducedMotion();
  const profileQuery = encodeURIComponent(name);
  const githubUrl = github || `https://github.com/search?q=${profileQuery}&type=users`;
  const linkedinUrl = linkedin || `https://www.linkedin.com/search/results/people/?keywords=${profileQuery}`;

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      openButton.current?.focus();
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={openButton}
        className="team-card team-card-button"
        type="button"
        role="listitem"
        aria-haspopup="dialog"
        aria-label={`View ${name}, ${role}`}
        onClick={() => setIsOpen(true)}
      >
        <span className="team-photo-wrap">
          {photo ? (
            <img className="team-photo" src={photo} alt="" loading="lazy" />
          ) : (
            <span className="team-photo-fallback" aria-hidden="true">
              <UserRound size={34} strokeWidth={1.25} />
            </span>
          )}
          <span className="team-photo-orbit" aria-hidden="true" />
        </span>
        <span className="team-card-copy">
          <span className="team-member-index">ORBITSRM TEAM</span>
          <span className="team-member-name">{name}</span>
          <span className="team-role">{role}</span>
          <span className="team-card-action">View profile <ArrowUpRight size={14} /></span>
        </span>
      </button>
      {createPortal(
        <AnimatePresence>
          {isOpen && (
          <motion.div
            className="team-dialog-backdrop"
            role="presentation"
            onMouseDown={(event) => event.target === event.currentTarget && setIsOpen(false)}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.section
              className="team-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby={`team-name-${profileQuery}`}
              initial={reduced ? false : { opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: reduced ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
              onKeyDown={(event) => {
                if (event.key !== "Tab") return;
                const focusable = event.currentTarget.querySelectorAll("a[href], button:not([disabled])");
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                  event.preventDefault();
                  last?.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                  event.preventDefault();
                  first?.focus();
                }
              }}
            >
              <button
                ref={closeButton}
                className="team-dialog-close"
                type="button"
                aria-label="Close profile"
                onClick={() => setIsOpen(false)}
              >
                <X size={19} />
              </button>
              <div className="team-dialog-person">
                <span className="team-dialog-avatar" aria-hidden="true">
                  {photo ? <img src={photo} alt="" /> : <UserRound size={38} strokeWidth={1.25} />}
                </span>
                <div className="team-dialog-person-copy">
                  <span className="team-member-index">ORBITSRM TEAM / PROFILE</span>
                  <h3 id={`team-name-${profileQuery}`}>{name}</h3>
                  <p className="team-dialog-role">{role}</p>
                </div>
              </div>
              <div className="team-dialog-detail">
                <span>ROLE FOCUS</span>
                <p>{focus || role}</p>
              </div>
              <div className="team-dialog-project">
                <span>PROJECT</span>
                <p>OrbitSRM explores deep-learning-based super-resolution for satellite imagery. Enhanced details are model estimates, not new satellite measurements.</p>
              </div>
              <div className="team-dialog-links">
                <a href={githubUrl} target="_blank" rel="noreferrer">
                  <Github size={17} /> GitHub <ArrowUpRight size={14} />
                </a>
                <a href={linkedinUrl} target="_blank" rel="noreferrer">
                  <Linkedin size={17} /> LinkedIn <ArrowUpRight size={14} />
                </a>
              </div>
            </motion.section>
          </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}

export function TeamMemberPlaceholder() {
  return (
    <article className="team-card team-card-placeholder" role="listitem">
      <div className="team-photo-wrap" aria-hidden="true">
        <span className="team-photo-fallback"><UserRound size={34} strokeWidth={1.25} /></span>
        <span className="team-photo-orbit" />
      </div>
      <div className="team-card-copy">
        <span className="team-placeholder-label">EDITABLE PROFILE SLOT</span>
        <h3>Team profiles to come</h3>
        <p className="team-bio">Add confirmed names, roles, and photos in <code>src/data/teamMembers.js</code>.</p>
      </div>
    </article>
  );
}
