// Contrast checks for design tokens. Plain ES module: used by the review
// board in the browser and by `yarn design:check` in Node.

/**
 * Token pairs that must stay readable. `fg` is drawn on `bg`; translucent
 * backgrounds are composited over `over` (default: --surface-base).
 * `min` follows WCAG 2.1: 4.5 for text, 3 for large/bold text and UI marks.
 */
export const PAIRS = [
  { fg: '--text-primary', bg: '--surface-base', min: 4.5, what: 'Primary text on the app background' },
  { fg: '--text-primary', bg: '--surface-sidebar', min: 4.5, what: 'Primary text on the dock' },
  { fg: '--text-primary', bg: '--surface-panel', min: 4.5, what: 'Primary text on panels' },
  { fg: '--text-primary', bg: '--surface-elevated', min: 4.5, what: 'Primary text on modals and inputs' },
  { fg: '--text-secondary', bg: '--surface-base', min: 4.5, what: 'Secondary text on the app background' },
  { fg: '--text-secondary', bg: '--surface-panel', min: 4.5, what: 'Secondary text on panels' },
  { fg: '--text-secondary', bg: '--surface-elevated', min: 4.5, what: 'Secondary text on modals' },
  { fg: '--text-tertiary', bg: '--surface-panel', min: 3, what: 'Section labels and hints on panels' },
  { fg: '--text-tertiary', bg: '--surface-base', min: 3, what: 'Section labels on the app background' },
  { fg: '--text-on-accent', bg: '--accent-default', min: 4.5, what: 'Primary button label' },
  { fg: '--text-on-accent', bg: '--accent-hover', min: 4.5, what: 'Primary button label, hover' },
  { fg: '--accent-text', bg: '--surface-base', min: 4.5, what: 'Links and accent text' },
  { fg: '--accent-text', bg: '--surface-panel', min: 4.5, what: 'Links and accent text on panels' },
  { fg: '--text-on-badge', bg: '--status-badge', min: 3, what: 'Unread count on its badge (bold)' },
  { fg: '--status-badge', bg: '--surface-sidebar', min: 3, what: 'Unread badge against the dock' },
  { fg: '--status-danger', bg: '--surface-panel', min: 4.5, what: 'Error text on panels' },
  { fg: '--status-success', bg: '--surface-panel', min: 3, what: 'Success marks on panels' },
  { fg: '--focus-ring', bg: '--surface-panel', min: 3, what: 'Focus ring against panels' },
  { fg: '--on-glass-secondary', bg: '--glass-bg', over: '#FFFFFF', min: 4.5, what: 'Secondary text on a popover over a white web page' },
  { fg: '--on-glass-tertiary', bg: '--glass-bg', over: '#FFFFFF', min: 3, what: 'Section labels on a popover over a white web page' },
];

/** Parse #rgb, #rrggbb, #rrggbbaa, rgb() and rgba(). Returns [r, g, b, a] or null. */
export function parseColor(value) {
  if (!value) return null;
  const v = value.trim().toLowerCase();
  let m = v.match(/^#([0-9a-f]{3,8})$/);
  if (m) {
    let hex = m[1];
    if (hex.length === 3 || hex.length === 4) hex = [...hex].map(c => c + c).join('');
    if (hex.length !== 6 && hex.length !== 8) return null;
    const n = i => parseInt(hex.slice(i, i + 2), 16);
    return [n(0), n(2), n(4), hex.length === 8 ? n(6) / 255 : 1];
  }
  m = v.match(/^rgba?\(([^)]+)\)$/);
  if (m) {
    const parts = m[1].split(/[\s,/]+/).filter(Boolean);
    if (parts.length < 3) return null;
    const channel = p => (p.endsWith('%') ? (parseFloat(p) * 255) / 100 : parseFloat(p));
    const alpha = parts[3] === undefined ? 1 : parts[3].endsWith('%') ? parseFloat(parts[3]) / 100 : parseFloat(parts[3]);
    return [channel(parts[0]), channel(parts[1]), channel(parts[2]), alpha];
  }
  if (v === 'white') return [255, 255, 255, 1];
  if (v === 'black') return [0, 0, 0, 1];
  return null;
}

/** Alpha-composite `top` over opaque `bottom`. */
export function composite(top, bottom) {
  const a = top[3];
  return [0, 1, 2].map(i => top[i] * a + bottom[i] * (1 - a)).concat(1);
}

function luminance([r, g, b]) {
  const lin = c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function ratio(fg, bg) {
  const [l1, l2] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
}

/**
 * Run every pair against a token lookup `get(name) → css value string`.
 * Pairs whose tokens are missing or not plain colors come back as `skipped`.
 */
export function runChecks(get, pairs = PAIRS) {
  const base = parseColor(get('--surface-base')) || [0, 0, 0, 1];
  return pairs.map(pair => {
    const bgRaw = parseColor(get(pair.bg));
    const fgRaw = parseColor(get(pair.fg));
    if (!bgRaw || !fgRaw) return { ...pair, skipped: true };
    const under = pair.over ? parseColor(pair.over.startsWith('--') ? get(pair.over) : pair.over) : base;
    const bg = bgRaw[3] < 1 ? composite(bgRaw, under) : bgRaw;
    const fg = fgRaw[3] < 1 ? composite(fgRaw, bg) : fgRaw;
    const value = ratio(fg, bg);
    return { ...pair, value, pass: value >= pair.min };
  });
}
