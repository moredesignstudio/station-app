// @ts-ignore: no declaration file
import LinkedMap from 'linked-map';
import ms from 'ms';

import { surface } from './tokens';
import { ThemeColorScheme } from './types';

// In ms
export const QUICK_DURATION = ms('2sec');
export const QUICK_INTERVAL = 42;

export const SLOW_DURATION = ms('10min');
export const SLOW_INTERVAL = ms('10sec');

export const DEFAULT_SUNCALC = { dawn: 6, sunrise: 7, midday: 12, afternoon: 14, sunset: 20, night: 22 };

export enum Theme {
  dawn = 'dawn',
  sunrise = 'sunrise',
  morning = 'morning',
  midday = 'midday',
  afternoon = 'afternoon',
  sunset = 'sunset',
  night = 'night',
}

/**
 * The dark theme uses one constant surface all day long. The moments of the
 * day are kept so the transition machinery in the app keeps working, but every
 * moment resolves to the same flat charcoal.
 */
export const DARK_THEME_COLORS = [surface.base, surface.base, surface.base, surface.base];

export const COLORS = new LinkedMap();
Object.keys(Theme).forEach((moment) => {
  COLORS.push(moment, new ThemeColorScheme(DARK_THEME_COLORS, QUICK_DURATION, QUICK_INTERVAL));
});
