import { Mail, MapPinned, Phone, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import type { CafeProfile } from "../data/cafeProfile";

type ContactSectionProps = {
  cafe: CafeProfile;
};

type ContactFormData = {
  name: string;
  phone: string;
  message: string;
};

export function ContactSection({ cafe }: ContactSectionProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    phone: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact enquiry submitted:", formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", phone: "", message: "" });
    }, 3000);
  };

  return (
    <>
      <section id="contact" className="section contact-section">
        <div className="site-shell contact-grid">
          <article className="contact-card">
            <p className="eyebrow">Visit us</p>
            <h2>{cafe.name}</h2>
            <div className="contact-list">
              <span className="contact-item">
                <MapPinned size={18} /> {cafe.address}
              </span>
              <span className="contact-item">
                <Phone size={18} /> {cafe.phone}
              </span>
              <span className="contact-item">
                <Mail size={18} /> {cafe.email}
              </span>
            </div>
          </article>
          {isSubmitted ? (
            <article className="contact-card" style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", textAlign: "center", padding: "2rem" }}>
              <CheckCircle2 size={48} style={{ color: "var(--moss)" }} />
              <h3>Message Sent!</h3>
              <p>We'll get back to you as soon as possible!</p>
            </article>
          ) : (
            <form className="contact-card form-grid" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                aria-label="Name"
                placeholder="Name"
                required
                value={formData.name}
                onChange={handleInputChange}
              />
              <input
                type="tel"
                name="phone"
                aria-label="Phone number"
                placeholder="Phone number"
                required
                value={formData.phone}
                onChange={handleInputChange}
              />
              <textarea
                name="message"
                aria-label="Message"
                placeholder="Message"
                required
                value={formData.message}
                onChange={handleInputChange}
              />
              <button className="primary-button" type="submit">
                Send Enquiry
              </button>
            </form>
          )}
        </div>
      </section>
      <footer className="footer-note">Powered by CafeOS modules: website, QR menu, reservations, analytics.</footer>
    </>
  );
}
