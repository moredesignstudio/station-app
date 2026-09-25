import * as React from 'react';
import injectSheet, { WithSheet } from 'react-jss';
import { theme } from '../../jss';
import { Icon, IconSymbol } from '../Icon';
import { Tooltip } from '../Tooltip';

export enum STYLE {
  LIGHT,
  DARK,
}

interface Classes {
  container: string;
  tooltip: string;
  hint: string;
}

interface OwnProps {
  classes?: Classes;
  tooltip: string;
  style?: STYLE;
  size?: number;
  children: any;
}

const styles = {
  container: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  tooltip: {
    marginLeft: 4,
    display: 'inline-flex',
    cursor: 'help',
    '& svg': {
      transition: `fill ${theme.transition.fast}`,
    },
    '&:hover svg': {
      fill: theme.text.primary,
    },
  },
  hint: {
    width: 'initial',
    maxWidth: 250,
  },
};

type Props = OwnProps & WithSheet<typeof styles, {}>;

class HintImpl extends React.PureComponent<Props, {}> {
  static defaultProps = {
    style: STYLE.LIGHT,
    size: 15,
  };

  style: Object;

  constructor(props: Props) {
    super(props);

    // both variants sit on dark surfaces now: use muted text color
    this.style = {
      [STYLE.LIGHT]: theme.text.tertiary,
      [STYLE.DARK]: theme.text.tertiary,
    };
  }

  render() {
    const { classes, tooltip, style, size, children } = this.props;

    return (
      <div className={classes!.container}>
        <div>{children}</div>
        <Tooltip className={classes!.tooltip} tooltip={tooltip} hintClassname={classes!.hint}>
          <Icon symbolId={IconSymbol.HINT} color={this.style[style!]} size={size} />
        </Tooltip>
      </div>
    );
  }
}

export const Hint = injectSheet(styles)(HintImpl);
