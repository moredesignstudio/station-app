import { accent, border, fill, font, radius, shadow, text, transition } from '@getstation/theme';

import { JSSClasses } from '../../../../types';

export type StylesType = JSSClasses<typeof styles>;
export type IdentitiesStylesType = JSSClasses<typeof identitiesStyle>;

const inputBorder = (color: string) => `inset 0 0 0 1px ${color}`;

export const styles = {
  help: {
    marginBottom: 16,
    fontFamily: font.sans,
    fontSize: 15,
    fontWeight: 600,
    letterSpacing: '-0.01em',
    lineHeight: '1.4em',
    color: text.primary,
  },
  input: {
    display: 'inline-block',
    verticalAlign: 'middle',
    width: 150,
    height: 32,
    padding: [0, 10],
    boxSizing: 'border-box',
    appearance: 'none',
    border: 0,
    borderRadius: radius.md,
    boxShadow: inputBorder(border.default),
    fontFamily: font.sans,
    fontSize: 13,
    color: text.primary,
    backgroundColor: fill.subtle,
    caretColor: accent.default,
    transition: `box-shadow ${transition.fast}, background-color ${transition.fast}`,
    '&:hover:not(:focus)': {
      boxShadow: inputBorder(border.strong),
    },
    '&:focus': {
      outline: 'none',
      backgroundColor: fill.hover,
      boxShadow: `${inputBorder(accent.border)}, ${shadow.focus}`,
    },
    '&::placeholder': {
      color: text.tertiary,
      opacity: 1,
    },
  },
  largeInput: {
    width: 240,
  },
  suffix: {
    marginLeft: 6,
    fontSize: 13,
    color: text.secondary,
    verticalAlign: 'middle',
  },
  subContainer: {
    marginTop: 16,
  },
  withPointer: {
    cursor: 'pointer',
    fontSize: 12,
    lineHeight: '1.4em',
    color: text.secondary,
    transition: `color ${transition.fast}`,
    '&:hover': {
      color: text.primary,
    },
  },
};

export const identitiesStyle = {
  ...styles,
  accountContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  account: {
    width: 240,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    marginBottom: 4,
    padding: [0, 12],
    boxSizing: 'border-box',
    fontSize: 13,
    fontWeight: 500,
    color: text.primary,
    backgroundColor: fill.subtle,
    boxShadow: `inset 0 0 0 1px ${border.subtle}`,
    borderRadius: radius.lg,
    transition: `background-color ${transition.fast}`,
    cursor: 'pointer',

    '&:hover': {
      backgroundColor: fill.hover,
    },
  },

  accountDetail: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    width: 0,
    marginRight: 2,
  },

  accountEmail: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  accountImage: {
    flexShrink: 0,
    width: 18,
    height: 18,
    marginRight: 10,
    border: `1px solid ${border.strong}`,
    borderRadius: '100%',
  },
};
