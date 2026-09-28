import * as React from 'react';
import { createUseStyles } from 'react-jss';
import * as classNames from 'classnames';
import { sectionLabelMixin } from '@getstation/theme';
import { WithBurgerMenuStatus } from '@src/HOC/withBurgerMenuStatus';
import AppStoreAsideNavRouterButton
  from '@src/components/AppStoreAside/AppStoreAsideNav/AppStoreAsideNavRouterButton/AppStoreAsideNavRouterButton';
import { colors } from '@src/theme';
import { ContextEnvPlatform } from '@src/context';

const useStyles = createUseStyles({
  navMenu: {
    color: colors.textSecondary,
  },
  title: {
    display: ({ appStoreContext }: AppStoreAsideNavMenuProps) => appStoreContext !== ContextEnvPlatform.Browser ? 'block' : 'none',
    ...sectionLabelMixin(),
    lineHeight: '16px',
    padding: [0, 18],
    marginBottom: 6,
  },
  navList: {
    padding: 0,
    margin: [0, 0, 16, 0],
  },
  '@media (min-width: 600px)': {
    title: {
      display: () => 'block',
    },
  },
});

export type AppStoreAsideNavMenuProps = {
  navMenuTitle: string,
  navMenuList: { screenName: string, title: string, iconName: string }[],
  appStoreContext?: number,
  link: string;
} & WithBurgerMenuStatus;

const AppStoreAsideNavRouterMenu: React.FC<AppStoreAsideNavMenuProps> = (props) => {
  const { navMenuTitle, navMenuList, isBurgerOpen, link } = props;
  const classes = useStyles(props);

  return (
    <div className={classes!.navMenu}>
      {<div
        className={classNames(
          classes!.title,
          { 'active-burger': isBurgerOpen }
        )}
      >
        {navMenuTitle}
      </div>}
      <ul className={classes!.navList}>
        {navMenuList.map(navItem => <AppStoreAsideNavRouterButton
          {...navItem}
          key={navItem.screenName}
          link={link}
        />)}
      </ul>
    </div>
  );
};

export default AppStoreAsideNavRouterMenu;
