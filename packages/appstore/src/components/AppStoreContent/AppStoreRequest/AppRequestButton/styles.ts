import { ThemeTypes } from '@getstation/theme';

const styles = (theme: ThemeTypes) => ({
  appRequestTooltip: {
    width: 100,
    borderRadius: theme.radius.md,
    backgroundColor: theme.surface.elevated,
    boxShadow: theme.shadow.tooltip,
    color: theme.text.primary,
    position: 'absolute',
    right: 60,
    padding: [6, 0, 8],
    top: 2,
    display: 'none',
    '&.visible': {
      display: 'block',
    },
  },
  addAppBtn: {
    cursor: 'pointer',
    '&.addAppBtn_small': {
      padding: [0, 21],
    },
    '&.addAppBtn_big': {
      padding: [0, 31],
    },
  },
  addAppPlusIcon: {
    verticalAlign: 'middle',
    marginLeft: -5,
  },
});

export interface IClasses {
  appRequestTooltip: string,
  addAppBtn: string,
  addAppPlusIcon: string,
}

export default styles;
