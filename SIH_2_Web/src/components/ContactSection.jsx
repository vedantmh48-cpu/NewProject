import { useState } from "react";
import { Mail, MessageCircle, Phone, Send } from "lucide-react";

const supportEmail = "phoenix.support@gmail.com";
const phoneNumber = "+919028076580";
const whatsappUrl = `https://wa.me/${phoneNumber.replace("+", "")}`;

export default function ContactSection() {
  const [status, setStatus] = useState("");

  function sendMessage(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const message = [
      `Hello OrbitSRM, my name is ${formData.get("name")}.`,
      `My email is ${formData.get("email")}.`,
      "",
      formData.get("message"),
    ].join("\n");
    const url = `${whatsappUrl}?text=${encodeURIComponent(message)}`;
    setStatus("Opening WhatsApp with your message ready to send.");
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <section id="contact" className="contact-section section-anchor">
      <div className="wrap contact-layout">
        <div className="contact-intro">
          <div className="section-head align-left contact-section-head">
            <div className="eyebrow">LET'S TALK</div>
            <h2>Have a question?<br /><em>We’re listening.</em></h2>
            <p>Reach the OrbitSRM team about the project, research collaboration, or support.</p>
          </div>
          <div className="contact-direct-list">
            <a href={`mailto:${supportEmail}`}>
              <span className="contact-direct-icon"><Mail size={18} /></span>
              <span><small>EMAIL</small><b>{supportEmail}</b></span>
            </a>
            <a href={`tel:${phoneNumber}`}>
              <span className="contact-direct-icon"><Phone size={18} /></span>
              <span><small>CALL</small><b>+91 90280 76580</b></span>
            </a>
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              <span className="contact-direct-icon"><MessageCircle size={18} /></span>
              <span><small>WHATSAPP</small><b>Message the team</b></span>
            </a>
          </div>
        </div>

        <div className="contact-form-wrap">
          <form className="contact-form" onSubmit={sendMessage}>
            <div className="contact-form-heading">
              <span>CONTACT FORM</span>
              <p>Tell us how we can help.</p>
            </div>
            <label>
              <span>Your name</span>
              <input name="name" type="text" autoComplete="name" placeholder="Full name" required />
            </label>
            <label>
              <span>Email address</span>
              <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
            </label>
            <label>
              <span>Message</span>
              <textarea name="message" rows="4" placeholder="What would you like to know?" required />
            </label>
            <button className="contact-submit" type="submit">
              Continue on WhatsApp <Send size={16} />
            </button>
            <p className="contact-status" aria-live="polite">{status}</p>
            <small className="contact-form-note">Review your message in WhatsApp before sending it to our team.</small>
          </form>
        </div>
      </div>
    </section>
  );
}