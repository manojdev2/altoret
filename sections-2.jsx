// ============ Features ============
function Features() {
  return (
    <section id="features">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Capabilities</span>
          <h2 className="section-title">Three engines. One platform. Every decision automated.</h2>
        </div>

        <FeatureBalancing />
        <FeatureAIReco />
        <FeatureForecast />
      </div>
    </section>
  );
}

// ============ Network Health (interactive) ============
const STORE_NETWORK = [
  { id: 's1', name: 'Helios', city: 'Chennai',   inv: 12,  dem: 148, cap: 220 },
  { id: 's2', name: 'Voltavera', city: 'Bangalore', inv: 92, dem: 102, cap: 220 },
  { id: 's3', name: 'Cromax', city: 'Mumbai',    inv: 287, dem: 96,  cap: 220 },
  { id: 's4', name: 'Lumen', city: 'Delhi',      inv: 78,  dem: 84,  cap: 220 },
  { id: 's5', name: 'Aurora', city: 'Hyderabad', inv: 23,  dem: 134, cap: 220 },
  { id: 's6', name: 'Helios', city: 'Pune',      inv: 240, dem: 110, cap: 220 },
];

function classify(s) {
  const ratio = s.inv / s.dem;
  if (ratio < 0.5) return 'crit';
  if (ratio > 1.7) return 'over';
  return 'ok';
}

function FeatureBalancing() {
  const [stores, setStores] = React.useState(STORE_NETWORK);
  const [focusedId, setFocusedId] = React.useState(null);
  const [rebalancing, setRebalancing] = React.useState(false);

  const focused = focusedId ? stores.find((s) => s.id === focusedId) : null;

  const proposed = React.useMemo(() => {
    // Pair surplus → deficit
    const surplus = stores.filter((s) => classify(s) === 'over').sort((a, b) => b.inv - a.inv);
    const deficit = stores.filter((s) => classify(s) === 'crit').sort((a, b) => b.dem - a.dem);
    const pairs = [];
    surplus.forEach((src, i) => {
      const dst = deficit[i];
      if (!dst) return;
      const move = Math.min(src.inv - src.dem, dst.dem - dst.inv);
      pairs.push({ src: src.id, dst: dst.id, move: Math.max(0, Math.round(move * 0.8)) });
    });
    return pairs;
  }, [stores]);

  const runRebalance = () => {
    if (rebalancing || proposed.length === 0) return;
    setRebalancing(true);
    setFocusedId(null);
    // Apply transfers progressively
    let step = 0;
    const apply = () => {
      if (step >= proposed.length) {
        setTimeout(() => setRebalancing(false), 600);
        return;
      }
      const p = proposed[step];
      setStores((s) =>
        s.map((st) => {
          if (st.id === p.src) return { ...st, inv: st.inv - p.move };
          if (st.id === p.dst) return { ...st, inv: st.inv + p.move };
          return st;
        })
      );
      step++;
      setTimeout(apply, 700);
    };
    setTimeout(apply, 400);
  };

  const reset = () => setStores(STORE_NETWORK);

  return (
    <div className="feature-row">
      <div className="feature-copy">
        <span className="pill data"><span className="ico"></span>FEATURE · 01 · INTERACTIVE</span>
        <h2>Overstock & Understock Balancing.</h2>
        <p>
          Alto identifies stores with excess stock and those facing shortages — then
          automatically recommends the right reallocation to balance supply across your network.
        </p>
        <ul className="feature-bullets">
          <li>Real-time inventory health across every store</li>
          <li>Threshold-aware alerts for criticality + surplus</li>
          <li>One-tap rebalance proposals with predicted lift</li>
        </ul>
        <div style={{ marginTop: 24, display: 'flex', gap: 10 }}>
          <button className="btn btn-primary btn-sm" onClick={runRebalance} disabled={rebalancing || proposed.length === 0}>
            {rebalancing ? 'Rebalancing…' : `Run rebalance (${proposed.length})`}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={reset} disabled={rebalancing}>
            Reset
          </button>
        </div>
      </div>

      <div className="visual visual-balancing">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>
            Network Health
            {focused && <span style={{ color: 'var(--fg-mute)', marginLeft: 8, fontWeight: 400 }}>· {focused.name} {focused.city}</span>}
          </div>
          <span className="pill accent mono"><span className="ico"></span>6 STORES · LIVE</span>
        </div>

        <div className="store-grid">
          {stores.map((s) => {
            const status = classify(s);
            const w = Math.min(100, Math.round((s.inv / s.cap) * 100));
            const isFocused = focusedId === s.id;
            const isAffected = rebalancing && proposed.some((p) => p.src === s.id || p.dst === s.id);
            return (
              <div
                key={s.id}
                className={`store-cell ${isFocused ? 'is-focused' : ''} ${isAffected ? 'is-active' : ''}`}
                onClick={() => setFocusedId(isFocused ? null : s.id)}
              >
                <div className="name">
                  <span>{s.name}</span>
                  <span className={`pill ${status}`}><span className="ico"></span>{status === 'crit' ? 'CRITICAL' : status === 'over' ? 'OVERSTOCK' : 'OPTIMAL'}</span>
                </div>
                <div className="city">{s.city}</div>
                <div className="bar"><div className={`bar-fill ${status}`} style={{ width: `${w}%` }}></div></div>
                <div className="meta">
                  <span>INV <AnimatedNum n={s.inv} /></span>
                  <span>DEM {s.dem}</span>
                </div>
              </div>
            );
          })}
        </div>

        {focused && !rebalancing && (
          <div className="store-detail">
            <div className="row">
              <span className="k">Capacity</span>
              <span className="v">{focused.cap} units</span>
            </div>
            <div className="row">
              <span className="k">Headroom</span>
              <span className="v">{focused.cap - focused.inv} units</span>
            </div>
            <div className="row">
              <span className="k">Gap</span>
              <span className="v" style={{ color: focused.dem > focused.inv ? 'var(--critical)' : 'var(--ok)' }}>
                {focused.dem - focused.inv > 0 ? '−' : '+'}{Math.abs(focused.dem - focused.inv)} units
              </span>
            </div>
          </div>
        )}

        <div style={{
          marginTop: 16,
          fontFamily: "'Geist Mono', monospace",
          fontSize: 11,
          color: 'var(--fg-mute)',
          letterSpacing: '0.06em',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <span>{rebalancing ? 'EXECUTING TRANSFERS…' : 'UPDATED 12s AGO'}</span>
          <span style={{ color: 'var(--accent)' }}>
            {proposed.length === 0 ? 'NETWORK BALANCED ✓' : `${proposed.length} REBALANCE${proposed.length > 1 ? 'S' : ''} PROPOSED`}
          </span>
        </div>
      </div>
    </div>
  );
}

// ============ AI Reco (interactive slider) ============
const RECO_PAIRS = [
  { from: 'Helios Mart', fromCity: 'Chennai', fromZip: '600040', to: 'Voltavera', toCity: 'Bangalore', toZip: '560001', distance: 428, surplus: 200, deficit: 130 },
  { from: 'Cromax', fromCity: 'Mumbai', fromZip: '400001', to: 'Aurora', toCity: 'Hyderabad', toZip: '500001', distance: 712, surplus: 240, deficit: 110 },
  { from: 'Lumen', fromCity: 'Delhi', fromZip: '110001', to: 'Helios', toCity: 'Pune', toZip: '411001', distance: 1456, surplus: 234, deficit: 90 },
];

function FeatureAIReco() {
  const [pairIdx, setPairIdx] = React.useState(0);
  const pair = RECO_PAIRS[pairIdx];
  const [units, setUnits] = React.useState(60);
  const [executed, setExecuted] = React.useState(false);

  // Pricing model (per-unit)
  const PRICE = 280;     // sell price per unit
  const HOLD_DAILY = 1.5; // holding cost per unit/day
  const LIFT_PER_UNIT_KM = 0.012;

  const liftCost = Math.round(units * pair.distance * LIFT_PER_UNIT_KM);
  const timeH = Math.max(8, Math.round(pair.distance / 30));
  // Profit = (price - hold cost saved + sales recovered) * units - liftCost  (simplified illustrative)
  const baseProfit = Math.round(units * PRICE * 0.10);
  const holdSavings = Math.round(units * HOLD_DAILY * Math.max(0, 14 - timeH / 24));
  const profit = baseProfit + holdSavings - liftCost;
  const confidence = Math.max(60, Math.min(98, Math.round(95 - Math.abs(units - 60) * 0.3 - pair.distance * 0.01)));

  const cyclePair = () => {
    setExecuted(false);
    setPairIdx((i) => (i + 1) % RECO_PAIRS.length);
    setUnits(60);
  };

  const execute = () => {
    setExecuted(true);
    setTimeout(() => {
      cyclePair();
    }, 1800);
  };

  return (
    <div className="feature-row alt">
      <div className="feature-copy">
        <span className="pill accent"><span className="ico"></span>FEATURE · 02 · RAG-ENHANCED</span>
        <h2>The AI Reallocation Engine.</h2>
        <p>
          Our AI engine doesn't just flag the problem — it tells you exactly how many units to
          move, which store to move them to, and what profit you'll unlock. Drag the slider to
          see how the model re-prices each decision in real time.
        </p>
        <ul className="feature-bullets">
          <li>Geospatial routing across 100+ pin codes</li>
          <li>Profit-aware: factors lift cost, holding cost, demand decay</li>
          <li>Built on Google Generative AI with retrieval augmentation</li>
        </ul>
      </div>
      <div className="visual">
        <div className={`ai-card ${executed ? 'is-executed' : ''}`}>
          <div className="top">
            <span className="tag">Recommendation · {String(pairIdx + 1).padStart(2, '0')} of {String(RECO_PAIRS.length).padStart(2, '0')}</span>
            <span className={`pill ${confidence > 85 ? 'ok' : confidence > 72 ? 'data' : 'over'}`}>
              <span className="ico"></span>{confidence > 85 ? 'HIGH' : confidence > 72 ? 'MEDIUM' : 'EXPLORATORY'} · {confidence}%
            </span>
          </div>
          <div className="transfer">
            <div className="node">
              <div className="role">From</div>
              <div className="store">{pair.from}</div>
              <div className="city">{pair.fromCity} · {pair.fromZip}</div>
            </div>
            <div className="arrow">
              <span>{units} UNITS</span>
              <span className="line"></span>
              <span>{pair.distance} KM</span>
            </div>
            <div className="node">
              <div className="role">To</div>
              <div className="store">{pair.to}</div>
              <div className="city">{pair.toCity} · {pair.toZip}</div>
            </div>
          </div>

          <div className="slider-row">
            <label className="slider-lbl">
              <span>Units to move</span>
              <span className="mono">{units}</span>
            </label>
            <input
              type="range"
              min="10"
              max="180"
              step="5"
              value={units}
              onChange={(e) => { setExecuted(false); setUnits(parseInt(e.target.value, 10)); }}
              className="alto-slider"
            />
            <div className="slider-scale">
              <span>10</span>
              <span>conservative</span>
              <span>aggressive</span>
              <span>180</span>
            </div>
          </div>

          <div className="kv-grid">
            <div className="kv">
              <div className="k">Lift Cost</div>
              <div className="v">₹<AnimatedNum n={liftCost} format={(v) => v.toLocaleString()} /></div>
            </div>
            <div className="kv">
              <div className="k">Time to Shelf</div>
              <div className="v">{timeH}h</div>
            </div>
            <div className="kv">
              <div className="k">Predicted Profit</div>
              <div className="v" style={{ color: profit > 0 ? 'var(--ok)' : 'var(--critical)' }}>
                {profit > 0 ? '+' : '−'}₹<AnimatedNum n={Math.abs(profit)} format={(v) => v.toLocaleString()} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={execute} disabled={executed || profit < 0}>
              {executed ? 'Transfer initiated ✓' : 'Approve transfer'}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={cyclePair}>Next reco →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ Forecast (interactive) ============
const FORECAST_CATEGORIES = ['LED', 'Smart Bulbs', 'Strip Lights'];
const FORECAST_REGIONS = ['South', 'North', 'West', 'East'];

function makeForecastData(cat, region) {
  // Deterministic pseudo-random based on cat+region
  const seed = (cat + region).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = (i) => {
    const x = Math.sin(seed + i) * 10000;
    return x - Math.floor(x);
  };
  const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
  const base = { LED: 1000, 'Smart Bulbs': 720, 'Strip Lights': 540 }[cat] || 800;
  const seasonal = [0.85, 0.95, 1.25, 1.55, 1.1, 1.0, 1.18, 1.32, 1.45];
  return months.map((m, i) => {
    const expected = Math.round(base * seasonal[i] * (1 + (rng(i) - 0.5) * 0.04));
    const noise = (rng(i + 100) - 0.5) * base * 0.12;
    const actual = i < 8 ? Math.round(expected + noise) : null;
    return { m, actual, predicted: expected };
  });
}

function FeatureForecast() {
  const [cat, setCat] = React.useState('LED');
  const [region, setRegion] = React.useState('South');
  const data = React.useMemo(() => makeForecastData(cat, region), [cat, region]);

  const [vars, setVars] = React.useState({ accent: '#c94d0f', data1: '#1F5BB8', fgMute: '#6B7689', grid: '#eee' });
  React.useEffect(() => {
    const read = () => {
      const cs = getComputedStyle(document.documentElement);
      setVars({
        accent: cs.getPropertyValue('--accent').trim() || '#c94d0f',
        data1: cs.getPropertyValue('--data').trim() || '#1F5BB8',
        fgMute: cs.getPropertyValue('--fg-mute').trim() || '#6B7689',
        grid: cs.getPropertyValue('--grid-line').trim() || '#eee',
      });
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => mo.disconnect();
  }, []);
  const { accent, data1, fgMute, grid } = vars;

  const { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } = window.Recharts;

  // Compute MAPE for this dataset
  const mape = React.useMemo(() => {
    const errs = data.filter(d => d.actual != null).map(d => Math.abs(d.actual - d.predicted) / d.predicted);
    const avg = errs.reduce((a, b) => a + b, 0) / errs.length;
    return (avg * 100).toFixed(1);
  }, [data]);

  return (
    <div className="feature-row">
      <div className="feature-copy">
        
        <span className="pill ok"><span className="ico"></span>FEATURE · 03 · INTERACTIVE</span>
        <h2>Demand Forecasting.</h2>
        <p>
          Forecast demand at a region × product category × brand level using both internal sales
          history and external market signals. Switch categories and regions to see how the model
          adapts.
        </p>
        <ul className="feature-bullets">
          <li>9-month rolling forecast with weekly re-training</li>
          <li>External signals: weather, events, festivals, economic indicators</li>
          <li>Backtested MAPE under 8% on LED category</li>
        </ul>
      </div>
      <div className="visual">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{cat} · {region} Zone</div>
            <div style={{ fontSize: 11, color: 'var(--fg-mute)', fontFamily: "'Geist Mono', monospace", letterSpacing: '0.06em', marginTop: 2 }}>9-MONTH FORECAST · UNITS / WEEK</div>
          </div>
          <span className="pill data mono"><span className="ico"></span>MAPE {mape}%</span>
        </div>

        <div className="seg-tabs">
          {FORECAST_CATEGORIES.map((c) => (
            <button key={c} className={`seg ${cat === c ? 'is-active' : ''}`} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
        <div className="seg-tabs seg-tabs-sub">
          {FORECAST_REGIONS.map((r) => (
            <button key={r} className={`seg seg-sm ${region === r ? 'is-active' : ''}`} onClick={() => setRegion(r)}>{r}</button>
          ))}
        </div>

        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 16, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="gActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accent} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={accent} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gPred" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={data1} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={data1} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={grid} vertical={false} />
              <XAxis dataKey="m" stroke={fgMute} fontSize={11} fontFamily="Geist Mono, monospace" tickLine={false} axisLine={false} />
              <YAxis stroke={fgMute} fontSize={11} fontFamily="Geist Mono, monospace" tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-elev)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 8,
                  fontSize: 12,
                  fontFamily: 'Geist Mono, monospace',
                }}
                labelStyle={{ color: 'var(--fg)' }}
                itemStyle={{ color: 'var(--fg)' }}
              />
              <Area type="monotone" dataKey="predicted" stroke={data1} strokeWidth={2} fill="url(#gPred)" strokeDasharray="4 3" />
              <Area type="monotone" dataKey="actual" stroke={accent} strokeWidth={2.2} fill="url(#gActual)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-legend">
          <span><span className="swatch" style={{ background: accent }}></span>Actual demand</span>
          <span><span className="swatch" style={{ background: data1 }}></span>AI prediction</span>
        </div>
      </div>
    </div>
  );
}

// ============ Metrics band ============
function MetricsBand() {
  return (
    <section className="band" style={{ padding: 0 }}>
      <div style={{ padding: '72px 0' }}>
        <div className="wrap">
          <div className="metrics">
            <div className="metric">
              <div className="v"><CountUp to={2847} /><span className="unit">+</span></div>
              <div className="l">SKUs tracked across pilot</div>
            </div>
            <div className="metric">
              <div className="v"><CountUp to={54} prefix="₹" /><span className="unit">K</span></div>
              <div className="l">Avg monthly profit unlocked</div>
            </div>
            <div className="metric">
              <div className="v"><CountUp to={6} /></div>
              <div className="l">Connected stores in network</div>
            </div>
            <div className="metric">
              <div className="v"><CountUp to={3} /></div>
              <div className="l">AI-triggered reallocations today</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Features, MetricsBand });
