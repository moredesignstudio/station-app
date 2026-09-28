import { ThemeTypes as Theme } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

export interface Classes {
  wrapper: string,
  version: string,
  title: string,
  thin: string,
}

export interface Props {
  classes?: Classes,
  isDownloadingUpdate: boolean,
  appName: string,
  appVersion: string,
  isCheckingUpdate: boolean,
  isUpdateAvailable: boolean,
  checkForUpdates: () => any,
  quitAndInstall: () => any,
  releaseName: string,
}

const styles = (theme: Theme) => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  title: {
    ...theme.titles.h2,
    marginBottom: 12,
  },
  thin: {
    marginLeft: 6,
    fontWeight: 400,
    color: theme.text.tertiary,
  },
  version: {
    ...theme.fontMixin(12, 500),
    fontFamily: theme.font.mono,
    lineHeight: '18px',
    marginBottom: 6,
    color: theme.text.secondary,
  },
});

@injectSheet(styles)
export default class AboutWindowVersions extends React.PureComponent<Props, {}> {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes!.wrapper}>
        <div>
          <div className={classes!.title}>
            {this.props.appName}
            <span className={classes!.thin}>version {this.props.appVersion}</span>
          </div>

          <p className={classes!.version}>
            Electron
            <span className={classes!.thin}>{process.versions.electron}</span>
          </p>
          <p className={classes!.version}>
            Chrome
            <span className={classes!.thin}>{process.versions.chrome}</span>
          </p>
          <p className={classes!.version}>
            Node
            <span className={classes!.thin}>{process.versions.node}</span>
          </p>
          <p className={classes!.version}>
            v8
            <span className={classes!.thin}>{process.versions.v8}</span>
          </p>
        </div>
      </div>
    );
  }
}
