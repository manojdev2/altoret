// ============ Icons ============
const Icon = {
  Sun: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  ),
  Moon: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  Scale: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M6 6v14M18 6v14M3 20h6M15 20h6M9 11h6" />
    </svg>
  ),
  Coin: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M9 9.5a3 3 0 0 1 5.5-1M9 14.5a3 3 0 0 0 5.5 1" />
    </svg>
  ),
  Truck: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 4h14v12H1zM15 8h4l3 4v4h-7" />
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="19" r="2" />
    </svg>
  ),
  Arrow: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  ),
  Box: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8L12 3 3 8v8l9 5 9-5V8zM3 8l9 5 9-5M12 13v8" />
    </svg>
  ),
};

// ============ Reveal hook ============
function useReveal() {
  // No-op — kept for API compat. Reveals are visible by default in CSS.
}

// ============ Animated number ============
function CountUp({ to, format, duration = 1600, prefix = '', suffix = '' }) {
  const [v, setV] = React.useState(0);
  const ref = React.useRef(null);
  const started = React.useRef(false);

  React.useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const tick = (now) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 3);
              setV(Math.round(to * eased));
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [to, duration]);

  const formatted = format ? format(v) : v.toLocaleString();
  return <span ref={ref}>{prefix}{formatted}{suffix}</span>;
}

Object.assign(window, { Icon, useReveal, CountUp });
