import { ThemeTypes } from '@getstation/theme';
import * as classNames from 'classnames';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

interface Classes {
  container: string,
  allHover: string,
  dot: string,
  close: string,
  minimize: string,
  expand: string,
}

interface Props {
  classes?: Classes,
  focused: boolean,
  handleClose: () => any,
  handleMinimize: () => any,
  handleExpand: () => any,
  /**
   * Kept for API compatibility: the dark theme has a single
   * idle style, so `dark` renders the same as the default.
   */
  dark?: boolean,
  allHover?: boolean,
}

@injectSheet((theme: ThemeTypes) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    flex: '0 0 auto',
    padding: 6,
    paddingBottom: 4,
    width: 50,
    '&:hover $close, &$allHover $close': {
      backgroundColor: theme.traffic.close,
    },
    '&:hover $minimize, &$allHover $minimize': {
      backgroundColor: theme.traffic.minimize,
    },
    '&:hover $expand, &$allHover $expand': {
      backgroundColor: theme.traffic.zoom,
    },
  },
  allHover: {},
  dot: {
    ...theme.avatarMixin('10px'),
    flex: '0 0 auto',
    backgroundColor: ({ focused }: Props) => focused ? theme.text.disabled : theme.traffic.idle,
    transition: `background-color ${theme.transition.fast}`,
  },
  close: {},
  minimize: {},
  expand: {},
}))
export default class TrafficLights extends React.PureComponent<Props, {}> {
  render() {
    const { classes, allHover, handleClose, handleMinimize, handleExpand } = this.props;

    return (
      <div className={classNames(classes!.container, { [classes!.allHover]: allHover })}>
        <div className={classNames(classes!.dot, classes!.close)} onClick={handleClose} />
        <div className={classNames(classes!.dot, classes!.minimize)} onClick={handleMinimize} />
        <div className={classNames(classes!.dot, classes!.expand)} onClick={handleExpand} />
      </div>
    );
  }
}
