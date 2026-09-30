import { fill as fillTokens, Icon, IconSymbol, motion, status, surface, text, Tooltip } from '@getstation/theme';
import * as classNames from 'classnames';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
export import IconSymbol = IconSymbol;

/**
 * A round button at the bottom of the rail (add apps, focus mode,
 * notifications, update). `active` is its pressed / open state.
 */

export enum Size {
  HALF, NORMAL, BIG,
}

interface Classes {
  dockIcon: string,
  active: string,
  disabled: string,
  spinOnHover: string,
  image: string,
  badge: string,
}

interface Props {
  classes?: Classes,
  className?: string,
  iconSymbolId: IconSymbol,
  imageURL?: string,
  fallbackImageURL?: string,
  onClick?: () => any,
  onMouseEnter?: () => any,
  onMouseLeave?: () => any,
  active?: boolean,
  badge?: boolean
  color?: string,
  disabled?: boolean,
  tooltip?: string,
  /** Kept for API compatibility; every rail button is the same round size now. */
  size?: Size,
}

interface State {
  canRenderImage: boolean,
}

const SIZE = 32;

@injectSheet({
  dockIcon: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: SIZE,
    height: SIZE,
    margin: [0, 'auto'],
    borderRadius: '50%',
    color: text.secondary,
    backgroundColor: fillTokens.active,
    cursor: 'default',
    transition: `background-color ${motion.quick}, color ${motion.quick}, transform ${motion.base} ${motion.easeSpring}`,
    '& svg': {
      transition: `transform ${motion.slow} ${motion.easeSpring}`,
    },
    '&:not($disabled):not($active):hover': {
      color: text.primary,
      backgroundColor: fillTokens.strong,
    },
    '&:not($disabled):active': {
      transform: 'scale(0.9)',
    },
  },
  // the "+" turns a quarter on hover
  spinOnHover: {
    '&:hover svg': { transform: 'rotate(90deg)' },
  },
  active: {
    color: text.inverse,
    backgroundColor: text.primary,
    '& svg': { transform: 'rotate(-24deg)' },
  },
  disabled: {
    color: text.disabled,
  },
  image: {
    width: 18,
    height: 18,
    borderRadius: '50%',
    boxShadow: `0 0 0 1px ${fillTokens.strong}`,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 9,
    height: 9,
    borderRadius: '50%',
    backgroundColor: status.badge,
    boxShadow: `0 0 0 2px ${surface.sidebar}`,
  },
})
export default class NativeAppDockIcon extends React.PureComponent<Props, State> {

  static defaultProps = {
    size: Size.NORMAL,
    active: false,
    badge: false,
    onClick: () => {},
    onMouseEnter: () => {},
    onMouseLeave: () => {},
  };

  state: State = { canRenderImage: true };

  handleImageError = () => {
    if (this.state.canRenderImage) this.setState({ canRenderImage: false });
  }

  render() {
    const {
      classes, className, tooltip, iconSymbolId, color, imageURL, fallbackImageURL,
      onClick, onMouseEnter, onMouseLeave, active, disabled, badge,
    } = this.props;

    return (
      <Tooltip className={className} placement="right" tooltip={tooltip}>
        <div
          className={classNames(classes!.dockIcon, {
            [classes!.active]: active,
            [classes!.disabled]: disabled,
            [classes!.spinOnHover]: iconSymbolId === IconSymbol.PLUS,
          })}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {imageURL
            ? <img
              className={classes!.image}
              src={this.state.canRenderImage ? imageURL : fallbackImageURL}
              onError={this.handleImageError}
              alt=""
            />
            : <Icon symbolId={iconSymbolId} size={22} color={color || 'currentColor'} />
          }
          {badge && <span className={classes!.badge} />}
        </div>
      </Tooltip>
    );
  }
}
