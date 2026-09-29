import * as Immutable from 'immutable';
import { isAlwaysLoaded } from '../application-settings/api';
import { ApplicationsSettingsImmutable } from '../application-settings/types';
import { getApplicationManifestURL } from '../applications/get';
import { BxAppManifest } from '../applications/manifest-provider/bxAppManifest';
import { ApplicationsImmutable } from '../applications/types';
import { getTabApplicationId, getTabId, getLastActivityAt } from '../tabs/get';
import { StationTabImmutable, StationTabsImmutable } from '../tabs/types';
import { STATION_MAX_ACTIVE_TABS } from '../utils/constants';
import { isWebcontentsMounted } from './selectors';

function filterAlwaysLoaded(
  applications: ApplicationsImmutable,
  tab: StationTabImmutable,
  manifests: Map<string, BxAppManifest>,
  appSettings: ApplicationsSettingsImmutable,
): boolean {
  if (!tab) return false;

  const application = applications.get(getTabApplicationId(tab))!;
  const manifestURL = getApplicationManifestURL(application);
  const manifest = manifests.get(manifestURL)!;
  const settings = appSettings.get(manifestURL);

  return isAlwaysLoaded(manifest, settings);
}

export type TabsToKillOptions = {
  // Maximum number of background tabs kept loaded (visible and `alwaysLoaded` tabs are not counted)
  maxActiveTabs?: number,
  // Background tabs unused for longer than this are put to sleep. 0 or undefined disables it.
  idleLimitMs?: number,
  // Last time each tab was seen in use, in addition to its `lastActivityAt`
  lastSeenAt?: Map<string, number>,
  now?: number,
};

export function tabWebcontentsToKill(
  applications: ApplicationsImmutable,
  appSettings: ApplicationsSettingsImmutable,
  tabWebcontents: Immutable.Map<string, any>,
  manifests: Map<string, BxAppManifest>,
  tabs: StationTabsImmutable,
  currentlyVisibleTabIds: string[],
  options: TabsToKillOptions = {}
): Immutable.Set<[string, Immutable.Map<string, any>]> {
  const {
    maxActiveTabs = STATION_MAX_ACTIVE_TABS,
    idleLimitMs,
    lastSeenAt,
    now = Date.now(),
  } = options;

  const lastUsedAt = (tabId: string): number => Math.max(
    getLastActivityAt(tabs.get(tabId)!) || 0,
    (lastSeenAt && lastSeenAt.get(tabId)) || 0
  );
  const isIdleTooLong = (tabId: string): boolean =>
    Boolean(idleLimitMs && idleLimitMs > 0 && now - lastUsedAt(tabId) > idleLimitMs);

  // All mounted tabs
  const mountedTabs = Immutable.Set(tabWebcontents
    .filter(isWebcontentsMounted)
    .filter(value => Boolean(tabs.get(getTabId(value))))
  );

  // Keep always loaded tabs
  const whiteListTabsAlwaysLoaded = (mountedTabs
    .filter(([tabId]) => filterAlwaysLoaded(applications, tabs.get(tabId)!, manifests, appSettings)) as Immutable.Set<any>);

  // Keep visible tabs
  const whiteListTabsVisible = mountedTabs
    .filter(([tabId]) => currentlyVisibleTabIds.indexOf(tabId) !== -1);

  const whiteListTabsAlwaysLoadedOrVisible = whiteListTabsAlwaysLoaded.merge(whiteListTabsVisible);

  // Tabs that we can't kill plus the rest of mounted tabs ordered
  // by activity up to `maxActiveTabs`, skipping tabs idle for longer than `idleLimitMs`
  // We ignore `alwaysLoaded` if we want this to remain efficient
  const seatsAvailable = maxActiveTabs - whiteListTabsVisible.size;

  let tabsAllowedToStay: Immutable.Iterable<any, any> = Immutable.Set();
  if (seatsAvailable > 0) {
    tabsAllowedToStay = mountedTabs
      .subtract(whiteListTabsAlwaysLoadedOrVisible)
      .filter(([tabId]) => !isIdleTooLong(tabId))
      .sortBy(([tabId]) => lastUsedAt(tabId))
      .reverse()
      .slice(0, seatsAvailable);
  }

  // Merge tabs that we can't kill
  const whiteListTabs = whiteListTabsAlwaysLoadedOrVisible.merge(tabsAllowedToStay);

  return mountedTabs.subtract(whiteListTabs);
}

export const hasEmptyHistory = (wc: Electron.WebContents) => !wc.canGoBack();

export const removeHashFromURL = (url: string) => url.split('#')[0];
