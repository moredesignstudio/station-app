import * as React from 'react';
import injectSheet, { WithSheet } from 'react-jss';
import { createStyles, ThemeTypes } from '../../types';

interface IProps {
  onClick?: () => void,
  children?: any,
}

type Props = IProps & WithSheet<typeof styles>;

const styles = (theme: ThemeTypes) => createStyles({
  container: {
    ...theme.mixins.flexbox.containerCenter,
    position: 'fixed',
    bottom: 20,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 100,
    border: 0,
    outline: 'none',
    backgroundColor: theme.accent.default,
    color: theme.text.onAccent,
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.45)',
    cursor: 'pointer',
    transition: `background-color ${theme.transition.fast}, transform ${theme.transition.fast}`,
    '&:hover': {
      backgroundColor: theme.accent.hover,
    },
    '&:active': {
      transform: 'scale(0.97)',
      backgroundColor: theme.accent.active,
    },
  },
});

export class FloatingActionButtonImpl extends React.PureComponent<Props, {}> {
  render() {
    const { classes, onClick, children } = this.props;

    return (
      <button className={classes.container} onClick={onClick}>
        {children}
      </button>
    );
  }
}

export const FloatingActionButton = injectSheet(styles)(FloatingActionButtonImpl);
