import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import SceneShell from "../ui/SceneShell";
import { SectionHead } from "../ui/Primitives";
import { faqs } from "../../data/siteConfig";

/**
 * Scene 10 - questions. Content and behaviour are unchanged; the section now
 * has an `faq` anchor so the journey rail can reach it.
 */
export default function QuestionsScene() {
  const [open, setOpen] = useState(null);
  const reduced = useReducedMotion();

  return (
    <SceneShell
      id="faq"
      className="section faq section-anchor"
      index={9}
      total={11}
      label="QUESTIONS"
      tone="cool"
    >
      <div className="wrap faq-layout">
        <SectionHead
          eyebrow="10 / QUESTIONS"
          title={
            <>
              A few things
              <br />
              <em>to know.</em>
            </>
          }
          description="Answers will evolve as the application takes shape."
        />
        <div className="faq-list">
          {faqs.map(([question, answer], index) => (
            <div
              className={`faq-item ${open === index ? "expanded" : ""}`}
              key={question}
            >
              <button
                type="button"
                aria-expanded={open === index}
                onClick={() => setOpen(open === index ? null : index)}
              >
                <span>{question}</span>
                <ChevronDown size={17} />
              </button>
              <AnimatePresence initial={false}>
                {open === index && (
                  <motion.div
                    className="faq-answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: reduced ? 0 : 0.22 }}
                  >
                    <p>{answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </SceneShell>
  );
}
