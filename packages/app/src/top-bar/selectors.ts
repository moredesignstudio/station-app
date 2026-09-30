import { createSelector } from 'reselect';

import { getApplicationsForDock } from '../dock/selectors';
import { getTabApplicationId, getTabBadge } from '../tabs/get';
import { getTabs } from '../tabs/selectors';

import { computeUnread } from './unread';

export const getUnread = createSelector(
  [getApplicationsForDock, getTabs],
  (applications, tabs) => computeUnread(
    applications
      .filter(application => Boolean(application))
      .map(application => application!.get('applicationId') as string)
      .toArray(),
    tabs
      .toList()
      .map(tab => ({ applicationId: getTabApplicationId(tab), badge: getTabBadge(tab) }))
      .toArray()
  )
);
