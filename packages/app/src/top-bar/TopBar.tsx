import { ThemeTypes } from '@getstation/theme';
import * as classNames from 'classnames';
import * as Immutable from 'immutable';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

// @ts-ignore: no declaration file
import { getForeFrontNavigationStateProperty } from '../applications/utils';
import { getApplicationsForDock } from '../dock/selectors';
import { INFINITE, SYNC_WITH_OS } from '../notification-center/constants';
import { resetSnoozeDuration, setSnoozeDuration } from '../notification-center/duck';
import { getSnoozeDuration, getSnoozeState } from '../notification-center/selectors';
import { StationState } from '../types';

/**
 * The top bar: holds the native traffic lights (macOS), drags the window,
 * and shows "today at a glance": unread messages across the rail and the
 * focus switch. A thin line runs under it while the current page loads.
 * See design/proposals/moredesign-studio.
 */

interface Classes {
  container: string,
  today: string,
  slash: string,
  count: string,
  focus: string,
  switch: string,
  switchOn: string,
  loading: string,
  paused: string,
  pausedVisible: string,
}

interface StateProps {
  unread: number | string | null,
  isLoading: boolean,
  isSnoozed: boolean,
  syncWithOS: boolean,
}

interface DispatchProps {
  setSnooze: (duration: string) => any,
  resetSnooze: () => any,
}

interface OwnProps {
  classes?: Classes,
  onDoubleClick: (event: React.MouseEvent) => void,
}

type Props = OwnProps & StateProps & DispatchProps;

const sumBadges = (total: number | string | null, badge: any) => {
  if (!badge) return total;
  if (!total) return badge;
  if (Number.isInteger(total) && Number.isInteger(badge)) return (total as number) + badge;
  return '•';
};

const styles = (theme: ThemeTypes) => ({
  container: {
    position: 'relative',
    flex: `0 0 ${theme.layout.topBarHeight}px`,
    height: theme.layout.topBarHeight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    WebkitAppRegion: 'drag',
  },
  today: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    height: 30,
    ...theme.fontMixin(13),
    color: theme.text.secondary,
  },
  slash: {
    color: theme.text.disabled,
  },
  count: {
    color: theme.text.primary,
    fontWeight: 500,
  },
  focus: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
    cursor: 'default',
    WebkitAppRegion: 'no-drag',
    transition: `color ${theme.motion.base} ${theme.motion.easeOut}`,
    '&:hover': {
      color: theme.text.primary,
    },
  },
  switch: {
    position: 'relative',
    width: 22,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.fill.strong,
    transition: `background-color ${theme.motion.base} ${theme.motion.easeOut}`,
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 2,
      left: 2,
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: theme.text.primary,
      transition: `transform ${theme.motion.slow} ${theme.motion.easeSpring}, background-color ${theme.motion.base}`,
    },
  },
  switchOn: {
    backgroundColor: theme.text.primary,
    '&::after': {
      transform: 'translateX(10px)',
      backgroundColor: theme.text.inverse,
    },
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 3,
    height: 1,
    opacity: 0.7,
    background: `linear-gradient(90deg, transparent, ${theme.text.primary}, transparent) no-repeat`,
    backgroundSize: '40% 100%',
    animation: `top-bar-scan 1.4s ${theme.motion.easeInOut} infinite`,
  },
  '@keyframes top-bar-scan': {
    from: { backgroundPosition: '-60% 0' },
    to: { backgroundPosition: '160% 0' },
  },
  paused: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: 'translate(6px, -50%)',
    opacity: 0,
    pointerEvents: 'none',
    ...theme.fontMixin(12),
    color: theme.text.secondary,
    transition: `opacity ${theme.motion.base} ${theme.motion.easeOut}, transform ${theme.motion.base} ${theme.motion.easeOut}`,
  },
  pausedVisible: {
    opacity: 1,
    transform: 'translate(0, -50%)',
  },
});

@injectSheet(styles)
class TopBarImpl extends React.PureComponent<Props> {
  onDoubleClick = (event: React.MouseEvent) => {
    // only the bar itself zooms the window, not its controls
    if (event.target === event.currentTarget) this.props.onDoubleClick(event);
  }

  toggleFocus = () => {
    const { isSnoozed, syncWithOS, setSnooze, resetSnooze } = this.props;
    if (syncWithOS) return;
    if (isSnoozed) resetSnooze();
    else setSnooze(INFINITE);
  }

  renderUnread() {
    const { classes, unread } = this.props;
    if (!unread) return <span>all caught up</span>;
    if (unread === '•') return <span className={classes!.count}>new messages</span>;
    return <span><span className={classes!.count}>{unread}</span> unread</span>;
  }

  render() {
    const { classes, isLoading, isSnoozed, syncWithOS } = this.props;

    return (
      <header className={classes!.container} onDoubleClick={this.onDoubleClick}>
        <div className={classes!.today}>
          {this.renderUnread()}
          <span className={classes!.slash}>/</span>
          <span
            className={classes!.focus}
            onClick={this.toggleFocus}
            title={syncWithOS ? 'Your Mac is in Do Not Disturb mode' : (isSnoozed ? 'Resume notifications' : 'Pause notifications')}
          >
            <span className={classNames(classes!.switch, { [classes!.switchOn]: isSnoozed })} />
            focus
          </span>
          {isLoading && <span className={classes!.loading} />}
        </div>
        <span className={classNames(classes!.paused, { [classes!.pausedVisible]: isSnoozed })}>
          notifications paused
        </span>
      </header>
    );
  }
}

const TopBar = connect<StateProps, DispatchProps, OwnProps>(
  (state: StationState) => ({
    unread: getApplicationsForDock(state)
      .map((application: Immutable.Map<string, any>) => application && application.get('badge'))
      .reduce(sumBadges, null),
    isLoading: Boolean(getForeFrontNavigationStateProperty(state, 'isLoading')),
    isSnoozed: getSnoozeState(state),
    syncWithOS: getSnoozeDuration(state) === SYNC_WITH_OS,
  }),
  (dispatch: Dispatch) => bindActionCreators(
    {
      setSnooze: (duration: string) => setSnoozeDuration('top-bar', duration),
      resetSnooze: () => resetSnoozeDuration('top-bar'),
    },
    dispatch
  )
)(TopBarImpl);

export default TopBar;
