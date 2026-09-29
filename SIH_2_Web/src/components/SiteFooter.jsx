import {
  ArrowUpRight,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Phone,
  Youtube,
} from "lucide-react";
import { navItems } from "../data/journey";
import { Mark } from "./ui/Primitives";
import LegalSection from "./LegalSection";
import { siteConfig } from "../data/siteConfig";

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-main">
          <div className="footer-brand-column">
            <Mark />
            <p>
              Clearer views of our planet through satellite imagery and thoughtful machine learning.
            </p>
            <span className="footer-project-id">SMART INDIA HACKATHON 2026 <i /> SIH26142</span>
          </div>
          <div className="footer-nav">
            <span className="footer-heading">EXPLORE</span>
            {navItems.map(({ id, nav }) => (
              <a href={`#${id}`} key={id}>
                {nav}
              </a>
            ))}
            <a href="#faq">Questions</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-project">
            <span className="footer-heading">GET IN TOUCH</span>
            <a href="mailto:phoenix.support@gmail.com"><Mail size={15} /> phoenix.support@gmail.com</a>
            <a href="tel:+919028076580"><Phone size={15} /> +91 90280 76580</a>
            <a href="https://wa.me/919028076580" target="_blank" rel="noreferrer"><MessageCircle size={15} /> WhatsApp</a>
            {siteConfig.githubUrl && (
              <a href={siteConfig.githubUrl} target="_blank" rel="noreferrer">
                <Github size={15} /> Project on GitHub <ArrowUpRight size={13} />
              </a>
            )}
          </div>
          <div className="footer-social-column">
            <span className="footer-heading">FOLLOW THE PROJECT</span>
            <p>Updates and conversations from the OrbitSRM team.</p>
            <div className="footer-socials" aria-label="Social media links">
              <a href="https://www.instagram.com/explore/search/keyword/?q=OrbitSRM" target="_blank" rel="noreferrer" aria-label="Search OrbitSRM on Instagram"><Instagram size={18} /></a>
              <a href="https://www.youtube.com/results?search_query=OrbitSRM" target="_blank" rel="noreferrer" aria-label="Search OrbitSRM on YouTube"><Youtube size={18} /></a>
              <a href="https://wa.me/919028076580" target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={18} /></a>
              <a href={siteConfig.githubUrl || "https://github.com/search?q=OrbitSRM&type=repositories"} target="_blank" rel="noreferrer" aria-label="Search OrbitSRM on GitHub"><Github size={18} /></a>
              <a href="https://www.linkedin.com/search/results/companies/?keywords=OrbitSRM" target="_blank" rel="noreferrer" aria-label="Search OrbitSRM on LinkedIn"><Linkedin size={18} /></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {siteConfig.name} · SIH 2026 project</span>
          <LegalSection />
          <a href="#home">Back to top <ArrowUpRight size={13} /></a>
        </div>
      </div>
    </footer>
  );
}
