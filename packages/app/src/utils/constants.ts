import ms = require('ms');

// Keep at most 3 background web content tabs loaded (ignoring `alwaysLoaded` and visible ones).
// Every loaded tab is a full web page with its own memory, so this is the main RAM lever.
export const STATION_MAX_ACTIVE_TABS = process.env.STATION_MAX_ACTIVE_TABS ?
  parseInt(process.env.STATION_MAX_ACTIVE_TABS, 10) : 3;

// Put a background tab to sleep once it has not been used for this long,
// even when it is within STATION_MAX_ACTIVE_TABS. Set to 0 to disable.
export const STATION_SLEEP_AFTER_IDLE_MS = process.env.STATION_SLEEP_AFTER_IDLE_MS ?
  parseInt(process.env.STATION_SLEEP_AFTER_IDLE_MS, 10) : ms('30min');

// Check inactive tabs every minute
export const STATION_CHECK_INACTIVE_TAB_EVERY_MS = process.env.STATION_CHECK_INACTIVE_TAB_EVERY_MS ?
  parseInt(process.env.STATION_CHECK_INACTIVE_TAB_EVERY_MS, 10) : ms('1min');
