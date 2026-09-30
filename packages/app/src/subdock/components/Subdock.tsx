import { ThemeTypes as Theme } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore no declaration file
import injectSheet from 'react-jss';
import { Application } from '../types';
import { ITabSelectedInfo, ActiveTab } from '../Container';
import SubdockHead from './SubdockHead';
import SubdockPanel from './SubdockPanel';

interface Classes {
  container: string,
  panels: string,
}

interface Props {
  classes?: Classes,
  application: Application,
  applicationId: string,
  onOverStateChange: (change: boolean) => any,
  notificationsEnabled: boolean,
  themeGradient: string,
  activeTab: ActiveTab,
  onSelectTab: (tabId: string, info: ITabSelectedInfo) => any,
  onDetachTab: () => any,
  onAttachTab: () => any,
  onSelectFavorite: (tabId: string) => any,
  onAddTabAsFavorite: () => any,
  onRemoveFavorite: (favoriteId: string, tabId: string) => any,
  onDetachFavorite: () => any,
  onCloseTab: (tabId: string) => any,
  onOpenNewTab: () => void,
  onClickAddNewInstance: (application: Application, identityNeeded?: boolean) => void,
  openApplicationPreferences: (application: Application) => void,
  toggleNotifications: () => void,
  handleHideSubdock: () => void,
}

@injectSheet((theme: Theme) => ({
  // The website's glass, sliding out of the rail.
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: 280,
    zIndex: 4,
    borderRadius: theme.radius.xl,
    maxHeight: '98vh',
    overflow: 'hidden',
    backgroundColor: theme.glass.background,
    backdropFilter: `blur(${theme.glass.blur}px)`,
    boxShadow: theme.shadow.panel,
    color: theme.text.primary,
    transformOrigin: 'left top',
    animation: `subdock-in 380ms ${theme.motion.easeOut} both`,
  },
  '@keyframes subdock-in': {
    from: { opacity: 0, transform: 'translateX(-10px) scale(0.98)' },
  },
  panels: {
    flex: '1 1 auto',
    position: 'relative',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
}))
export default class Subdock extends React.PureComponent<Props, {}> {

  render() {
    const {
      classes, application, onOverStateChange, notificationsEnabled,
      handleHideSubdock, activeTab, onSelectTab, onDetachTab, onAttachTab, onSelectFavorite, onAddTabAsFavorite,
      onRemoveFavorite, onDetachFavorite, onCloseTab, onClickAddNewInstance, onOpenNewTab, openApplicationPreferences,
      toggleNotifications,
    } = this.props;

    const onMouseEnter = () => onOverStateChange(true);
    const onMouseLeave = () => onOverStateChange(false);

    return (
      <div className={classes!.container} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <SubdockHead
          application={application}
          notificationsEnabled={notificationsEnabled}
          openApplicationPreferences={openApplicationPreferences}
          toggleNotifications={toggleNotifications}
        />

        <div className={classes!.panels}>
          {application &&
            <SubdockPanel
              application={application}
              activeTab={activeTab}
              onSelectTab={onSelectTab}
              onDetachTab={onDetachTab}
              onAttachTab={onAttachTab}
              onSelectFavorite={onSelectFavorite}
              onAddTabAsFavorite={onAddTabAsFavorite}
              onRemoveFavorite={onRemoveFavorite}
              onDetachFavorite={onDetachFavorite}
              onCloseTab={onCloseTab}
              onOpenNewTab={onOpenNewTab}
              onClickAddNewInstance={onClickAddNewInstance}
              handleHideSubdock={handleHideSubdock}
            />
          }
        </div>
      </div>
    );
  }
}
