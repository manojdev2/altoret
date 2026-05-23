// ============ Navbar ============
function Navbar({ theme, onToggle }) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="wrap nav-row">
       <a href="#" className="brand">

  <img 
    src="/Alto.ai.png" 
    alt="Alto Retail Logo" 
    className="h-2  object-contain" width = "100px" />
    </a>
  
        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#how">How It Works</a>
          <a href="#usecase">Use Cases</a>
          <a href="#roadmap">Roadmap</a>
        </nav>
        <div className="nav-right">
          <button className="theme-toggle" onClick={onToggle} aria-label="Toggle theme">
            <span className="ico-sun"><Icon.Sun /></span>
            <span className="ico-moon"><Icon.Moon /></span>
          </button>
          <button className="btn btn-primary btn-sm">Request Demo</button>
        </div>
      </div>
      
    </header>
    
  );
}

// ============ Hero ============
function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true">
        <NetworkCanvas />
        <FloatingSKUs />
      </div>
      <div className="wrap hero-grid">
        <div>
          <div className="eyebrow">v2.6 · Inventory Intelligence</div>
          <h1 style={{ marginTop: 18 }}>
            Revolutionizing retail with <em>intelligent automation</em>.
          </h1>
          <p className="lead">
            Alto predicts demand, balances inventory across stores, and triggers AI-powered
            stock reallocation — so you never overstock or miss a sale.
          </p>
          <div className="hero-ctas">
            <a href="https://alto-theta.vercel.app/dashboard/dashboard-index"><button className="btn btn-primary">See It Live <Icon.Arrow /></button></a>
            <button className="btn btn-ghost">Watch Demo</button>
          </div>
          <div className="hero-meta">
            <span><span className="dot" style={{ display:'inline-block', verticalAlign:'middle', marginRight:8 }}></span> Live across 6 pilot stores</span>
            <span className="mono">SOC-2 ready · RAG-enhanced</span>
          </div>
        </div>
        <div>
          <HeroMap />
        </div>
      </div>
    </section>
  );
}

// ============ Recommendations data ============
const RECOS = [
  {
    id: 'RECO-2847',
    fromStore: 'Helios Mart',
    fromCity: 'Chennai',
    toStore: 'Voltavera',
    toCity: 'Bangalore',
    sku: 'LED-A60-9W',
    skuName: 'A60 Bulb · 9W · Warm',
    inv: 50, dem: 148, move: 60,
    distance: 428, profit: 12000, confidence: 94,
  },
  {
    id: 'RECO-2848',
    fromStore: 'Cromax Mumbai',
    fromCity: 'Mumbai',
    toStore: 'Aurora',
    toCity: 'Hyderabad',
    sku: 'LED-BR30-12W',
    skuName: 'BR30 Reflector · 12W',
    inv: 287, dem: 96, move: 110,
    distance: 712, profit: 18600, confidence: 89,
  },
  {
    id: 'RECO-2849',
    fromStore: 'Lumen Delhi',
    fromCity: 'Delhi',
    toStore: 'Helios Pune',
    toCity: 'Pune',
    sku: 'LED-T8-18W',
    skuName: 'T8 Tube · 18W · 4ft',
    inv: 234, dem: 80, move: 90,
    distance: 1456, profit: 9400, confidence: 81,
  },
];

function HeroDash() {
  const [idx, setIdx] = React.useState(0);
  const [approvedIds, setApprovedIds] = React.useState([]);
  const [profitUnlocked, setProfitUnlocked] = React.useState(0);
  const [actionState, setActionState] = React.useState(null); // 'approving' | 'skipping' | null
  const reco = RECOS[idx];

  const next = () => {
    setActionState(null);
    setIdx((i) => (i + 1) % RECOS.length);
  };

  const approve = () => {
    if (approvedIds.includes(reco.id) || actionState) return;
    setActionState('approving');
    setApprovedIds((a) => [...a, reco.id]);
    // Animate profit counter
    const start = profitUnlocked;
    const target = profitUnlocked + reco.profit;
    const t0 = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / 900);
      const eased = 1 - Math.pow(1 - t, 3);
      setProfitUnlocked(Math.round(start + (target - start) * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    setTimeout(next, 1700);
  };

  const skip = () => {
    if (actionState) return;
    setActionState('skipping');
    setTimeout(next, 500);
  };

  // Auto-advance idle
  React.useEffect(() => {
    if (actionState) return;
    const t = setTimeout(() => {
      if (!approvedIds.includes(reco.id)) skip();
    }, 9000);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [idx, actionState]);

  const isApproved = approvedIds.includes(reco.id);

  return (
    <div className="hero-dash">
      <div className={`dash-card ${actionState ? 'dash-card-' + actionState : ''}`}>
        <div className="dash-head">
          <div className="title">
            <span className="pulse"></span>
            <span className="mono" style={{ letterSpacing: '0.04em' }}>{reco.id}</span>
            <span style={{ color: 'var(--fg-mute)' }}>· Reallocation</span>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--fg-mute)' }}>
              {idx + 1}/{RECOS.length}
            </span>
            <span className="pill accent"><span className="ico"></span>LIVE</span>
          </div>
        </div>

        <div className="dash-row">
          <div className="dash-stat">
            <div className="lbl">From Store</div>
            <div className="val" style={{ fontSize: 17, marginTop: 6 }}>{reco.fromStore}</div>
            <div style={{ fontSize: 12, color: 'var(--fg-mute)', marginTop: 2 }}>{reco.fromCity}</div>
          </div>
          <div className="dash-stat">
            <div className="lbl">SKU</div>
            <div className="val mono" style={{ fontSize: 14, marginTop: 6 }}>{reco.sku}</div>
            <div style={{ fontSize: 12, color: 'var(--fg-mute)', marginTop: 2 }}>{reco.skuName}</div>
          </div>
          <div className="dash-stat">
            <div className="lbl">Inventory</div>
            <div className="val mono"><AnimatedNum n={reco.inv} /><small>units</small></div>
          </div>
          <div className="dash-stat">
            <div className="lbl">Forecast Demand</div>
            <div className="val mono" style={{ color: reco.dem > reco.inv ? 'var(--warn)' : 'var(--ok)' }}>
              <AnimatedNum n={reco.dem} /><small>units</small>
            </div>
          </div>
        </div>

        <div className={`dash-reco ${isApproved ? 'is-approved' : ''}`}>
          <div className="badge">
            <span className="ai-glyph"></span>
            AI RECOMMENDATION · {reco.confidence}% CONFIDENCE
          </div>
          <div className="copy">
            Send <strong>{reco.move} units</strong> from {reco.fromStore} → <strong>{reco.toStore} {reco.toCity}</strong>.
            Surplus rebalanced, demand met within {Math.round(reco.distance / 30)}h.
          </div>
          <div className="profit">
            <span className="num">+₹{reco.profit.toLocaleString()}</span>
            <span className="cap">PREDICTED PROFIT UNLOCK</span>
          </div>

          {!isApproved && (
            <div className="reco-actions">
              <button className="btn btn-primary btn-sm" onClick={approve} disabled={!!actionState}>
                {actionState === 'approving' ? 'Approving…' : 'Approve transfer'}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={skip} disabled={!!actionState}>
                Skip
              </button>
            </div>
          )}
          {isApproved && (
            <div className="reco-approved">
              <span className="check">✓</span>
              <span>Transfer initiated. Tracking shipment…</span>
            </div>
          )}
        </div>
      </div>

      <div className="floater floater-1">
        <div className="row">
          <span className="pill ok"><span className="ico"></span>UNLOCKED TODAY</span>
          <span className="v mono">₹<AnimatedNum n={profitUnlocked} format={(v) => v.toLocaleString()} /></span>
        </div>
      </div>
      <div className="floater floater-2">
        <div className="row">
          <span className="k">Approved</span>
          <span className="v mono">{String(approvedIds.length).padStart(2, '0')} / {String(RECOS.length).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
}

// Cheap animated number for sub-component use
function AnimatedNum({ n, format }) {
  const [v, setV] = React.useState(n);
  const prev = React.useRef(n);
  React.useEffect(() => {
    const from = prev.current;
    const to = n;
    prev.current = n;
    if (from === to) return;
    const t0 = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / 600);
      const e = 1 - Math.pow(1 - t, 3);
      setV(Math.round(from + (to - from) * e));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [n]);
  return <>{format ? format(v) : v}</>;
}

// ============ Problem strip ============
function ProblemStrip() {
  const items = [
    {
      n: '01',
      icon: <Icon.Scale />,
      title: 'Stock balance breaks every day',
      desc: 'Excess units stranded in one store while neighboring stores run dry.',
      stat: '−₹2.4Cr',
      statLbl: 'monthly bleed',
    },
    {
      n: '02',
      icon: <Icon.Coin />,
      title: 'Holding cost compounds silently',
      desc: 'Every misplaced SKU adds 1.5%/day in carrying cost — margin you never priced.',
      stat: '7.2%',
      statLbl: 'holding overhead',
    },
    {
      n: '03',
      icon: <Icon.Truck />,
      title: 'Logistics taxes every transfer',
      desc: 'Long-haul rebalancing eats lift cost faster than the recovered sale.',
      stat: '₹0.012/u·km',
      statLbl: 'lift overhead',
    },
  ];
  return (
    <section id="problem">
<iframe
  width="100%"
  height="500"
  src="https://player.vimeo.com/video/1109621598?h=f0afb8d117&autoplay=1&muted=1&loop=1&background=1"
  title="Alto AI Video"
  frameBorder="0"
  allow="autoplay; fullscreen"
  allowFullScreen
  className="rounded-2xl"
></iframe>
<div className="wrap">
        <div className="section-head">

          <span className="eyebrow">The Problem</span>
          <h2 className="section-title">Retail loses 8% of revenue to mis-allocated inventory.</h2>
        </div>
        <div className="problem-layout">
          <div className="problem-stat">
            <div className="problem-stat-pct">
              <span className="num">8</span>
              <span className="sign">%</span>
            </div>
            <div className="mono problem-stat-lbl">OF REVENUE · LOST</div>
            <div className="problem-stat-desc">
              Avg Indian retailer · across regional FMCG &amp; lighting networks · 2024
            </div>
            <div className="problem-stat-trend">
              <svg width="100%" height="44" viewBox="0 0 200 44" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--critical)" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="var(--critical)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M 0 34 L 22 30 L 44 32 L 66 26 L 88 28 L 110 22 L 132 24 L 154 18 L 176 14 L 200 8 L 200 44 L 0 44 Z" fill="url(#sparkFill)" />
                <polyline points="0,34 22,30 44,32 66,26 88,28 110,22 132,24 154,18 176,14 200,8"
                  stroke="var(--critical)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="200" cy="8" r="3.5" fill="var(--critical)" />
              </svg>
              <div className="trend-row">
                <span className="mono"><span className="up-arrow">▲</span> +0.6 pp YoY</span>
                <span className="mono">2019—2024</span>
              </div>
            </div>
          </div>

          <div className="problem-rows">
            {items.map((it) => (
              <div key={it.n} className="problem-row">
                <div className="problem-row-n mono">{it.n}</div>
                <div className="problem-row-glyph">{it.icon}</div>
                <div className="problem-row-body">
                  <div className="problem-row-ttl">{it.title}</div>
                  <div className="problem-row-desc">{it.desc}</div>
                </div>
                <div className="problem-row-stat">
                  <div className="v mono">{it.stat}</div>
                  <div className="l">{it.statLbl}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ How it works ============
function HowItWorks() {
  const steps = [
    { n: '01', title: 'Read Data',        desc: 'Internal sales + external signals across regions, categories and brands.' },
    { n: '02', title: 'AI Forecasting',   desc: 'Demand modeled at region × category × brand level with transformer regressors.' },
    { n: '03', title: 'Reallocation',     desc: 'Geospatial routing picks the optimal store-to-store transfer.' },
    { n: '04', title: 'Trigger & Track',  desc: 'One-click execution with live profit prediction and shipment tracking.' },
  ];
  return (
    <section id="how">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">How It Works</span>
          <h2 className="section-title">From signal to shelf, in four steps.</h2>
        </div>
        <div className="how-flow">
          <div className="how-rail" aria-hidden="true">
            <div className="how-rail-line"></div>
            <div className="how-rail-packet"></div>
          </div>
          <div className="how-grid">
            {steps.map((s, i) => (
              <div key={s.n} className="how-step">
                <div className="how-num" aria-hidden="true">{s.n}</div>
                <div className="how-node">
                  <span className="how-node-dot"></span>
                </div>
                <div className="how-step-body">
                  <div className="mono how-step-tag">STEP {s.n}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Navbar, Hero, HeroDash, AnimatedNum, ProblemStrip, HowItWorks });
