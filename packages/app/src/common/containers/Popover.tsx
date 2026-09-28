import { GradientType, ThemeTypes as Theme, withGradient } from '@getstation/theme';
import * as classNames from 'classnames';
import * as React from 'react';
import injectSheet from 'react-jss';

export interface Classes {
  container: string,
}

export interface OwnProps {
  className?: string,
  onMouseEnter?: React.MouseEventHandler<any>,
  onMouseLeave?: React.MouseEventHandler<any>,
}

export interface StateToProps {
  classes?: Classes,
  themeGradient: string,
}

const styles = (theme: Theme) => ({
  container: {
    width: 250,
    boxSizing: 'border-box',
    padding: 8,
    borderRadius: theme.radius.lg,
    boxShadow: theme.shadow.panel,
    backgroundColor: theme.surface.elevated,
    color: theme.text.primary,
    ...theme.fontMixin(13),
    lineHeight: '18px',
  },
});

@injectSheet(styles)
class Popover extends React.PureComponent<StateToProps & OwnProps, {}> {
  render() {
    const { classes, children, className, onMouseEnter, onMouseLeave } = this.props;
    const rest = { onMouseEnter, onMouseLeave };

    return (
      <div className={classNames(classes!.container, className)} {...rest}>
        {children}
      </div>
    );
  }
}

export default withGradient(GradientType.withDarkOverlay)(Popover);
