import { ThemeTypes as Theme } from '@getstation/theme';

export interface SubdockListStyle {
  container: string,
  home: string,
  content: string,
  scrollOverlayTop: string,
  scrollOverlayBottom: string,
  title: string,
  count: string,
  sectionHeader: string,
}

export const subdockListStyle = (theme: Theme) => ({
  container: {
    position: 'relative',
    flex: '1 1 auto',
    padding: 0,
    width: '100%',
    marginBottom: 6,
  },
  home: {
    padding: '6px 0 0',
  },
  content: {
    maxHeight: 200,
    overflowY: 'scroll',
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      width: '100%',
      height: 40,
      pointerEvents: 'none',
      zIndex: 1,
      opacity: 0,
      transition: `opacity ${theme.transition.slow}`,
    },
    '&::before': {
      background: `linear-gradient(${theme.surface.panel}, transparent)`,
    },
    '&::after': {
      bottom: 0,
      background: `linear-gradient(transparent, ${theme.surface.panel})`,
    },
  },
  title: {
    ...theme.mixins.sectionLabel(),
    display: 'flex',
    alignItems: 'center',
    margin: 0,
    padding: '10px 12px 4px',
    lineHeight: '16px',
  },
  count: {
    display: 'inline-block',
    marginLeft: 6,
    padding: '0 6px',
    borderRadius: theme.radius.pill,
    backgroundColor: theme.fill.active,
    color: theme.text.secondary,
    fontSize: 10,
    fontWeight: 600,
    lineHeight: '16px',
    letterSpacing: 0,
  },
  sectionHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scrollOverlayTop: {
    '&::before': {
      opacity: '1 !important',
    },
  },
  scrollOverlayBottom: {
    '&::after': {
      opacity: '1 !important',
    },
  },
});
