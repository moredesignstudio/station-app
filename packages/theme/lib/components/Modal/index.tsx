import classNames from 'classnames';
import * as React from 'react';
import injectSheet, { WithSheet } from 'react-jss';
import { createStyles, ThemeTypes } from '../../types';
import { Button, Style } from '../Button';
import { Icon, IconSymbol } from '../Icon';
import { ModalWrapper } from '../ModalWrapper';

interface OwnProps {
  classNameModalBody?: string,
  classNameModalContent?: string,
  title?: string,
  description?: string,
  onCancel?: () => void,
  cancelContent?: string,
  onContinue?: () => void,
  onClickOutside?: () => void,
  continueContent?: string,
  continueDanger?: boolean,
  applicationIcon?: string,
  themeColor?: string,
  isLoading?: boolean,
  /**
   * Will display a loading on the confirm button.
   */
  confirmButtonIsLoading?: boolean,
  disableWrapperClick?: boolean,
}

const ICON_SIZE = 72;

const styles = (theme: ThemeTypes) => createStyles({
  container: {
    position: 'relative',
    width: 420,
    maxWidth: 'calc(100vw - 80px)',
    backgroundColor: theme.surface.elevated,
    borderRadius: theme.radius.xl,
    boxShadow: theme.shadow.modal,
    color: theme.text.primary,
    fontFamily: theme.font.sans,
  },
  header: {
    width: '100%',
    padding: (({ applicationIcon, title, description }: OwnProps) => {
      if (applicationIcon) {
        return `${ICON_SIZE / 2 + 16}px 24px 0`;
      }
      if (title || description) {
        return '24px 24px 0';
      }
      return '0px';
    }) as any,
    textAlign: 'center',
    boxSizing: 'border-box',
  },
  applicationIcon: {
    display: (({ applicationIcon }: OwnProps) => applicationIcon ? 'initial' : 'none') as any,
    position: 'absolute',
    top: -(ICON_SIZE / 2),
    left: `calc(50% - ${ICON_SIZE / 2}px)`,
    width: ICON_SIZE,
    height: ICON_SIZE,
    backgroundImage: (({ applicationIcon }: OwnProps) => `url('${applicationIcon}')`) as any,
    backgroundColor: (({ themeColor }: OwnProps) => themeColor || theme.surface.panel) as any,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100%',
    backgroundPosition: 'center',
    borderRadius: '100%',
    border: `3px solid ${theme.surface.elevated}`,
    boxShadow: theme.shadow.panel,
  },
  title: {
    ...theme.fontMixin(16, 600),
    letterSpacing: '-0.01em',
    color: theme.text.primary,
  },
  description: {
    ...theme.fontMixin(13),
    lineHeight: '18px',
    marginTop: 4,
    color: theme.text.secondary,
  },
  body: {
    color: theme.text.primary,
    position: 'relative',
    padding: '16px 8px',
  },
  '@keyframes spin': {
    '100%': { transform: 'rotate(360deg)' },
  },
  content: {
    height: '100%',
    width: '100%',
    maxHeight: 400,
    overflow: 'auto',
    paddingLeft: 16,
    paddingRight: 16,
    boxSizing: 'border-box',
    ...theme.fontMixin(13),
    lineHeight: '20px',
    ...theme.mixins.scrollbar(),
  },
  loading: {
    ...theme.mixins.flexbox.containerCenter,
    ...theme.mixins.position('absolute', 0, 0),
    ...theme.mixins.size('100%'),
    backgroundColor: theme.surface.elevated,
    '& svg': {
      animation: `spin 1s linear infinite`,
    },
    zIndex: 1,
    borderRadius: theme.radius.xl,
  },
  footer: {
    whiteSpace: 'nowrap',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 8,
    padding: '8px 24px 24px',
    '& button': {
      flexBasis: ({ onContinue }: OwnProps) => onContinue ? '50%' : '100%',
    } as any,
  },
});

type Props = OwnProps & WithSheet<typeof styles>;

class ModalImpl extends React.PureComponent<Props, {}> {

  onClickOutside = () => {
    // click is disabled, stop here
    if (this.props.disableWrapperClick) return;

    const { onClickOutside, onCancel } = this.props;
    if (onClickOutside) {
      onClickOutside();
      return;
    }
    onCancel && onCancel();
  }

  render() {
    const {
      classes, title, description, cancelContent, continueContent, children,
      onCancel, onContinue,
      isLoading, continueDanger, confirmButtonIsLoading,
      classNameModalContent, classNameModalBody,
    } = this.props;

    return (
      <ModalWrapper onClickOutside={this.onClickOutside}>
        <div className={classes.container}>
          <div className={classes.header}>
            <div className={classes.applicationIcon} />
            {title && <div className={classes.title}>{title}</div>}
            {description && <div className={classes.description}>{description}</div>}
          </div>

          <div className={classNames(classes.body, classNameModalBody)}>
            { isLoading &&
            <div className={classes.loading}>
              <Icon symbolId={IconSymbol.LOADING} size={25} />
            </div>
            }

            <div className={classNames(classes.content, classNameModalContent)}>
              {children}
            </div>
          </div>

          { (onCancel || onContinue) &&
          <div className={classes.footer}>
            { onCancel &&
            <Button onClick={onCancel} btnStyle={Style.SECONDARY}>
              {cancelContent || `Cancel`}
            </Button>
            }

            { onContinue &&
            <Button
              onClick={onContinue}
              btnStyle={continueDanger ? Style.DANGER : Style.PRIMARY}
              isLoading={confirmButtonIsLoading}
            >
              {continueContent || `OK`}
            </Button>
            }
          </div>
          }
        </div>
      </ModalWrapper>
    );
  }
}

export const Modal = injectSheet(styles)(ModalImpl);
