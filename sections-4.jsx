// ============ In the Field (photographic showcase) ============
// Curated Unsplash imagery tied to retail floors, warehouses, lighting & logistics.
// All images are free-license from unsplash.com — original framing only.

const FIELD_CARDS = [
  {
    span: 'wide',
    src: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1400&q=80',
    alt: 'Warehouse aisles stacked with inventory',
    lbl: 'WAREHOUSE · MUMBAI DC',
    ttl: 'Surplus stock, rebalanced.',
    sub: 'Cromax overstock detected · 287 units flagged for reallocation.',
  },
  {
    span: 'narrow',
    src: 'https://images.unsplash.com/photo-1565098772267-60af42b81ef2?auto=format&fit=crop&w=1200&q=80',
    alt: 'LED light bulb, close up',
    lbl: 'SKU · LED-A60-9W',
    ttl: '2,847 LEDs tracked.',
    sub: 'Per-unit AuraTag from dock to doorstep.',
  },
  {
    span: 'narrow',
    src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    alt: 'Retail store aisle',
    lbl: 'STORE FLOOR · CHENNAI',
    ttl: 'Helios runs lean.',
    sub: 'Forecast-aligned shelf depth, every category.',
  },
  {
    span: 'wide',
    src: 'https://images.unsplash.com/photo-1601598851547-4302969d0614?auto=format&fit=crop&w=1400&q=80',
    alt: 'Worker scanning packages in a logistics hub',
    lbl: 'LIFT · HELIOS → VOLTAVERA',
    ttl: '60 units · 428 km · 14 h.',
    sub: 'Profit-aware routing. Lift cost priced before pick.',
  },
];

function InTheField() {
  return (
    <section id="field">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">In the field</span>
          <h2 className="section-title">Where Alto runs.</h2>
          <p className="section-sub">
            From distribution centers to shop floors — intelligence wired into every link
            of the retail chain.
          </p>
        </div>

        <div className="field-grid">
          {FIELD_CARDS.map((c, i) => (
            <a key={i} className={`field-card field-${c.span}`} href="#">
              <img src={c.src} alt={c.alt} loading="lazy" />
              <div className="field-shade" aria-hidden="true"></div>
              <div className="field-overlay">
                <span className="field-lbl mono">{c.lbl}</span>
                <div className="field-ttl">{c.ttl}</div>
                <div className="field-sub">{c.sub}</div>
              </div>
              <span className="field-corner mono" aria-hidden="true">
                LIVE · 0{i + 1}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { InTheField });
