import * as React from 'react';
import Maybe from 'graphql/tsutils/Maybe';
import { Icon, IconSymbol, roundedBackground, ThemeTypes as Theme } from '@getstation/theme';
import * as classNames from 'classnames';
// @ts-ignore: no declaration file
import * as isBlank from 'is-blank';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

import AppIcon from '../../dock/components/AppIcon';

import SubdockButton from './SubdockButton';

// STYLE

type OwnStyle = {
  item: string,
  iconWrapper: string,
  iconWrapperActive: string,
  txt: string,
  favoriteIcon: string,
  favoriteIconWrapper: string,
  favoriteImg: string,
  link: string,
  buttons: string,
  unPinned: string,
  pinned: string,
};

export const SUBDOCK_ITEM_HEIGHT = 36;

const styles = (theme: Theme) => ({
  item: {
    boxSizing: 'border-box',
    height: SUBDOCK_ITEM_HEIGHT,
    margin: '0 6px',
    padding: '0 8px 0 12px',
    borderRadius: theme.radius.pill,
    // rows follow the panel in, one after another
    animation: `subdock-row-in 460ms ${theme.motion.easeOut} both`,
    animationDelay: '90ms',
    '&:nth-child(2)': { animationDelay: '114ms' },
    '&:nth-child(3)': { animationDelay: '138ms' },
    '&:nth-child(4)': { animationDelay: '162ms' },
    '&:nth-child(n+5)': { animationDelay: '186ms' },
    listStyleType: 'none',
    transition: `background-color ${theme.transition.fast}`,
    '&:hover': {
      backgroundColor: theme.fill.hover,
    },
    '&.isActive': {
      backgroundColor: theme.fill.selected,
    },
    '& $buttons': {
      display: 'none',
    },
    '&:hover $buttons': {
      display: 'flex',
    },
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'default',
    height: '100%',
    position: 'relative',
    color: 'inherit',
    textDecoration: 'none',
  },
  favoriteIcon: {
    color: theme.text.tertiary,
    '&:hover': {
      color: theme.text.secondary,
    },
    '$item.isActive &, $item.favorite &': {
      color: theme.text.inverse,
    },
  },
  favoriteImg: {
    flex: '0 0 auto',
    marginRight: 8,
    display: 'inline-flex',
    borderRadius: theme.radius.sm,
    filter: 'grayscale(100%)',
    opacity: 0.85,
    transition: `filter ${theme.transition.fast}, opacity ${theme.transition.fast}`,
    '$item:hover &, $item.isActive &': {
      filter: 'grayscale(0)',
      opacity: 1,
    },
  },
  '@keyframes subdock-row-in': {
    from: { opacity: 0, transform: 'translateX(-6px)' },
  },
  txt: {
    color: theme.glass.textSecondary,
    flex: '1 1 auto',
    minWidth: 0,
    marginRight: 4,
    position: 'relative',
    lineHeight: '18px',
    transition: `color ${theme.transition.fast}`,
    ...theme.elipsisMixin(1),
    ...theme.fontMixin(13),
    '$item:hover &': {
      color: theme.text.primary,
    },
    '$item.isActive &': {
      color: theme.text.primary,
      fontWeight: 500,
    },
  },
  iconWrapper: {
    flex: '0 0 auto',
    width: 24,
    height: 24,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -6,
    marginRight: 2,
    color: theme.text.tertiary,
    transition: `color ${theme.transition.fast}`,
    '$item:hover &, $item.isActive &': {
      color: theme.text.primary,
    },
  },
  favoriteIconWrapper: {
    width: 24,
    height: 24,
    marginLeft: -3,
    marginRight: 5,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      ...roundedBackground(theme.fill.hover),
    },
    '$item.favorite &': {
      ...roundedBackground(theme.status.favorite),
    },
  },
  buttons: {
    flex: '0 0 auto',
    alignItems: 'center',
  },
  unPinned: {
    '& svg': {
      transform: 'rotate(45deg)',
    },
  },
  pinned: {
    '$item &, $item &:hover': {
      ...roundedBackground(theme.status.favorite),
      color: theme.text.inverse,
    },
  },
});

// PROPS

export interface MinimalSubdockApplication {
  id: string,
  iconUrl: Maybe<string>,
  themeColor: Maybe<string>,
}

export interface WrappedActions {
  onSelect: () => any,
  onClose: () => any,
  onClickFavorite: () => any,
  onClickAttach?: () => any,
  onClickDetach: () => any,
}

export interface ItemDetails {
  title: string,
  isActive: boolean,
  isTabApplicationHome: boolean,
  isDetached: boolean,
  icon?: string | null,
  noClose?: boolean,
  canPin?: boolean,
  canDetach?: boolean,
  isPinned?: boolean,
}

interface OwnProps {
  application: MinimalSubdockApplication,
  actions: WrappedActions,
  item: ItemDetails,
}

// EMPTY SUBDOCK ELEMENT

const emptySubdockItemStyle = { height: SUBDOCK_ITEM_HEIGHT };
export const EmptySubdockItem = () => (
  <div style={emptySubdockItemStyle} />
);

// FULL SUBDOCK ELEMENT

const SubdockItem = (props: OwnProps & { classes: OwnStyle }) => {
  const { application, actions, item, classes } = props;

  const {
    title, icon,
    isActive, isTabApplicationHome, isPinned, isDetached,
    canPin, canDetach, noClose,
  } = item;

  const {
    onSelect, onClose, onClickPin,
    onClickDetach, onClickAttach,
  } = useEventWrapper(actions);

  const { iconUrl, themeColor } = application;

  return (
    <li className={classNames(classes!.item, { isActive })}>
      <a className={classes!.link} onClick={onSelect}>
        {isTabApplicationHome && iconUrl &&
          <div className={classes!.favoriteImg}>
            <AppIcon
              imgUrl={iconUrl}
              themeColor={themeColor || undefined}
              size={16}
            />
          </div>
        }

        {icon &&
          <span className={classes!.iconWrapper}>
            <Icon size={20} color="currentColor" symbolId={icon as IconSymbol} />
          </span>
        }

        <span className={classes!.txt}>
          {isBlank(title) ? <i>Untitled</i> : title}
        </span>

        <span className={classes!.buttons}>
          {canPin &&
            <SubdockButton
              className={isPinned ? classes!.pinned : classes!.unPinned}
              tooltip={isPinned ? 'Unpin this page' : 'Pin this page'}
              size={24}
              symbolId={IconSymbol.PIN}
              onClick={onClickPin}
            />
          }

          { canDetach &&
            <SubdockButton
              tooltip={isDetached ? 'Reattach the window' : 'Open in detached window'}
              size={24}
              symbolId={isDetached ? IconSymbol.REATTACH : IconSymbol.DETACH}
              onClick={isDetached ? onClickAttach : onClickDetach}
            />
          }

          {!noClose && <SubdockButton
            tooltip="Close this page"
            size={24}
            symbolId={IconSymbol.CROSS}
            onClick={onClose}
          />}
        </span>
      </a>
    </li>
  );
};

// HOOKS

const useEventWrapper = (actions: WrappedActions) => {
  return React.useMemo(
    () => {
      const onSelect = (_: React.MouseEvent<Element>) => {
        actions.onSelect();
      };

      // close being inside the whole item, need to stop propagation
      // so that onSelect is not called
      const onClose = (e: React.MouseEvent<Element>) => {
        e.stopPropagation();
        actions.onClose();
      };

      const onClickPin = (e: React.MouseEvent<Element>) => {
        e.stopPropagation();
        actions.onClickFavorite();
      };

      const onClickDetach = (e: React.MouseEvent<Element>) => {
        e.stopPropagation();
        actions.onClickDetach();
      };

      const onClickAttach = (e: React.MouseEvent<Element>) => {
        e.stopPropagation();
        if (actions.onClickAttach) actions.onClickAttach();
      };

      return {
        onSelect,
        onClose,
        onClickPin,
        onClickDetach,
        onClickAttach,
      };
    },
    [actions],
  );
};

// EXPORT

export default injectSheet(styles)(SubdockItem) as React.ComponentType<OwnProps>;
