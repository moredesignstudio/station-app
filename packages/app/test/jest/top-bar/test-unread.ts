import { computeUnread } from '../../../src/top-bar/unread';

describe('computeUnread', () => {
  test('takes the highest count per app instead of adding its pages', () => {
    const unread = computeUnread(['gmail'], [
      { applicationId: 'gmail', badge: 5 },
      { applicationId: 'gmail', badge: 5 },
      { applicationId: 'gmail', badge: 3 },
    ]);
    expect(unread.count).toBe(5);
  });

  test('adds up the apps in the rail, in rail order', () => {
    const unread = computeUnread(['slack', 'gmail', 'drive'], [
      { applicationId: 'gmail', badge: 5 },
      { applicationId: 'slack', badge: 2 },
      { applicationId: 'drive', badge: null },
    ]);
    expect(unread.count).toBe(7);
    expect(unread.applicationIds).toEqual(['slack', 'gmail']);
  });

  test('a dot is "something new" and does not break the count', () => {
    const unread = computeUnread(['gmail', 'whatsapp'], [
      { applicationId: 'gmail', badge: 4 },
      { applicationId: 'whatsapp', badge: '•' },
    ]);
    expect(unread.count).toBe(4);
    expect(unread.applicationIds).toEqual(['gmail', 'whatsapp']);

    const onlyDots = computeUnread(['whatsapp'], [{ applicationId: 'whatsapp', badge: '•' }]);
    expect(onlyDots).toEqual({ count: 0, hasActivity: true, applicationIds: ['whatsapp'] });
  });

  test('ignores apps that are not in the rail', () => {
    const unread = computeUnread(['gmail'], [{ applicationId: 'removed-app', badge: 9 }]);
    expect(unread).toEqual({ count: 0, hasActivity: false, applicationIds: [] });
  });
});
