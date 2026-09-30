import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import { Icon, IconSymbol } from '@getstation/theme';

@injectSheet(theme => ({
  container: {
    position: 'absolute',
    top: 8,
    right: 12,
    zIndex: theme.$zIndexUltime,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    // `.l-webview__tab > div` forces height: 100% in webview.scss; keep the bar at its own height
    height: '36px !important',
    padding: [6, 8],
    backgroundColor: theme.surface.elevated,
    borderRadius: theme.radius.lg,
    boxShadow: theme.shadow.panel,
  },
  searchIcon: {
    flexShrink: 0,
    color: theme.text.tertiary,
  },
  input: {
    flexGrow: 1,
    width: 200,
    height: 24,
    border: 'none',
    outline: 'none',
    padding: [0, 4],
    backgroundColor: 'transparent',
    color: theme.text.primary,
    caretColor: theme.accent.default,
    ...theme.fontMixin(13),
    '&::placeholder': {
      color: theme.text.tertiary,
    },
    '&::selection': {
      backgroundColor: theme.fill.strong,
    },
  },
  number: {
    flexShrink: 0,
    padding: [0, 6],
    lineHeight: '24px',
    whiteSpace: 'nowrap',
    color: theme.text.tertiary,
    ...theme.fontMixin(11),
  },
  separator: {
    flexShrink: 0,
    width: 1,
    height: 16,
    margin: [0, 2],
    backgroundColor: theme.border.subtle,
  },
  closeIcon: {
    flexShrink: 0,
    boxSizing: 'content-box',
    padding: 3,
    borderRadius: theme.radius.md,
    color: theme.text.secondary,
    cursor: 'pointer',
    transition: `background-color ${theme.transition.fast}, color ${theme.transition.fast}`,
    '&:hover': {
      color: theme.text.primary,
      backgroundColor: theme.fill.hover,
    },
  },
}))
export default class TabSearchInput extends PureComponent {
  static propTypes = {
    searchString: PropTypes.string,
    resultsInfo: PropTypes.shape({
      activeMatchOrdinal: PropTypes.number,
      matchesCount: PropTypes.number
    }),
    onSearchStringChange: PropTypes.func,
    onFindNext: PropTypes.func,
    onClose: PropTypes.func,
    inputRef: PropTypes.object,
    classes: PropTypes.object,
  };

  handleKeyDown = (e) => {
    switch (e.key) {
      case 'Enter':
        this.props.onFindNext();
        break;
      case 'Escape':
        this.props.onClose();
        break;
      default:
    }
  }

  handleSearchStringChange = (e) => {
    this.props.onSearchStringChange(e.target.value);
  }

  render() {
    const { resultsInfo, classes } = this.props;
    return (
      <div className={classes.container}>
        <Icon
          color="currentColor"
          size={18}
          symbolId={IconSymbol.SEARCH}
          className={classes.searchIcon}
        />
        <input
          className={classes.input}
          type="text"
          placeholder="Find in page"
          onKeyDown={this.handleKeyDown}
          value={this.props.searchString}
          onChange={this.handleSearchStringChange}
          ref={this.props.inputRef}
        />
        { resultsInfo &&
          <span className={classes.number}>{resultsInfo.activeMatchOrdinal} of {resultsInfo.matchesCount}</span>
        }
        <span className={classes.separator} />
        <Icon
          symbolId={IconSymbol.CROSS}
          size={18}
          color="currentColor"
          className={classes.closeIcon}
          onClick={this.props.onClose}
        />
      </div>
    );
  }
}
