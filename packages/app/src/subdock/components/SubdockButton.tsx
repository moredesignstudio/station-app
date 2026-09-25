import { Icon, IconSymbol, ThemeTypes as Theme, Tooltip } from '@getstation/theme';
import * as React from 'react';
import * as classNames from 'classnames';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

export type Classes = {
  iconWrapper: string,
  icon: string,
};

export type Props = {
  className?: string,
  classes?: Classes,
  symbolId: IconSymbol,
  onClick: (e: React.MouseEvent<Element>) => void,
  size?: number,
  tooltip?: string,
  tooltipOffset?: string,
  tooltipPlacement?: string,
};

const styles = (theme: Theme) => ({
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '0 0 auto',
    height: 24,
    width: 24,
    marginLeft: 4,
    borderRadius: theme.radius.sm,
    color: theme.text.tertiary,
    cursor: 'default',
    transition: `background-color ${theme.transition.fast}, color ${theme.transition.fast}`,
    '&:hover': {
      backgroundColor: theme.fill.hover,
      color: theme.text.primary,
    },
  },
  icon: {
    display: 'flex',
  },
});

@injectSheet(styles)
class SubdockButton extends React.PureComponent<Props> {
  renderIcon() {
    const { classes, size, onClick, symbolId, className: upperClassName } = this.props;
    return (
      <span className={classNames(classes!.iconWrapper, upperClassName)}>
        <Icon
          className={classes!.icon}
          size={size}
          color="currentColor"
          symbolId={symbolId}
          onClick={onClick}
        />
      </span>
    );
  }

  renderIconWithTooltip() {
    const { tooltip, tooltipOffset, tooltipPlacement } = this.props;
    return (
      <Tooltip
        tooltip={tooltip}
        offset={tooltipOffset || '0, 4'}
        placement={tooltipPlacement || 'top'}
        alternate={true}
      >
        {this.renderIcon()}
      </Tooltip>
    );
  }

  render() {
    const { tooltip } = this.props;
    if (tooltip) {
      return this.renderIconWithTooltip();
    }
    return this.renderIcon();
  }
}

export default SubdockButton;
