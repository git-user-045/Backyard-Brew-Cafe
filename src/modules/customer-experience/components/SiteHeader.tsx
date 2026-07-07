import { CalendarDays, MessageCircle } from "lucide-react";
import type { CafeProfile } from "../data/cafeProfile";

type SiteHeaderProps = {
  cafe: CafeProfile;
};

export function SiteHeader({ cafe }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <a className="brand-mark" href="#top" aria-label={`${cafe.name} home`}>
        <span>B</span>
        {cafe.name}
      </a>
      <nav className="nav-links" aria-label="Primary navigation">
        <a href="#menu">Menu</a>
        <a href="#reserve">Reserve</a>
        <a href="#gallery">Gallery</a>
        <a href="#contact">Contact</a>
      </nav>
      <div className="header-actions">
        <a className="icon-button" href={cafe.whatsapp} aria-label="Open WhatsApp chat">
          <MessageCircle size={19} />
        </a>
        <a className="secondary-button" href="#reserve">
          <CalendarDays size={18} />
          Book
        </a>
      </div>
    </header>
  );
}
