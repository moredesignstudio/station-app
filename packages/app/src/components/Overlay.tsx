import { ButtonIcon, GradientType, IconSymbol, Size, Style, ThemeTypes as Theme, withGradient } from '@getstation/theme';
import * as classNames from 'classnames';
import * as React from 'react';
// @ts-ignore: no declaration file
import ClickOutside from 'react-click-outside';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
// @ts-ignore: no declaration file
import KeyHandler, { KEYDOWN } from 'react-key-handler';

const noop = () => {};

export interface Classes {
  container: string,
  panels: string,
  kbd: string,
  label: string,
  content: string,
  category: string,
  li: string,
  head: string,
  subtitle: string,
  titleText: string,
  closeButton: string,
}

type DefaultProps = {
  withClickOutside: boolean,
};

type HocProps = {
  themeGradient: string,
  classes?: Classes,
};

export type Props = HocProps & DefaultProps & {
  title?: string,
  onClose: (via: string) => void,
  children: React.ReactNode,
  contentClassName?: string,
  headClassName?: string,
};

const styles = (theme: Theme) => ({
  // Fills the web app card: next to the rail, under the top bar.
  container: {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    top: theme.layout.topBarHeight,
    bottom: theme.layout.frameGap,
    left: theme.layout.railWidth,
    right: theme.layout.frameGap,
    overflow: 'auto',
    zIndex: 100,
    backgroundColor: theme.surface.base,
    color: theme.text.primary,
    borderRadius: theme.layout.frameRadius,
    boxShadow: `0 0 0 1px ${theme.border.default}`,
    padding: '64px 48px 48px',
    animation: `overlay-rise ${theme.motion.slow} ${theme.motion.easeOut} both`,
    ...theme.mixins.scrollbar(),
  },
  '@keyframes overlay-rise': {
    from: { opacity: 0, transform: 'translateY(8px)' },
  },
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
    '&>div': {
      display: 'inherit',
      width: '100%',
    },
  },
  head: {
    paddingBottom: 32,
    maxWidth: 960,
    width: '100%',
    display: 'flex',
    alignSelf: 'center',
  },
  titleText: {
    ...theme.titles.h1,
    flexGrow: 1,
    margin: 0,
  },
  closeButton: {
    position: 'absolute !important',
    top: 20,
    left: 20,
  },
});

@injectSheet(styles)
class Overlay extends React.PureComponent<Props & HocProps> {

  static defaultProps: DefaultProps = {
    withClickOutside: true,
  };

  renderChildren() {
    const { onClose, children, withClickOutside } = this.props;
    const onClickOutside = withClickOutside ? () => onClose('click') : noop;
    return (
      <ClickOutside onClickOutside={onClickOutside}>
        {children}
      </ClickOutside>
    );
  }

  render() {
    const { classes, contentClassName, headClassName, title, onClose, withClickOutside } = this.props;

    return (
      <div className={classes!.container}>
        <KeyHandler
          keyEventName={KEYDOWN}
          keyValue="Escape"
          onKeyHandle={() => onClose('esc')}
        />
        <ButtonIcon
          onClick={withClickOutside ? noop : () => onClose('click')}
          symbolId={IconSymbol.CROSS}
          btnStyle={Style.TERTIARY}
          btnSize={Size.SMALL}
          className={classes!.closeButton}
          type="button"
        />
        { title &&
        <div className={classNames(classes!.head, headClassName)}>
          <h1 className={classes!.titleText}>{title}</h1>
        </div>
        }
        <div className={classNames(classes!.content, contentClassName)}>
          {this.renderChildren()}
        </div>
      </div>
    );
  }
}

export default withGradient(GradientType.withOverlay)(Overlay);
