import { Icon, IconSymbol, ThemeTypes as Theme } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

export interface Classes {
  container: string,
  navigationWrapper: string,
  navigation: string,
  navigationIcon: string,
  settings: string,
}

export interface Props {
  classes?: Classes,
  onClickSettings?: () => void,
  ctrlTabCycling?: boolean,
  searchShortcut?: string,
  smallSize?: boolean,
}

const styles = (theme: Theme) => ({
  container: {
    height: ({ smallSize }: Props) => smallSize ? 30 : 36,
    flexShrink: 0,
    backgroundColor: theme.surface.inset,
    borderTop: `1px solid ${theme.border.subtle}`,
    padding: [0, 12],
    color: theme.text.tertiary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navigationWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  navigation: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: ({ smallSize }: Props) => smallSize ? 10 : 11,
    color: theme.text.tertiary,
    whiteSpace: 'nowrap',
  },
  navigationIcon: {
    ...theme.mixins.kbd(),
  },
  settings: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: theme.radius.md,
    color: theme.text.tertiary,
    cursor: 'default',
    transition: `background-color ${theme.transition.fast}, color ${theme.transition.fast}`,
    '&:hover': {
      color: theme.text.primary,
      backgroundColor: theme.fill.hover,
    },
  },
});

@injectSheet(styles)
export default class BangBottom extends React.PureComponent<Props, {}> {
  render() {
    const { classes, ctrlTabCycling, onClickSettings } = this.props;

    return (
      <div className={classes!.container}>
        <div className={classes!.navigationWrapper}>
          <div className={classes!.navigation}>
            <span className={classes!.navigationIcon}>TAB</span>
            { !ctrlTabCycling &&
              <>
                <span className={classes!.navigationIcon}>↑</span>
                <span className={classes!.navigationIcon}>↓</span>
              </>
            }
            Navigate
          </div>

          <div className={classes!.navigation}>
            <span className={classes!.navigationIcon}>ESC</span>
            Close
          </div>
        </div>

        { onClickSettings &&
          <a className={classes!.settings} onClick={onClickSettings}>
            <Icon
              symbolId={IconSymbol.COG}
              size={18}
              color="currentColor"
            />
          </a>
        }
      </div>
    );
  }
}
