// ============ App ============
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentDark": "#fe6624",
  "accentLight": "#FF6725",
  "density": "regular",
  "fontStack": "Geist"
}/*EDITMODE-END*/;

const ACCENT_PRESETS_DARK = [
  '#ff6725', // orange (default)
  '#6FA5FF', // sky
  '#D97757', // terra
  '#B58CFF', // violet
];
const ACCENT_PRESETS_LIGHT = [
  '#ff6725', // burnt orange (default)
  '#1F5BB8', // ink blue
  '#A04A2E', // burnt sienna
  '#5A3DB0', // royal
];

function App() {
  const [theme, setTheme] = React.useState(() => {
    return localStorage.getItem('alto-theme') || 'dark';
  });
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('alto-theme', theme);
  }, [theme]);

  // Apply accent + density tweaks as CSS vars
  React.useEffect(() => {
    const root = document.documentElement;
    const accent = theme === 'dark' ? t.accentDark : t.accentLight;
    root.style.setProperty('--accent', accent);
    // Update accent-soft to a translucent version
    root.style.setProperty('--accent-soft', hexToRgba(accent, theme === 'dark' ? 0.12 : 0.10));
    root.style.setProperty('--accent-fg', theme === 'dark' ? '#1a0500' : '#ffffff');

    // Density: adjust radii + section padding
    const dense = t.density === 'compact';
    const comfy = t.density === 'comfy';
    root.style.setProperty('--radius', dense ? '8px' : comfy ? '14px' : '12px');
    root.style.setProperty('--radius-lg', dense ? '12px' : comfy ? '20px' : '16px');

    // Font stack
    document.body.style.fontFamily = `'${t.fontStack}', system-ui, -apple-system, sans-serif`;
  }, [theme, t.accentDark, t.accentLight, t.density, t.fontStack]);

  useReveal();

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <>
      <Navbar theme={theme} onToggle={toggle} />
      <main className={t.density === 'compact' ? 'density-compact' : t.density === 'comfy' ? 'density-comfy' : ''}>
        <Hero />
        <SkuTicker />
        <ProblemStrip />
        <HowItWorks />
        <Features />
        <MetricsBand />
        <InTheField />
{/*         <UseCase /> */}
        <StockPulse />
        <Roadmap />
        <CTABanner />
      </main>
      <Footer />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme" />
        <TweakColor
          label={`Accent (${theme} mode)`}
          value={theme === 'dark' ? t.accentDark : t.accentLight}
          options={theme === 'dark' ? ACCENT_PRESETS_DARK : ACCENT_PRESETS_LIGHT}
          onChange={(v) => setTweak(theme === 'dark' ? 'accentDark' : 'accentLight', v)}
        />
        <TweakSection label="Layout" />
        <TweakRadio
          label="Density"
          value={t.density}
          options={['compact', 'regular', 'comfy']}
          onChange={(v) => setTweak('density', v)}
        />
        <TweakSection label="Typography" />
        <TweakRadio
          label="Font"
          value={t.fontStack}
          options={['Geist', 'Inter', 'IBM Plex Sans']}
          onChange={(v) => setTweak('fontStack', v)}
        />
      </TweaksPanel>
    </>
  );
}

function hexToRgba(hex, alpha) {
  const m = hex.replace('#', '').match(/.{2}/g);
  if (!m) return hex;
  const [r, g, b] = m.map((x) => parseInt(x, 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
