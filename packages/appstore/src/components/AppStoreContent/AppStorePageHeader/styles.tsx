import { colors } from '@src/theme';

const styles = {
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: [32, 45],
    borderBottom: `1px solid ${colors.borderSubtle}`,
    minHeight: 127,
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 60,
    minWidth: 60,
    height: 60,
    borderRadius: '50%',
    overflow: 'hidden',
    marginRight: 31,
  },
  icon: {
    maxWidth: '100%',
    maxHeight: '100%',
  },
  description: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
    lineHeight: '32px',
    letterSpacing: '-0.01em',
    color: colors.textPrimary,
    marginBottom: 6,
    marginTop: 0,
  },
  subTitle: {
    fontSize: 14,
    lineHeight: '20px',
    color: colors.textSecondary,
  },
  '@media (max-width: 599px)': {
    pageHeader: {
      display: 'none',
    },
  },
};

export interface AppStorePageHeaderClasses {
  pageHeader: string,
  content: string,
  iconContainer: string,
  icon: string,
  description: string,
  title: string,
  subTitle: string,
}

export default styles;
