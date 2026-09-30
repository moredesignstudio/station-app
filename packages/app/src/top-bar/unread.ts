export interface Unread {
  /**
   * Unread messages across the rail. Per app we take the highest count, not
   * the sum: every open page of one account repeats the same inbox count.
   */
  count: number,
  /** Some app only shows "something new" (a dot, no number). */
  hasActivity: boolean,
  /** Apps with anything unread, in rail order. */
  applicationIds: string[],
}

export interface TabBadge {
  applicationId: string,
  badge: number | string | null | undefined,
}

/** Unread across the apps in the rail (in rail order), from their tabs' badges. */
export const computeUnread = (railApplicationIds: string[], tabBadges: TabBadge[]): Unread => {
  const perApp = new Map<string, { count: number, dot: boolean }>();
  for (const { applicationId, badge } of tabBadges) {
    if (!badge) continue;
    const entry = perApp.get(applicationId) || { count: 0, dot: false };
    if (Number.isInteger(badge)) entry.count = Math.max(entry.count, badge as number);
    else entry.dot = true;
    perApp.set(applicationId, entry);
  }

  const unread: Unread = { count: 0, hasActivity: false, applicationIds: [] };
  for (const applicationId of railApplicationIds) {
    const entry = perApp.get(applicationId);
    if (!entry) continue;
    unread.count += entry.count;
    if (!entry.count && entry.dot) unread.hasActivity = true;
    unread.applicationIds.push(applicationId);
  }
  return unread;
};
