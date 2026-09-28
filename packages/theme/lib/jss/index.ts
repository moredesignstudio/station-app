import Color from 'color';
import * as CSS from 'csstype';
import { dark, flat, font as fontTokens, kbdMixin, scrollbarMixin, sectionLabelMixin } from '../tokens';

/**
 * getGradientCSSBackground
 *
 * Historically returned the time-of-day blue gradient. The dark theme is a
 * single flat surface, so this now returns a flat `linear-gradient` of the
 * first theme color (still a valid `background-image` value).
 *
 * @param {string[]} themeColors - the array of colors for the current theme
 * @returns {string} a linear-gradient CSS value
 */
export const getGradientCSSBackground = (themeColors: string[]) => {
  const color = (themeColors && themeColors[0]) || dark.surface.base;
  return flat(color);
};

/**
 * getOpacityGradient
 *
 * @param {number} opacity - the opacity
 * @returns {string} the linear-gradient CSS value that represents the opacity gradient
 */
export const getOpacityGradient = (opacity: number) => {
  return flat(`rgba(0, 0, 0, ${opacity})`);
};

/**
 * getHighlightGradient
 *
 * Used by list items for hover / selected states. In the dark theme this is a
 * flat translucent white fill: `.30` maps to the hover fill and `.50` maps to
 * the selected fill.
 *
 * @param {string} _direction - kept for API compatibility
 * @param {number} opacity - legacy opacity (0.15, 0.30, 0.50)
 * @returns {string} a flat linear-gradient CSS value
 */
export const getHighlightGradient = (_direction: string = 'to right', opacity: number = 0.15) => {
  if (opacity >= 0.5) return flat(dark.fill.selected);
  if (opacity >= 0.3) return flat(dark.fill.hover);
  return flat(dark.fill.subtle);
};

/**
 * getGradientWithOverlay
 *
 * @param {string[]} themeColors - the array of colors for the current theme
 * @param {number} opacity - opacity of the overlay
 * @returns {string} a darker flat surface
 */
export const getGradientWithOverlay = (themeColors: string[], opacity: number) => {
  const base = (themeColors && themeColors[0]) || dark.surface.base;
  return flat(Color(base).mix(Color('black'), opacity).rgb().string());
};

/**
 * fontMixin
 *
 * @param {number} size - size of the font
 * @param {string | number} weight - weight of the font
 * @returns {{fontFamily: string; fontSize: number; fontWeight: string | number}} the corresponding fonts CSS properties
 */
const fontMixin = (size: CSS.Property.FontSize<number>, weight: CSS.Property.FontWeight = 'normal') => ({
  fontFamily: fontTokens.sans,
  fontSize: size,
  fontWeight: weight,
});

export const theme = {
  /**
   * Dark design tokens. Prefer these over anything else in this object.
   * @see ../tokens.ts
   */
  ...dark,

  /**
   * Legacy color names, remapped onto the dark palette so that untouched
   * consumers keep a sensible appearance:
   * - `gray.light`  → elevated surface (was a light background)
   * - `gray.middle` → secondary text
   * - `gray.dark`   → primary text
   * - `black`       → primary text ("ink")
   */
  colors: {
    gray: {
      light: dark.surface.elevated,
      middle: dark.text.secondary,
      dark: dark.text.primary,
    },
    flatRed: {
      middle: dark.status.danger,
      dark: dark.status.dangerHover,
    },
    black: dark.text.primary,
    error: dark.status.danger,
  },
  titles: {
    h1: {
      ...fontMixin(24, 600),
      lineHeight: '1.3em',
      letterSpacing: '-0.01em',
      color: dark.text.primary,
      marginBottom: 12,
    },
    h2: {
      ...fontMixin(18, 600),
      lineHeight: '28px',
      letterSpacing: '-0.005em',
      color: dark.text.primary,
    },
    h3: {
      ...fontMixin(14, 600),
      lineHeight: '1.5em',
      color: dark.text.primary,
    },
  },
  icons: {
    color: {
      base: dark.text.primary,
      muted: dark.text.secondary,
    },
  },
  mixins: {
    ellipsis: (nbLines: number = 2) => ({
      display: '-webkit-box',
      '-webkit-line-clamp': nbLines,
      '-webkit-box-orient': 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      wordBreak: 'break-word',
    }),
    flexbox: {
      containerCenter: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
    size: (size: number | string) => ({
      width: size,
      height: size,
    }),
    position: (
      position: CSS.Properties['position'],
      top?: number | string,
      left?: number | string,
      bottom?: number | string,
      right?: number | string,
    ) => ({
      position,
      top,
      left,
      bottom,
      right,
    }),
    kbd: kbdMixin,
    sectionLabel: sectionLabelMixin,
    scrollbar: scrollbarMixin,
    /** A panel (card) sitting on the base surface. */
    panel: () => ({
      backgroundColor: dark.surface.panel,
      border: `1px solid ${dark.border.subtle}`,
      borderRadius: dark.radius.lg,
    }),
    /** Focus ring for keyboard navigation. */
    focusRing: () => ({
      outline: 'none',
      boxShadow: dark.shadow.focus,
    }),
  },
  dock: {
    size: 50,
  },
  rightDock: {
    size: 50,
  },

  // == Base
  $gutter: '10px',
  $borderRadius: '6px',
  $imPath: '../../static/',

  // == Colors
  $red: dark.status.danger,

  // == Z-indexes
  $zindexUltime: 1000,
  $zIndexSupra: 100,
  $zIndexUltra: 10,
  $zIndexMega: 9,
  $zIndexHuge: 4,
  $zIndexLarge: 3,
  $zIndexMedium: 2,
  $zIndexSmall: 1,
  $zIndexNull: 0,

  // == Global variables
  $bodyBkg: dark.surface.elevated,
  $osbarHeight: '30px',
  $appSize: '50px',

  /**
   * avatarMixin
   *
   * @param {string} value - the width and height value
   * @param {string} radius - the border radius value
   * @returns {{height: string; width: string; borderRadius: string; backgroundClip: string}} the corresponding CSS properties
   */
  avatarMixin: (value: string, radius = value) => ({
    height: value,
    width: value,
    borderRadius: radius,
    backgroundClip: 'padding-box',
  }),

  /**
   * covererMixin
   *
   * @param {number} bottom - value of the bottom property
   * @param {number} left - value of the left property
   * @param {number} right - value of the right property
   * @param {number} top - value of the top property
   * @returns {{bottom: number; left: number; position: string; right: number; top: number}} the corresponding CSS properties
   */
  covererMixin: (bottom = 0, left = 0, right = 0, top = 0) => ({
    bottom: bottom,
    left: left,
    position: 'absolute',
    right: right,
    top: top,
  }),

  fontMixin,

  /**
   * elipsisMixin
   *
   * @param {number} lineClamp - value of the line-clamp property
   * @returns {{display: string; "-webkit-line-clamp": number; "-webkit-box-orient": string; overflow: string; textOverflow: string}}
   * the corresponding CSS properties
   */
  elipsisMixin: (lineClamp = 2) => ({
    display: '-webkit-box',
    '-webkit-line-clamp': lineClamp,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),

  /**
   * mixinDarkenColor
   *
   * @param {string} color - the corresponding color
   * @param {number} ratio - the ratio to daren the color
   * @returns {string} - the color darkened by the ratio
   */
  mixinDarkenColor: (color: string, ratio = 0.3) =>
    Color(color).mix(Color('black'), ratio).rgb().string(),
};

/**
 * roundedBackground
 *
 * @param {string} color - color for the background
 * @returns {{borderRadius: string; backgroundColor: string}} the corresponding CSS properties
 */
export const roundedBackground = (color: string = dark.fill.hover) => {
  return {
    borderRadius: '999px',
    backgroundColor: color,
  };
};
