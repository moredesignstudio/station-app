import { colors, radius, transition } from '@src/theme';

const styles = {
  navButton: {
    listStyleType: 'none',
    minHeight: 28,
    margin: [1, 8],
    padding: [5, 10],
    borderRadius: radius.md,
    color: colors.textSecondary,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    transition: `background-color ${transition.fast}, color ${transition.fast}`,
    '&:hover': {
      backgroundColor: colors.fillHover,
      color: colors.textPrimary,
    },
  },
  activeNavButton: {
    backgroundColor: colors.fillSelected,
    color: colors.textPrimary,
    '&:hover': {
      backgroundColor: colors.fillSelected,
    },
    '& $title': {
      fontWeight: 500,
    },
  },
  content: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    color: 'inherit',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    fontSize: 13,
    fontWeight: 400,
    lineHeight: '18px',
  },
  titleName: {
    marginRight: 4,
  },
  icon: {
    minWidth: 14,
    width: 14,
    height: 14,
    marginRight: 10,
    flexShrink: 0,
    color: 'inherit',
    fill: 'currentColor',
  },
  '@media (min-width: 600px)': {
    navButton: {
      margin: [1, 8],
    },
  },
};

export interface IClasses {
  navButton: string,
  activeNavButton: string,
  content: string,
  title: string,
  titleName: string,
  icon: string,
}

export default styles;
