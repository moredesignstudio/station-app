import { Switcher, ThemeTypes as Theme } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { compose } from 'redux';
import { withGetHideMainMenuStatus, withEnableHideMainMenu } from './queries@local.gql.generated';

export interface Classes {
  container: string,
  item: string,
  title: string,
  settingName: string,
  checkbox: string,
  label: string,
}

export interface Props {
  classes?: Classes
  isHideMainMenu: boolean,
  onHideMainMenu: (hide: boolean) => any
  loading: boolean,
}

const styles = (theme: Theme) => ({
  container: {
    maxWidth: 600,
    padding: [14, 0],
    borderTop: `1px solid ${theme.border.subtle}`,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  settingName: {
    ...theme.mixins.sectionLabel(),
    marginBottom: 8,
  },
  label: {
    ...theme.fontMixin(13),
    lineHeight: '1.4em',
    color: theme.text.primary,
  },
});

@injectSheet(styles)
class SettingsHideMainMenu extends React.Component<Props, {}> {
  render() {
    const { classes, loading, isHideMainMenu } = this.props;

    const handleSwitcherChange = (e: React.ChangeEvent<HTMLInputElement>) =>
      this.props.onHideMainMenu(e.target.checked);
    return (
      <div className={classes!.container}>
        <p className={classes!.settingName}>main menu</p>
        <div className={classes!.item}>
          <div className={classes!.label}>
            Hide main menu
          </div>
          <Switcher
            disabled={loading} // if no data yet we disable
            checked={isHideMainMenu}
            onChange={handleSwitcherChange}
          />
        </div>
      </div>
    );
  }
}

const connect = compose(
  withGetHideMainMenuStatus({
    props: ({ data }) => ({
      loading: !data || data.loading,
      isHideMainMenu: !!data && Boolean(data.hideMainMenu),
    }),
  }),
  withEnableHideMainMenu({
    props: ({ mutate }) => ({
      onHideMainMenu: (hide: boolean) => mutate && mutate({ variables: { hide } }),
    }),
  }),
);

export default connect(SettingsHideMainMenu);
