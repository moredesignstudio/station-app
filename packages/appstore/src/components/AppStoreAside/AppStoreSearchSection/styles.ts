import { colors } from '@src/theme';

const styles = {
  searchSection: {
    padding: '25px 20px',
    backgroundColor: 'transparent',
    color: colors.textPrimary,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottom: `1px solid ${colors.borderSubtle}`,
  },
  content: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    color: colors.textPrimary,
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: '-0.01em',
    cursor: 'pointer',
  },
  logo: {
    width: 18,
    height: 20,
    marginRight: 10,
    flexShrink: 0,
  },
  logoText: {
    fontWeight: 600,
    color: colors.textPrimary,
    whiteSpace: 'nowrap',
  },
  burger: {
    width: 20,
    height: 16,
    cursor: 'pointer',
    color: colors.textSecondary,
    fill: 'currentColor',
  },
  '@media (min-width: 600px)': {
    burger: {
      display: 'none',
    },
    searchSection: {
      padding: '18px 12px 14px',
    },
  },
  link: {
    textDecoration: 'none',
  },
};

export interface IClasses {
  searchSection: string,
  content: string,
  title: string,
  logo: string,
  logoText: string,
  burger: string,
  link: string,
}

export default styles;
