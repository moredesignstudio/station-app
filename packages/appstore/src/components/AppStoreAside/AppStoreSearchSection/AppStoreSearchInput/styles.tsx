import { colors, radius, shadow, transition } from '@src/theme';

const styles = {
  container: {
    position: 'relative',
    width: '100%',
  },
  label: {
    width: '100%',
    height: 28,
    backgroundColor: colors.fillSubtle,
    boxShadow: `inset 0 0 0 1px ${colors.borderDefault}`,
    borderRadius: radius.md,
    display: 'flex',
    alignItems: 'center',
    color: colors.textPrimary,
    overflow: 'hidden',
    cursor: 'text',
    transition: `box-shadow ${transition.fast}, background-color ${transition.fast}`,
    '&:hover': {
      backgroundColor: colors.fillHover,
    },
    '&.active-focus': {
      backgroundColor: colors.fillSubtle,
      boxShadow: `inset 0 0 0 1px ${colors.accentBorder}, ${shadow.focus}`,
    },
  },
  searchIcon: {
    width: 14,
    height: 14,
    marginLeft: 8,
    flexShrink: 0,
  },
  autosuggestInput: {
    width: '100%',
    flexGrow: 1,
    height: '100%',
    padding: [0, 6],
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
};

export interface IClasses {
  container: string,
  label: string,
  searchIcon: string,
  input: string,
  autosuggestInput: string,
}

export default styles;
