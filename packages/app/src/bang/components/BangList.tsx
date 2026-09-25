import { ThemeTypes } from '@getstation/theme';
import * as classNames from 'classnames';
// @ts-ignore: no declaration file
import * as scrollIntoView from 'dom-scroll-into-view';
// @ts-ignore: no declaration file
import * as isBlank from 'is-blank';
import * as React from 'react';
import { findDOMNode } from 'react-dom';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { EMPTY_SECTION, flattenResults, sectionsAlwaysExpanded } from '../api';
import { SearchResultSerialized, SearchSectionSerialized } from '../duck';
import { findItemById, getId } from '../helpers/utils';
import BangItem from './BangItem';

const throttle = require('lodash.throttle');

interface Classes {
  list: string;
  lastOpened: string;
  section: string;
  withResults: string;
  category: string;
  categoryLabel: string;
  results: string;
  loading: string;
  expandSection: string;
  expandSectionIcon: string;
  resultsCount: string;
}

interface CollapseSections {
  [sectionName: string]: { collapsed: boolean };
}

interface State {
  collapseSections: CollapseSections;
}

export interface Props {
  classes?: Classes;
  forEmptyQuery: boolean;
  items: SearchSectionSerialized[];
  historyItems: SearchResultSerialized[];
  highlightedItemId?: string;
  onItemClick: (id: string, position: number) => void;
  onResetHighlightedItem: () => void;
  onCollapseSection: () => void;
}

const shouldShowSection = (item: SearchSectionSerialized) =>
  (item.results && item.results.length > 0) || item.loading;

const sectionAlwaysExpanded = (item: SearchSectionSerialized) =>
  sectionsAlwaysExpanded.includes(item.sectionName);

const getHighlightedItem = (props: Props) =>
  findItemById(props.highlightedItemId!, flattenResults(props.items)) ||
  findItemById(props.highlightedItemId!, props.historyItems);

const itemIsInTopHits = (item: SearchResultSerialized) =>
  item.sectionKind === 'top-hits';

const itemIsCollapsed = (
  item: SearchResultSerialized,
  collapseSections: CollapseSections
) =>
  item.category &&
  collapseSections[item.category] &&
  collapseSections[item.category].collapsed &&
  !itemIsInTopHits(item);

@injectSheet((theme: ThemeTypes) => ({
  list: {
    flex: 1,
    overflowY: 'auto',
    padding: [4, 0],
    ...theme.mixins.scrollbar(),
  },
  lastOpened: {
    ...theme.mixins.sectionLabel(),
    padding: [8, 20, 4],
  },
  section: {
    marginBottom: 8,
    '&.withResults': {
      backgroundColor: 'transparent',
    },
  },
  category: {
    ...theme.mixins.sectionLabel(),
    margin: 0,
    padding: [8, 20, 4],
    display: 'flex',
    flexFlow: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: `color ${theme.transition.fast}`,
    '&.clickable': {
      cursor: 'pointer',
    },
    '&.clickable:hover': {
      color: theme.text.secondary,
    },
  },
  categoryLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
  },
  results: {
    marginTop: 4,
    '&.collapsed': {
      height: 0,
      overflow: 'hidden',
    },
  },
  loading: {
    animationDuration: '2s',
    animationFillMode: 'forwards',
    animationIterationCount: 'infinite',
    animationName: 'bangLoading',
    animationTimingFunction: 'ease-in-out',
    opacity: 0.3,
    marginRight: 5,
  },
  expandSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  expandSectionIcon: {
    display: 'block',
    fill: theme.text.tertiary,
    transform: 'rotate(90deg)',
    transition: `transform ${theme.transition.fast}`,
    '&.collapsed': {
      transform: 'rotate(0deg)',
    },
  },
  resultsCount: {
    display: 'inline-block',
    backgroundColor: theme.fill.active,
    borderRadius: theme.radius.pill,
    color: theme.text.secondary,
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: 0,
    lineHeight: '14px',
    padding: [1, 6],
    width: 'auto',
    textAlign: 'center',
  },
  '@keyframes bangLoading': {
    '0%': {
      backgroundPosition: '10% 0%',
      opacity: 0.3,
    },
    '50%': {
      backgroundPosition: '91% 100%',
      opacity: 0.5,
    },
    '100%': {
      backgroundPosition: '10% 0%',
      opacity: 0.3,
    },
  },
}))
export default class BangList extends React.PureComponent<Props, State> {
  private highlightedItemComponent: Element | null;

  constructor(props: Props) {
    super(props);

    this.componentDidUpdate = throttle(this.componentDidUpdate, 100, {
      leading: false,
    });
    this.toggleCollapse = this.toggleCollapse.bind(this);
    this.isCollapsedResults = this.isCollapsedResults.bind(this);
    this.renderSectionTitle = this.renderSectionTitle.bind(this);
    this.renderArrow = this.renderArrow.bind(this);
  }

  componentDidMount() {
    this.setState({
      collapseSections: this.props.items.reduce((state, item) => {
        state[item.sectionName] = { collapsed: true };
        return state;
      }, {}),
    });
  }

  // tslint:disable-next-line:function-name
  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const { forEmptyQuery } = nextProps;
    if (forEmptyQuery) return;
    if (!this.state) return;

    const { collapseSections } = this.state;

    const nextCollapseSectionsState = nextProps.items.reduce(
      (collapseSectionsNewState, item) => {
        if (
          collapseSections[item.sectionName] &&
          !collapseSections[item.sectionName].collapsed
        ) {
          return collapseSectionsNewState;
        }
        collapseSectionsNewState[item.sectionName] = { collapsed: true };
        return collapseSectionsNewState;
      },
      {},
    );

    this.updateCollapsedSections(nextCollapseSectionsState);
  }

  componentDidUpdate(_: Props, prevState: State) {
    const highlightedItem = getHighlightedItem(this.props);
    if (!highlightedItem) return;

    if (
      prevState &&
      !itemIsCollapsed(highlightedItem, prevState.collapseSections) &&
      itemIsCollapsed(highlightedItem, this.state.collapseSections)
    ) {
      this.props.onResetHighlightedItem();
      return;
    }

    const { forEmptyQuery } = this.props;
    const highlightedItemIsCollapsed = itemIsCollapsed(
      highlightedItem,
      this.state.collapseSections
    );

    if (!forEmptyQuery && highlightedItemIsCollapsed) {
      this.expandSectionForSearchResult(highlightedItem);
    }

    if (forEmptyQuery && !isBlank(this.state.collapseSections)) {
      this.setState({ collapseSections: {} });
    }

    if (this.highlightedItemComponent) {
      scrollIntoView(
        findDOMNode(this.highlightedItemComponent),
        findDOMNode(this),
        { onlyScrollIfNeeded: true }
      );
    }
  }

  expandSectionForSearchResult(item: SearchResultSerialized) {
    this.updateCollapsedSections({ [item!.category]: { collapsed: false } });
  }

  toggleCollapse(item: SearchSectionSerialized) {
    const nextCollapseState =
      this.state.collapseSections[item.sectionName] &&
      !this.state.collapseSections[item.sectionName].collapsed;

    this.props.onCollapseSection();
    this.updateCollapsedSections({
      [item.sectionName]: { collapsed: nextCollapseState },
    });
  }

  isCollapsedResults(item: SearchSectionSerialized) {
    if (!Boolean(this.state)) return false;

    const shouldNotCollapseFromState =
      this.state.collapseSections[item.sectionName] &&
      !this.state.collapseSections[item.sectionName].collapsed;

    if (shouldNotCollapseFromState) return false;

    return !sectionAlwaysExpanded(item);
  }

  renderSectionTitle(item: SearchSectionSerialized) {
    const { classes } = this.props;
    const clickable =
      !sectionAlwaysExpanded(item) && item.results && item.results.length > 0;
    const collapsed = this.isCollapsedResults(item);
    const showResultPart =
      !item.loading && item.results && !sectionAlwaysExpanded(item);

    return (
      <h4
        className={classNames(classes!.category, { clickable, collapsed })}
        onClick={() => this.toggleCollapse(item)}
      >
        <span className={classes!.categoryLabel}>
          {item.sectionName}
          {showResultPart && <span className={classes!.resultsCount}>{item.results!.length}</span>}
        </span>
        <div className={classes!.expandSection}>
          {item.loading && <span className={classes!.loading}>loading</span>}

          {showResultPart && <span>{this.renderArrow(item)}</span>}
        </div>
      </h4>
    );
  }

  renderArrow(item: SearchSectionSerialized) {
    const { classes } = this.props;

    return (
      <svg
        className={classNames(classes!.expandSectionIcon, {
          collapsed: this.isCollapsedResults(item),
        })}
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 24 24"
      >
        <path d="M8.122 24l-4.122-4 8-8-8-8 4.122-4 11.878 12z" />
      </svg>
    );
  }

  renderItem(item: SearchResultSerialized, position: number) {
    const { highlightedItemId, forEmptyQuery } = this.props;
    const id = getId(item);
    const highlighted = highlightedItemId === id;

    return (
      <BangItem
        current={forEmptyQuery && position === 0}
        key={id}
        label={item.label}
        context={item.context}
        imgUrl={item.imgUrl}
        type={item.type}
        themeColor={item.themeColor!}
        // todo change all `highlighted` by `selected`
        selected={highlighted}
        ref={(itemComp: Element) => {
          if (highlighted) this.highlightedItemComponent = itemComp;
        }}
        onClick={() => this.props.onItemClick(id, position)}
      />
    );
  }

  render() {
    const { classes, items, historyItems, forEmptyQuery } = this.props;

    return (
      <div className={classes!.list}>
        {forEmptyQuery ? (
          <>
            <>
              <div className={classes!.lastOpened}>CURRENT</div>
              {historyItems.length > 0
                ? this.renderItem(historyItems[0], 0)
                : null}
            </>

            <div className={classes!.lastOpened}>RECENTS</div>
            <div className={classNames(classes!.section)}>
              <div className={classNames(classes!.results)}>
                {historyItems.map((result, position) => {
                  if (forEmptyQuery && position === 0) return null;
                  return this.renderItem(result, position);
                })}
              </div>
            </div>
          </>
        ) : (
          items.some(i => i.sectionKind === 'top-hits') &&
          items.filter(shouldShowSection).map(item => (
            <div
              className={classNames(classes!.section, {
                withResults: item.sectionName !== EMPTY_SECTION,
              })}
              key={item.sectionName}
            >
              {item.sectionName === EMPTY_SECTION
                ? null
                : this.renderSectionTitle(item)}

              {!this.isCollapsedResults(item) && (
                <div
                  className={classNames(classes!.results, {
                    collapsed: this.isCollapsedResults(item),
                  })}
                >
                  {item.results
                    ? item.results.map((result, position) => {
                      if (forEmptyQuery && position === 0) {
                        return null;
                      }
                      return this.renderItem(result, position);
                    })
                    : null}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    );
  }

  private updateCollapsedSections(state: CollapseSections) {
    this.setState({
      collapseSections: { ...this.state.collapseSections, ...state },
    });
  }
}
