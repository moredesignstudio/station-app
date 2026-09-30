import { ThemeTypes } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import SearchWrapper from '../../bang/BangContainer';
import RecentDockContainer from './RecentDockContainer';
import {
  cyclingStep as bangCyclingStep,
  SearchPaneFormat, SearchPaneItemSelectedVia,
  SearchResultSerialized,
  selectItem as selectBangItem,
  SearchPaneClosedVia,
} from '../../bang/duck';
import { ActivityEntry } from '../../activity/queries@local.gql.generated';

interface Classes {
  container: string,
  brand: string,
}

// The more mail icon at the top of the rail (72px for 2x screens).
// tslint:disable-next-line:no-var-requires
const railIcon: string = require('../../static/icon-rail.png');

interface Props {
  classes?: Classes,
  handleBangWillUnmount: () => any,
  handleBangDidMount: () => any,
  handleRecentDockDidMount: () => any,
  handleRecentDockWillUnmount: () => any,
  ctrlTabCycling: boolean,
  handlePaneEscape: (format: SearchPaneFormat) => any,
  cyclingStep: typeof bangCyclingStep,
  stopCycling: () => any,
  recentApplications: ActivityEntry[],
  selectItem: typeof selectBangItem,
  setHighlightedRecentSubdockItemId: (id?: string) => void,
  highlightedRecentSubdockItemId?: string,
  isRecentSubdockVisible: boolean,
  showRecentSubdock: () => void,
  hideRecentSubdock: (via: SearchPaneClosedVia) => void,
}

const styles = (theme: ThemeTypes) => ({
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: 10,
    // a short hairline under the brand tile
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '50%',
      width: 24,
      marginLeft: -12,
      height: 1,
      backgroundColor: theme.border.default,
    },
  },
  brand: {
    width: 36,
    height: 36,
    borderRadius: 10,
    overflow: 'hidden',
    boxShadow: `0 0 0 1px ${theme.border.default}`,
    transition: `transform ${theme.motion.slow} ${theme.motion.easeSpring}`,
    '&:hover': {
      transform: 'scale(1.06) rotate(-4deg)',
    },
    '& img': {
      display: 'block',
      width: '100%',
      height: '100%',
    },
  },
});

@injectSheet(styles)
export default class DockTopSection extends React.PureComponent<Props, {}> {
  render() {
    const {
      classes, cyclingStep,
      ctrlTabCycling, handlePaneEscape, stopCycling, recentApplications, selectItem,
      handleRecentDockDidMount, handleRecentDockWillUnmount, highlightedRecentSubdockItemId,
      setHighlightedRecentSubdockItemId, isRecentSubdockVisible, showRecentSubdock, hideRecentSubdock,
    } = this.props;

    return (
      <div className={classes!.container}>
        {/* Traffic lights are native now (in the top bar); back / forward live on
            ⌘[ ⌘] and the trackpad swipe. */}
        <div className={classes!.brand} title="more mail">
          <img src={railIcon} alt="more mail" draggable={false} />
        </div>

        <SearchWrapper
          onQuit={() => handlePaneEscape('center-modal')}
        />

        <RecentDockContainer
          cyclingStep={cyclingStep}
          isSubdockVisible={isRecentSubdockVisible}
          showRecentSubdock={showRecentSubdock}
          hideRecentSubdock={hideRecentSubdock}
          highlightedItemId={highlightedRecentSubdockItemId}
          setHighlightedItemId={setHighlightedRecentSubdockItemId}
          recentApplications={recentApplications}
          selectItem={
            (item: SearchResultSerialized, via: SearchPaneItemSelectedVia, position: number) =>
              selectItem(item, position, via, 'subdock')
          }
          ctrlTabCycling={ctrlTabCycling}
          stopCycling={stopCycling}
          onDidMount={handleRecentDockDidMount}
          onWillUnmount={handleRecentDockWillUnmount}
        />
      </div>
    );
  }
}
