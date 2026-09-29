import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { siteConfig } from "../../data/siteConfig";
import brandLogo from "../../../logo.png";

const rise = {
  hidden: { opacity: 0, y: 34, filter: "blur(7px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export function Mark({ compact = false }) {
  return (
    <a className="brand" href="#home" aria-label={`${siteConfig.name} home`}>
      <span className="brand-mark">
        <img className="brand-logo" src={brandLogo} alt="" />
      </span>
    </a>
  );
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  as = "div",
  amount = 0.16,
  ...rest
}) {
  const reduced = useReducedMotion();
  const Component = motion[as] || motion.div;
  return (
    <Component
      className={className}
      variants={rise}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      transition={{
        duration: reduced ? 0 : 0.66,
        delay: reduced ? 0 : delay,
        ease: [0.21, 0.72, 0.25, 1],
      }}
      {...rest}
    >
      {children}
    </Component>
  );
}

export function MagneticLink({
  children,
  className,
  href,
  onClick,
  strength = 0.12,
  ...props
}) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 240, damping: 18, mass: 0.28 });
  const springY = useSpring(y, { stiffness: 240, damping: 18, mass: 0.28 });

  function move(event) {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * strength);
    y.set((event.clientY - rect.top - rect.height / 2) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      href={href}
      onClick={onClick}
      onPointerMove={move}
      onPointerLeave={reset}
      onBlur={reset}
      className={className}
      style={{ x: springX, y: springY }}
      {...props}
    >
      {children}
    </motion.a>
  );
}

export function SectionHead({ eyebrow, title, description, align = "left" }) {
  return (
    <Reveal className={`section-head align-${align}`}>
      <div className="eyebrow">{eyebrow}</div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </Reveal>
  );
}
