import * as React from 'react';
import injectSheet from 'react-jss';
import { createStyles, ThemeTypes } from '../../types';
import classNames = require('classnames');
import { Icon, IconSymbol } from '../Icon';

export enum Size {
  BIG, NORMAL, SMALL, XSMALL, XXSMALL, XXXSMALL,
}

/**
 * - MAIN / PRIMARY: the accent call-to-action (terracotta)
 * - SECONDARY: neutral filled button
 * - TERTIARY: ghost button, only visible on hover
 * - LINK: text-only accent link
 * - DANGER: destructive, red tinted
 * - OUTLINED: hairline bordered neutral
 */
export enum Style {
  MAIN, PRIMARY, SECONDARY, TERTIARY, LINK, DANGER, OUTLINED,
}

export interface ButtonOwnProps extends JSX.IntrinsicClassAttributes<ButtonImpl> {
  btnSize?: Size,
  btnStyle?: Style
  isLoading?: boolean,
}
interface InjectSheetProps {
  classes: any,
  sheet: any,
}

// outer props
export type ButtonProps = ButtonOwnProps & React.HTMLProps<HTMLButtonElement>;

const styles = (theme: ThemeTypes) => createStyles({
  button: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    appearance: 'none' as 'none',
    border: 'none',
    margin: 0,
    padding: ((props: ButtonProps) => isRenderingIcon(props) ? 0 : '0 12px') as any,
    aspectRatio: ((props: ButtonProps) => isRenderingIcon(props) ? '1 / 1' : 'auto') as any,
    borderRadius: theme.radius.md,
    height: 32,
    lineHeight: '32px',
    fontFamily: theme.font.sans,
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: '-0.01em',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    userSelect: 'none',
    transition: `background-color ${theme.transition.fast}, color ${theme.transition.fast}, box-shadow ${theme.transition.fast}`,
    '&:disabled': {
      cursor: 'default',
      opacity: 0.4,
    },
    '&:focus': {
      outline: 'none',
    },
    '&:focus-visible': {
      boxShadow: theme.shadow.focus,
    },
  },
  buttonXSmall: {
    height: 26,
    lineHeight: '26px',
    fontSize: 12,
    padding: ((props: ButtonProps) => isRenderingIcon(props) ? 0 : '0 10px') as any,
  },
  buttonXXSmall: {
    height: 22,
    lineHeight: '22px',
    fontSize: 11,
    padding: ((props: ButtonProps) => isRenderingIcon(props) ? 0 : '0 8px') as any,
  },
  buttonXXXSmall: {
    height: 18,
    lineHeight: '18px',
    fontSize: 11,
    padding: ((props: ButtonProps) => isRenderingIcon(props) ? 0 : '0 6px') as any,
  },
  buttonSmall: {
    height: 28,
    lineHeight: '28px',
    fontSize: 12,
  },
  buttonBig: {
    fontSize: 14,
    height: 38,
    lineHeight: '38px',
    padding: ((props: ButtonProps) => isRenderingIcon(props) ? 0 : '0 16px') as any,
    borderRadius: theme.radius.lg,
  },
  buttonMain: {
    backgroundColor: theme.accent.default,
    color: theme.text.onAccent,
    '&:hover:enabled': {
      backgroundColor: theme.accent.hover,
    },
    '&:active:enabled': {
      backgroundColor: theme.accent.active,
    },
  },
  buttonPrimary: {
    backgroundColor: theme.accent.default,
    color: theme.text.onAccent,
    '&:hover:enabled': {
      backgroundColor: theme.accent.hover,
    },
    '&:active:enabled': {
      backgroundColor: theme.accent.active,
    },
  },
  buttonSecondary: {
    color: theme.text.primary,
    backgroundColor: theme.fill.active,
    boxShadow: `inset 0 0 0 1px ${theme.border.default}`,
    '&:hover:enabled': {
      backgroundColor: theme.fill.selected,
    },
    '&:active:enabled': {
      backgroundColor: theme.fill.strong,
    },
  },
  buttonTertiary: {
    backgroundColor: 'transparent',
    color: theme.text.secondary,
    '&:hover:enabled': {
      backgroundColor: theme.fill.hover,
      color: theme.text.primary,
    },
    '&:active:enabled': {
      backgroundColor: theme.fill.active,
    },
  },
  buttonLink: {
    padding: '0 4px',
    backgroundColor: 'transparent',
    color: theme.accent.text,
    fontWeight: 500,
    textDecoration: 'none',
    '&:hover:enabled, &:active:enabled': {
      color: theme.accent.hover,
      textDecoration: 'underline',
    },
  },
  buttonDanger: {
    backgroundColor: theme.status.dangerSubtle,
    color: theme.status.danger,
    boxShadow: `inset 0 0 0 1px ${theme.status.dangerBorder}`,
    '&:hover:enabled': {
      backgroundColor: 'rgba(229, 98, 91, 0.22)',
      color: theme.status.dangerHover,
    },
    '&:active:enabled': {
      backgroundColor: 'rgba(229, 98, 91, 0.3)',
    },
  },
  outlined: {
    backgroundColor: 'transparent',
    color: theme.text.primary,
    boxShadow: `inset 0 0 0 1px ${theme.border.strong}`,
    '&:hover:enabled': {
      backgroundColor: theme.fill.hover,
    },
    '&:active:enabled': {
      backgroundColor: theme.fill.active,
    },
  },
  content: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: (({ isLoading } : ButtonProps) => isLoading ? 0 : 1) as any,
    transition: '200ms',
  },
  '@keyframes spin': {
    '100%': { transform: 'rotate(360deg)' },
  },
  loading: {
    ...theme.mixins.flexbox.containerCenter,
    position: 'absolute',
    left: 0,
    top: 0,
    ...theme.mixins.size('100%'),
    opacity: (({ isLoading } : ButtonProps) => isLoading ? 1 : 0) as any,
    pointerEvents: 'none',
    transition: 'opacity 200ms',
    '& svg': {
      fill: 'currentColor',
      animation: `spin 1.5s cubic-bezier(0.82, 0.26, 0.25, 0.68) infinite`,
      animationPlayState: (({ isLoading } : ButtonProps) => isLoading ? 'running' : 'paused') as any,
    },
  },
});
export class ButtonImpl extends React.Component<ButtonProps & InjectSheetProps, {}> {

  public static defaultProps: Partial<ButtonProps> = {
    btnSize: Size.NORMAL,
    btnStyle: Style.PRIMARY,
  };

  render() {
    const { classes, className: upperClassName, btnSize, btnStyle, isLoading: _, sheet: __, ...buttonProps } = this.props;

    const sizeClassNames = {
      [Size.XXXSMALL]: classes.buttonXXXSmall,
      [Size.XXSMALL]: classes.buttonXXSmall,
      [Size.XSMALL]: classes.buttonXSmall,
      [Size.SMALL]: classes.buttonSmall,
      [Size.NORMAL]: '',
      [Size.BIG]: classes.buttonBig,
    };

    const styleClassNames = {
      [Style.MAIN]: classes.buttonMain,
      [Style.PRIMARY]: classes.buttonPrimary,
      [Style.SECONDARY]: classes.buttonSecondary,
      [Style.TERTIARY]: classes.buttonTertiary,
      [Style.LINK]: classes.buttonLink,
      [Style.DANGER]: classes.buttonDanger,
      [Style.OUTLINED]: classes.outlined,
    };

    const className = classNames(
      classes.button,
      sizeClassNames[btnSize!],
      styleClassNames[btnStyle!],
      upperClassName
    );

    return (
      <button
        className={className}
        {...(buttonProps as any)}
      >
        <div className={classes.loading}>
          <Icon symbolId={IconSymbol.LOADING} size={16} color="currentColor" />
        </div>

        <span className={classes!.content}>{this.props.children}</span>
      </button>
    );
  }
}

// Helpers
const isRenderingIcon = (props: ButtonProps): boolean => {
  const childrenIsObject = typeof props.children === 'object';
  if (!childrenIsObject) return false;
  if (props.children === null) return false;
  const childrenHasProps = typeof (props.children as React.ReactElement<typeof props.children>).props !== 'undefined';
  if (!childrenHasProps) return false;
  return Object.keys((props.children as React.ReactElement<typeof props.children>).props!)
    .some((prop: string) => prop === 'symbolId');
};

// force outer typing
export const Button = injectSheet(styles)(ButtonImpl) as unknown as React.ComponentType<ButtonProps>;
