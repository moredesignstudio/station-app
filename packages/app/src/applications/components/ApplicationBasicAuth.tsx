import { Button, Input, InputType, Style, ThemeTypes as Theme } from '@getstation/theme';
import Maybe from 'graphql/tsutils/Maybe';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

export interface Classes {
  container: string,
  title: string,
  host: string,
  realm: string,
  form: string,
  input: string,
  button: string,
}

export interface Props {
  classes?: Classes,
  applicationIcon: Maybe<string>,
  performBasicAuth: (username: string, password: string) => any,
  authInfoHost: string,
  authInfoRealm: string,
}

export interface State {
  username: string,
  password: string,
}

const styles = (theme: Theme) => ({
  container: {
    width: 360,
    padding: 24,
    boxSizing: 'border-box',
    backgroundColor: theme.surface.panel,
    border: `1px solid ${theme.border.subtle}`,
    borderRadius: theme.radius.lg,
    color: theme.text.primary,
    textAlign: 'center',
  },
  title: {
    ...theme.fontMixin(16, 600),
    letterSpacing: '-0.01em',
    lineHeight: '24px',
    marginBottom: 4,
    color: theme.text.primary,
  },
  host: {
    ...theme.fontMixin(12),
    lineHeight: '18px',
    color: theme.text.tertiary,
    wordBreak: 'break-all',
  },
  realm: {
    ...theme.fontMixin(13),
    lineHeight: '20px',
    margin: [16, 0, 20],
    color: theme.text.secondary,
  },
  form: {
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  input: {
    width: '100%',
    maxWidth: 'none',
    marginBottom: 10,
    textAlign: 'left',
  },
  button: {
    width: '100%',
    marginTop: 10,
  },
});

@injectSheet(styles)
export default class BasicAuth extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      username: '',
      password: '',
    };
  }

  handleBasicAuth(event: Event) {
    event.preventDefault();
    const { username, password } = this.state;
    this.props.performBasicAuth(username, password);
    this.setState({ username: '', password: '' });
  }

  handleUsernameChange(event: Event) {
    this.setState({ username: event.target.value });
  }

  handlePasswordChange(event: Event) {
    this.setState({ password: event.target.value });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes!.container}>
        <div className={classes!.title}>Authentication</div>

        <div className={classes!.host}>
          {this.props.authInfoHost}
        </div>

        <div className={classes!.realm}>
          {this.props.authInfoRealm}
        </div>

        <form className={classes!.form} onSubmit={e => this.handleBasicAuth(e)}>
          <Input
            className={classes!.input}
            forceHeader={false}
            type={InputType.TEXT}
            name="login"
            placeholder="Login"
            value={this.state.username}
            onChange={(event: any) => this.handleUsernameChange(event)}
            autoFocus={true}
          />

          <Input
            className={classes!.input}
            forceHeader={false}
            type={InputType.PASSWORD}
            name="password"
            placeholder="Password"
            value={this.state.password}
            onChange={(event: any) => this.handlePasswordChange(event)}
          />

          <Button
            className={classes!.button}
            btnStyle={Style.PRIMARY}
            type="submit"
          >
            Connect
          </Button>
        </form>
      </div>
    );
  }
}
