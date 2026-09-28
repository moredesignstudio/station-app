import {
  accent,
  border,
  fill,
  font,
  radius,
  shadow,
  status,
  surface,
  text,
  transition,
} from '@getstation/theme';

/**
 * Dark design tokens, re-exported so that App Store style files can import
 * everything they need from `@src/theme`.
 * @see packages/theme/lib/tokens.ts
 */
export { accent, border, fill, font, radius, shadow, status, surface, text, transition };

/**
 * App Store palette.
 *
 * The legacy light blue-gray names are kept so that nothing breaks, but every
 * one of them is now mapped **by role** onto the dark tokens. Prefer the
 * explicit role keys (`textPrimary`, `surfacePanel`, `fillHover`, ...) in any
 * file you touch.
 */
export const colors = {
  // == Legacy names (remapped by role)
  /** Primary action color (was the Station blue). */
  stationBlue: accent.default,
  /** Aside / panel surface. */
  blueGray: surface.panel,
  /** Primary text (was the dark blue-gray ink). */
  blueGray100: text.primary,
  /** Hairline borders. */
  blueGray40: border.default,
  /** Aside / panel surface. */
  blueGray30: surface.panel,
  /** Page background. */
  blueGray10: surface.base,
  /** Hover fill. */
  hoverBlue: fill.hover,
  /** Focus / hover accent. */
  blueGlowing: accent.hover,
  /** Strong borders. */
  gray: border.strong,
  /** Dividers. */
  dividerColor: border.default,
  /** Secondary text. */
  darkGray: text.secondary,
  /** Page background (was pure white). */
  white: surface.base,
  /** Selected row fill. */
  activeSuggestion: fill.selected,
  /** Accent outline. */
  buttonBorder: accent.border,

  // == Text
  textPrimary: text.primary,
  textSecondary: text.secondary,
  textTertiary: text.tertiary,
  textDisabled: text.disabled,
  textOnAccent: text.onAccent,

  // == Surfaces
  surfaceBase: surface.base,
  surfaceSidebar: surface.sidebar,
  surfacePanel: surface.panel,
  surfaceElevated: surface.elevated,
  surfaceInset: surface.inset,
  surfaceScrim: surface.scrim,

  // == Fills (translucent white)
  fillSubtle: fill.subtle,
  fillHover: fill.hover,
  fillActive: fill.active,
  fillSelected: fill.selected,
  fillStrong: fill.strong,

  // == Borders
  borderSubtle: border.subtle,
  borderDefault: border.default,
  borderStrong: border.strong,

  // == Accent
  accent: accent.default,
  accentHover: accent.hover,
  accentActive: accent.active,
  accentSubtle: accent.subtle,
  accentBorder: accent.border,
  accentText: accent.text,

  // == Status
  success: status.success,
  danger: status.danger,
  dangerHover: status.dangerHover,
  dangerSubtle: status.dangerSubtle,
  dangerBorder: status.dangerBorder,
};

/** Shared recipe for text inputs (search, request-an-app steps, textarea). */
export const inputMixin = () => ({
  backgroundColor: fill.subtle,
  boxShadow: `inset 0 0 0 1px ${border.default}`,
  border: 'none',
  borderRadius: radius.md,
  color: text.primary,
  outline: 'none',
  transition: `box-shadow ${transition.fast}, background-color ${transition.fast}`,
  '&::placeholder': {
    color: text.tertiary,
  },
  '&:focus': {
    boxShadow: `inset 0 0 0 1px ${accent.border}, ${shadow.focus}`,
  },
});

/** Shared recipe for the accent (primary) call-to-action. */
export const accentButtonMixin = () => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 32,
  lineHeight: '32px',
  padding: [0, 14],
  border: 'none',
  borderRadius: radius.md,
  backgroundColor: accent.default,
  color: text.onAccent,
  fontFamily: font.sans,
  fontSize: 13,
  fontWeight: 500,
  letterSpacing: '-0.01em',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  outline: 'none',
  transition: `background-color ${transition.fast}, color ${transition.fast}`,
  '&:hover': {
    backgroundColor: accent.hover,
  },
  '&:active': {
    backgroundColor: accent.active,
  },
});

/** Shared recipe for the neutral (secondary) button. */
export const secondaryButtonMixin = () => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 32,
  lineHeight: '32px',
  padding: [0, 14],
  border: 'none',
  borderRadius: radius.md,
  backgroundColor: fill.active,
  boxShadow: `inset 0 0 0 1px ${border.default}`,
  color: text.primary,
  fontFamily: font.sans,
  fontSize: 13,
  fontWeight: 500,
  letterSpacing: '-0.01em',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  outline: 'none',
  transition: `background-color ${transition.fast}, color ${transition.fast}`,
  '&:hover': {
    backgroundColor: fill.selected,
  },
  '&:active': {
    backgroundColor: fill.strong,
  },
});
