import { ThemeTypes } from '@getstation/theme';
import * as classNames from 'classnames';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

// @ts-ignore: no declaration file
import { getForeFrontNavigationStateProperty } from '../applications/utils';
import { changeSelectedApp } from '../applications/duck';
import { getActiveApplicationId } from '../nav/selectors';
import { INFINITE, SYNC_WITH_OS } from '../notification-center/constants';
import { resetSnoozeDuration, setSnoozeDuration } from '../notification-center/duck';
import { getSnoozeDuration, getSnoozeState } from '../notification-center/selectors';
import { StationState } from '../types';

import { getUnread } from './selectors';
import { Unread } from './unread';

/**
 * The top bar: holds the native traffic lights (macOS), drags the window,
 * and shows "today at a glance": unread messages across the rail (click to
 * go to the next app with unread) and the focus switch. A thin line runs under it while the current page loads.
 * See design/proposals/moredesign-studio.
 */

interface Classes {
  container: string,
  today: string,
  slash: string,
  count: string,
  unread: string,
  focus: string,
  switch: string,
  switchOn: string,
  loading: string,
  paused: string,
  pausedVisible: string,
}

interface StateProps {
  unread: Unread,
  activeApplicationId?: string,
  isLoading: boolean,
  isSnoozed: boolean,
  syncWithOS: boolean,
}

interface DispatchProps {
  setSnooze: (duration: string) => any,
  resetSnooze: () => any,
  selectApp: (applicationId: string) => any,
}

interface OwnProps {
  classes?: Classes,
  onDoubleClick: (event: React.MouseEvent) => void,
}

type Props = OwnProps & StateProps & DispatchProps;

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
  // clickable: goes to the next app with unread messages
  unread: {
    cursor: 'default',
    WebkitAppRegion: 'no-drag',
    transition: `color ${theme.motion.base} ${theme.motion.easeOut}`,
    '&:hover': {
      color: theme.text.primary,
    },
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

  goToUnread = () => {
    const { unread, activeApplicationId, selectApp } = this.props;
    const ids = unread.applicationIds;
    if (!ids.length) return;
    const next = ids[(ids.indexOf(activeApplicationId || '') + 1) % ids.length];
    selectApp(next);
  }

  renderUnread() {
    const { classes, unread } = this.props;
    if (!unread.count && !unread.hasActivity) return <span>all caught up</span>;
    return (
      <span className={classes!.unread} onClick={this.goToUnread} title="Go to the next app with unread messages">
        {unread.count
          ? <><span className={classes!.count}>{unread.count > 999 ? '999+' : unread.count}</span> unread</>
          : 'something new'}
      </span>
    );
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
    unread: getUnread(state),
    activeApplicationId: getActiveApplicationId(state),
    isLoading: Boolean(getForeFrontNavigationStateProperty(state, 'isLoading')),
    isSnoozed: getSnoozeState(state),
    syncWithOS: getSnoozeDuration(state) === SYNC_WITH_OS,
  }),
  (dispatch: Dispatch) => bindActionCreators(
    {
      setSnooze: (duration: string) => setSnoozeDuration('top-bar', duration),
      resetSnooze: () => resetSnoozeDuration('top-bar'),
      selectApp: (applicationId: string) => changeSelectedApp(applicationId, 'top-bar-unread'),
    },
    dispatch
  )
)(TopBarImpl);

export default TopBar;
