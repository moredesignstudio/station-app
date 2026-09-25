import { Switcher, Button, Size, Style, ThemeTypes as Theme } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { compose } from 'redux';
import { isDarwin } from '../../../utils/process';
import { withGetPromptDownloadStatus, withEnablePromptDownload } from './queries@local.gql.generated';

export interface Classes {
  container: string,
  settingName: string,
  button: string,
  label: string,
  downloadFolderSection: string,
  downloadFolderVal: string,
  settings: string,
  promptDownloadSection: string,
  settingsValue: string,
}

export type ClassesProps = {
  classes: Classes,
};

export interface QueryProps{
  promptDownloadEnabled: boolean,
}

export interface MutationProps{
  togglePromptDownload: (enabled: boolean) => void,
}

export type OwnProps = {
  onBrowseClick: () => void,
  onDownloadLocationClick: () => void,
  currentDownloadFolder?: string,
};

export type Props = ClassesProps & QueryProps & MutationProps & OwnProps;

const styles = (theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    maxWidth: 600,
    padding: [14, 0],
    borderTop: `1px solid ${theme.border.subtle}`,
  },
  settings: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
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
  downloadFolderSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'start',
    gap: 8,
    minWidth: 0,
  },
  downloadFolderVal: {
    ...theme.fontMixin(12),
    fontFamily: theme.font.mono,
    lineHeight: '18px',
    display: 'inline-block',
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    padding: [2, 6],
    borderRadius: theme.radius.sm,
    color: theme.text.secondary,
    backgroundColor: theme.fill.subtle,
    cursor: 'pointer',
    transition: `color ${theme.transition.fast}, background-color ${theme.transition.fast}`,
    '&:hover': {
      color: theme.text.primary,
      backgroundColor: theme.fill.hover,
    },
  },
  promptDownloadSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  settingsValue: {
    marginLeft: 'auto',
    flexShrink: 0,
  },
  button: {},
});

@injectSheet(styles)
class SettingsDownloadFolder extends React.PureComponent<Props> {

  render() {
    const { classes, onBrowseClick, currentDownloadFolder, onDownloadLocationClick, promptDownloadEnabled } = this.props;
    const onTogglePromptDownload = (event: React.ChangeEvent<HTMLInputElement>) => this.props.togglePromptDownload(event.target.checked);
    return (
      <section className={classes!.container} >
        <section className={classes!.settings}>
          <p className={classes!.settingName}>downloads</p>
          <section className={classes!.downloadFolderSection}>
            <label className={classes!.label}>Location:</label>
            <code
              title={`Reveal in ${isDarwin ? 'Finder' : 'Explorer'}`}
              className={classes!.downloadFolderVal}
              onClick={onDownloadLocationClick}
            >
              {currentDownloadFolder}
            </code>
            <aside className={classes!.settingsValue}>
              <Button
                onClick={onBrowseClick}
                className={classes!.button}
                btnSize={Size.XSMALL}
                btnStyle={Style.SECONDARY}
              >
                Change
              </Button>
            </aside>
          </section>
        </section>
        <section className={classes!.promptDownloadSection}>
          <label className={classes!.label}>Ask where to save each file before downloading</label>
          <aside className={classes!.settingsValue}>
            <Switcher checked={promptDownloadEnabled} onChange={onTogglePromptDownload} />
          </aside>
        </section>
      </section>
    );
  }
}

const connect = compose(
  withGetPromptDownloadStatus({
    props:({ data }) => ({
      promptDownloadEnabled: !!data && data.promptDownloadEnabled,
    }),
  }),
  withEnablePromptDownload({
    props:({ mutate }): MutationProps => ({
      togglePromptDownload: (enabled: boolean) => mutate && mutate({ variables: { enabled } }),
    }),
  }),
);

export default connect(SettingsDownloadFolder) as React.ComponentType<OwnProps>;
