import {
  Icon,
  IconSymbol,
  ThemeTypes as Theme,
} from '@getstation/theme';
import * as classNames from 'classnames';
import * as React from 'react';
// @ts-ignore no ts definitions
import injectSheet from 'react-jss';

import AppIcon from '../../dock/components/AppIcon';
import { SearchPaneItemSelectedItem } from '../duck';
import KeyHold from './KeyHold';

interface Classes {
  item: string,
  content: string,
  labelWrapper: string,
  label: string,
  context: string,
  image: string,
  caretIcon: string,
  current: string,
}

interface InjectSheetProps {
  classes: Classes,
}
export interface OwnProps {
  label: string,
  imgUrl: string,
  themeColor: string,
  type: SearchPaneItemSelectedItem,
  current?: boolean,
  context?: string,
  /**
   * Indicates that this item is currently selected,
   * for instance via keyboard navigation.
   */
  selected: boolean,
  onClick: () => void,
  ctrlTabCycling?: boolean,
  smallSize?: boolean,
}

interface State {
  isHover: boolean
}

@injectSheet((theme: Theme) => {
  const labelSize = ({ smallSize }: OwnProps) => smallSize ? 12 : 13;
  const contextSize = ({ smallSize }: OwnProps) => smallSize ? 10 : 11;
  const imageSize = ({ smallSize }: OwnProps) => smallSize ? '22px' : '28px';

  return ({
    item: {
      display: 'flex',
      height: ({ smallSize }: OwnProps) => smallSize ? 40 : 48,
      alignItems: 'center',
      gap: '10px',
      padding: [0, 12],
      margin: [0, 8],
      borderRadius: theme.radius.lg,
      listStyle: 'none',
      transition: `background-color ${theme.transition.fast}`,
      '&.highlighted': {
        backgroundColor: theme.fill.selected,
      },
      '&.mediumlighted': {
        backgroundColor: theme.fill.hover,
      },
    },
    content: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flex: 1,
      minWidth: 0,
      color: theme.text.primary,
    },
    labelWrapper: {
      flex: 1,
      minWidth: 0,
    },
    label: {
      ...theme.fontMixin(labelSize, 500),
      margin: 0,
      lineHeight: '18px',
      color: theme.text.primary,
      ...theme.mixins.ellipsis(1),
    },
    context: {
      ...theme.fontMixin(contextSize),
      margin: 0,
      lineHeight: '14px',
      color: theme.text.tertiary,
      ...theme.mixins.ellipsis(1),
    },
    image: {
      ...theme.avatarMixin(imageSize),
      flexShrink: 0,
      '&.placeholder': {
        content: '""',
      },
    },
    caretIcon: {
      flexGrow: 0,
      flexShrink: 0,
      color: theme.text.tertiary,
    },
  });
})

class BangItem extends React.PureComponent<OwnProps & InjectSheetProps, State> {
  static defaultProps = {
    onHover: () => { },
    current: false,
    context: '',
  };

  state = {
    isHover: false,
  };

  handleCtrlClick = (e: React.MouseEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      this.props.onClick();
    }
  }

  renderImage() {
    const { imgUrl, label, type, themeColor, smallSize, classes } = this.props;

    if (!imgUrl) {
      // if no image put a placeholder
      return <span className={classNames(classes!.image, 'placeholder')} />;
    }

    if (type === 'station-app') {
      const iconSize = smallSize ? 22 : 28;

      return (
        <div className={classes!.image}>
          <AppIcon size={iconSize} imgUrl={imgUrl} themeColor={themeColor} />
        </div>
      );
    }

    return (
      <img className={classes!.image} src={imgUrl} alt={label} />
    );
  }

  setIsHover = () => this.setState({ isHover: true });
  unsetIsHover = () => this.setState({ isHover: false });

  renderButton() {
    const { classes, selected } = this.props;

    if (!selected) return;

    return (
      <KeyHold keyValue={'Alt'} >
        {() => (
          <Icon
            className={classes!.caretIcon}
            symbolId={IconSymbol.RETURN}
            size={24}
            color="currentColor"
          />
        )}
      </KeyHold>
    );
  }

  render() {
    const { classes, selected, onClick, label, context } = this.props;

    return (
      <li
        onMouseEnter={this.setIsHover}
        onMouseLeave={this.unsetIsHover}
        onClick={onClick}
        onContextMenu={this.handleCtrlClick}
        className={classNames(classes!.item, {
          highlighted: selected,
          mediumlighted: !selected && this.state.isHover,
        })}
      >
        {this.renderImage()}
        <div className={classes!.content}>
          <div className={classes!.labelWrapper}>
            <p className={classes!.label}>{label || ''}</p>
            <p className={classes!.context}>{context}</p>
          </div>
          {this.renderButton()}
        </div>
      </li>
    );
  }
}

export default BangItem as React.ComponentType<OwnProps>;
