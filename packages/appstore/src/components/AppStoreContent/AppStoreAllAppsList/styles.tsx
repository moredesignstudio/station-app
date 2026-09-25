import { colors, radius, transition } from '@src/theme';
import { block } from 'csstips';

const categoryNavButton = {
  display: 'none',
  fontSize: 13,
  fontWeight: 500,
  color: colors.textSecondary,
  position: 'relative',
  cursor: 'pointer',
  transition: `color ${transition.fast}`,
  '&:hover': {
    color: colors.textPrimary,
  },
  '&.isHidden': {
    visibility: 'hidden',
  },
};

const chevron = {
  content: '""',
  display: 'block',
  position: 'absolute',
  top: 3,
  width: 3,
  height: 3,
  border: 'solid currentColor',
  borderWidth: [0, 2, 2, 0],
  borderRadius: '1.2px',
  padding: 3,
};

const styles = {
  container: {
    padding: [80, 20, 100, 20],
  },
  resultsContent: {
    padding: [30, 0, 30],
    margin: 0,
    listStyleType: 'none',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  resultsNav: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsNavPrevCategoryBtn: {
    ...categoryNavButton,
    paddingLeft: 20,
    '&:before': {
      ...chevron,
      left: 0,
      transform: 'rotate(135deg)',
    },
  },
  resultsNavNextCategoryBtn: {
    ...categoryNavButton,
    paddingRight: 17,
    '&:after': {
      ...chevron,
      right: 0,
      transform: 'rotate(-45deg)',
    },
  },
  resultsNavScrollBtnContainer: {
    width: 30,
    minWidth: 30,
    height: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: `inset 0 0 0 1px ${colors.borderStrong}`,
    borderRadius: radius.pill,
    color: colors.textSecondary,
    textAlign: 'center',
    cursor: 'pointer',
    transition: `background-color ${transition.fast}, color ${transition.fast}`,
    '&:hover': {
      backgroundColor: colors.fillHover,
      color: colors.textPrimary,
    },
  },
  resultNavScrollBtnIcon: {
    width: 12,
    height: 12,
    fill: 'currentColor',
  },
  '@media (min-width: 600px)': {
    container: {
      padding: [100, 35, 140, 45],
    },
    resultsContent: {
      padding: [40, 0, 50],
    },
  },
  '@media (min-width: 768px)': {
    resultsNav: {
      justifyContent: 'space-between',
    },
    resultsNavPrevCategoryBtn: {
      display: 'block',
    },
    resultsNavNextCategoryBtn: {
      display: 'block',
    },
  },
  '@media (min-width: 1024px)': {
    container: {
      padding: [50, 35, 140, 0],
    },
  },
};

export interface AppStoreAllAppsListClasses {
  container: string,
  resultsContent: string,
  resultsNav: string,
  resultsNavPrevCategoryBtn: string,
  resultsNavNextCategoryBtn: string,
  resultsNavScrollBtnContainer: string,
  resultNavScrollBtnIcon: string,
}

export default styles;
