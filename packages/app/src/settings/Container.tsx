import { ThemeTypes as Theme } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import Tab from '../common/containers/Tab';
import Tabs from '../common/containers/Tabs';
import Overlay from '../components/Overlay';

import SettingsPanelGeneral from './components/SettingsPanelGeneral';
import SettingsQuickSwitch from './components/SettingsQuickSwitch';
import SettingsMyApps from './applications/SettingsMyApps';

interface Classes {
  content: string,
  categories: string,
  category: string,
  categoryList: string,
  panel: string,
  head: string,
}

export interface Props {
  classes?: Classes,
  setActiveTabTitle: (title: string) => void,
  setVisibility: (visibility: boolean) => void,
  activeTabTitle: string,
}

const styles = (theme: Theme) => ({
  head: {
    paddingBottom: 32,
  },
  content: {
    display: 'flex',
    width: '100%',
    maxHeight: 'calc(100% - 64px)',
  },
  categories: {
    width: 160,
    flexShrink: 0,
    overflow: 'auto',
  },
  categoryList: {
    listStyle: 'none',
    textAlign: 'left',
    padding: 0,
    margin: 0,
  },
  category: {
    ...theme.fontMixin(13),
    lineHeight: '20px',
    color: theme.text.secondary,
    padding: [6, 10],
    borderRadius: theme.radius.md,
    cursor: 'pointer',
    transition: `background-color ${theme.transition.fast}, color ${theme.transition.fast}`,
    '&:hover': {
      backgroundColor: theme.fill.hover,
      color: theme.text.primary,
    },
    '&.active': {
      backgroundColor: theme.fill.selected,
      color: theme.text.primary,
      fontWeight: 500,
    },
  },
  panel: {
    flex: 1,
    minWidth: 0,
    padding: [0, 32],
  },
});

@injectSheet(styles)
export default class SettingsOverlay extends React.PureComponent<Props, {}> {

  private modalIsOpened: boolean = false;

  constructor(props: Props) {
    super(props);
    this.setActiveTab = this.setActiveTab.bind(this);
    this.closeSettings = this.closeSettings.bind(this);
  }

  setActiveTab(title: string) {
    this.props.setActiveTabTitle(title);
  }

  closeSettings() {
    this.props.setVisibility(false);
  }

  handleModalStateChanged = (isOpened: boolean) => {
    this.modalIsOpened = isOpened;
  }

  onClose = (via: 'esc' | 'click') => {
    if (via === 'esc' && this.modalIsOpened) return;
    this.closeSettings();
  }

  render() {
    const { classes, activeTabTitle } = this.props;

    return (
      <Overlay
        withClickOutside={false}
        onClose={this.onClose}
        title="Settings"
        headClassName={classes!.head}
        contentClassName={classes!.content}
      >
        <Tabs
          setActiveTab={this.props.setActiveTabTitle}
          activeTabTitle={activeTabTitle}
        >
          <Tab title="General">
            {() => (
              <SettingsPanelGeneral />
            )}
          </Tab>
          <Tab title="Quick-Switch">
            {() => (
              <SettingsQuickSwitch closeSettings={this.closeSettings} />
            )}
          </Tab>
          <Tab title="My Apps">
            {() => (
              <SettingsMyApps onModalStateChanged={this.handleModalStateChanged} />
            )}
          </Tab>
        </Tabs>
      </Overlay>
    );
  }
}
