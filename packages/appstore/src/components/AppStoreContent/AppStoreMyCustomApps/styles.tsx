import { colors, transition } from '@src/theme';

const styles = {
  section: {
    height: '100%',
  },
  container: {
    padding: [30, 20, 0, 20],
  },
  goBackBtn: {
    display: 'inline-block',
    fontSize: 13,
    fontWeight: 500,
    color: colors.textSecondary,
    paddingLeft: 25,
    marginBottom: 30,
    position: 'relative',
    cursor: 'pointer',
    transition: `color ${transition.fast}`,
    '&:hover': {
      color: colors.textPrimary,
    },
    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 3,
      left: 0,
      width: 3,
      height: 3,
      border: 'solid currentColor',
      borderWidth: [0, 2, 2, 0],
      borderRadius: '1.2px',
      padding: 3,
      transform: 'rotate(135deg)',
    },
  },
  stepperContainer: {
    maxWidth: 330,
    minHeight: 450,
    margin: '0 auto',
    overflowX: 'hidden',
    position: 'relative',
  },
  '@media (min-width: 600px)': {
    container: {
      padding: [30, 45, 0, 45],
    },
  },
};

export interface AppStoreMyCustomAppsClasses {
  section: string,
  container: string,
  goBackBtn: string,
  stepperContainer: string,
}

export default styles;
