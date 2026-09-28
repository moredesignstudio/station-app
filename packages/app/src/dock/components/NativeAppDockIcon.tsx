import {
  fill as fillTokens, Icon, IconSymbol, radius, status, surface, text, Tooltip, transition,
} from '@getstation/theme';
import * as classNames from 'classnames';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import * as shortid from 'shortid';
export import IconSymbol = IconSymbol;

export enum Size {
  HALF, NORMAL, BIG,
}

interface Classes {
  dockIcon: string,
  sizeHalf: string,
  sizeBig: string,
  inner: string,
  imageRing: string,
  active: string,
  disabled: string,
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
  size?: Size,
}

interface State {
  canRenderImage: boolean,
}

@injectSheet({
  dockIcon: {
    display: 'block',
    margin: [2, 0],
    color: text.secondary,
    transition: `color ${transition.fast}`,
    '&:not($disabled):not($active):hover': {
      color: text.primary,
      '& $inner': { fill: fillTokens.hover },
    },
  },
  sizeHalf: {
    margin: 0,
  },
  sizeBig: {
    margin: [4, 0],
  },
  inner: {
    fill: 'transparent',
    transition: `fill ${transition.fast}`,
  },
  imageRing: {
    fill: fillTokens.strong,
  },
  active: {
    color: text.primary,
    '& $inner': { fill: fillTokens.selected },
  },
  disabled: {
    color: text.disabled,
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

  imageId: string;
  img: SVGImageElement | null;

  constructor(props: Props) {
    super(props);
    this.state = {
      canRenderImage: true,
    };

    this.imageId = `icon-img-${shortid.generate()}`;
  }

  componentDidMount() {
    if (this.img) {
      (this.img as any).onerror = () => {
        if (this.state.canRenderImage) {
          this.setState({ canRenderImage: false });
        }
      };
    }
  }

  renderImg() {
    const { classes } = this.props;
    return (
      <g>
        <circle cx="25" cy="12" r="9" className={classes!.imageRing} />
        <circle cx="25" cy="12" r="8" fill={`url(#${this.imageId})`} />
      </g>
    );
  }

  renderIcon() {
    const { iconSymbolId, color } = this.props;

    // `currentColor` lets the icon follow the hover / active / disabled
    // color set on the root svg
    return (
      <Icon symbolId={iconSymbolId} color={color || 'currentColor'} />
    );
  }

  renderBadge() {
    const { badge, iconSymbolId } = this.props;

    if (!badge) return null;

    // center of the badge
    let center = { cx: 36, cy: 7 };

    // for notificaton icon, for easthetism we'd like to place
    // the badge exactly on the dot of the icon
    if (iconSymbolId === IconSymbol.NOTIFICATION) {
      center = { ...center, cx: 30 };
    }

    return (
      <g>
        <circle {...center} r="3.5" fill={surface.sidebar} />
        <circle {...center} r="2.5" fill={status.badge} />
      </g>
    );
  }

  renderSvg() {
    const {
      classes, onMouseEnter, onMouseLeave, active, disabled, onClick, imageURL,
      fallbackImageURL, size,
    } = this.props;
    const { canRenderImage } = this.state;

    const sizeClassNames = {
      [Size.HALF]: classes!.sizeHalf,
      [Size.NORMAL]: '',
      [Size.BIG]: classes!.sizeBig,
    };

    const className = classNames(
      classes!.dockIcon,
      sizeClassNames[size!],
      {
        [classes!.active]: active,
        [classes!.disabled]: disabled,
      }
    );

    const SizesProps = {
      [Size.HALF]: {
        width: 25, height: 24, viewBox: '0 0 25 24', x: 0, y: 0, rx: radius.md, rectWidth: 25,
      },
      [Size.NORMAL]: {
        width: 50, height: 24, viewBox: '0 0 50 24', x: 4, y: 0, rx: radius.md, rectWidth: 42,
      },
      [Size.BIG]: {
        width: 50, height: 32, viewBox: '0 0 50 32', x: 4, y: 0, rx: radius.md, rectWidth: 42,
      },
    };

    const props = SizesProps[size!];

    return (
      <svg
        width={props.width}
        height={props.height}
        viewBox={props.viewBox}
        className={className}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        { imageURL &&
          <defs>
            <pattern id={this.imageId} width="100%" height="100%" x="0">
              <image ref={img => this.img = img} xlinkHref={canRenderImage ? imageURL : fallbackImageURL} width="16" height="16" />
            </pattern>
          </defs>
        }

        <g>
          <rect
            className={classes!.inner}
            width={props.rectWidth}
            height={props.height}
            x={props.x}
            y={props.y}
            rx={props.rx}
          />
          {imageURL ? this.renderImg() : this.renderIcon()}
          {this.renderBadge()}
        </g>
      </svg>
    );
  }

  render() {
    const { tooltip } = this.props;

    return (
      <Tooltip className={this.props.className} placement="right" tooltip={tooltip}>
        {this.renderSvg()}
      </Tooltip>
    );
  }
}
