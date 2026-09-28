import classNames from 'classnames';
import * as React from 'react';
import injectSheet from 'react-jss';
import { Button, ButtonProps, Icon, IconSymbol, Size } from '../..';

// outer props
export type ButtonIconProps = ButtonProps & {
  iconColor?: string,
  iconPosition?: 'Left' | 'Right',
  iconClassName?: string,
  symbolId: IconSymbol,
  text?: string,
};

interface Classes {
  button: string,
  iconAndTextSpan: string,
}

interface InjectSheetProps {
  classes: Classes,
  sheet: any
}

const positionStyle = {
  Left: {
    flexDirection: 'row',
    padding: '0 12px 0 6px',
  },
  Right: {
    flexDirection: 'row-reverse',
    padding: '0 6px 0 12px',
  },
};

const styles = {
  button: {
    padding: ({ iconPosition, text }: ButtonIconProps) => text ? positionStyle[iconPosition || 'Left'].padding : 0,
  },
  iconAndTextSpan: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    flexDirection: ({ iconPosition }: ButtonIconProps) => positionStyle[iconPosition || 'Left'].flexDirection,
    verticalAlign: 'top',
  },
};

class ButtonIconImp extends React.Component<InjectSheetProps & ButtonIconProps, {}> {

  static defaultProps = {
    // inherit the button's text color so every button style tints its icon
    iconColor: 'currentColor',
  };

  renderIcon() {
    const { classes, iconClassName, symbolId, text, iconColor } = this.props;
    const size = this.getIconSize();
    const icon = (
      <Icon
        key="icon"
        className={iconClassName}
        symbolId={symbolId}
        color={iconColor}
        size={size}
      />
    );
    if (!text) return icon;
    const iconAndTextSpan = (
      <span
        key="text"
        className={classes.iconAndTextSpan}
      >
        {icon}
        {text}
      </span>
    );
    return [
      iconAndTextSpan,
    ];
  }

  getIconSize = () => {
    switch (this.props.btnSize) {
      case Size.XXXSMALL:
        return 16;
      case Size.XXSMALL:
        return 18;
      case Size.XSMALL:
        return 20;
      case Size.SMALL:
        return 22;
      case Size.BIG:
        return 28;
      default:
        return 24;
    }
  }

  render() {
    const {
      className: upperClassName,
      // filter out uncecessary props for Button
      classes,
      sheet,
      iconColor,
      symbolId,
      text,
      iconClassName,
      iconPosition,

      ...buttonProps
    } = this.props;

    return (
      <Button
        className={classNames(classes.button, upperClassName)}
        {...buttonProps}
      >
        {this.renderIcon()}
      </Button>
    );
  }
}

// force outer typing
export const ButtonIcon = injectSheet(styles)(ButtonIconImp) as unknown as React.ComponentType<ButtonIconProps>;
