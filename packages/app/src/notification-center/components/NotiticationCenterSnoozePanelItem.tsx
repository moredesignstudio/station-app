import { ThemeTypes } from '@getstation/theme';
import * as React from 'react';
import injectSheet from 'react-jss';

export interface Props {
  classes?: any,
  handleClick: () => any,
  duration: string
}

@injectSheet((theme: ThemeTypes) => ({
  item: {
    margin: 0,
    '& a': {
      display: 'block',
      padding: [6, 8],
      borderRadius: theme.radius.sm,
      ...theme.fontMixin(12),
      lineHeight: '16px',
      color: theme.text.secondary,
      cursor: 'pointer',
      transition: `background-color ${theme.transition.fast}, color ${theme.transition.fast}`,
      '&:hover': {
        backgroundColor: theme.fill.hover,
        color: theme.text.primary,
      },
    },
  },
}))
class NotificationCenterSnoozePanelItem extends React.PureComponent<Props, {}> {

  render() {
    const { classes } = this.props;
    return (
      <li className={classes.item}>
        <a onClick={this.props.handleClick}>
          {this.props.duration}
        </a>
      </li>
    );
  }
}

export default NotificationCenterSnoozePanelItem;
