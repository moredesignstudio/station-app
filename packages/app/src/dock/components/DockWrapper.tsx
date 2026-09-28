import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { GradientType, ThemeTypes, withGradient } from '@getstation/theme';

interface Classes {
  container: string,
}

interface Props {
  classes?: Classes,
  themeGradient: string,
  onClickDock: () => void,
}

const styles = (theme: ThemeTypes) => ({
  container: {
    display: 'flex',
    flex: '0 0 50px',
    flexDirection: 'column',
    position: 'relative',
    width: 50,
    zIndex: 4,
    backgroundImage: (props: Props) => props.themeGradient,
    borderRight: `1px solid ${theme.border.subtle}`,
  },
});

@injectSheet(styles)
class DockWrapper extends React.PureComponent<Props, {}> {
  render() {
    const { classes, onClickDock, children } = this.props;

    return (
      <div onClick={onClickDock} className={classes!.container}>
        {children}
      </div>
    );
  }
}

export default withGradient(GradientType.withOverlay)(DockWrapper);
