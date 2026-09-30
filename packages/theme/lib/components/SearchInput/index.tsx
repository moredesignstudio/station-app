import { Icon, IconSymbol } from '../Icon';
import * as Mousetrap from 'mousetrap';
import * as React from 'react';
import { DebounceInput } from 'react-debounce-input';
import injectSheet, { WithSheet } from 'react-jss';
import { createStyles, ThemeTypes } from '../../types';

export interface OwnProps {
  placeholder: string,
  value: string,
  onChange: (value: string) => any,
  autofocus?: boolean,
}

const styles = (theme: ThemeTypes) => createStyles({
  container: {
    padding: [0, 8] as any,
    height: 36,
    borderRadius: theme.radius.md,
    width: '100%',
    maxWidth: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: theme.text.primary,
    overflow: 'hidden',
    backgroundColor: theme.fill.subtle,
    boxShadow: `inset 0 0 0 1px ${theme.border.default}`,
    transition: `box-shadow ${theme.transition.fast}, background-color ${theme.transition.fast}`,
    '&:hover': {
      boxShadow: `inset 0 0 0 1px ${theme.border.strong}`,
    },
    '&:focus-within': {
      backgroundColor: theme.fill.hover,
      boxShadow: `inset 0 0 0 1px ${theme.accent.border}, ${theme.shadow.focus}`,
    },
  },
  icon: {
    fill: theme.text.tertiary,
    width: 22,
    height: 22,
    flexShrink: 0,
  },
  input: {
    border: 'none',
    outline: 'none',
    flexGrow: 1,
    height: '100%',
    fontFamily: theme.font.sans,
    fontSize: 13,
    color: theme.text.primary,
    backgroundColor: 'transparent',
    caretColor: theme.accent.default,
    '&::placeholder': {
      color: theme.text.tertiary,
    },
    '&::-webkit-search-cancel-button': {
      appearance: 'none',
    },
  },
});

type Props = OwnProps & WithSheet<typeof styles>;

class SearchInputImpl extends React.PureComponent<Props, {}> {
  inputRef: any;

  constructor(props: Props) {
    super(props);

    this.inputRef = React.createRef();
  }

  componentWillMount() {
    Mousetrap.bind('mod+f', (e: any) => {
      if (this.inputRef) {
        e.preventDefault();
        this.inputRef.current.focus();
      }
    }, 'keydown');
  }

  componentWillUnmount() {
    Mousetrap.unbind('mod+f');
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChange(e.target.value);
  }

  render() {
    const { classes, placeholder, value, autofocus } = this.props;

    return (
      <div className={classes.container}>
        <Icon symbolId={IconSymbol.SEARCH} size={22} className={classes.icon} />

        <DebounceInput
          minLength={0}
          debounceTimeout={150}
          className={classes.input}
          autoFocus={autofocus}
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={this.handleInputChange}
          ref={this.inputRef}
        />
      </div>
    );
  }
}

export const SearchInput = injectSheet(styles)(SearchInputImpl);
