import * as React from 'react';
import {
  SearchPaneItemSelectedVia,
  cyclingStep, SearchPaneClosedVia,
} from '../../bang/duck';
import { Manager, Reference, Popper } from 'react-popper';
import * as PopperJS from 'popper.js';

import { ActivityEntry } from '../../activity/queries@local.gql.generated';

import RecentSubdock, { Props as RecentSubdockProps } from './RecentSubdock';
interface OwnProps {
  highlightedItemId?: string,
  setHighlightedItemId: (bxResourceId?: string) => void,
  recentApplications: ActivityEntry[],
  selectItem: RecentSubdockProps['selectItem'],
  onDidMount: () => void,
  onWillUnmount: () => void,
  cyclingStep: typeof cyclingStep,
  stopCycling: () => void,
  ctrlTabCycling: boolean,
  isSubdockVisible: boolean,
  showRecentSubdock: () => void,
  hideRecentSubdock: (via: SearchPaneClosedVia) => void,
}

type Props = OwnProps;

interface State {
  isHover: boolean,
}

class RecentDockContainer extends React.PureComponent<Props, State> {

  private static popperModifiers: PopperJS.Modifiers = {
    preventOverflow: { enabled: true, boundariesElement: 'viewport' },
    offset: { offset: '0, 8' },
    computeStyle: { gpuAcceleration: false },
  };

  timeoutSubdock: NodeJS.Timer | null = null;

  onOverStateChange = (isHover: boolean) => {
    if (this.timeoutSubdock !== null) {
      clearTimeout(this.timeoutSubdock);
      this.timeoutSubdock = null;
    }
    if (isHover) {
      this.timeoutSubdock = setTimeout(() => {
        this.props.showRecentSubdock();
      }, 300);
    } else {
      this.timeoutSubdock = setTimeout(() => {
        this.props.hideRecentSubdock('mouse-leave');
      }, 200);
    }
  }

  handleSelectItem = (item: ActivityEntry, via: SearchPaneItemSelectedVia, position: number) => {
    this.props.hideRecentSubdock('item-selected');
    this.props.selectItem(item, via, position);
  }

  onEsc = () => {
    this.props.hideRecentSubdock('keyboard-esc');
    this.props.stopCycling();
  }

  render() {
    const {
      recentApplications, onWillUnmount, onDidMount,
      ctrlTabCycling, highlightedItemId, setHighlightedItemId,
      isSubdockVisible,
    } = this.props;

    const shouldDisplaySubdock = isSubdockVisible || ctrlTabCycling;

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <div ref={ref}>
              {/* No recents button in the rail any more; this empty anchor
                  places the list that Ctrl+Tab cycling still shows. */}
            </div>
          )}

        </Reference>

        <Popper placement="right-start" modifiers={RecentDockContainer.popperModifiers}>
          {({ ref, style, placement }) => (
            <div ref={ref} style={style} data-placement={placement}>
              {shouldDisplaySubdock &&
                <RecentSubdock
                  selectItem={this.handleSelectItem}
                  onDidMount={onDidMount}
                  onWillUnmount={onWillUnmount}
                  onMouseEnter={() => this.onOverStateChange(true)}
                  onMouseLeave={() => this.onOverStateChange(false)}
                  onEsc={this.onEsc}
                  recentApplications={recentApplications}
                  setHighlightedItemId={setHighlightedItemId}
                  highlightedItemId={highlightedItemId}
                  cyclingStep={this.props.cyclingStep}
                  isCycling={ctrlTabCycling}
                />
              }
            </div>
          )}
        </Popper>
      </Manager>
    );
  }
}

export default RecentDockContainer;
