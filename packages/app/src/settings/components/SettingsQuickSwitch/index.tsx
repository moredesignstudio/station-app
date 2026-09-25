import { createStyles, ThemeTypes as Theme } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { SHORTCUTS } from '../../../keyboard-shortcuts';
import SDKPortal from '../../../sdk/react/components/SDKPortal';
import FindBoostedAppsButton, { OwnProps as FindBoostedAppsButtonOwnProps } from './FindBoostedAppsButton';

const kbShortcut = SHORTCUTS.bang.kbd.replace(' ', '+');

type InjectSheetProps = {
  classes: {
    title: string,
    description: string,
    boostedAppsButton: string,
    navigation: string,
    navigationIcon: string,
  },
};

type OwnProps = Pick<FindBoostedAppsButtonOwnProps, 'closeSettings'>;

const styles = (theme: Theme) => createStyles({
  title: {
    ...theme.titles.h2,
    marginBottom: 12,
    display: 'inline-block',
  },
  description: {
    ...theme.fontMixin(13),
    lineHeight: '1.5em',
    color: theme.text.secondary,
    maxWidth: 600,
    marginBottom: 24,
  },
  boostedAppsButton: {
    marginTop: 16,
  },
  navigation: {
    display: 'inline-block',
    paddingLeft: 10,
    transform: 'translateY(-3px)',
  },
  navigationIcon: {
    ...theme.mixins.kbd(),
  },
});

const getDescription = (nbComponents: number): string => {
  if (nbComponents === 0) {
    return 'None of the apps you have installed have integrations with the Quick-Switch so far.';
  } else if (nbComponents > 0) {
    return 'You can search any document of those apps via the Quick-Switch, our unified search.';
  }
  return '';
};

type Props = OwnProps & InjectSheetProps;

const SettingsQuickSwitch = (props: Props) => {
  const { classes, ...restProps } = props;

  const [nbComponents, setNbComponents] = React.useState(-1);

  return (
    <>
      <div className={classes.title}>Quick-Switch</div>
      <div className={classes!.navigation}>
        <span className={classes!.navigationIcon}>{kbShortcut}</span>
      </div>
      <div className={classes.description}>
        <p>{getDescription(nbComponents)}</p>
        {nbComponents === 0 &&
          <div className={classes.boostedAppsButton}>
            <FindBoostedAppsButton {...restProps} />
          </div>
        }
      </div>
      <SDKPortal id="portal-quickswitch" onComponentsChanged={setNbComponents} />
    </>
  );
};

export default injectSheet(styles)(SettingsQuickSwitch) as React.ComponentType<OwnProps>;
