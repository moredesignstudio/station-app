import { accentButtonMixin, colors } from '@src/theme';

const styles = {
  header: {
    width: '100%',
  },
  headerBanner: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    padding: '8px 0',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceElevated,
    borderBottom: `1px solid ${colors.borderSubtle}`,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: '30px',
    fontWeight: 500,
    color: colors.textPrimary,
    zIndex: 30,
  },
  downloadLink: {
    ...accentButtonMixin(),
    height: 28,
    lineHeight: '28px',
    marginLeft: 16,
  },
  '@media (max-width: 1279px)': {
    headerBanner: {
      display: 'none',
    },
  },
};

export interface AppStoreHeaderClasses {
  header: string,
  headerBanner: string,
  downloadLink: string,
}

export default styles;
