import { Button, Size, Style, ThemeTypes as Theme } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

export interface Classes {
  container: string,
  item: string,
  title: string,
  settingName: string,
  checkbox: string,
  label: string,
  button: string,
}

export interface Props {
  classes?: Classes,
  onClickOpenProcessManager: () => void,
}

const styles = (theme: Theme) => ({
  container: {
    maxWidth: 600,
    padding: [14, 0],
    borderTop: `1px solid ${theme.border.subtle}`,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  settingName: {
    ...theme.mixins.sectionLabel(),
    marginBottom: 8,
  },
  label: {
    ...theme.fontMixin(13),
    lineHeight: '1.4em',
    color: theme.text.primary,
  },
  button: {
    flexShrink: 0,
  },
});

@injectSheet(styles)
export default class SettingsDeveloperTools extends React.PureComponent<Props, {}> {
  render() {
    const { classes, onClickOpenProcessManager } = this.props;

    return (
      <div className={classes!.container}>
        <p className={classes!.settingName}>developer tools</p>
        <div className={classes!.item}>
          <Button
            onClick={() => onClickOpenProcessManager()}
            className={classes!.button}
            btnSize={Size.XSMALL}
            btnStyle={Style.SECONDARY}
          >
            Open Process Manager
          </Button>
        </div>
      </div>
    );
  }
}
