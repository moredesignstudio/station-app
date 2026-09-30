import * as React from 'react';
// @ts-ignore no declaration file
import injectSheet from 'react-jss';
import * as classNames from 'classnames';
import { fill as fillTokens, motion, text } from '@getstation/theme';

import { getImageColor } from './imageColor';
import { RAIL_DUOTONE_FILTER_ID } from './RailFilters';

/**
 * An app in the rail. Inactive apps are drawn in duotone (midnight → milk);
 * the active app is in full color with a tight glow in the colors of what it
 * shows: the account's profile picture, or the app's own color. An account
 * shows its profile picture, without the small app icon. No unread badge for
 * now: new messages show as a brief bleed into color.
 * See design/proposals/moredesign-studio for the motion spec.
 */

interface Classes {
  anchor: string,
  item: string,
  active: string,
  arrive: string,
  bleed: string,
  scaleUpAnimation: string,
  glow: string,
  icon: string,
  layer: string,
  mono: string,
  color: string,
  disc: string,
  glyph: string,
  picture: string,
}

export interface OwnProps {
  classes?: Classes,
  applicationId: string,
  active?: boolean,
  badge?: string | number | null,
  isInstanceLogoInDockIcon?: boolean,
  logoURL?: string,
  /**
   * If passed to `true`, when the `AppDockIcon` will
   * get a little animation.
   */
  dramaticEnter?: boolean,
  onOverStateChange?: (newState: boolean) => void,
  onClick?: () => void,
  onRightClick?: () => void,
  iconRef?: (el: HTMLDivElement) => void,
}

interface GraphQLProps {
  loading: boolean,
  iconURL?: string,
  themeColor?: string,
  snoozed?: boolean | null,
}

type Props = OwnProps & GraphQLProps;

interface State {
  arrive: boolean,
  bleed: boolean,
  /** The profile picture's color, once sampled. */
  pictureColor: string | null,
}

const ICON = 32;
const ARRIVE_MS = 900;
const BLEED_MS = 1600;

const badgeValue = (badge: Props['badge']) => {
  if (badge === null || badge === undefined || badge === '' || badge === 0) return 0;
  return Number.isInteger(badge as number) ? (badge as number) : badge;
};

@injectSheet({
  anchor: {
    display: 'block',
    cursor: 'default',
  },
  item: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 60,
    margin: [0, 'auto'],
    padding: [6, 0],
    '&:hover $icon': { transform: 'translateY(-1px)' },
    '&:hover $color': { opacity: 1 },
    '&:active $icon': { transform: 'scale(0.94)' },
  },
  active: {
    '& $color': { opacity: 1 },
    '& $glow': { opacity: 0.6, transform: 'scale(1)' },
  },
  // becoming the active app: its light blooms, the icon pops
  arrive: {
    '& $glow': { animation: `rail-bloom ${ARRIVE_MS}ms ${motion.easeOut}` },
    '& $icon': { animation: `rail-pop ${motion.slow} ${motion.easeSpring}` },
  },
  // a new message while in the background: the icon bleeds into color
  bleed: {
    '& $icon': { animation: `rail-bleed-pop ${BLEED_MS}ms ${motion.easeInOut}` },
    '& $color': { animation: `rail-bleed ${BLEED_MS}ms ${motion.easeInOut}` },
  },
  scaleUpAnimation: {
    animation: 'app-dock-icon-scale-up .5s cubic-bezier(0.2, 0, 0, 1)',
  },
  // a tight light right around the icon, in the colors of what it shows
  glow: {
    position: 'absolute',
    top: 6,
    left: '50%',
    width: ICON,
    height: ICON,
    marginLeft: -ICON / 2,
    borderRadius: '50%',
    backgroundColor: 'var(--glow-color)',
    filter: 'blur(6px)',
    opacity: 0,
    transform: 'scale(0.6)',
    transition: `opacity ${motion.slow} ${motion.easeOut}, transform ${motion.slow} ${motion.easeOut}, background-color ${motion.slow}`,
    pointerEvents: 'none',
  },
  icon: {
    position: 'relative',
    zIndex: 1,
    width: ICON,
    height: ICON,
    transition: `transform ${motion.base} ${motion.easeSpring}`,
  },
  layer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: ICON,
    height: ICON,
    borderRadius: '50%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mono: {
    filter: `url(#${RAIL_DUOTONE_FILTER_ID})`,
  },
  // Two stacked layers so color fades in and out smoothly
  // (an SVG filter like the duotone can't be tweened).
  color: {
    opacity: 0,
    transition: `opacity ${motion.slow} ${motion.easeOut}`,
  },
  disc: {
    backgroundColor: fillTokens.active,
    '&$color': { backgroundColor: 'var(--app-color)' },
  },
  glyph: {
    width: 30,
    height: 30,
    display: 'block',
  },
  picture: {
    width: ICON,
    height: ICON,
    display: 'block',
    objectFit: 'cover',
  },
  '@keyframes rail-bloom': {
    '0%': { opacity: 0, transform: 'scale(0.5)' },
    '35%': { opacity: 0.85, transform: 'scale(1.2)' },
    '100%': { opacity: 0.6, transform: 'scale(1)' },
  },
  '@keyframes rail-pop': {
    '0%': { transform: 'scale(0.86)' },
    '100%': { transform: 'scale(1)' },
  },
  '@keyframes rail-bleed': {
    '0%, 100%': { opacity: 0 },
    '16%, 72%': { opacity: 1 },
  },
  '@keyframes rail-bleed-pop': {
    '0%, 100%': { transform: 'none' },
    '16%': { transform: 'scale(1.12)' },
    '30%': { transform: 'scale(1)' },
  },
  '@keyframes app-dock-icon-scale-up': {
    '0%': { transform: 'scale(0)' },
    '90%': { transform: 'scale(1.1)' },
    '100%': { transform: 'scale(1)' },
  },
})
export class AppDockIcon extends React.PureComponent<Props, State> {
  static defaultProps = {
    active: false,
    onClick: () => { },
    onOverStateChange: () => { },
  };

  state: State = { arrive: false, bleed: false, pictureColor: null };

  private timers: ReturnType<typeof setTimeout>[] = [];
  private mounted = false;

  componentDidMount() {
    this.mounted = true;
    this.samplePicture();
  }

  componentDidUpdate(prevProps: Props) {
    const { active, badge, logoURL, isInstanceLogoInDockIcon } = this.props;
    if (active && !prevProps.active) this.flash('arrive', ARRIVE_MS);

    const before = badgeValue(prevProps.badge);
    const now = badgeValue(badge);
    const grew = now && (!before || (typeof now === 'number' && typeof before === 'number' && now > before));
    if (grew && !active) this.flash('bleed', BLEED_MS);

    if (logoURL !== prevProps.logoURL || isInstanceLogoInDockIcon !== prevProps.isInstanceLogoInDockIcon) {
      this.samplePicture();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    this.timers.forEach(timer => clearTimeout(timer));
  }

  samplePicture() {
    const { isInstanceLogoInDockIcon, logoURL } = this.props;
    if (!isInstanceLogoInDockIcon || !logoURL) {
      if (this.state.pictureColor) this.setState({ pictureColor: null });
      return;
    }
    getImageColor(logoURL).then(pictureColor => {
      if (this.mounted && this.props.logoURL === logoURL) this.setState({ pictureColor });
    });
  }

  // Restart a one-shot animation: drop the class for a frame, then add it back.
  flash(key: 'arrive' | 'bleed', ms: number) {
    this.setState({ [key]: false } as Pick<State, 'arrive' | 'bleed'>, () => {
      requestAnimationFrame(() => {
        this.setState({ [key]: true } as Pick<State, 'arrive' | 'bleed'>);
        this.timers.push(setTimeout(() => this.setState({ [key]: false } as Pick<State, 'arrive' | 'bleed'>), ms));
      });
    });
  }

  handleMouseEnter = () => this.props.onOverStateChange!(true);

  handleMouseLeave = () => this.props.onOverStateChange!(false);

  renderFace(layer: string) {
    const { classes, isInstanceLogoInDockIcon, logoURL, iconURL } = this.props;
    if (isInstanceLogoInDockIcon && logoURL) {
      return (
        <span className={classNames(classes!.layer, layer)}>
          <img className={classes!.picture} src={logoURL} alt="" draggable={false} />
        </span>
      );
    }
    return (
      <span className={classNames(classes!.layer, classes!.disc, layer)}>
        {iconURL && <img className={classes!.glyph} src={iconURL} alt="" draggable={false} />}
      </span>
    );
  }

  render() {
    const { classes, loading, active, dramaticEnter, themeColor, onClick, onRightClick, iconRef } = this.props;
    if (loading) return null;

    const appColor = themeColor || text.secondary;

    return (
      <div ref={iconRef}>
        <a
          className={classes!.anchor}
          onClick={onClick}
          onContextMenu={onRightClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        >
          <div
            className={classNames(classes!.item, {
              [classes!.active]: active,
              [classes!.arrive]: this.state.arrive,
              [classes!.bleed]: this.state.bleed,
              [classes!.scaleUpAnimation]: dramaticEnter,
            })}
            style={{
              ['--app-color' as any]: appColor,
              ['--glow-color' as any]: this.state.pictureColor || appColor,
            }}
          >
            <span className={classes!.glow} />
            <span className={classes!.icon}>
              {this.renderFace(classes!.mono)}
              {this.renderFace(classes!.color)}
            </span>
          </div>
        </a>
      </div>
    );
  }
}

export const AppearingAppDockIcon = (props: Props) => {
  // when `dramaticEnter` is true we need to temporarely
  // set the icon as active so that the animation is complete
  const [active, setActive] = React.useState(false);
  const appearingActiveTimer = React.useRef<NodeJS.Timer | null>(null);

  const temporarySetActive = () => {
    setActive(true);
    appearingActiveTimer.current = setTimeout(() => {
      setActive(false);
      appearingActiveTimer.current = null;
    }, 1000);
  };

  React.useEffect(() => {
    if (props.dramaticEnter && !appearingActiveTimer.current) {
      temporarySetActive();
    }
  }, [props.dramaticEnter]);

  return (
    <AppDockIcon
      {...props}
      active={active || props.active}
    />
  );
};
