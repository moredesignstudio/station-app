import { colors } from '@src/theme';
import { AppStorePageCategoryTitleProps } from '@src/components/AppStoreContent/AppStorePageCategoryTitle/AppStorePageCategoryTitle';

const styles = {
  categoryTitle: {
    display: 'inline-flex',
    alignItems: 'center',
    paddingRight: 10,
    paddingBottom: 10,
    marginBottom: ({ subTitle }: AppStorePageCategoryTitleProps) => subTitle ? 6 : 0,
    position: 'relative',
    '&:before': {
      content: '""',
      display: 'block',
      width: 40,
      height: 2,
      position: 'absolute',
      bottom: 0,
      left: 0,
      backgroundColor: colors.accent,
      borderRadius: 1,
    },
  },
  categoryIcon: {
    width: 22,
    minWidth: 22,
    height: 22,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 600,
    lineHeight: '24px',
    letterSpacing: '-0.01em',
    color: colors.textPrimary,
  },
  categorySubtitle: {
    fontSize: 13,
    lineHeight: '18px',
    color: colors.textSecondary,
  },
};

export interface AppStorePageCategoryTitleClasses {
  categoryTitle: string,
  categoryIcon: string,
  categoryName: string,
  categorySubtitle: string,
  resultsContent: string,
}

export default styles;
