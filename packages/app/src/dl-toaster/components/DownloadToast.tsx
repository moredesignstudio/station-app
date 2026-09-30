import { ButtonIcon, IconSymbol, Size, Style, ThemeTypes as Theme } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { compose } from 'redux';
import { oc } from 'ts-optchain';
import { withGetApplication } from '../queries@local.gql.generated';
import AppIcon from '../../dock/components/AppIcon';
import { number } from '@storybook/addon-knobs';

export interface Classes {
  container: string,
  progressTrack: string,
  progress: string,
  wrapper: string,
  appIcon: string,
  content: string,
  status: string,
  filename: string,
  successWrapper: string,
  filenameSuccess: string,
  close: string,
}

export interface InjectedProps {
  loading: boolean,
  interpretedIconUrl: string,
  themeColor: string,
}

interface OnFinished {
  doTheJob: () => void,
  delay: number,
}

export interface Props {
  classes?: Classes,
  applicationId: string,
  filename: string,
  // waiting for https://github.com/electron/electron/pull/7851
  // fileIconURL:  str,
  completionPercent: number,
  onClickOpen: () => any,
  onClickHide: () => any,
  onFinished?: OnFinished,
  themeColor: string,
  failed?: boolean,
}

export type FullProps = Props & InjectedProps;

const noop = () => {};

const isFinished = (props: Props) => Boolean(props.failed) || props.completionPercent === 100;

const styles = (theme: Theme) => ({
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: 320,
    marginTop: 8,
    overflow: 'hidden',
    backgroundColor: theme.surface.elevated,
    border: `1px solid ${theme.border.subtle}`,
    borderRadius: theme.radius.lg,
    boxShadow: theme.shadow.panel,
    color: theme.text.primary,
    fontFamily: theme.font.sans,
  },
  progressTrack: {
    display: (props: Props) => isFinished(props) ? 'none' : 'block',
    height: 3,
    margin: [-2, 12, 12, 12],
    overflow: 'hidden',
    borderRadius: theme.radius.pill,
    backgroundColor: theme.fill.active,
  },
  progress: {
    height: '100%',
    width: (props: Props) => `${props.completionPercent}%`,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.accent.default,
    transition: `width ${theme.transition.normal}`,
  },
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
    padding: [12, 10, 12, 12],
    fontSize: 12,
    lineHeight: '16px',
  },
  content: {
    ...theme.mixins.ellipsis(2),
    flexGrow: 1,
    minWidth: 0,
  },
  status: {
    ...theme.fontMixin(12),
    color: (props: Props) => props.failed ? theme.status.danger : theme.text.secondary,
  },
  filename: {
    ...theme.fontMixin(13, 500),
    color: theme.text.primary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  successWrapper: {
    ...theme.mixins.ellipsis(2),
    cursor: 'pointer',
  },
  filenameSuccess: {
    ...theme.fontMixin(13, 500),
    color: theme.text.primary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  close: {
    flexShrink: 0,
  },
});

@injectSheet(styles)
class DownloadToast extends React.PureComponent<FullProps> {

  handleClickOpen() {
    const { onClickOpen, onClickHide } = this.props;
    onClickOpen();
    onClickHide();
  }

  render() {
    const { classes, completionPercent, filename, onClickHide, interpretedIconUrl, failed, loading, themeColor, onFinished } = this.props;
    const completed = completionPercent === 100;
    const finished = completed || failed;

    if (loading) return null;
    if (completed && onFinished && typeof onFinished === 'function') {
      setTimeout(onFinished.doTheJob, onFinished.delay);
    }

    return (
      <div className={classes!.container}>
        <div className={classes!.wrapper}>
          { interpretedIconUrl &&
            <AppIcon
              imgUrl={interpretedIconUrl}
              themeColor={themeColor}
            />
          }
          <div className={classes!.content} onClick={finished ? this.handleClickOpen.bind(this) : noop}>
            {
              !finished ? (
                <div>
                  <div className={classes!.status}>Downloading</div>
                  <div className={classes!.filename}>{filename}</div>
                </div>
              ) : (
                <div className={classes!.successWrapper}>
                  <div className={classes!.status}>{failed ? 'Failed download' : 'Successful download'}!</div>
                  <div className={classes!.filenameSuccess}>{filename}</div>
                </div>
              )
            }
          </div>

          <ButtonIcon
            className={classes!.close}
            symbolId={IconSymbol.CROSS}
            btnStyle={Style.TERTIARY}
            btnSize={Size.XSMALL}
            onClick={onClickHide}
          />
        </div>

        <div className={classes!.progressTrack}>
          <div className={classes!.progress} />
        </div>
      </div>
    );
  }
}

const connector = compose(
  withGetApplication({
    options: (props: Props) => ({ variables: { applicationId: props.applicationId } }),
    props: ({ data }) => ({
      loading: !data || data.loading,
      interpretedIconUrl: oc(data).application.manifestData.interpretedIconURL(),
      themeColor: oc(data).application.manifestData.theme_color(),
    }),
  }),

);

export default connector(DownloadToast);
