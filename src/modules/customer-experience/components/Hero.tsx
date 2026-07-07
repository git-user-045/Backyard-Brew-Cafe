import { ArrowRight, MapPin } from "lucide-react";
import type { CafeProfile } from "../data/cafeProfile";

type HeroProps = {
  cafe: CafeProfile;
};

export function Hero({ cafe }: HeroProps) {
  return (
    <section id="top" className="hero">
      <div className="site-shell hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">CafeOS website MVP</p>
          <h1>{cafe.name}</h1>
          <p>{cafe.description}</p>
          <div className="hero-actions">
            <a className="primary-button" href="#reserve">
              Reserve a Table
              <ArrowRight size={18} />
            </a>
            <a className="secondary-button" href="#menu">
              View Menu
            </a>
          </div>
        </div>
        <aside className="hero-status" aria-label="Cafe live information">
          <div className="status-row">
            <span>Today</span>
            <strong>{cafe.hours}</strong>
          </div>
          <div className="status-row">
            <span>Location</span>
            <strong>
              <MapPin size={16} aria-hidden="true" /> {cafe.address}
            </strong>
          </div>
          <div className="status-row">
            <span>Next slot</span>
            <strong>{cafe.availableSlots[0]}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}
