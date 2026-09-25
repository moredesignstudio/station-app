import { ThemeTypes } from '@getstation/theme';
import { accentButtonMixin } from '@src/theme';

const styles = (theme: ThemeTypes) => ({
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
      right: -10,
      width: 286,
      height: 334,
      backgroundImage: 'url(/static/astro-shrug.png)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 286,
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
    color: theme.text.primary,
    textAlign: 'center',
    marginBottom: 32,
  },
  text: {
    marginRight: 5,
  },
  button: {
    ...accentButtonMixin(),
  },
  '@media (max-width: 1023px)': {
    notFoundPage: {
      '&:before': {
        display: 'none',
      },
    },
  },
});

export interface AppStoreSearchNotFoundClasses {
  notFoundPage: string,
  content: string,
  title: string,
  text: string,
  button: string,
}

export default styles;
