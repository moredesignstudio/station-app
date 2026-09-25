import { Icon, IconSymbol, ThemeTypes } from '@getstation/theme';
import Maybe from 'graphql/tsutils/Maybe';
import * as Immutable from 'immutable';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { oc } from 'ts-optchain';
import AppIcon from '../../dock/components/AppIcon';
import { getNotificationId } from '../../notifications/get';
import { ImmutableNotification } from '../../notifications/types';
import NotificationItem from '../components/NotificationItem';
import { withGetApplication } from '../queries@local.gql.generated';

type InjectedProps = {
  applicationName: Maybe<string>,
  icon: Maybe<string>,
  badge: Maybe<string>,
  themeColor?: Maybe<string>,
  label: Maybe<string>,
  loading?: boolean,
};

type OwnProps = {
  icon: string,
  applicationId?: string,
  notifications: Immutable.List<ImmutableNotification>,
  onNotificationClick: (notificationId: string) => void,
  markAsRead: (notificationId: string) => void,
  toggleVisibility: () => void,
};

interface Classes {
  count: string,
}

export type Props = OwnProps & InjectedProps & { classes?: Classes };

const styles = (theme: ThemeTypes) => ({
  count: {
    display: 'inline-block',
    minWidth: 16,
    marginLeft: 6,
    padding: [0, 5],
    borderRadius: theme.radius.pill,
    backgroundColor: theme.fill.active,
    ...theme.fontMixin(10, 600),
    lineHeight: '16px',
    textAlign: 'center',
    verticalAlign: 'middle',
    color: theme.text.secondary,
  },
});

class NotificationGroup extends React.PureComponent<Props> {
  markAsReadGroup = () => {
    this.props.notifications.forEach((notification: ImmutableNotification) => {
      this.props.markAsRead(getNotificationId(notification));
    });
  }

  render() {
    const { classes, loading, notifications, icon, themeColor, badge, applicationName, label } = this.props;

    if (loading) return null;

    return (
      <div
        className="l-notification-group"
      >
        <div className="l-notification-group__title">
          <div className="l-notification-item__image-wrapper">
            <AppIcon
              imgUrl={icon!}
              themeColor={themeColor!}
              size={24}
            />
            {badge &&
            <span className="l-dock__app__acco  unt">
                    <span style={{ backgroundImage: `url(${badge})` }}/>
                  </span>
            }
          </div>
          <span className="l-notification-group__title-text">
                  <span>
                    {applicationName}
                    <span className={classes!.count}>{notifications.size}</span>
                  </span>
                  <small>{label}</small>
                </span>
          <span className="l-notification-group__title-actions">
                  <Icon
                    symbolId={IconSymbol.MARK_READ}
                    size={24}
                    onClick={this.markAsReadGroup}
                  />
                </span>
        </div>
        <TransitionGroup>
          {notifications.toSeq().map((notification: ImmutableNotification) =>
            <CSSTransition
              key={getNotificationId(notification)}
              classNames="notification"
              timeout={{ enter: 500, exit: 300 }}
            >
              <NotificationItem
                notification={notification}
                markAsRead={this.props.markAsRead}
                onNotificationClick={this.props.onNotificationClick}
                toggleVisibility={this.props.toggleVisibility}
              />
            </CSSTransition>
          )
          }
        </TransitionGroup>
      </div>
    );
  }
}

// react-jss' HOC typings don't compose with the graphql HOC below: erase them here, as the theme package does.
const StyledNotificationGroup = (injectSheet(styles) as unknown as
  (component: React.ComponentType<Props>) => React.ComponentType<Props>)(NotificationGroup);

const connector = withGetApplication<OwnProps, InjectedProps>({
  options: (props) => ({ variables: { applicationId: props.applicationId! } }),
  props: ({ data, ownProps }) => {
    const application = oc(data).application;
    const manifest = application.manifestData;

    return {
      loading: !data || data.loading,
      applicationName: manifest.name(),
      icon: manifest.interpretedIconURL() || ownProps.icon,
      badge: application.iconURL(),
      label: manifest.bx_multi_instance_config.instance_wording(),
      themeColor: manifest.theme_color(),
    };
  },
});

const ConnectedNotificationGroup = connector(StyledNotificationGroup);

const NotificationGroupManager = (props: Props) => {
  if (props.applicationId) {
    return (
      <ConnectedNotificationGroup
        icon={props.icon}
        applicationId={props.applicationId}
        notifications={props.notifications}
        onNotificationClick={props.onNotificationClick}
        markAsRead={props.markAsRead}
        toggleVisibility={props.toggleVisibility}
      />
    );
  }
  return (
    <StyledNotificationGroup
      icon={props.icon}
      notifications={props.notifications}
      onNotificationClick={props.onNotificationClick}
      markAsRead={props.markAsRead}
      toggleVisibility={props.toggleVisibility}
      applicationName={props.applicationName}
      badge={props.badge}
      label={props.label}
      loading={false}
      themeColor={props.themeColor}
    />
  );
};

export default NotificationGroupManager;
