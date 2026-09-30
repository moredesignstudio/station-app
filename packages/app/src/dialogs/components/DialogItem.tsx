import { Button, Icon, ThemeTypes as Theme } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore : no declaration file
import injectSheet from 'react-jss';
import { compose } from 'react-apollo';
import * as shortid from 'shortid';
import { oc } from 'ts-optchain';
import { getApplicationIconURL, getApplicationManifestURL, getApplicationId } from '../../applications/get';
import { withGetApplication } from '../queries@local.gql.generated';
import { APPLICATIONS_WITH_DIALOG_HINT } from '../../applications/manifest-provider/const';
import { getDialogActions, getDialogApplication, getDialogMessage, getDialogTitle } from '../get';
import { DialogItemAction, ExtendedDialogItem, ExtendedDialogItemImmutable } from '../types';

export interface Classes {
  container: string,
  icon: string,
  content: string,
  title: string,
  dialogMessage: string,
  hint: string,
  hintLink: string,
  buttonWrapper: string,
  buttonContainer: string,
  button: string,
  buttonText: string,
}

export interface OwnProps {
  applicationName: string,
}

export interface StateProps {
  classes?: Classes,
  dialog: ExtendedDialogItemImmutable,
  onClickDialog: (dialog: ExtendedDialogItem, buttonClicked: DialogItemAction) => void,
  themeColor: string,
}

export type Props = OwnProps & StateProps;

const annoyedLink = 'https://github.com/getstation/desktop-app/wiki/FAQ-%7C-%F0%9F%93%A3-Notifications-&-badges#i-find-google-calendar-reminder-popups-annoying';

const actionCTAOnBottom = (props: Props) =>
  props.dialog.get('actions').some((action) => Boolean(action!.get('text')));

const styles = (theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: (props: Props) => actionCTAOnBottom(props) ? 'wrap' : 'inherited',
    position: 'absolute',
    // centered at the bottom of the web app card
    bottom: 18,
    left: `calc(50% + ${(theme.layout.railWidth - theme.layout.frameGap) / 2}px)`,
    transform: 'translateX(-50%)',
    width: 400,
    margin: 0,
    padding: 20,
    boxSizing: 'border-box',
    fontFamily: theme.font.sans,
    fontSize: 13,
    lineHeight: '18px',
    color: theme.text.primary,
    backgroundColor: theme.surface.elevated,
    borderRadius: theme.radius.xl,
    boxShadow: theme.shadow.modal,
    animation: '500ms',
  },
  icon: {
    ...theme.mixins.size(32),
    flexShrink: 0,
    marginTop: 2,
    backgroundImage: (props: Props) => `url(${getApplicationIconURL(getDialogApplication(props.dialog))})`,
    backgroundSize: 'cover',
    borderRadius: 100,
    boxShadow: `0 0 0 1px ${theme.border.subtle}`,
  },
  content: {
    flexGrow: 1,
    padding: '0 12px',
    wordWrap: 'break-word',
    width: (props: Props) => actionCTAOnBottom(props) ? 'calc(100% - 32px)' : 'inherited',
    '& h4': {
      margin: [8, 0, 0],
      ...theme.fontMixin(13, 500),
      lineHeight: '18px',
      color: theme.text.primary,
    },
  },
  title: {
    ...theme.fontMixin(14, 600),
    letterSpacing: '-0.01em',
    lineHeight: '20px',
    marginBottom: 2,
    color: theme.text.primary,
  },
  dialogMessage: {
    ...theme.mixins.ellipsis(4),
    fontSize: 13,
    lineHeight: '19px',
    marginTop: 6,
    color: theme.text.secondary,
  },
  hint: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: '16px',
    color: theme.text.tertiary,
  },
  hintLink: {
    marginLeft: 4,
    color: theme.accent.text,
    textDecoration: 'underline',
    cursor: 'pointer',
    '&:hover': {
      color: theme.accent.hover,
    },
  },
  buttonWrapper: {
    display: 'flex',
    flexDirection: (props: Props) => actionCTAOnBottom(props) ? 'row' : 'column',
    justifyContent: (props: Props) => actionCTAOnBottom(props) ? 'space-evenly' : 'center',
    margin: (props: Props) => actionCTAOnBottom(props) ? '20px auto 0 10%' : 'inherited',
    width: (props: Props) => actionCTAOnBottom(props) ? '90%' : 'inherited',
  },
  buttonContainer: {
    marginBottom: 6,
    '&:last-child': {
      marginBottom: 0,
    },
  },
  buttonText: {
    margin: 0,
  },
});

@injectSheet(styles)
class DialogItemImpl extends React.PureComponent<Props, {}> {
  render() {
    const { classes, dialog, onClickDialog, applicationName } = this.props;

    return (
      <div className={classes!.container}>
        <div className={classes!.icon} />

        <div className={classes!.content}>
          <div className={classes!.title}>
            {applicationName}
          </div>

          <h4>{getDialogTitle(dialog)}</h4>
          <p className={classes!.dialogMessage}>{getDialogMessage(dialog)}</p>

          {
            APPLICATIONS_WITH_DIALOG_HINT.includes(getApplicationManifestURL(getDialogApplication(dialog))) &&
            <div className={classes!.hint}>
              Annoyed by this message?
              <a className={classes!.hintLink} href={annoyedLink} target="_blank">
                Turn it into notifications.
              </a>
            </div>
          }
        </div>

        <div className={classes!.buttonWrapper}>
          {
            getDialogActions(dialog).map((action) => {
              const { icon, text, style } = action;

              const onClick = (_: any) => onClickDialog(dialog.toJS(), action);

              return <div
                key={`dialog-item-${shortid.generate()}`}
                onClick={onClick}
                className={classes!.buttonContainer}
              >
                {text ? (
                  <Button
                    btnStyle={style}
                  >
                    {text}
                  </Button>
                ) : (
                    <Button
                      btnStyle={style}
                    >
                      <Icon symbolId={icon!} size={20} />
                    </Button>
                  )}

              </div>;
            })
          }
        </div>
      </div>
    );
  }
}

export default compose(
  withGetApplication({
    options: (props: Props) => ({
      variables: {
        applicationId: getApplicationId(getDialogApplication(props.dialog)),
      },
    }),
    props: ({ data }) => ({
      applicationName: oc(data).application.name(),
    }),
  }),
)(DialogItemImpl);
