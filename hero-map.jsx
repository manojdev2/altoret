// ============ Hero Map (Leaflet + OSM tiles) ============
// Real-tile map of the 6 pilot stores, with health-coded pins and an
// animated dashed transfer route between source and destination.

// City lat/lng for Alto's 6 pilot stores
const CITY_GEO = {
  'Helios Mart':       { lat: 13.0827, lng: 80.2707, label: 'Chennai' },     // CHN
  'Voltavera':         { lat: 12.9716, lng: 77.5946, label: 'Bangalore' },   // BLR
  'Cromax Mumbai':     { lat: 19.0760, lng: 72.8777, label: 'Mumbai' },      // MUM
  'Cromax':            { lat: 19.0760, lng: 72.8777, label: 'Mumbai' },      // alt name from RECO_PAIRS
  'Aurora':            { lat: 17.3850, lng: 78.4867, label: 'Hyderabad' },   // HYD
  'Lumen':             { lat: 28.6139, lng: 77.2090, label: 'Delhi' },       // DEL
  'Lumen Delhi':       { lat: 28.6139, lng: 77.2090, label: 'Delhi' },
  'Helios Pune':       { lat: 18.5204, lng: 73.8567, label: 'Pune' },        // PNE
};

// Health snapshot per store (matches STORE_NETWORK in sections-2.jsx)
const STORE_HEALTH = [
  { key: 'Helios Mart',   inv: 12,  dem: 148, status: 'crit', sub: 'Helios · Chennai' },
  { key: 'Voltavera',     inv: 92,  dem: 102, status: 'ok',   sub: 'Voltavera · Bangalore' },
  { key: 'Cromax Mumbai', inv: 287, dem: 96,  status: 'over', sub: 'Cromax · Mumbai' },
  { key: 'Lumen Delhi',   inv: 78,  dem: 84,  status: 'ok',   sub: 'Lumen · Delhi' },
  { key: 'Aurora',        inv: 23,  dem: 134, status: 'crit', sub: 'Aurora · Hyderabad' },
  { key: 'Helios Pune',   inv: 240, dem: 110, status: 'over', sub: 'Helios · Pune' },
];

// Status → color (resolved at render via CSS var, but kept here for inline use)
const STATUS_HEX = {
  crit: { dark: '#F86E66', light: '#C8362E' },
  ok:   { dark: '#fe6624', light: '#c94d0f' },
  over: { dark: '#F2B860', light: '#B5781A' },
};

function pctOf(s) {
  return Math.min(199, Math.round((s.inv / s.dem) * 100));
}

// Truck/store glyph
const SHOP_SVG = `
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 9 L4 4 H20 L21 9" />
    <path d="M3 9 V20 H21 V9" />
    <path d="M3 9 H21" />
    <path d="M9 20 V14 H15 V20" />
  </svg>
`;

function makePinHtml(s) {
  const pct = pctOf(s);
  return `
    <div class="map-pin map-pin-${s.status}">
      <div class="map-pin-badge">${pct}%</div>
      <div class="map-pin-shop">${SHOP_SVG}</div>
    </div>
  `;
}

function HeroMap() {
  const [idx, setIdx] = React.useState(0);
  const [approvedCount, setApprovedCount] = React.useState(0);
  const [profit, setProfit] = React.useState(0);
  const [phase, setPhase] = React.useState('arriving');
  const [theme, setTheme] = React.useState(() => document.documentElement.getAttribute('data-theme') || 'dark');
  const reco = RECOS[idx];

  const mapRef = React.useRef(null);
  const mapEl = React.useRef(null);
  const tileLayerRef = React.useRef(null);
  const routeLayerRef = React.useRef(null);
  const packetMarkerRef = React.useRef(null);
  const packetAnimRef = React.useRef(null);

  const from = CITY_GEO[reco.fromStore];
  const to = CITY_GEO[reco.toStore];

  // Watch theme changes
  React.useEffect(() => {
    const obs = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  // Init map once
  React.useEffect(() => {
    if (!mapEl.current || mapRef.current) return;
    const map = L.map(mapEl.current, {
      center: [21.5, 78.5],
      zoom: 5,
      minZoom: 4,
      maxZoom: 7,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      dragging: true,
      touchZoom: false,
    });
    mapRef.current = map;

    // Fit bounds to all stores
    const all = STORE_HEALTH.map((s) => [CITY_GEO[s.key].lat, CITY_GEO[s.key].lng]);
    map.fitBounds(all, { padding: [40, 40] });

    // Add pins
    STORE_HEALTH.forEach((s) => {
      const g = CITY_GEO[s.key];
      const icon = L.divIcon({
        className: 'map-pin-wrap',
        html: makePinHtml(s),
        iconSize: [56, 64],
        iconAnchor: [28, 56],
      });
      L.marker([g.lat, g.lng], { icon, riseOnHover: true, keyboard: false })
        .bindTooltip(`${s.sub} · INV ${s.inv} / DEM ${s.dem}`, {
          direction: 'top',
          offset: [0, -50],
          className: 'map-tooltip',
        })
        .addTo(map);
    });

    // Tiny attribution in the corner
    L.control.attribution({ prefix: false, position: 'bottomright' })
      .addAttribution('© OpenStreetMap · © CARTO')
      .addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Swap tile layer when theme changes
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
      tileLayerRef.current = null;
    }
    const url = theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png';
    const labelsUrl = theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png';
    const base = L.tileLayer(url, { subdomains: 'abcd', maxZoom: 19, detectRetina: true }).addTo(map);
    const labels = L.tileLayer(labelsUrl, { subdomains: 'abcd', maxZoom: 19, detectRetina: true, opacity: 0.85 }).addTo(map);
    tileLayerRef.current = {
      remove() { map.removeLayer(base); map.removeLayer(labels); }
    };
  }, [theme]);

  // Draw/animate active route on idx change
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map || !from || !to) return;

    // Clear previous
    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }
    if (packetMarkerRef.current) {
      map.removeLayer(packetMarkerRef.current);
      packetMarkerRef.current = null;
    }
    if (packetAnimRef.current) {
      cancelAnimationFrame(packetAnimRef.current);
      packetAnimRef.current = null;
    }

    setPhase('arriving');

    const accent = theme === 'dark' ? STATUS_HEX.ok.dark : STATUS_HEX.ok.light;

    // Curved-ish route — interpolate with a slight perpendicular bow
    const pts = curvedRoute(
      [from.lat, from.lng],
      [to.lat, to.lng],
      0.18,
      40
    );

    const line = L.polyline(pts, {
      color: accent,
      weight: 2.5,
      opacity: 0.95,
      dashArray: '6 7',
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);
    routeLayerRef.current = line;

    // Packet marker (DivIcon dot)
    const packetIcon = L.divIcon({
      className: 'map-packet-wrap',
      html: `<div class="map-packet"></div><div class="map-packet-halo"></div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });
    const packet = L.marker(pts[0], { icon: packetIcon, interactive: false, keyboard: false }).addTo(map);
    packetMarkerRef.current = packet;

    // Animate packet along pts over ~2s
    const t0 = performance.now();
    const dur = 2000;
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      const i = Math.min(pts.length - 1, Math.floor(eased * (pts.length - 1)));
      packet.setLatLng(pts[i]);
      if (t < 1) {
        packetAnimRef.current = requestAnimationFrame(tick);
      }
    };
    packetAnimRef.current = requestAnimationFrame(tick);

    // Phases: commit + next
    const t1 = setTimeout(() => setPhase('committing'), 2100);
    const t2 = setTimeout(() => {
      setProfit((p) => p + reco.profit);
      setApprovedCount((c) => c + 1);
      setPhase('done');
    }, 2300);
    const t3 = setTimeout(() => {
      setIdx((i) => (i + 1) % RECOS.length);
    }, 5400);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      if (packetAnimRef.current) cancelAnimationFrame(packetAnimRef.current);
    };
  }, [idx, theme]);

  return (
    <div className="hero-map">
      <div className="map-card">
        <div className="map-head">
          <div className="title">
            <span className="pulse"></span>
            <span className="mono" style={{ letterSpacing: '0.04em' }}>{reco.id}</span>
            <span style={{ color: 'var(--fg-mute)' }}>· Live transfer</span>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--fg-mute)' }}>
              {idx + 1}/{RECOS.length}
            </span>
            <span className="pill accent"><span className="ico"></span>LIVE</span>
          </div>
        </div>

        <div className="map-leaflet-wrap">
          <div ref={mapEl} className="map-leaflet" />
          <div className="map-corner-tag mono">INDIA · PILOT NETWORK · 6 STORES</div>
          <div className="map-phase-tag mono">
            {phase === 'arriving' ? 'IN TRANSIT' : phase === 'committing' ? 'COMMITTING' : 'SETTLED'}
          </div>
        </div>

        <div className="map-strip">
          <div className="map-strip-col">
            <div className="lbl mono">FROM</div>
            <div className="val">{reco.fromStore}</div>
            <div className="sub">{reco.fromCity}</div>
          </div>
          <div className="map-strip-arrow">
            <svg width="36" height="14" viewBox="0 0 36 14" fill="none">
              <path d="M 1 7 L 30 7 M 24 2 L 30 7 L 24 12" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="mono">{reco.move} UNITS</span>
          </div>
          <div className="map-strip-col">
            <div className="lbl mono">TO</div>
            <div className="val">{reco.toStore}</div>
            <div className="sub">{reco.toCity}</div>
          </div>
          <div className="map-strip-col map-strip-profit">
            <div className="lbl mono">PROFIT UNLOCK</div>
            <div className="val accent">+₹{reco.profit.toLocaleString()}</div>
            <div className="sub">{reco.confidence}% confidence</div>
          </div>
        </div>
      </div>

      <div className="floater floater-1">
        <div className="row">
          <span className="pill ok"><span className="ico"></span>UNLOCKED TODAY</span>
          <span className="v mono">₹<AnimatedNum n={profit} format={(v) => v.toLocaleString()} /></span>
        </div>
      </div>
      <div className="floater floater-2">
        <div className="row">
          <span className="k">Approved</span>
          <span className="v mono">{String(approvedCount).padStart(2, '0')} / {String(RECOS.length).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  );
}

// ============ Helpers ============
// Curved polyline between two lat/lng points (slight perpendicular bow).
function curvedRoute(a, b, bow = 0.2, steps = 32) {
  const [lat1, lng1] = a;
  const [lat2, lng2] = b;
  const mx = (lat1 + lat2) / 2;
  const my = (lng1 + lng2) / 2;
  // Perpendicular offset
  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;
  const len = Math.sqrt(dLat * dLat + dLng * dLng);
  const nLat = -dLng / (len || 1);
  const nLng = dLat / (len || 1);
  const cx = mx + nLat * len * bow;
  const cy = my + nLng * len * bow;
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const omt = 1 - t;
    const lat = omt * omt * lat1 + 2 * omt * t * cx + t * t * lat2;
    const lng = omt * omt * lng1 + 2 * omt * t * cy + t * t * lng2;
    pts.push([lat, lng]);
  }
  return pts;
}

Object.assign(window, { HeroMap });
