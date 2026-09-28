import { ThemeTypes as Theme } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

export interface Classes {
  footer: string,
  link: string,
}

export interface Props {
  classes?: Classes,
}

const styles = (theme: Theme) => ({
  footer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    ...theme.fontMixin(12),
    color: theme.text.tertiary,
  },
  link: {
    marginLeft: 12,
    fontWeight: 500,
    color: theme.text.secondary,
    textDecoration: 'none',
    cursor: 'pointer',
    transition: `color ${theme.transition.fast}`,
    '&:hover': {
      color: theme.text.primary,
      textDecoration: 'underline',
    },
  },
});

@injectSheet(styles)
export default class AboutWindowFooter extends React.PureComponent<Props, {}> {
  render() {
    const { classes } = this.props;

    return (
      <footer className={classes!.footer}>
        <p>2019 - { new Date().getFullYear() }</p>
        <a
          className={classes!.link}
          href="https://medium.com/getstation/your-way-of-working-belongs-to-the-stone-age-9ff64782f40"
          target="_blank"
        >
          About more mail
        </a>
        <a className={classes!.link} href="https://github.com/getstation/desktop-app" target="_blank">
          Support
        </a>
      </footer>
    );
  }
}
