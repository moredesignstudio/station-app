import { colors, radius, shadow, transition } from '@src/theme';
import { applicationNameMaxWidth } from '@src/shared/constants/constants';

import { AppStoreApplicationProps } from './AppStoreApplication';

const styles = {
  application: {
    flex: '0 0 291px',
    display: 'flex',
    justifyContent: 'space-between',
    color: colors.textPrimary,
    alignItems: 'center',
    width: ({ alternate }: AppStoreApplicationProps) => alternate ? null : 291,
    marginBottom: 27,
    padding: [8, 10],
    backgroundColor: 'transparent',
    borderRadius: radius.lg,
    transition: `background-color ${transition.fast}`,
    '&:hover': {
      backgroundColor: ({ alternate }: AppStoreApplicationProps) => alternate ? colors.fillHover : 'transparent',
    },
  },
  applicationContent: {
    display: 'flex',
    alignItems: 'center',
  },
  applicationDetails: {
    maxWidth: 190,
  },
  applicationNameContainer: {
    display: 'inline-block',
    '&.applicationNamePopup': {
      position: 'relative',
      '&:after': {
        content: ({ application }: AppStoreApplicationProps) => `'${application.name}'`,
        display: 'block',
        position: 'absolute',
        top: -24,
        left: 0,
        backgroundColor: colors.surfaceElevated,
        fontSize: 11,
        fontWeight: 400,
        lineHeight: '16px',
        letterSpacing: 0,
        whiteSpace: 'nowrap',
        color: colors.textPrimary,
        padding: [3, 6],
        borderRadius: radius.md,
        boxShadow: shadow.tooltip,
        visibility: 'hidden',
        transition: 'visibility .2s',
        zIndex: 1,
      },
      '&:hover:after': {
        visibility: 'visible',
        transition: 'visibility .2s',
      },
    },
  },
  applicationName: {
    display: 'inline-block',
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '20px',
    maxWidth: applicationNameMaxWidth,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  applicationControls: {
    display: 'flex',
    alignItems: 'center',
  },
  applicationControlsItem: {
    marginRight: 6,
  },
  categoryName: {
    fontSize: 12,
    lineHeight: '16px',
    color: colors.textTertiary,
  },
  action: {
    flexShrink: 0,
    borderRadius: radius.md,
    backgroundColor: 'transparent',
    color: colors.textTertiary,
    opacity: 0,
    display: 'none',
    cursor: 'pointer',
    transition: `background-color ${transition.fast}, color ${transition.fast}, opacity ${transition.fast}`,
    '& path': {
      fill: 'currentColor',
    },
    '$application:hover &': {
      display: 'block',
      opacity: 1,
    },
    '&:hover': {
      display: 'block',
      backgroundColor: colors.fillActive,
      color: colors.textPrimary,
    },
  },
  '@media (min-width: 600px)': {
    application: {
      marginBottom: ({ marginBottom }: AppStoreApplicationProps) => marginBottom ? marginBottom : 14,
    },
  },
};

export interface AppStoreApplicationClasses {
  application: string,
  applicationContent: string,
  applicationDetails: string,
  applicationNameContainer: string,
  applicationName: string,
  applicationControls: string,
  applicationControlsItem: string,
  categoryName: string,
  action: string,
}

export default styles;
