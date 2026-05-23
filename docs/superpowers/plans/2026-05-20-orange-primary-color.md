# Orange Primary Color Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current teal/green accent (`#00C896` dark / `#0A6B52` light) with orange (`#fe6624` dark / `#c94d0f` light) as the site's primary color everywhere it appears.

**Architecture:** The color system is split into CSS custom properties (the live source of truth) and a handful of hardcoded `rgba(0, 200, 150, …)` fallback/inline values spread across five files. Changing the CSS vars is enough for runtime; the hardcoded fallbacks must also be updated so the canvas/chart components never flash green on first paint. The `accent-fg` (text on accent background) changes from near-black green `#03110C` to warm near-black `#1a0500` to stay on-brand.

**Tech Stack:** Vanilla React (CDN), CSS custom properties, HTML Canvas (network-bg.jsx), Recharts (sections-2.jsx), Leaflet (hero-map.jsx)

---

## Color Palette Reference

| Token | Old value | New value |
|-------|-----------|-----------|
| `accentDark` (dark mode) | `#00C896` | `#fe6624` |
| `accentLight` (light mode) | `#0A6B52` | `#c94d0f` |
| `accent-soft` dark | `rgba(0, 200, 150, 0.12)` | `rgba(254, 102, 36, 0.12)` |
| `accent-soft` light | `rgba(10, 107, 82, 0.10)` | `rgba(201, 77, 15, 0.10)` |
| `accent-fg` dark | `#03110C` | `#1a0500` |
| `accent-fg` light | `#ffffff` | `#ffffff` (unchanged) |

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `styles.css` | Modify | CSS custom properties + 10 hardcoded rgba glows |
| `app.jsx` | Modify | TWEAK_DEFAULTS, preset arrays, accent-fg inline set |
| `hero-map.jsx` | Modify | STATUS_HEX.ok hardcoded colors for Leaflet pins |
| `sections-2.jsx` | Modify | Recharts fallback accent color |
| `network-bg.jsx` | Modify | Canvas accent fallback + hex2rgba error branch |

---

### Task 1: Update CSS variables in styles.css

**Files:**
- Modify: `styles.css:11-12` (light mode `:root`)
- Modify: `styles.css:44-46` (dark mode `[data-theme="dark"]`)

- [ ] **Step 1: Update the light-mode `:root` accent tokens**

  Open `styles.css`. Find this block (lines 11–12):

  ```css
    --accent: #0A6B52;
    --accent-soft: rgba(10, 107, 82, 0.10);
  ```

  Replace with:

  ```css
    --accent: #c94d0f;
    --accent-soft: rgba(201, 77, 15, 0.10);
  ```

- [ ] **Step 2: Update the dark-mode `[data-theme="dark"]` accent tokens**

  Find this block (lines 44–46):

  ```css
    --accent: #00C896;
    --accent-soft: rgba(0, 200, 150, 0.12);
    --accent-fg: #03110C;
  ```

  Replace with:

  ```css
    --accent: #fe6624;
    --accent-soft: rgba(254, 102, 36, 0.12);
    --accent-fg: #1a0500;
  ```

- [ ] **Step 3: Verify in browser**

  Open `index.html` in a browser (e.g. `npx serve .` or Live Server). Toggle between light and dark mode. The nav brand dot, primary buttons, step numbers, roadmap dots, and feature bullet points should all be orange instead of teal/green.

---

### Task 2: Replace hardcoded green glows in styles.css

These are glow/shadow values that reference the old accent as raw `rgba(0, 200, 150, ...)` instead of CSS vars. There are 10 occurrences across components.

**Files:**
- Modify: `styles.css` (10 individual replacements listed below)

- [ ] **Step 1: Fix float-sku colors (lines 387–388)**

  Find:
  ```css
  html[data-theme="dark"] .float-sku { color: rgba(0, 200, 150, 0.5); }
  html[data-theme="light"] .float-sku { color: rgba(10, 107, 82, 0.4); }
  ```

  Replace with:
  ```css
  html[data-theme="dark"] .float-sku { color: rgba(254, 102, 36, 0.5); }
  html[data-theme="light"] .float-sku { color: rgba(201, 77, 15, 0.4); }
  ```

- [ ] **Step 2: Fix map-card dark glow (line 412)**

  Find:
  ```css
    box-shadow: 0 30px 80px -20px rgba(0, 200, 150, 0.10), 0 0 0 1px rgba(0,200,150,0.04);
  ```

  Replace with:
  ```css
    box-shadow: 0 30px 80px -20px rgba(254, 102, 36, 0.10), 0 0 0 1px rgba(254, 102, 36, 0.04);
  ```

- [ ] **Step 3: Fix map-phase-tag pulse dot shadow (line 520)**

  Find:
  ```css
      box-shadow: 0 0 0 3px rgba(0, 200, 150, 0.25);
  ```

  Replace with:
  ```css
      box-shadow: 0 0 0 3px rgba(254, 102, 36, 0.25);
  ```

- [ ] **Step 4: Fix dash-card dark glow (line 795)**

  Find:
  ```css
    box-shadow: 0 30px 80px -20px rgba(0, 200, 150, 0.08), 0 0 0 1px rgba(0,200,150,0.04);
  ```

  Replace with:
  ```css
    box-shadow: 0 30px 80px -20px rgba(254, 102, 36, 0.08), 0 0 0 1px rgba(254, 102, 36, 0.04);
  ```

- [ ] **Step 5: Fix metrics band radial glow (line 1281)**

  Find:
  ```css
      radial-gradient(700px 300px at 15% 50%, rgba(0, 200, 150, 0.10), transparent 60%),
  ```

  Replace with:
  ```css
      radial-gradient(700px 300px at 15% 50%, rgba(254, 102, 36, 0.10), transparent 60%),
  ```

- [ ] **Step 6: Fix phone dark glow (line 1333)**

  Find:
  ```css
    box-shadow: 0 40px 80px -30px rgba(0, 200, 150, 0.10), inset 0 0 0 1px rgba(0,200,150,0.06);
  ```

  Replace with:
  ```css
    box-shadow: 0 40px 80px -30px rgba(254, 102, 36, 0.10), inset 0 0 0 1px rgba(254, 102, 36, 0.06);
  ```

- [ ] **Step 7: Fix CTA banner radial glow (line 1564)**

  Find:
  ```css
      radial-gradient(500px 280px at 50% 0%, rgba(0, 200, 150, 0.22), transparent 65%),
  ```

  Replace with:
  ```css
      radial-gradient(500px 280px at 50% 0%, rgba(254, 102, 36, 0.22), transparent 65%),
  ```

- [ ] **Step 8: Fix CTA banner button hardcoded color (line 1593)**

  Find:
  ```css
    background: #00C896;
    color: #03110C;
  ```

  Replace with:
  ```css
    background: #fe6624;
    color: #1a0500;
  ```

- [ ] **Step 9: Fix field-corner pulse dot shadow (line 2089)**

  Find:
  ```css
      box-shadow: 0 0 0 3px rgba(0, 200, 150, 0.18);
  ```

  Replace with:
  ```css
      box-shadow: 0 0 0 3px rgba(254, 102, 36, 0.18);
  ```

- [ ] **Step 10: Verify no green rgba values remain**

  Search the file for `0, 200, 150` — should return zero matches. (Use Ctrl+F or grep.)

---

### Task 3: Update accent defaults and presets in app.jsx

**Files:**
- Modify: `app.jsx:2-20` (TWEAK_DEFAULTS + ACCENT_PRESETS arrays)
- Modify: `app.jsx:40` (inline accent-fg set)

- [ ] **Step 1: Update TWEAK_DEFAULTS**

  Find (lines 2–7):
  ```js
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "accentDark": "#00C896",
    "accentLight": "#0A6B52",
    "density": "regular",
    "fontStack": "Geist"
  }/*EDITMODE-END*/;
  ```

  Replace with:
  ```js
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "accentDark": "#fe6624",
    "accentLight": "#c94d0f",
    "density": "regular",
    "fontStack": "Geist"
  }/*EDITMODE-END*/;
  ```

- [ ] **Step 2: Update ACCENT_PRESETS_DARK first entry**

  Find (lines 9–14):
  ```js
  const ACCENT_PRESETS_DARK = [
    '#00C896', // teal (default)
    '#6FA5FF', // sky
    '#D97757', // terra
    '#B58CFF', // violet
  ];
  ```

  Replace with:
  ```js
  const ACCENT_PRESETS_DARK = [
    '#fe6624', // orange (default)
    '#6FA5FF', // sky
    '#D97757', // terra
    '#B58CFF', // violet
  ];
  ```

- [ ] **Step 3: Update ACCENT_PRESETS_LIGHT first entry**

  Find (lines 15–20):
  ```js
  const ACCENT_PRESETS_LIGHT = [
    '#0A6B52', // forest (default)
    '#1F5BB8', // ink blue
    '#A04A2E', // burnt sienna
    '#5A3DB0', // royal
  ];
  ```

  Replace with:
  ```js
  const ACCENT_PRESETS_LIGHT = [
    '#c94d0f', // burnt orange (default)
    '#1F5BB8', // ink blue
    '#A04A2E', // burnt sienna
    '#5A3DB0', // royal
  ];
  ```

- [ ] **Step 4: Update accent-fg for dark mode (line 40)**

  Find:
  ```js
      root.style.setProperty('--accent-fg', theme === 'dark' ? '#03110C' : '#ffffff');
  ```

  Replace with:
  ```js
      root.style.setProperty('--accent-fg', theme === 'dark' ? '#1a0500' : '#ffffff');
  ```

- [ ] **Step 5: Verify in browser**

  Hard-refresh the page (`Ctrl+Shift+R`). Open the Tweaks panel (bottom-right gear). The first color swatch should be orange. The accent-based UI should look correct in both dark and light modes.

---

### Task 4: Update hardcoded status colors in hero-map.jsx

The `STATUS_HEX.ok` colors were set to match the accent. They drive Leaflet polyline strokes and inline pin colors for "in-stock" store states.

**Files:**
- Modify: `hero-map.jsx:28-32`

- [ ] **Step 1: Update STATUS_HEX.ok**

  Find (lines 28–32):
  ```js
  const STATUS_HEX = {
    crit: { dark: '#F86E66', light: '#C8362E' },
    ok:   { dark: '#00C896', light: '#0A6B52' },
    over: { dark: '#F2B860', light: '#B5781A' },
  };
  ```

  Replace with:
  ```js
  const STATUS_HEX = {
    crit: { dark: '#F86E66', light: '#C8362E' },
    ok:   { dark: '#fe6624', light: '#c94d0f' },
    over: { dark: '#F2B860', light: '#B5781A' },
  };
  ```

- [ ] **Step 2: Verify in browser**

  Scroll to the hero map section. The route line and "OK" store pins should glow orange, not teal/green.

---

### Task 5: Update fallback colors in sections-2.jsx and network-bg.jsx

These are `|| fallback` values used when `getComputedStyle` fails (e.g. SSR or paint-before-ready). They should match the new accent.

**Files:**
- Modify: `sections-2.jsx:341,346`
- Modify: `network-bg.jsx:53,65`

- [ ] **Step 1: Update sections-2.jsx fallbacks**

  Find (lines 341, 346):
  ```js
    const [vars, setVars] = React.useState({ accent: '#0A6B52', data1: '#1F5BB8', fgMute: '#6B7689', grid: '#eee' });
  ```
  Replace with:
  ```js
    const [vars, setVars] = React.useState({ accent: '#c94d0f', data1: '#1F5BB8', fgMute: '#6B7689', grid: '#eee' });
  ```

  Then find:
  ```js
        accent: cs.getPropertyValue('--accent').trim() || '#0A6B52',
  ```
  Replace with:
  ```js
        accent: cs.getPropertyValue('--accent').trim() || '#c94d0f',
  ```

- [ ] **Step 2: Update network-bg.jsx accent fallback (line 53)**

  Find:
  ```js
        accent: cs.getPropertyValue('--accent').trim() || '#00C896',
  ```

  Replace with:
  ```js
        accent: cs.getPropertyValue('--accent').trim() || '#fe6624',
  ```

- [ ] **Step 3: Update network-bg.jsx hex2rgba error branch (line 65)**

  Find:
  ```js
      if (!m) return `rgba(0,200,150,${a})`;
  ```

  Replace with:
  ```js
      if (!m) return `rgba(254,102,36,${a})`;
  ```

- [ ] **Step 4: Final verification**

  Hard-refresh the page. Scroll through every section top to bottom:

  - **Navbar** — brand dot is orange
  - **Hero** — em text, CTA button, map route glow, floating SKU text are orange
  - **SKU Ticker** — "meta" label in ticker head is orange
  - **Problem Strip** — row numbers and glyph icons are orange
  - **How It Works** — step numerals fade from orange, rail packet is orange
  - **Features** — bullet dots, store cell focus ring, AI card tag, transfer arrow are orange
  - **Metrics Band** — left-side glow is orange (subtle)
  - **Use Case (phone)** — track steps and phone tab active state are orange
  - **Stock Pulse** — alert action text and dismiss ring are orange
  - **Roadmap** — timeline rail fill, beta pill, and active dot are orange
  - **CTA Banner** — button is orange, top glow is orange
  - **In the Field** — card hover border and label line are orange

  Switch to light mode — the accent should be the darker burnt-orange `#c94d0f`. Open the Tweaks panel and confirm the first color swatch shows orange in both modes.

  Search all five files for `#00C896` and `#0A6B52` — should return zero matches.
