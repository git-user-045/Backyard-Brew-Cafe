import { CalendarDays, MessageCircle } from "lucide-react";
import Link from "next/link";
import type { CafeProfile } from "../data/cafeProfile";

type SiteHeaderProps = {
  cafe: CafeProfile;
};

export function SiteHeader({ cafe }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <Link className="brand-mark" href="/" aria-label={`${cafe.name} home`}>
        <span>B</span>
        {cafe.name}
      </Link>
      <nav className="nav-links" aria-label="Primary navigation">
        <Link href="/menu">Menu</Link>
        <Link href="/#reserve">Reserve</Link>
        <Link href="/#gallery">Gallery</Link>
        <Link href="/#contact">Contact</Link>
      </nav>
      <div className="header-actions">
        <a className="icon-button" href={cafe.whatsapp} aria-label="Open WhatsApp chat">
          <MessageCircle size={19} />
        </a>
        <Link className="secondary-button" href="/#reserve">
          <CalendarDays size={18} />
          Book
        </Link>
      </div>
    </header>
  );
}
