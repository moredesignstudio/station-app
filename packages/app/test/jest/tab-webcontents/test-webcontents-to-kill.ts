import * as Immutable from 'immutable';
import { tabWebcontentsToKill, TabsToKillOptions } from '../../../src/tab-webcontents/api';
import { applications, manifests, appSettings, tabs, tabWebcontents } from './webcontents-to-kill-data';

const MINUTE = 60 * 1000;
// most recent `lastActivityAt` in the fixture
const LAST_ACTIVITY = 1530551261738;

const tabsToKill = (options?: TabsToKillOptions): string[] => {
  const results = tabWebcontentsToKill(
    Immutable.fromJS(applications),
    Immutable.fromJS(appSettings),
    Immutable.fromJS(tabWebcontents),
    manifests,
    Immutable.fromJS(tabs),
    [],
    options
  );

  // @ts-ignore: no iterator declaration
  return results.map(([tabId]) => tabId).toJS();
};

describe('webcontents to kill', () => {
  it('should kill the oldest loaded tabs', () => {
    const tabsIds = tabsToKill({ maxActiveTabs: 7 });

    const expectedTabIds = [
      'slite-r1qAypUff/HyYuQK9WQ',
      'slite-r1qAypUff/rkISut8ZQ',
      'slite-r1qAypUff/BkT4QIypf',
      'slite-r1qAypUff/SytooADzX',
      'slite-r1qAypUff/B1AWOW3k7',
    ];

    expect(tabsIds).toEqual(expect.arrayContaining(expectedTabIds));
    expect(tabsIds).toHaveLength(expectedTabIds.length);
  });

  it('should keep only 3 background tabs by default', () => {
    const tabsIds = tabsToKill();

    const expectedTabIds = [
      'slite-r1qAypUff/HyYuQK9WQ',
      'slite-r1qAypUff/rkISut8ZQ',
      'slite-r1qAypUff/BkT4QIypf',
      'slite-r1qAypUff/SytooADzX',
      'slite-r1qAypUff/B1AWOW3k7',
      'slite-r1qAypUff/rybshI4yQ',
      'slite-r1qAypUff/BkEeC-Txm',
      'slite-r1qAypUff/ByiSMqvzm',
      'slite-r1qAypUff/HJI6ybAhG',
    ];

    expect(tabsIds).toEqual(expect.arrayContaining(expectedTabIds));
    expect(tabsIds).toHaveLength(expectedTabIds.length);
  });

  it('should not kill more tabs when none has been idle too long', () => {
    const withIdleLimit = tabsToKill({ idleLimitMs: 30 * MINUTE, now: LAST_ACTIVITY + 10 * MINUTE });

    expect(withIdleLimit.sort()).toEqual(tabsToKill().sort());
  });

  it('should kill tabs idle for too long even within the limit', () => {
    const tabsIds = tabsToKill({ idleLimitMs: 30 * MINUTE, now: LAST_ACTIVITY + 40 * MINUTE });

    // the 3 most recent background tabs, kept by the limit alone
    expect(tabsIds).toEqual(expect.arrayContaining([
      'clickup-r1Vks7aBG/ByeE1jQpBM',
      'slite-r1qAypUff/B1XWQJO-m',
      'slite-r1qAypUff/S19WLgCnM',
    ]));
    expect(tabsIds).toHaveLength(12);

    // always loaded tabs are never killed
    expect(tabsIds).not.toContain('gmail-rkXZqYPiz/H1Mm-9KPsf');
    expect(tabsIds).not.toContain('gcalendar-mu-S17tkQD2mM/HkEYkmPhXf');
    expect(tabsIds).not.toContain('slack-SyxuaZEEf/rkxeda-NEG');
  });

  it('should keep a tab seen recently even if it was opened long ago', () => {
    const now = LAST_ACTIVITY + 40 * MINUTE;
    const tabsIds = tabsToKill({
      now,
      idleLimitMs: 30 * MINUTE,
      lastSeenAt: new Map([['clickup-r1Vks7aBG/ByeE1jQpBM', now - MINUTE]]),
    });

    expect(tabsIds).not.toContain('clickup-r1Vks7aBG/ByeE1jQpBM');
    expect(tabsIds).toHaveLength(11);
  });
});
