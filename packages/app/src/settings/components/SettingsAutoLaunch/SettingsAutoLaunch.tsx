import { Switcher, ThemeTypes as Theme } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { compose } from 'redux';
import { withGetAutolaunchStatus, withEnableAutoLaunch } from './queries@local.gql.generated';

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
  isAutoLaunchEnabled: boolean,
  onEnableAutoLaunch: (enabled: boolean) => any
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
    gap: '16px',
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
class SettingsAutoLaunch extends React.Component<Props, {}> {
  render() {
    const { classes, loading, isAutoLaunchEnabled } = this.props;

    const handleSwitcherChange = (e: React.ChangeEvent<HTMLInputElement>) =>
      this.props.onEnableAutoLaunch(e.target.checked);
    return (
      <div className={classes!.container}>
        <p className={classes!.settingName}>auto launch</p>
        <div className={classes!.item}>
          <div className={classes!.label}>
            Launch more mail on login
          </div>
          <Switcher
            disabled={loading} // if no data yet we disable
            checked={isAutoLaunchEnabled}
            onChange={handleSwitcherChange}
          />
        </div>
      </div>
    );
  }
}

const connect = compose(
  withGetAutolaunchStatus({
    props: ({ data }) => ({
      loading: !data || data.loading,
      isAutoLaunchEnabled: !!data && Boolean(data.autoLaunchEnabled),
    }),
  }),
  withEnableAutoLaunch({
    props: ({ mutate }) => ({
      onEnableAutoLaunch: (enabled: boolean) => mutate && mutate({ variables: { enabled } }),
    }),
  }),
);

export default connect(SettingsAutoLaunch);
