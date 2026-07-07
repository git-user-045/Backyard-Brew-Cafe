type MenuItem = {
  name: string;
  category: string;
  price: string;
  description: string;
  image: string;
};

type MenuPreviewProps = {
  items: MenuItem[];
};

export function MenuPreview({ items }: MenuPreviewProps) {
  return (
    <section id="menu" className="section">
      <div className="site-shell">
        <div className="section-header">
          <h2>Menu favorites ready for QR ordering.</h2>
          <p>
            The public menu is built as a reusable module so future CafeOS menu management can feed this page directly.
          </p>
        </div>
        <div className="menu-grid">
          {items.map((item) => (
            <article className="menu-card" key={item.name}>
              <div className="menu-image" style={{ backgroundImage: `url(${item.image})` }} />
              <div className="menu-content">
                <div className="menu-meta">
                  <span>{item.category}</span>
                  <span>{item.price}</span>
                </div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
