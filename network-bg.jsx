// ============ Animated Inventory Network ============
// Canvas-based store network with packets traveling between nodes,
// representing reallocation flows. Recolors live with theme/accent changes.

function NetworkCanvas({ density = 'normal' }) {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const dpr = window.devicePixelRatio || 1;

    let W = 0, H = 0;
    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);

    // Store constellation — positions in [0..1]
    const nodes = [
      { x: 0.08, y: 0.22, label: 'CHN', size: 1.0 },
      { x: 0.24, y: 0.62, label: 'BLR', size: 1.2 },
      { x: 0.42, y: 0.18, label: 'MUM', size: 1.4 },
      { x: 0.58, y: 0.78, label: 'HYD', size: 1.0 },
      { x: 0.74, y: 0.32, label: 'DEL', size: 1.3 },
      { x: 0.92, y: 0.66, label: 'PNE', size: 0.9 },
      { x: 0.36, y: 0.42, label: 'KOL', size: 0.8 },
      { x: 0.66, y: 0.54, label: 'AMD', size: 0.9 },
    ];
    const edges = [
      [0, 1], [1, 2], [2, 4], [1, 3], [3, 5], [4, 5],
      [0, 6], [6, 1], [6, 7], [7, 4], [7, 3], [2, 7],
    ];

    // Packets traveling along edges
    const packets = [];
    let lastSpawn = 0;

    const readVars = () => {
      const cs = getComputedStyle(document.documentElement);
      return {
        accent: cs.getPropertyValue('--accent').trim() || '#fe6624',
        fg: cs.getPropertyValue('--fg').trim() || '#EAF0FB',
        fgMute: cs.getPropertyValue('--fg-mute').trim() || '#6F7B92',
        data: cs.getPropertyValue('--data').trim() || '#6FA5FF',
      };
    };
    let vars = readVars();
    const mo = new MutationObserver(() => { vars = readVars(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style'] });

    const hex2rgba = (hex, a) => {
      const m = hex.replace('#', '').match(/.{2}/g);
      if (!m) return `rgba(254,102,36,${a})`;
      const [r, g, b] = m.map((x) => parseInt(x, 16));
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    };

    const draw = (ts) => {
      ctx.clearRect(0, 0, W, H);
      const { accent, fgMute, data: dataC } = vars;

      // Subtle grid backdrop
      ctx.strokeStyle = hex2rgba(fgMute, 0.05);
      ctx.lineWidth = 1;
      const step = 56;
      for (let x = 0; x < W; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0); ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y); ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Edges
      ctx.lineWidth = 1;
      edges.forEach(([a, b]) => {
        const na = nodes[a], nb = nodes[b];
        ctx.strokeStyle = hex2rgba(accent, 0.10);
        ctx.beginPath();
        ctx.moveTo(na.x * W, na.y * H);
        ctx.lineTo(nb.x * W, nb.y * H);
        ctx.stroke();
      });

      // Packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.t += p.speed;
        if (p.t >= 1) { packets.splice(i, 1); continue; }
        const na = nodes[p.from], nb = nodes[p.to];
        const ax = na.x * W, ay = na.y * H;
        const bx = nb.x * W, by = nb.y * H;
        const x = ax + (bx - ax) * p.t;
        const y = ay + (by - ay) * p.t;

        // Trail
        const tail = 0.18;
        const t0 = Math.max(0, p.t - tail);
        const tx0 = ax + (bx - ax) * t0;
        const ty0 = ay + (by - ay) * t0;
        const grad = ctx.createLinearGradient(tx0, ty0, x, y);
        grad.addColorStop(0, hex2rgba(p.color, 0));
        grad.addColorStop(1, hex2rgba(p.color, 0.9));
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(tx0, ty0);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Head dot
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Spawn packets
      if (ts - lastSpawn > 600 && packets.length < (density === 'low' ? 3 : 6)) {
        const e = edges[Math.floor(Math.random() * edges.length)];
        const fwd = Math.random() > 0.5;
        const color = Math.random() > 0.65 ? dataC : accent;
        packets.push({
          from: fwd ? e[0] : e[1],
          to: fwd ? e[1] : e[0],
          t: 0,
          speed: 0.0025 + Math.random() * 0.004,
          color,
        });
        lastSpawn = ts;
      }

      // Nodes (drawn last so they sit on top)
      nodes.forEach((n) => {
        const x = n.x * W, y = n.y * H;
        const r = 5 * n.size;
        const pulse = (Math.sin(ts / 1100 + n.x * 7) + 1) / 2;
        // Soft halo
        const haloR = r + 12 + pulse * 6;
        const halo = ctx.createRadialGradient(x, y, r, x, y, haloR);
        halo.addColorStop(0, hex2rgba(accent, 0.35));
        halo.addColorStop(1, hex2rgba(accent, 0));
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(x, y, haloR, 0, Math.PI * 2);
        ctx.fill();
        // Outer ring
        ctx.strokeStyle = hex2rgba(accent, 0.6);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, r + 3, 0, Math.PI * 2);
        ctx.stroke();
        // Inner dot
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(x, y, r - 1, 0, Math.PI * 2);
        ctx.fill();
        // Label
        ctx.fillStyle = hex2rgba(fgMute, 0.7);
        ctx.font = '10px "Geist Mono", monospace';
        ctx.fillText(n.label, x + r + 6, y - r - 2);
      });

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
    };
  }, [density]);

  return <canvas ref={canvasRef} className="net-canvas" />;
}

// ============ Floating SKU codes / inventory data drifting in background ============
function FloatingSKUs() {
  const items = [
    { x: 6,  y: 12, d: 28, txt: 'LED-A60-9W' },
    { x: 82, y: 8,  d: 34, txt: 'INV 287' },
    { x: 14, y: 78, d: 26, txt: 'DEM 148' },
    { x: 72, y: 88, d: 38, txt: 'LED-T8-18W' },
    { x: 48, y: 6,  d: 32, txt: '+₹12,400' },
    { x: 92, y: 48, d: 30, txt: 'BR30-12W' },
    { x: 4,  y: 46, d: 36, txt: 'RECO-2847' },
    { x: 56, y: 92, d: 28, txt: 'MAPE 6.8%' },
  ];
  return (
    <div className="floating-skus" aria-hidden="true">
      {items.map((s, i) => (
        <span
          key={i}
          className="float-sku mono"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            animationDuration: `${s.d}s`,
            animationDelay: `${-i * 2.7}s`,
          }}
        >
          {s.txt}
        </span>
      ))}
    </div>
  );
}

Object.assign(window, { NetworkCanvas, FloatingSKUs });
