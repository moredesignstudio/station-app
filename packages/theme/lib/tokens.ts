/**
 * more mail design tokens: the More Design studio website carried into the app.
 *
 * The site's near-black page, blue-grey glass for panels, midnight cards,
 * milk text, and monochrome actions (milk pills with midnight text). Values
 * come from the studio's tailwind.config.js; see
 * design/proposals/moredesign-studio for the reasoning and the review board.
 *
 * Everything in the app UI should be expressed with these tokens rather
 * than hard-coded colors.
 */

export const surface = {
  /** App background: behind webviews, overlays, empty states. */
  base: '#080C13',
  /** The rail (left) and the top bar. */
  sidebar: '#080C13',
  /** Subdock, quick-switch, popovers, cards. */
  panel: '#1C2029',
  /** Modals, inputs on panels, tooltips, hover cards. */
  elevated: '#1C1929',
  /** Wells: bottom bars, code / kbd rows, grouped sections. */
  inset: '#11141B',
  /** Dimming layer behind modals and overlays. */
  scrim: 'rgba(8, 12, 19, 0.64)',
};

/** Translucent white fills for interactive states on any dark surface. */
export const fill = {
  subtle: 'rgba(248, 249, 250, 0.04)',
  hover: 'rgba(248, 249, 250, 0.07)',
  active: 'rgba(248, 249, 250, 0.10)',
  selected: 'rgba(248, 249, 250, 0.13)',
  strong: 'rgba(248, 249, 250, 0.18)',
};

export const border = {
  subtle: 'rgba(248, 249, 250, 0.06)',
  default: 'rgba(248, 249, 250, 0.10)',
  strong: '#4E5561',
};

export const text = {
  primary: '#F8F9FA',
  secondary: '#ACB5BD',
  tertiary: '#7D8591',
  disabled: '#4E5561',
  inverse: '#100D1E',
  onAccent: '#100D1E',
};

/**
 * The site is monochrome: primary actions are milk pills with midnight text.
 * Color comes from the apps themselves (the active app, unread counts).
 */
export const accent = {
  default: '#F8F9FA',
  hover: '#DDE2E5',
  active: '#B4BCC4',
  subtle: 'rgba(248, 249, 250, 0.10)',
  border: 'rgba(248, 249, 250, 0.55)',
  /** Accent used as text on dark surfaces. */
  text: '#F8F9FA',
  /** The brand gradient (mint → magenta, as in the app icon), in four stops. */
  ramp: ['#00FFB2', '#4EAACC', '#9D55E5', '#EB00FF'],
};

export const status = {
  success: '#17B26A',
  successSubtle: 'rgba(23, 178, 106, 0.14)',
  warning: '#F79009',
  warningSubtle: 'rgba(247, 144, 9, 0.14)',
  danger: '#F97066',
  dangerHover: '#FDA29B',
  dangerSubtle: 'rgba(240, 68, 56, 0.16)',
  dangerBorder: 'rgba(240, 68, 56, 0.40)',
  info: '#53B1FD',
  infoSubtle: 'rgba(46, 144, 250, 0.14)',
  /** Unread counts and dots: solid, never a gradient. */
  badge: '#F04438',
  /** Pinned / favorite star. */
  favorite: '#FEC84B',
};

export const radius = {
  xs: 4,
  sm: 6,
  /** Inputs (the site's rounded-9px). */
  md: 9,
  lg: 12,
  /** Cards and popovers (the site's rounded-2xl). */
  xl: 16,
  pill: 999,
};

export const shadow = {
  panel: '0 12px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(248, 249, 250, 0.07)',
  modal: '0 24px 64px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(248, 249, 250, 0.08)',
  tooltip: '0 4px 12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(248, 249, 250, 0.08)',
  focus: '0 0 0 2px rgba(248, 249, 250, 0.85)',
  focusInset: 'inset 0 0 0 1px rgba(248, 249, 250, 0.7)',
};

export const font = {
  /** Freizeit is used when it is installed on the Mac (it is not bundled: licensed). */
  sans: '"Freizeit", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, ' +
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
  fast: '140ms cubic-bezier(0.16, 1, 0.3, 1)',
  normal: '240ms cubic-bezier(0.16, 1, 0.3, 1)',
  slow: '420ms cubic-bezier(0.16, 1, 0.3, 1)',
};

/**
 * Motion. `easeOut` for arrivals (panels, glows, rows), `easeSpring` for
 * things you touch (a small overshoot), `easeInOut` for moving between places.
 */
export const motion = {
  easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeSpring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  easeInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
  quick: '140ms',
  base: '240ms',
  slow: '420ms',
  story: '1600ms',
};

/** Frosted popovers over web content: the website's `.light-glass`. */
export const glass = {
  background: 'rgba(28, 32, 41, 0.8)',
  blur: 24,
  /** Text on glass is one step lighter so it stays readable over white pages. */
  textSecondary: '#DDE2E5',
  textTertiary: '#B4BCC4',
};

/** The window frame: a top bar, the rail, and the web app as a card. */
export const layout = {
  topBarHeight: 40,
  railWidth: 68,
  frameGap: 8,
  frameRadius: 12,
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
  motion,
  glass,
  layout,
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

/** Mixin: small lowercase section label (like the website's labels). */
export const sectionLabelMixin = () => ({
  color: text.tertiary,
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: 0,
  textTransform: 'lowercase' as 'lowercase',
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
