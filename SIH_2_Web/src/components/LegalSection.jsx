import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

const legalContent = {
  terms: {
    eyebrow: "ORBITSRM / TERMS",
    title: "Terms of use",
    sections: [
      ["Project preview", "OrbitSRM is a student project and research preview. Features and technologies marked planned are not currently available as a released application."],
      ["Illustrative outputs", "Any enhanced imagery or interface examples are illustrative. Model-generated detail is an estimate, not a new satellite measurement or a substitute for authoritative geospatial data."],
      ["Use and availability", "The website and its materials are provided for informational and educational use. Availability, content, and planned features may change. Do not rely on this preview for safety-critical, legal, or operational decisions."],
      ["External services", "Links to WhatsApp and other third-party services are governed by those providers’ own terms. You choose whether to open or use them."],
    ],
  },
  privacy: {
    eyebrow: "ORBITSRM / PRIVACY",
    title: "Privacy policy",
    sections: [
      ["Contact form", "Submitting the contact form opens WhatsApp with the name, email address, and message you entered in a prefilled draft. This website does not send or store the draft. It is shared only if you choose to send it in WhatsApp."],
      ["Third-party processing", "WhatsApp is operated by Meta and processes information under its own privacy policy. Opening external social or contact links also takes you to services with their own privacy practices."],
      ["Local browser storage", "The site uses session storage only to remember whether its introductory animation has been shown in the current browser session. The contact form does not submit information to an OrbitSRM server."],
      ["Your choices", "You can edit or discard the WhatsApp draft before sending it. Avoid including sensitive personal or confidential information in a message."],
    ],
  },
};

export default function LegalSection() {
  const [activePolicy, setActivePolicy] = useState(null);
  const closeButton = useRef(null);
  const trigger = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!activePolicy) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") setActivePolicy(null);
      if (event.key !== "Tab") return;
      const focusable = document.querySelectorAll(".legal-dialog button");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      trigger.current?.focus();
    };
  }, [activePolicy]);

  const content = activePolicy ? legalContent[activePolicy] : null;

  return (
    <>
      <div className="footer-legal-links" aria-label="Legal information">
        <button ref={activePolicy === "terms" ? trigger : undefined} type="button" onClick={(event) => { trigger.current = event.currentTarget; setActivePolicy("terms"); }}>
          Terms of use
        </button>
        <button ref={activePolicy === "privacy" ? trigger : undefined} type="button" onClick={(event) => { trigger.current = event.currentTarget; setActivePolicy("privacy"); }}>
          Privacy policy
        </button>
      </div>
      {content &&
        createPortal(
          <motion.div
            className="legal-dialog-backdrop"
            role="presentation"
            onMouseDown={(event) => event.target === event.currentTarget && setActivePolicy(null)}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.section
              className="legal-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="legal-dialog-title"
              initial={reduced ? false : { opacity: 0, y: 18, scale: .98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: reduced ? 0 : .22, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="legal-dialog-header">
                <span>{content.eyebrow}</span>
                <button ref={closeButton} type="button" aria-label="Close legal information" onClick={() => setActivePolicy(null)}>
                  <X size={19} />
                </button>
              </div>
              <h2 id="legal-dialog-title">{content.title}</h2>
              <div className="legal-dialog-content">
                {content.sections.map(([heading, body]) => (
                  <section key={heading}>
                    <h3>{heading}</h3>
                    <p>{body}</p>
                  </section>
                ))}
              </div>
            </motion.section>
          </motion.div>,
          document.body,
        )}
    </>
  );
}