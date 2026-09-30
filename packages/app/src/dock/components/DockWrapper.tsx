import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { GradientType, ThemeTypes, withGradient } from '@getstation/theme';

import RailFilters from './RailFilters';

interface Classes {
  container: string,
}

interface Props {
  classes?: Classes,
  themeGradient: string,
  onClickDock: () => void,
}

const styles = (theme: ThemeTypes) => ({
  // The rail: sits on the window background, next to the web app card.
  container: {
    display: 'flex',
    flex: `0 0 ${theme.layout.railWidth}px`,
    flexDirection: 'column',
    position: 'relative',
    width: theme.layout.railWidth,
    zIndex: 4,
    padding: [4, 0, 14],
    boxSizing: 'border-box',
    backgroundImage: (props: Props) => props.themeGradient,
  },
});

@injectSheet(styles)
class DockWrapper extends React.PureComponent<Props, {}> {
  render() {
    const { classes, onClickDock, children } = this.props;

    return (
      <div onClick={onClickDock} className={classes!.container}>
        <RailFilters />
        {children}
      </div>
    );
  }
}

export default withGradient(GradientType.withOverlay)(DockWrapper);
