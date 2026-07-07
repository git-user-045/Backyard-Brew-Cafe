type GalleryStripProps = {
  gallery: string[];
};

export function GalleryStrip({ gallery }: GalleryStripProps) {
  return (
    <section id="gallery" className="section">
      <div className="site-shell">
        <div className="section-header">
          <h2>Atmosphere that sells the visit.</h2>
          <p>Gallery content is isolated so future website editor uploads can replace these assets per cafe tenant.</p>
        </div>
        <div className="gallery-grid">
          {gallery.map((image, index) => (
            <div
              className="gallery-tile"
              key={image}
              aria-label={`Cafe gallery image ${index + 1}`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
