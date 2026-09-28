import { Button, Size, Style, ThemeTypes as Theme } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import gDriveIcon from '../../static/bang/googledrive.svg';

interface Classes {
  container: string,
  item: string,
  itemDescription: string,
  itemCTA: string,
  kbShortcut: string,
  gdriveIcon: string,
  gdriveDesc: string,
}

export interface Props {
  classes?: Classes,
  isGDriveConnected: boolean,
  onGDriveConnect: () => any,
}

@injectSheet((theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: [0, 20, 12],
    color: theme.text.primary,
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    margin: [8, 0],
    padding: 12,
    backgroundColor: theme.fill.subtle,
    fontSize: 12,
    borderRadius: theme.radius.lg,
    border: `1px solid ${theme.border.subtle}`,
  },
  itemDescription: {
    flexGrow: 1,
    textAlign: 'center',
    lineHeight: 1.5,
  },
  itemCTA: {
    flexShrink: 0,
  },
  kbShortcut: {
    ...theme.mixins.kbd(),
  },
  gdriveIcon: {
    width: 28,
    flexShrink: 0,
  },
  gdriveDesc: {
    flex: 1,
    margin: 0,
    color: theme.text.secondary,
    fontSize: 12,
    lineHeight: 1.5,
  },
}))
export default class BangInsert extends React.PureComponent<Props> {

  constructor(props: Props) {
    super(props);
  }

  renderGDriveTooltip() {
    const { classes, onGDriveConnect } = this.props;

    return (
      <div className={classes!.item}>
  
        <img className={classes!.gdriveIcon} src={gDriveIcon} />

        <p className={classes!.gdriveDesc}>Access Google Docs and Sheets with the Quick Switch</p>

        <Button
          className={classes!.itemCTA}
          onClick={onGDriveConnect}
          btnSize={Size.SMALL}
          btnStyle={Style.SECONDARY}
        >
          Connect Google Drive
        </Button>
      </div>
    );
  }

  render() {
    const { classes, isGDriveConnected } = this.props;

    return (
      <div className={classes!.container}>
        {!isGDriveConnected &&
          this.renderGDriveTooltip()
        }
      </div>
    );
  }
}
