// ============ Use Case (AuraTag) ============
const PHONE_PRODUCTS = [
  {
    id: 'led-a60', name: 'LED Bulb · A60 · 9W', sku: 'A2-9F8C-LED',
    stage: 1, // 0 sourced, 1 testing, 2 storage, 3 shipped
    msg: 'Your LED light is undergoing high-voltage testing. Estimated 2 hours until storage hand-off.',
    eta: '2h left',
    img: 'https://images.unsplash.com/photo-1565098772267-60af42b81ef2?auto=format&fit=crop&w=720&q=80',
    tag: 'TESTING · BAY 03',
  },
  {
    id: 'led-strip', name: 'LED Strip · 5m · RGB', sku: 'B4-2E11-STR',
    stage: 2,
    msg: 'Quality-checked and shelved at warehouse 04. Awaiting customer dispatch order.',
    eta: '4h left',
    img: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=720&q=80',
    tag: 'STORAGE · WH 04',
  },
  {
    id: 'led-panel', name: 'LED Panel · 600×600', sku: 'C7-9A3D-PNL',
    stage: 3,
    msg: 'Your order is packed and ready for shipment. Expected delivery tomorrow by 6PM.',
    eta: 'just now',
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=720&q=80',
    tag: 'SHIPPED · ETA 1D',
  },
];

function UseCase() {
  return (
    <section id="usecase">
      <div className="wrap usecase">
        <div>
          <span className="pill accent"><span className="ico"></span>USE CASE · LED RETAIL</span>
          <h2 className="section-title" style={{ marginTop: 18 }}>
            Track every product.<br />From source to doorstep.
          </h2>
          <p className="section-sub">
            Alto assigns a unique digital tag — <strong style={{color:'var(--fg)'}}>AuraTag</strong> —
            to every product the moment it's sourced. Customers and store managers get real-time
            status updates with AI-generated notifications for any delays.
          </p>

          <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <UseCaseStep n="01" t="Sourced" d="QR + NFC tag generated at the manufacturer dock." />
            <UseCaseStep n="02" t="Testing" d="High-voltage testing logged on-chain, traceable per unit." />
            <UseCaseStep n="03" t="Storage" d="Warehouse position auto-indexed for fastest retrieval." />
            <UseCaseStep n="04" t="Shipment" d="Customer + store manager pinged with live ETA." />
          </div>
        </div>

        <div>
          <PhoneMock />
        </div>
      </div>
    </section>
  );
}

function UseCaseStep({ n, t, d }) {
  return (
    <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
      <div className="mono" style={{ color: 'var(--accent)', fontSize: 12, letterSpacing: '0.12em', paddingTop: 2 }}>
        {n}
      </div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 500 }}>{t}</div>
        <div style={{ color: 'var(--fg-soft)', fontSize: 14, marginTop: 4 }}>{d}</div>
      </div>
    </div>
  );
}

function PhoneMock() {
  const [idx, setIdx] = React.useState(0);
  const product = PHONE_PRODUCTS[idx];
  const stageLabels = ['Sourced', 'Testing', 'Storage', 'Shipped'];

  return (
    <div className="phone">
      <div className="phone-screen">
        <div className="phone-head">
          <div className="ttl">
            <span className="dot"></span>
            AuraTag
          </div>
          <div className="sub">#{product.sku}</div>
        </div>

        <div className="phone-tabs">
          {PHONE_PRODUCTS.map((p, i) => (
            <button key={p.id} className={`phone-tab ${idx === i ? 'is-active' : ''}`} onClick={() => setIdx(i)}>
              {p.name.split(' · ')[0]}
            </button>
          ))}
        </div>

        <div className="status-card status-card-main">
          <div className="phone-product">
            <img src={product.img} alt={product.name} loading="lazy" />
            <span className="pp-tag">{product.tag}</span>
          </div>
          <div className="row1" style={{ marginTop: 10 }}>
            <div className="name">{product.name}</div>
            <div className="time">{product.eta}</div>
          </div>
          <div className="msg">{product.msg}</div>
          <div className="track">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`track-step ${i < product.stage ? 'done' : i === product.stage ? 'active' : ''}`}
              ></div>
            ))}
          </div>
          <div className="track-labels">
            {stageLabels.map((l) => <span key={l}>{l}</span>)}
          </div>
        </div>

        <div className="status-card" style={{ opacity: 0.85 }}>
          <div className="row1">
            <div className="name" style={{ fontSize: 12 }}>Order #VLT-3041</div>
            <div className="time">just now</div>
          </div>
          <div className="msg" style={{ fontSize: 12 }}>
            3 units of {product.name.split(' · ')[0]} reserved for in-store pickup at Helios Mart Chennai.
          </div>
        </div>

        <div style={{
          marginTop: 'auto',
          background: 'var(--accent-soft)',
          border: '1px solid var(--accent)',
          borderRadius: 12,
          padding: '12px 14px',
          display: 'flex',
          gap: 10,
          alignItems: 'center',
        }}>
          <div className="ai-glyph" style={{ width: 14, height: 14, background: 'var(--accent)', clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)' }}></div>
          <div style={{ fontSize: 12, color: 'var(--fg)' }}>
            <strong style={{ fontWeight: 500 }}>AI Update:</strong> {product.stage === 3 ? 'Delivery on track.' : 'Processing on schedule.'}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ StockPulse (streaming) ============
const ALERT_TEMPLATES = [
  { level: 'crit', tag: 'CRITICAL', title: 'Cromax Mumbai · LED-A60-9W', desc: '187 units below demand threshold · projected stockout in 11 hours', act: 'TRIGGER REALLOC' },
  { level: 'over', tag: 'OVERSTOCK', title: 'Lumen Delhi · LED-BR30-12W', desc: '234 surplus units · reallocation to Aurora Hyderabad advised', act: 'REVIEW PROPOSAL' },
  { level: 'ok', tag: 'TRANSFERRED', title: 'Voltavera → Aurora Hyderabad · LED-T8-18W', desc: '45 units reallocated · profit lift ₹8,200', act: 'VIEW RECEIPT' },
  { level: 'crit', tag: 'CRITICAL', title: 'Helios Pune · LED-PAR38-15W', desc: '94 units shortfall · regional demand spike detected', act: 'TRIGGER REALLOC' },
  { level: 'over', tag: 'OVERSTOCK', title: 'Aurora Hyderabad · LED-MR16-5W', desc: '167 surplus units · holding cost ₹245/day', act: 'REVIEW PROPOSAL' },
  { level: 'ok', tag: 'APPROVED', title: 'AI reco RECO-2851 · auto-approved', desc: '32 units · Helios → Voltavera · est. profit ₹6,400', act: 'TRACK SHIPMENT' },
];

function timeAgo(ms) {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.round(m / 60)}h ago`;
}

function StockPulse() {
  // Seed feed
  const [feed, setFeed] = React.useState(() => [
    { ...ALERT_TEMPLATES[0], id: 1, t: Date.now() - 120 * 1000 },
    { ...ALERT_TEMPLATES[1], id: 2, t: Date.now() - 480 * 1000 },
    { ...ALERT_TEMPLATES[2], id: 3, t: Date.now() - 23 * 60 * 1000 },
  ]);
  const [paused, setPaused] = React.useState(false);
  const [tick, setTick] = React.useState(0); // forces re-render to update time labels
  const nextIdRef = React.useRef(4);
  const nextTplRef = React.useRef(3);

  React.useEffect(() => {
    const tickT = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(tickT);
  }, []);

  React.useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      const tpl = ALERT_TEMPLATES[nextTplRef.current % ALERT_TEMPLATES.length];
      nextTplRef.current++;
      const id = nextIdRef.current++;
      setFeed((f) => [{ ...tpl, id, t: Date.now(), isNew: true }, ...f].slice(0, 8));
      // Clear isNew flag after animation
      setTimeout(() => {
        setFeed((f) => f.map((a) => a.id === id ? { ...a, isNew: false } : a));
      }, 700);
    }, 7000);
    return () => clearInterval(t);
  }, [paused]);

  const dismiss = (id) => setFeed((f) => f.filter((a) => a.id !== id));

  return (
    <section id="stockpulse">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">StockPulse</span>
          <h2 className="section-title">Never miss a signal.</h2>
          <p className="section-sub">A live feed of every replenishment, overstock and reallocation event across your network — built for ops teams that move fast.</p>
        </div>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: 32 }}>
          <span className={`live-dot ${paused ? 'is-paused' : ''}`}>{paused ? 'Stream paused' : 'Live feed · last 30 minutes'}</span>
          <div style={{ display:'flex', gap: 10, alignItems:'center' }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--fg-mute)', letterSpacing: '0.08em' }}>
              {feed.length} EVENT{feed.length !== 1 ? 'S' : ''} · AUTO-REFRESH 7s
            </span>
            <button className="btn btn-ghost btn-sm" onClick={() => setPaused((p) => !p)}>
              {paused ? '▶ Resume' : '❚❚ Pause'}
            </button>
          </div>
        </div>

        <div className="pulse-feed" style={{ maxWidth: 'none' }}>
          {feed.map((a) => (
            <div key={a.id} className={`alert ${a.isNew ? 'is-new' : ''}`}>
              <div className={`alert-icon ${a.level}`}>
                <span className="mono">{a.level === 'crit' ? '!' : a.level === 'over' ? '~' : '✓'}</span>
              </div>
              <div className="alert-body">
                <div className="ttl">
                  <span className={`pill ${a.level}`}><span className="ico"></span>{a.tag}</span>
                  {a.title}
                </div>
                <div className="desc">{a.desc}</div>
              </div>
              <div className="time">{timeAgo(Date.now() - a.t)}</div>
              <div className="alert-actions">
                <button className="act">{a.act} →</button>
                <button className="dismiss" onClick={() => dismiss(a.id)} title="Dismiss">×</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ Roadmap ============
function Roadmap() {
  const items = [
    { stage: 'Q2 · 26',     status: 'shipping',  statusLbl: 'SHIPPING',  progress: 100, name: 'StockPulse Alerts', desc: 'Real-time replenishment notifications.' },
    { stage: 'Q3 · 26',     status: 'beta',      statusLbl: 'BETA',      progress: 65,  name: 'PriceMinds AI',     desc: 'AI dynamic pricing per SKU, per region.' },
    { stage: 'Q4 · 26',     status: 'alpha',     statusLbl: 'ALPHA',     progress: 30,  name: 'SyncStock Hub',     desc: 'Cross-store inventory network with governance.' },
    { stage: '2027 +',      status: 'explore',   statusLbl: 'EXPLORING', progress: 8,   name: 'EcoLens Insights',  desc: 'Sustainability & waste analytics on reallocation.' },
  ];
  // Visual progress along the rail (segment index 0..n-2 between adjacent nodes)
  // 1.5 means seg 0 fully filled, seg 1 half filled, rest empty
  const railProgress = 1.55;
  return (
    <section id="roadmap">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Roadmap</span>
          <h2 className="section-title">What we're shipping next.</h2>
        </div>
        <div className="road-grid">
          {items.map((r, i) => {
            const isFirst = i === 0;
            const isLast = i === items.length - 1;
            // Segment to LEFT of this node = segment index (i-1)
            // Segment to RIGHT of this node = segment index i
            const leftFill = isFirst ? 0 : Math.max(0, Math.min(1, railProgress - (i - 1)));
            const rightFill = isLast ? 0 : Math.max(0, Math.min(1, railProgress - i));
            const isCurrent = i === Math.floor(railProgress) || (railProgress > i && railProgress < i + 1);
            return (
              <div key={i} className={`road-node road-${r.status} ${isCurrent ? 'is-current' : ''}`}>
                <div className="road-node-quarter mono">{r.stage}</div>
                <div className="road-rail-row" aria-hidden="true">
                  <div className={`road-seg road-seg-left ${isFirst ? 'is-hidden' : ''}`}>
                    <div className="road-seg-fill" style={{ width: `${leftFill * 100}%` }}></div>
                  </div>
                  <div className="road-dot">
                    <span className="dot-inner"></span>
                    <span className="dot-pulse"></span>
                  </div>
                  <div className={`road-seg road-seg-right ${isLast ? 'is-hidden' : ''}`}>
                    <div className="road-seg-fill" style={{ width: `${rightFill * 100}%` }}></div>
                    {rightFill > 0 && rightFill < 1 && (
                      <div className="road-seg-tip" style={{ left: `${rightFill * 100}%` }}></div>
                    )}
                  </div>
                </div>
                <div className="road-node-body">
                  <span className={`pill road-pill ${r.status}`}><span className="ico"></span>{r.statusLbl}</span>
                  <h3>{r.name}</h3>
                  <p>{r.desc}</p>
                  <div className="road-progress">
                    <div className="road-progress-bar">
                      <div className="road-progress-fill" style={{ width: `${r.progress}%` }}></div>
                    </div>
                    <span className="mono">{r.progress}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============ CTA ============
function CTABanner() {
  return (
    <section style={{ padding: 0 }}>
      <div className="wrap">
        <div className="cta-banner">
          <h2>Ready to stop leaving money on the shelf?</h2>
          <p>Join retail teams using Alto to automate reallocation and unlock hidden profit.</p>
          <button className="btn">Request Early Access <Icon.Arrow /></button>
        </div>
      </div>
    </section>
  );
}

// ============ Footer ============
function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="tagline">Predict. Reallocate. Deliver. Seamlessly.</div>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--fg-mute)', letterSpacing: '0.12em', marginBottom: 14 }}>PRODUCT</div>
            <div className="foot-links" style={{ flexDirection: 'column', gap: 10 }}>
              <a href="#features">Features</a>
              <a href="#usecase">Use Cases</a>
              <a href="#roadmap">Roadmap</a>
              <a href="#">Contact</a>
            </div>
          </div>
          <div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--fg-mute)', letterSpacing: '0.12em', marginBottom: 14 }}>BUILT WITH</div>
            <div className="stack">
              Google Generative AI<br />
              RAG-Enhanced Retrieval<br />
              scikit-learn forecasting<br />
              React + recharts
            </div>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2025 ALTO.ai · ALL RIGHTS RESERVED</span>
          <span>v2.6.0 · CHENNAI / BANGALORE</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { UseCase, StockPulse, Roadmap, CTABanner, Footer });
