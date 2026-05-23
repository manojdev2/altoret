// ============ SKU Live Ticker (Bloomberg-style marquee) ============
// Two scrolling rows of live SKU/store events. Pauses on hover.

const TICKER_ITEMS = [
  { code: 'LED-A60-9W',    city: 'Chennai',   status: 'crit', val: 'INV 12 / DEM 148',  delta: '−87 u' },
  { code: 'LED-BR30-12W',  city: 'Mumbai',    status: 'over', val: 'INV 287 / DEM 96',  delta: '+191 u' },
  { code: 'LED-T8-18W',    city: 'Delhi',     status: 'ok',   val: 'INV 234 / DEM 80',  delta: '+0 u' },
  { code: 'LED-PAR38-15W', city: 'Pune',      status: 'crit', val: 'INV 94 / DEM 188',  delta: '−94 u' },
  { code: 'LED-MR16-5W',   city: 'Hyderabad', status: 'over', val: 'INV 167 / DEM 102', delta: '+65 u' },
  { code: 'LED-CFL-23W',   city: 'Bangalore', status: 'ok',   val: 'INV 88 / DEM 92',   delta: '−4 u' },
  { code: 'LED-G9-3W',     city: 'Chennai',   status: 'ok',   val: 'INV 142 / DEM 130', delta: '+12 u' },
  { code: 'LED-A19-7W',    city: 'Mumbai',    status: 'crit', val: 'INV 18 / DEM 92',   delta: '−74 u' },
];

const TICKER_ROW_2 = [
  { code: 'RECO-2847', city: 'CHN → BLR', status: 'ok',   val: '60u · +₹12,000',  delta: 'APPROVED' },
  { code: 'RECO-2848', city: 'MUM → HYD', status: 'ok',   val: '110u · +₹18,600', delta: 'APPROVED' },
  { code: 'RECO-2849', city: 'DEL → PNE', status: 'over', val: '90u · +₹9,400',   delta: 'PENDING' },
  { code: 'RECO-2850', city: 'BLR → CHN', status: 'crit', val: 'flagged · profit < 0', delta: 'SKIPPED' },
  { code: 'RECO-2851', city: 'HYD → MUM', status: 'ok',   val: '32u · +₹6,400',   delta: 'AUTO' },
  { code: 'RECO-2852', city: 'PNE → DEL', status: 'ok',   val: '48u · +₹7,800',   delta: 'APPROVED' },
];

const statusLbl = (s) => s === 'crit' ? 'CRITICAL' : s === 'over' ? 'OVERSTOCK' : 'OPTIMAL';

function TickerRow({ items, reverse }) {
  // Duplicate items so the scroll loops seamlessly
  const doubled = [...items, ...items];
  return (
    <div className={`ticker-row ${reverse ? 'is-reverse' : ''}`}>
      <div className="ticker-track">
        {doubled.map((it, i) => (
          <div key={i} className="ticker-item">
            <span className={`pill ${it.status}`}><span className="ico"></span>{statusLbl(it.status)}</span>
            <span className="mono ticker-code">{it.code}</span>
            <span className="ticker-city">{it.city}</span>
            <span className="mono ticker-val">{it.val}</span>
            <span className={`mono ticker-delta ${it.status === 'crit' ? 'neg' : it.status === 'over' ? 'warn' : 'pos'}`}>{it.delta}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkuTicker() {
  return (
    <section className="ticker-section" aria-label="Live SKU and reallocation stream">
      <div className="ticker-head">
        <span className="ticker-head-dot"></span>
        <span className="mono">LIVE · STOCK & REALLOC STREAM · LAST 60 MIN</span>
        <span className="mono ticker-head-meta">14 EVENTS / MIN</span>
      </div>
      <TickerRow items={TICKER_ITEMS} />
      <TickerRow items={TICKER_ROW_2} reverse />
    </section>
  );
}

Object.assign(window, { SkuTicker });
