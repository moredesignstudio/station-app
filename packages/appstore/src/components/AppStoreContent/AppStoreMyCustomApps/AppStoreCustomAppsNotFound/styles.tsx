import { accentButtonMixin, colors } from '@src/theme';

const styles = {
  notFoundPage: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    padding: [30, 20],
    '&:before': {
      display: 'block',
      content: '""',
      position: 'absolute',
      bottom: 65,
      right: 30,
      width: 262,
      height: 213,
      backgroundImage: 'url(/static/astro-binoculars.png)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 262,
      backgroundPosition: 'center',
      zIndex: 0,
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 1,
  },
  title: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    fontSize: 20,
    fontWeight: 600,
    lineHeight: '28px',
    letterSpacing: '-0.01em',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 24,
  },
  description: {
    marginBottom: 28,
  },
  text: {
    fontSize: 14,
    lineHeight: '22px',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  redirect: {
    color: colors.accentText,
    cursor: 'pointer',
  },
  button: {
    ...accentButtonMixin(),
  },
  link: {
    textDecoration: 'none',
  },
  '@media (max-width: 1023px)': {
    notFoundPage: {
      '&:before': {
        display: 'none',
      },
    },
  },
};

export interface AppStoreCustomAppsNotFoundClasses {
  notFoundPage: string,
  content: string,
  title: string,
  description: string,
  text: string,
  redirect: string,
  link: string,
}

export default styles;
