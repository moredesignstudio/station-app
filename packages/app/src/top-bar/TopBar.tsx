import { ThemeTypes } from '@getstation/theme';
import * as classNames from 'classnames';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { connect } from 'react-redux';

// @ts-ignore: no declaration file
import { getForeFrontNavigationStateProperty } from '../applications/utils';
import { getSnoozeState } from '../notification-center/selectors';
import { StationState } from '../types';

/**
 * The top bar: holds the native traffic lights (macOS), drags the window,
 * and shows the wordmark under a slow ambient light: the brand gradient used
 * as light, not as paint. "notifications paused" shows while focus is on,
 * and a thin line runs under the wordmark while the current page loads.
 * See design/proposals/moredesign-studio.
 */

interface Classes {
  container: string,
  ambient: string,
  wordmark: string,
  loading: string,
  paused: string,
  pausedVisible: string,
}

interface StateProps {
  isLoading: boolean,
  isSnoozed: boolean,
}

interface OwnProps {
  classes?: Classes,
  onDoubleClick: (event: React.MouseEvent) => void,
}

type Props = OwnProps & StateProps;

const styles = (theme: ThemeTypes) => {
  const [mint, , , magenta] = theme.accent.ramp;
  return {
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
    // a wide, soft light that drifts slowly behind the wordmark
    ambient: {
      position: 'absolute',
      left: '50%',
      top: -70,
      width: 760,
      height: 150,
      marginLeft: -380,
      borderRadius: '50%',
      background: `radial-gradient(closest-side, color-mix(in srgb, ${mint} 20%, transparent), ` +
        `color-mix(in srgb, ${magenta} 13%, transparent) 55%, transparent)`,
      filter: 'blur(28px)',
      pointerEvents: 'none',
      animation: `top-bar-drift 18s ${theme.motion.easeInOut} infinite alternate`,
      '@media (prefers-reduced-motion: reduce)': {
        animation: 'none',
      },
    },
    '@keyframes top-bar-drift': {
      from: { transform: 'translateX(-80px) scale(1)' },
      to: { transform: 'translateX(80px) scale(1.1)' },
    },
    wordmark: {
      position: 'relative',
      ...theme.fontMixin(15, 500),
      letterSpacing: '-0.01em',
      color: theme.text.primary,
    },
    loading: {
      position: 'absolute',
      left: -12,
      right: -12,
      bottom: -5,
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
  };
};

@injectSheet(styles)
class TopBarImpl extends React.PureComponent<Props> {
  onDoubleClick = (event: React.MouseEvent) => this.props.onDoubleClick(event);

  render() {
    const { classes, isLoading, isSnoozed } = this.props;

    return (
      <header className={classes!.container} onDoubleClick={this.onDoubleClick}>
        <span className={classes!.ambient} />
        <span className={classes!.wordmark}>
          more mail
          {isLoading && <span className={classes!.loading} />}
        </span>
        <span className={classNames(classes!.paused, { [classes!.pausedVisible]: isSnoozed })}>
          notifications paused
        </span>
      </header>
    );
  }
}

const TopBar = connect<StateProps, {}, OwnProps>(
  (state: StationState) => ({
    isLoading: Boolean(getForeFrontNavigationStateProperty(state, 'isLoading')),
    isSnoozed: getSnoozeState(state),
  })
)(TopBarImpl);

export default TopBar;
