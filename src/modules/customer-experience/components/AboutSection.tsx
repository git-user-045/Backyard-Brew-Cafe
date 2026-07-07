import type { CafeProfile } from "../data/cafeProfile";

type AboutSectionProps = {
  cafe: CafeProfile;
};

export function AboutSection({ cafe }: AboutSectionProps) {
  return (
    <section className="section">
      <div className="site-shell about-grid">
        <div className="about-copy">
          <p className="eyebrow">Built for repeatable SaaS rollout</p>
          <h2>One cafe website today. A configurable operating system tomorrow.</h2>
          <p>
            CafeOS starts with a beautiful customer experience and keeps every future feature modular: QR menu,
            reservations, loyalty, reviews, marketing, and business analytics.
          </p>
        </div>
        <div className="about-stats">
          {cafe.stats.map((stat) => (
            <article className="about-stat" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
