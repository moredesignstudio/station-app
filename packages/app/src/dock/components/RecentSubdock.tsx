import { GradientType, ThemeTypes, withGradient } from '@getstation/theme';
import * as React from 'react';
import { findDOMNode } from 'react-dom';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import {
  SearchPaneItemSelectedVia,
  cyclingStep as bangCyclingStep,
  SearchPaneItemsListCycleDirection,
  SearchPaneItemsListCycleVia,
  SearchPaneItemSelectedItem,
} from '../../bang/duck';
import BangItem from '../../bang/components/BangItem';
import BangBottom from '../../bang/components/BangBottom';
import { ActivityEntry } from '../../activity/queries@local.gql.generated';
import { getId, findItemById } from '../../bang/helpers/utils';

const throttle = require('lodash.throttle');

interface Classes {
  recentSubdock: string,
  recentSubdockContent: string,
  recentSubdockTitle: string,
  navigation: string,
  navigationIcon: string,
  recentSubdockItems: string,
}

export interface Props {
  classes?: Classes,
  themeGradient: string,
  onDidMount: () => void,
  onWillUnmount: () => void,
  onMouseEnter: () => void,
  onMouseLeave: () => void,
  onEsc: () => void,
  recentApplications: ActivityEntry[],
  highlightedItemId?: string,
  cyclingStep: typeof bangCyclingStep,
  isCycling: boolean,
  selectItem: (item: ActivityEntry, via: SearchPaneItemSelectedVia, position: number) => void,
  setHighlightedItemId: (bxResourceId?: string) => void,
}

const styles = (theme: ThemeTypes) => ({
  recentSubdock: {
    width: 270,
    height: 390,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.surface.panel,
    backgroundImage: (props: Props) => props.themeGradient,
    backgroundAttachment: 'fixed',
    border: `1px solid ${theme.border.subtle}`,
    borderRadius: theme.radius.lg,
    boxShadow: theme.shadow.panel,
    overflow: 'hidden',
  },
  recentSubdockContent: {
    flex: '1 1 auto',
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  recentSubdockTitle: {
    flex: '0 0 auto',
    height: 36,
    padding: [0, 12],
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...theme.mixins.sectionLabel(),
  },
  navigation: {
    display: 'flex',
    alignItems: 'center',
  },
  navigationIcon: {
    ...theme.mixins.kbd(),
  },
  recentSubdockItems: {
    flex: '1 1 auto',
    minHeight: 0,
    overflowY: 'auto',
    borderTop: `1px solid ${theme.border.subtle}`,
    ...theme.mixins.scrollbar(),
  },
});

@injectSheet(styles)
class RecentSubdock extends React.PureComponent<Props> {
  private highlightedItemComponent: BangItem | null;

  constructor(props: Props) {
    super(props);

    if (!props.isCycling && props.recentApplications.length > 0) {
      props.setHighlightedItemId(getId(props.recentApplications[0]));
    }

    this.componentDidUpdate = throttle(this.componentDidUpdate, 100, { leading: false });
  }

  getHighlightedItem = () => findItemById(this.props.highlightedItemId!, this.props.recentApplications);

  previousHighlightedItemIndex(via: SearchPaneItemsListCycleVia) {
    const withCycling = via !== 'keyboard-arrow';
    const item = this.getHighlightedItem();
    const newIndex = this.props.recentApplications.indexOf(item!) - 1;

    if (newIndex < 0) {
      return withCycling ? this.props.recentApplications.length - 1 : null;
    }
    return newIndex;
  }

  nextHighlightedItemIndex(via: SearchPaneItemsListCycleVia) {
    const withCycling = via !== 'keyboard-arrow';
    const item = this.getHighlightedItem();
    const newIndex = this.props.recentApplications.indexOf(item!) + 1;

    if (newIndex >= this.props.recentApplications.length) {
      return withCycling ? 0 : null;
    }
    return newIndex;
  }

  cyclingStep = (index: number | null, direction: SearchPaneItemsListCycleDirection, via: SearchPaneItemsListCycleVia) => {
    if (index === null) return;
    const items = this.props.recentApplications;
    return this.props.cyclingStep(items[index], index, direction, 'subdock', via);
  }

  // tslint:disable-next-line:function-name
  UNSAFE_componentWillMount() {
    this.handleKeyboardShortcuts();
  }

  componentDidMount() {
    this.props.onDidMount();
  }

  componentDidUpdate() {
    const item = findDOMNode(this.highlightedItemComponent);
    if (item) {
      item.scrollIntoView({ behavior: 'smooth' });
    }
  }

  componentWillUnmount() {
    Mousetrap.unbind(['enter', 'tab', 'esc', 'ctrl+esc', 'up', 'down', 'shift+tab']);
    this.props.onWillUnmount();
  }

  handleKeyboardShortcuts() {
    Mousetrap.bind(['enter'], (e) => {
      const { isCycling, recentApplications, highlightedItemId } = this.props;
      e.preventDefault();

      if (isCycling) return;

      const index = recentApplications.findIndex(app => getId(app) === highlightedItemId);

      if (index > -1) {
        const application = recentApplications[index];
        const altKey = e.getModifierState('Alt');
        // Check if the user was using a modifier
        switch (altKey) {
          case false: {
            this.props.selectItem(application, 'keyboard-enter', index);
            break;
          }
        }
      }
    });
    Mousetrap.bind(['ctrl+esc', 'esc'], (e) => {
      e.preventDefault();

      this.props.onEsc();
    });
    Mousetrap.bind(['tab', 'down'], (e) => {
      e.preventDefault();
      if (this.props.isCycling) return;

      const via = e.key === 'Tab' ? 'keyboard-tab' : 'keyboard-arrow';
      this.cyclingStep(this.nextHighlightedItemIndex(via), 'down', via);
    });
    Mousetrap.bind(['shift+tab', 'up'], (e) => {
      e.preventDefault();
      if (this.props.isCycling) return;

      const via = e.key === 'Tab' ? 'keyboard-tab' : 'keyboard-arrow';
      this.cyclingStep(this.previousHighlightedItemIndex(via), 'up', via);
    });
  }

  render() {
    const {
      classes,
      onMouseEnter,
      onMouseLeave,
      recentApplications,
      highlightedItemId,
      selectItem,
      isCycling,
    } = this.props;

    return (
      <div
        className={classes!.recentSubdock}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className={classes!.recentSubdockContent}>
          <div className={classes!.recentSubdockTitle}>
            <div>RECENTS</div>

            <div className={classes!.navigation}>
              <span className={classes!.navigationIcon}>CTRL + TAB</span>
            </div>
          </div>

          <div className={classes!.recentSubdockItems}>
            {recentApplications.map((entry: ActivityEntry, index: number) => {
              const {
                label,
                context,
                imgUrl,
                type,
                themeColor,
              } = entry;
              const isHighLighted = getId(entry) === highlightedItemId;

              return <BangItem
                ctrlTabCycling={isCycling}
                key={getId(entry)}
                label={label}
                context={context!}
                imgUrl={imgUrl!}
                type={type as unknown as SearchPaneItemSelectedItem}
                themeColor={themeColor!}
                // todo change all `highlighted` by `selected`
                selected={isHighLighted}
                onClick={() => selectItem(entry, 'click', index)}
                smallSize={true}
                ref={(itemComp: HTMLDivElement) => {
                  if (isHighLighted) this.highlightedItemComponent = itemComp;
                }}
              />;
            })}
          </div>
        </div>

        <BangBottom ctrlTabCycling={isCycling} smallSize={true} />
      </div>
    );
  }
}

export default withGradient(GradientType.withDarkOverlay)(RecentSubdock);
