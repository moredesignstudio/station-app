import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { Icon, IconSymbol } from '@getstation/theme';
import { colors, radius, shadow, transition } from '@src/theme';
import * as classNames from 'classnames';

const { useState, forwardRef } = React;

const useStyles = createUseStyles({
  container: {
    position: 'relative',
    width: '100%',
    height: 30,
    backgroundColor: colors.fillSubtle,
    boxShadow: `inset 0 0 0 1px ${colors.borderDefault}`,
    borderRadius: radius.md,
    display: 'flex',
    alignItems: 'center',
    color: colors.textPrimary,
    overflow: 'hidden',
    transition: `box-shadow ${transition.fast}, background-color ${transition.fast}`,
    '&:hover': {
      backgroundColor: colors.fillHover,
    },
    '&.isFocused': {
      backgroundColor: colors.fillSubtle,
      boxShadow: `inset 0 0 0 1px ${colors.accentBorder}, ${shadow.focus}`,
    },
  },
  searchIcon: {
    marginLeft: 8,
    flexShrink: 0,
  },
  input: {
    width: '100%',
    flexGrow: 1,
    height: '100%',
    padding: [0, 8],
    fontFamily: 'inherit',
    fontSize: 13,
    color: colors.textPrimary,
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: 0,
    outline: 'none',
    transform: 'translate3d(0,-1px,0)',
    '-webkit-appearance': 'none',
    '&::placeholder': {
      color: colors.textTertiary,
    },
  },
});

type Props = {
  onQueryChange: (query: string) => any,
  query: string,
};

const Search = forwardRef(
({
  onQueryChange,
  query,
}: Props,
 ref: React.Ref<HTMLInputElement>,
) => {
  const classes = useStyles();

  const [isFocused, setFocus] = useState(false);

  const onFocus = () => setFocus(true);
  const onBlur = () => setFocus(false);

  const onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    onQueryChange(value);
  };

  return (
    <div
      className={
        classNames(
          classes!.container,
          { isFocused }
        )
      }
    >
      <Icon
        className={classes!.searchIcon}
        symbolId={IconSymbol.SEARCH}
        size={18}
        color={colors.textTertiary}
      />
      <input
        ref={ref}
        className={classes!.input}
        onFocus={onFocus}
        onBlur={onBlur}
        type="search"
        placeholder="Search an app"
        value={query}
        onChange={onChange}
      />
    </div>
  );
});

export default Search;
