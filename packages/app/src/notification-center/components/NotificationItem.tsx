import { Icon, IconSymbol, text, ThemeTypes } from '@getstation/theme';
import * as classNames from 'classnames';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import {
  getNotificationBody,
  getNotificationDateFromNow,
  getNotificationId,
  getNotificationTitle,
  isNotificationFull,
} from '../../notifications/get';
import { ImmutableNotification } from '../../notifications/types';

export interface Classes {
  item: string,
  markAsReadIcon: string,
  iconWrapper: string,
}

export interface Props {
  classes?: Classes,
  notification: ImmutableNotification,
  markAsRead(notificationId: string): void,
  toggleVisibility(): any,
  onNotificationClick(notificationId: string): void
}

@injectSheet((theme: ThemeTypes) => ({
  iconWrapper: {
    display: 'inline-block',
    flexShrink: 0,
    width: 24,
    height: 24,
    marginLeft: 8,
  },
  markAsReadIcon: {
    visibility: 'hidden',
    borderRadius: theme.radius.sm,
    transition: `background-color ${theme.transition.fast}`,
    '&:hover': {
      fill: `${theme.text.primary} !important`,
      backgroundColor: theme.fill.hover,
    },
  },
  item: {
    '&:hover $markAsReadIcon': {
      visibility: 'visible',
    },
    '& .l-notification-item__title': {
      fontWeight: 500,
    },
  },
}))
class NotificationItem extends React.PureComponent<Props, {}> {

  handleClickMarkAsRead = (e: React.MouseEvent<any>) => {
    const notificationId = getNotificationId(this.props.notification);
    e.stopPropagation();
    e.preventDefault();
    this.props.markAsRead(notificationId);
  }

  handleClick = () => {
    const notificationId = getNotificationId(this.props.notification);
    this.props.onNotificationClick(notificationId);
    this.props.toggleVisibility();
  }

  render() {
    const { notification, classes } = this.props;
    const body = getNotificationBody(notification);

    return (
      <div
        className={classNames(
          classes!.item,
          'l-notification-item',
          { 'l-notification-item-compact': !isNotificationFull(notification) })
        }
        onClick={this.handleClick}
      >
        <div className="l-notification-item__container">
          <div className="l-notification-item__content">
            <span className="l-notification-item__title">
              {getNotificationTitle(notification)}
            </span>
            {body &&
              `— ${body}`
            }
          </div>

          <div className="l-notification-item__footer">
            <span>{getNotificationDateFromNow(notification)}</span>
          </div>
        </div>
        <span className={classes!.iconWrapper}>
          <Icon
            className={classes!.markAsReadIcon}
            symbolId={IconSymbol.CHECKMARK}
            onClick={this.handleClickMarkAsRead}
            size="24px"
            color={text.tertiary}
          />
        </span>
      </div>
    );
  }
}

export default NotificationItem;
