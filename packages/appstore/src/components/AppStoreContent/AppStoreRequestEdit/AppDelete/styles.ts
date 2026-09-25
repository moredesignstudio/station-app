import { colors, transition } from '@src/theme';

const styles = {
  stepContainer: {
    maxWidth: 300,
    width: '100%',
    marginBottom: 42,
  },
  subTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: colors.textPrimary,
    marginBottom: 10,
  },
  deleteButton: {
    display: 'inline-flex',
    alignItems: 'center',
    marginLeft: -5,
    cursor: 'pointer',
    color: colors.textSecondary,
    transition: `color ${transition.fast}`,
    '& > svg': {
      transition: `fill ${transition.fast}`,
    },
    '&:hover': {
      color: colors.danger,
    },
    '&:hover > svg': {
      fill: colors.danger,
    },
  },
  deleteButtonText: {
    fontSize: 12,
    fontWeight: 600,
  },
};

export interface DeleteClasses {
  stepContainer: string,
  subTitle: string,
  deleteButton: string,
  deleteButtonText: string,
}

export default styles;
