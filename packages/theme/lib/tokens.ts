/**
 * Station dark design tokens.
 *
 * A warm, low-contrast charcoal palette in the spirit of Claude Code and
 * Notion in dark mode: neutral surfaces, translucent white fills for
 * interaction states, hairline borders, and a single terracotta accent
 * reserved for primary actions and focus.
 *
 * Everything in the app UI should be expressed with these tokens rather
 * than hard-coded colors.
 */

export const surface = {
  /** App background: behind webviews, overlays, empty states. */
  base: '#1B1A19',
  /** The 50px dock rail. */
  sidebar: '#151413',
  /** Subdock, quick-switch, popovers, cards. */
  panel: '#232221',
  /** Modals, inputs on panels, tooltips, hover cards. */
  elevated: '#2B2A28',
  /** Wells: bottom bars, code / kbd rows, grouped sections. */
  inset: '#141312',
  /** Dimming layer behind modals and overlays. */
  scrim: 'rgba(0, 0, 0, 0.55)',
};

/** Translucent white fills for interactive states on any dark surface. */
export const fill = {
  subtle: 'rgba(255, 255, 255, 0.04)',
  hover: 'rgba(255, 255, 255, 0.06)',
  active: 'rgba(255, 255, 255, 0.09)',
  selected: 'rgba(255, 255, 255, 0.12)',
  strong: 'rgba(255, 255, 255, 0.16)',
};

export const border = {
  subtle: 'rgba(255, 255, 255, 0.06)',
  default: 'rgba(255, 255, 255, 0.10)',
  strong: 'rgba(255, 255, 255, 0.18)',
};

export const text = {
  primary: '#ECEAE6',
  secondary: '#A9A69F',
  tertiary: '#78756E',
  disabled: '#55534E',
  inverse: '#1B1A19',
  onAccent: '#FFFFFF',
};

export const accent = {
  default: '#D97757',
  hover: '#E38A6C',
  active: '#C4674A',
  subtle: 'rgba(217, 119, 87, 0.14)',
  border: 'rgba(217, 119, 87, 0.45)',
  /** Accent used as text on dark surfaces (slightly lighter for contrast). */
  text: '#E8956F',
  /** Four stops used for the Station logo gradient. */
  ramp: ['#E8956F', '#D97757', '#C4674A', '#A8563C'],
};

export const status = {
  success: '#6FBF8A',
  successSubtle: 'rgba(111, 191, 138, 0.14)',
  warning: '#D9A441',
  warningSubtle: 'rgba(217, 164, 65, 0.14)',
  danger: '#E5625B',
  dangerHover: '#EE7770',
  dangerSubtle: 'rgba(229, 98, 91, 0.14)',
  dangerBorder: 'rgba(229, 98, 91, 0.35)',
  info: '#6FA3E6',
  infoSubtle: 'rgba(111, 163, 230, 0.14)',
  /** Unread / notification dot. */
  badge: '#E5625B',
  /** Pinned / favorite star. */
  favorite: '#D9A441',
};

export const radius = {
  xs: 3,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  pill: 999,
};

export const shadow = {
  panel: '0 8px 24px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.06)',
  modal: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08)',
  tooltip: '0 4px 12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08)',
  focus: '0 0 0 2px rgba(217, 119, 87, 0.45)',
  focusInset: 'inset 0 0 0 1px rgba(217, 119, 87, 0.6)',
};

export const font = {
  sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, ' +
    '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  mono: '"SF Mono", ui-monospace, Menlo, Consolas, "Liberation Mono", monospace',
};

/** Keyboard shortcut chips. */
export const kbd = {
  background: fill.active,
  border: border.default,
  color: text.secondary,
  radius: radius.sm,
  fontSize: 10,
  fontFamily: font.mono,
  padding: '1px 5px',
};

/** macOS window controls. */
export const traffic = {
  close: '#FF5F57',
  minimize: '#FEBC2E',
  zoom: '#28C840',
  idle: 'rgba(255, 255, 255, 0.18)',
};

export const transition = {
  fast: '120ms ease-out',
  normal: '200ms ease-out',
  slow: '300ms ease-out',
};

export const dark = {
  surface,
  fill,
  border,
  text,
  accent,
  status,
  radius,
  shadow,
  font,
  kbd,
  traffic,
  transition,
};

export type DarkTokens = typeof dark;

/**
 * Returns a CSS `linear-gradient` that renders as a flat color.
 * Useful where a property expects an image (`backgroundImage`).
 */
export const flat = (color: string) => `linear-gradient(${color}, ${color})`;

/** Mixin: a monospace keyboard-shortcut chip. */
export const kbdMixin = () => ({
  display: 'inline-block',
  padding: kbd.padding,
  borderRadius: kbd.radius,
  backgroundColor: kbd.background,
  boxShadow: `inset 0 0 0 1px ${kbd.border}`,
  color: kbd.color,
  fontFamily: kbd.fontFamily,
  fontSize: kbd.fontSize,
  fontWeight: 500,
  lineHeight: '14px',
  letterSpacing: '0.02em',
  verticalAlign: 'middle',
});

/** Mixin: small uppercase section label (Notion-style). */
export const sectionLabelMixin = () => ({
  color: text.tertiary,
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.04em',
  textTransform: 'uppercase' as 'uppercase',
});

/** Mixin: thin dark scrollbar for scrollable panels. */
export const scrollbarMixin = () => ({
  '&::-webkit-scrollbar': {
    width: 8,
    height: 8,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 4,
    border: '2px solid transparent',
    backgroundClip: 'padding-box',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
});
