import { Button, Style, ThemeTypes as Theme } from '@getstation/theme';
// @ts-ignore: no declaration file
import * as networkErrors from 'chromium-net-errors';
import Maybe from 'graphql/tsutils/Maybe';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

export interface Classes {
  container: string,
  title: string,
  message: string,
  code: string,
  url: string,
  button: string,
}

export interface Props {
  classes?: Classes,
  crashed: boolean,
  errorCode: any,
  errorDescription: any,
  webView: any,
  applicationName: Maybe<string>,
  tabUrl: string,
}

const styles = (theme: Theme) => ({
  container: {
    maxWidth: 420,
    color: theme.text.primary,
    textAlign: 'center',
  },
  title: {
    ...theme.fontMixin(16, 600),
    letterSpacing: '-0.01em',
    lineHeight: '24px',
    color: theme.text.primary,
  },
  message: {
    ...theme.fontMixin(13),
    lineHeight: '20px',
    marginTop: 8,
    color: theme.text.secondary,
  },
  code: {
    display: 'inline-block',
    marginLeft: 6,
    padding: [1, 6],
    borderRadius: theme.radius.sm,
    backgroundColor: theme.fill.subtle,
    boxShadow: `inset 0 0 0 1px ${theme.border.subtle}`,
    fontFamily: theme.font.mono,
    fontSize: 11,
    lineHeight: '16px',
    color: theme.text.tertiary,
  },
  url: {
    ...theme.fontMixin(12),
    lineHeight: '18px',
    marginTop: 6,
    color: theme.text.tertiary,
    wordBreak: 'break-all',
  },
  button: {
    width: '100%',
    marginTop: 20,
  },
});

@injectSheet(styles)
export default class ApplicationLoadingContainer extends React.PureComponent<Props, {}> {
  hasError = () => {
    if (this.props.crashed) return true;
    return typeof this.props.errorCode === 'number';
  }

  handleReloadClick() {
    if (this.props.webView && this.props.webView.isReady()) this.props.webView.reload();
  }

  renderErrorMessage = () => {
    const { classes, crashed, errorCode, errorDescription, tabUrl } = this.props;
    const errorObject = this.hasError() ? networkErrors.createByCode(errorCode) : null;

    if (!crashed && errorObject) {
      return (
        <>
          <div className={classes!.message}>
            {errorObject.message}
            <span className={classes!.code}>{errorCode}:{errorDescription}</span>
          </div>
          <div className={classes!.url}>URL: {tabUrl}</div>
        </>
      );
    }
    return null;
  }

  render() {
    const { classes, applicationName } = this.props;

    return (
      <div className={classes!.container}>
        { this.hasError() &&
          <div>
            <div className={classes!.title}>We can't load {applicationName}...</div>
            {this.renderErrorMessage()}
            <Button
              btnStyle={Style.PRIMARY}
              className={classes!.button}
              onClick={() => this.handleReloadClick()}
            >
              Try reloading
            </Button>
          </div>
        }
      </div>
    );
  }
}
