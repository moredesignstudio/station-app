import { ThemeTypes } from '@getstation/theme';
import * as React from 'react';
import injectSheet from 'react-jss';
import NotificationCenterSnoozePanelItem from './NotiticationCenterSnoozePanelItem';
import { minutesBeforeHeightAm } from '../utils';

export interface Classes {
  container: string,
  title: string,
  list: string,
}

export interface Props {
  classes?: Classes,
  handleSnooze: (duration: string) => any,
}

const styles = (theme: ThemeTypes) => ({
  container: {
    minWidth: 160,
    marginTop: 6,
    padding: 6,
    backgroundColor: theme.surface.elevated,
    borderRadius: theme.radius.lg,
    boxShadow: theme.shadow.panel,
  },
  title: {
    display: 'block',
    padding: [4, 8, 6],
    ...theme.mixins.sectionLabel(),
  },
  list: {
    marginTop: 0,
  },
});

@injectSheet(styles)
class NotificationCenterSnoozePanel extends React.PureComponent<Props, {}> {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes!.container}>
        <span className={classes!.title}>Do Not Disturb for</span>
        <ul className={classes!.list}>
          <NotificationCenterSnoozePanelItem
            handleClick={() => this.props.handleSnooze('21min')}
            duration="20 minutes"
          />
          <NotificationCenterSnoozePanelItem
            handleClick={() => this.props.handleSnooze('61min')}
            duration="1 hour"
          />
          <NotificationCenterSnoozePanelItem
            handleClick={() => this.props.handleSnooze('121min')}
            duration="2 hours"
          />
          <NotificationCenterSnoozePanelItem
            handleClick={() => this.props.handleSnooze('241min')}
            duration="4 hours"
          />
          <NotificationCenterSnoozePanelItem
            handleClick={() => this.props.handleSnooze(`${minutesBeforeHeightAm()}min`)}
            duration="Until tomorrow"
          />
          <NotificationCenterSnoozePanelItem
            handleClick={() => this.props.handleSnooze('INFINITE')}
            duration="Always"
          />
        </ul>
      </div>
    );
  }
}

export default NotificationCenterSnoozePanel;
