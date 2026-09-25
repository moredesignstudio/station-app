import classNames from 'classnames';
import * as React from 'react';
import injectSheet, { WithSheet } from 'react-jss';
import { ChooserItemTypes, createStyles, ThemeTypes } from '../../types';
import { Button, Size as ButtonSize, Style as ButtonStyle } from '../Button';

export enum ChooserItemStyle {
  PRIMARY, SECONDARY,
}

interface OwnProps {
  item: ChooserItemTypes,
  onSelect: (item: any) => any,
  style?: ChooserItemStyle,
  selectText?: string,
}

const styles = (theme: ThemeTypes) => createStyles({
  chooserItem: {
    margin: '8px auto',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: theme.fill.subtle,
    boxShadow: `inset 0 0 0 1px ${theme.border.subtle}`,
    borderRadius: theme.radius.lg,
    padding: '10px 12px',
    minWidth: 180,
    color: theme.text.primary,
    ...theme.fontMixin(13),
    transition: `background-color ${theme.transition.fast}`,
    '&:hover': {
      backgroundColor: theme.fill.hover,
    },
  },
  info: {
    minWidth: 0,
  },
  title: {
    margin: 0,
    fontWeight: 500,
    color: theme.text.primary,
    ...theme.mixins.ellipsis(1),
  },
  description: {
    display: 'block',
    marginTop: 2,
    fontSize: 12,
    color: theme.text.secondary,
  },
  chooserPrimary: {
  },
  chooserSecondary: {
  },
});

type Props = OwnProps & WithSheet<typeof styles>;

class ChooserItemImpl extends React.PureComponent<Props, {}> {
  static defaultProps = {
    style: ChooserItemStyle.PRIMARY,
    implicit: true,
  };

  handleClickSelect = () => {
    const { onSelect, item } = this.props;
    onSelect(item.value);
  }

  render() {
    const { classes, style, item, selectText } = this.props;

    const styleClassNames = {
      [ChooserItemStyle.PRIMARY]: classes!.chooserPrimary,
      [ChooserItemStyle.SECONDARY]: classes!.chooserSecondary,
    };

    return (
      <div className={classNames(classes!.chooserItem, styleClassNames[style!])}>
        <div className={classes!.info}>
          <p className={classes!.title}>{item.title}</p>

          { item.description &&
          <small className={classes!.description}>
            {item.description}
          </small>
          }
        </div>

        <Button
          onClick={this.handleClickSelect}
          btnStyle={style === ChooserItemStyle.SECONDARY ? ButtonStyle.SECONDARY : ButtonStyle.PRIMARY}
          btnSize={ButtonSize.SMALL}
        >
          {selectText || 'Select'}
        </Button>
      </div>
    );
  }
}

export const ChooserItem = injectSheet(styles)(ChooserItemImpl);
