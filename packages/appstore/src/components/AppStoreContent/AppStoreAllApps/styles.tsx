import { colors, radius, shadow, transition } from '@src/theme';

const styles = {
  '@keyframes slideRight': {
    from: { transform: 'translateX(-230px)' },
    to: { transform: 'translateX(0)' },
  },
  allAppsSection: {
    display: 'flex',
  },
  categoriesContainer: {
    margin: [0, 70, 0, 0],
    display: 'none',
    visibility: 'hidden',
    height: 0,
  },
  categoriesList: {
    minWidth: 230,
    maxWidth: 230,
    backgroundColor: colors.surfacePanel,
    border: `1px solid ${colors.borderSubtle}`,
    borderLeft: 'none',
    margin: 0,
    padding: [12, 8],
    borderRadius: [0, radius.xl, radius.xl, 0],
    listStyleType: 'none',
    animationName: 'slideRight',
    animationDuration: '.3s',
  },
  categoriesItem: {
    display: 'flex',
    alignItems: 'center',
    padding: [6, 10],
    borderRadius: radius.md,
    marginBottom: 2,
    color: colors.textSecondary,
    cursor: 'pointer',
    transition: `background-color ${transition.fast}, color ${transition.fast}`,
    '&:last-child': {
      marginBottom: 0,
    },
    '&:hover': {
      backgroundColor: colors.fillHover,
      color: colors.textPrimary,
    },
    '&.isActive': {
      backgroundColor: colors.fillSelected,
      color: colors.textPrimary,
      '& $categoryText': {
        fontWeight: 500,
      },
    },
  },
  categoryIcon: {
    width: 20,
    minWidth: 20,
    height: 20,
    alignSelf: 'flex-start',
    marginRight: 8,
  },
  categoryText: {
    fontSize: 13,
    lineHeight: '20px',
    fontWeight: 400,
    color: 'inherit',
  },
  dropDown: {
    width: '100%',
    position: 'fixed',
    top: 126,
    left: 0,
    backgroundColor: colors.surfacePanel,
    borderBottom: `1px solid ${colors.borderSubtle}`,
    boxShadow: shadow.panel,
    zIndex: 10,
  },
  dropDownTitleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: [14, 21],
    cursor: 'pointer',
  },
  dropDownTitle: {
    fontSize: 13,
    fontWeight: 500,
    color: colors.textPrimary,
  },
  dropDownIcon: {
    display: 'inline-block',
    width: 12,
    height: 12,
    color: colors.textSecondary,
    fill: 'currentColor',
    transition: 'transform .3s',
    '&.isActive': {
      transform: 'rotate(180deg)',
      transition: 'transform .3s',
    },
  },
  dropDownCategoriesList: {
    width: '100%',
    maxHeight: 0,
    padding: 0,
    margin: 0,
    listStyleType: 'none',
    overflowY: 'auto',
    transition: 'max-height .3s',
    '&.isActive': {
      maxHeight: 225,
      margin: [0, 0, 16, 0],
      transition: 'max-height .3s',
    },
  },
  dropDownCategoriesItem: {
    padding: [8, 21],
    color: colors.textSecondary,
    cursor: 'pointer',
    transition: `background-color ${transition.fast}, color ${transition.fast}`,
    '&:hover': {
      backgroundColor: colors.fillHover,
      color: colors.textPrimary,
    },
    '&.isActive': {
      backgroundColor: colors.fillSelected,
      color: colors.textPrimary,
    },
  },
  '@media (min-width: 600px)': {
    dropDown: {
      position: 'fixed',
      top: 0,
      left: 200,
      width: 'calc(100% - 200px)',
    },
  },
  '@media (min-width: 1024px)': {
    categoriesContainer: {
      display: 'block',
      visibility: 'visible',
      height: 'auto',
    },
    dropDown: {
      display: 'none',
    },
  },
};

export interface AppStoreAllAppsClasses {
  allAppsSection: string,
  categoriesContainer: string,
  categoriesList: string,
  categoriesItem: string,
  categoryIcon: string,
  categoryText: string,
  dropDown: string,
  dropDownTitleContainer: string,
  dropDownTitle: string,
  dropDownIcon: string,
  dropDownCategoriesList: string,
  dropDownCategoriesItem: string,
  dropDownCategoryText: string,
}

export default styles;
