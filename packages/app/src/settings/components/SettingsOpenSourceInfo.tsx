import { Button, Size, Style, ThemeTypes as Theme } from '@getstation/theme';
import * as remote from '@electron/remote';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

export interface Classes {
  container: string,
  item: string,
  title: string,
  settingName: string,
  label: string,
  button: string,
}

export interface Props {
  classes?: Classes,
}

const styles = (theme: Theme) => ({
  container: {
    maxWidth: 600,
    padding: [14, 0],
    borderTop: `1px solid ${theme.border.subtle}`,
  },
  item: {
  },
  settingName: {
    ...theme.mixins.sectionLabel(),
    marginBottom: 8,
  },
  label: {
    ...theme.fontMixin(13),
    display: 'block',
    lineHeight: '1.5em',
    color: theme.text.secondary,
  },
  button: {
    marginTop: 12,
  },
});

@injectSheet(styles)
export default class SettingsOpenSourceInfo extends React.PureComponent<Props, {}> {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes!.container}>
        <div className={classes!.item}>
          <p className={classes!.settingName}>open source info</p>
          <label className={classes!.label}>
            This software is maintained by the open source community. If you’re a developer and want to contribute, check our Github.
          </label>
          <p>
            <Button
              onClick={() => remote.shell.openExternal('https://github.com/getstation/desktop-app')}
              className={classes!.button}
              btnSize={Size.XSMALL}
              btnStyle={Style.SECONDARY}
            >
              Open Github
            </Button>
          </p>
        </div>
      </div>
    );
  }
}
