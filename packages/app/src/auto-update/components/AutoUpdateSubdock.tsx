import { Button, Style, ThemeTypes as Theme } from '@getstation/theme';
import * as remote from '@electron/remote';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

const releaseNotesHTML = require('!!raw-loader!../../app/resources/release-notes.html').default;

export interface Classes {
  container: string,
  header: string,
  logo: string,
  title: string,
  description: string,
  body: string,
  content: string,
  newVersion: string,
}

export interface Props {
  classes?: Classes,
  updateAvailable: boolean,
  releaseName: string,
  onClickQuitAndInstall: () => any,
}

const styles = (theme: Theme) => ({
  container: {
    position: 'relative',
    color: theme.text.primary,
  },
  header: {
    padding: 20,
    borderBottom: `1px solid ${theme.border.subtle}`,
    backgroundColor: theme.surface.elevated,
  },
  logo: {
    width: 40,
  },
  title: {
    marginTop: 16,
    ...theme.titles.h2,
  },
  description: {
    marginTop: 4,
    ...theme.fontMixin(13),
    lineHeight: '18px',
    color: theme.text.secondary,
  },
  body: {
    padding: 20,
    '& button': {
      width: '100%',
      marginTop: 20,
    },
  },
  content: {
    '& h2': {
      margin: [16, 0, 8],
      ...theme.mixins.sectionLabel(),
    },
    '& ul': {
      marginBottom: 32,
    },
    '& li': {
      listStyleType: 'disc',
      marginLeft: 18,
      marginBottom: 6,
      ...theme.fontMixin(13),
      lineHeight: '18px',
      color: theme.text.secondary,
    },
  },
  newVersion: {
    ...theme.fontMixin(13, 600),
    lineHeight: '18px',
    textAlign: 'center',
    color: theme.status.success,
    '& p + p': {
      marginTop: 4,
      ...theme.fontMixin(12),
      color: theme.text.secondary,
    },
  },
});

@injectSheet(styles)
export default class AutoUpdateSubdock extends React.PureComponent<Props, {}> {
  render() {
    const { classes, updateAvailable, releaseName, onClickQuitAndInstall } = this.props;

    return (
      <div className={classes!.container}>
        <div className={classes!.header}>
          <img className={classes!.logo} src="static/illustrations/illustration--updates.svg" alt="" />
          <h1 className={classes!.title}>What's new on {remote.app.name}?</h1>
          <p className={classes!.description}>
            You're now on version {remote.app.getVersion()}
          </p>
        </div>

        <div className={classes!.body}>
          { updateAvailable ?
            <div className={classes!.newVersion}>
              <p>A new version is available 🎉</p>
              <p>({releaseName})</p>
              <Button
                btnStyle={Style.PRIMARY}
                onClick={onClickQuitAndInstall}
              >
                Quit to install the latest version
              </Button>
            </div>
            :
            <div className={classes!.content} dangerouslySetInnerHTML={{ __html: releaseNotesHTML }} />
          }
        </div>
      </div>
    );
  }
}
