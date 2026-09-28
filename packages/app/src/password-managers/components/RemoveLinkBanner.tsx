import { Button, Icon, IconSymbol, Size, Style, ThemeTypes as Theme } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { PasswordManager } from '../types';

export interface Classes {
  container: string,
  headline: string,
  button: string,
  close: string,
}

export interface Props {
  classes?: Classes,
  applicationName: string,
  passwordManager: PasswordManager,
  onRemoveLink: () => void,
  onClose: () => void,
}

const styles = (theme: Theme) => ({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    maxWidth: 560,
    margin: '0 auto',
    boxSizing: 'border-box',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 40px 12px 16px',
    ...theme.fontMixin(13),
    lineHeight: '18px',
    color: theme.text.secondary,
    backgroundColor: theme.surface.elevated,
    border: `1px solid ${theme.border.subtle}`,
    borderRadius: theme.radius.lg,
    boxShadow: theme.shadow.panel,
    textAlign: 'center',
    zIndex: 3,
  },
  button: {
    flex: '0 0 auto',
    marginLeft: 12,
  },
  close: {
    position: 'absolute',
    top: 8,
    right: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: theme.radius.sm,
    color: theme.text.tertiary,
    cursor: 'pointer',
    transition: `background-color ${theme.transition.fast}, color ${theme.transition.fast}`,
    '&:hover': {
      backgroundColor: theme.fill.hover,
      color: theme.text.primary,
    },
  },
});

@injectSheet(styles)
export default class RemoveLinkBanner extends React.PureComponent<Props, {}> {
  render() {
    const {
      classes, applicationName, passwordManager,
      onRemoveLink, onClose,
    } = this.props;

    return (
      <div className={classes!.container}>
        Do you want to unlink {applicationName} from {passwordManager.providerName}?

        <Button className={classes!.button} onClick={onRemoveLink} btnSize={Size.SMALL} btnStyle={Style.DANGER}>
          Unlink from {passwordManager.providerName}
        </Button>

        <span className={classes!.close} onClick={onClose}>
          <Icon symbolId={IconSymbol.CROSS} size={18} color="currentColor" />
        </span>
      </div>
    );
  }
}
