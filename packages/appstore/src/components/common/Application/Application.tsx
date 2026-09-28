import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { Icon, IconSymbol } from '@getstation/theme';
import ApplicationLogo from '@src/components/common/Application/ApplicationLogo';
import { colors, radius, transition } from '@src/theme';

import { Application as ApplicationType } from '../Application.type';

const useStyles = createUseStyles({
  application: {
    flex: '0 0 290px',
    display: 'flex',
    position: 'relative',
    justifyContent: 'space-between',
    color: colors.textPrimary,
    alignItems: 'center',
    width: 200,
    maxHeight: 42,
    padding: 5,
    marginBottom: 7,
    backgroundColor: 'transparent',
    borderRadius: radius.lg,
    transition: `background-color ${transition.fast}`,
    '&:hover': {
      backgroundColor: colors.fillHover,
    },
    '& > div:nth-child(3)': {
      position: 'fixed',
      '& > div:first-child > div:first-child > div:first-child': {
        backgroundColor: (themeColor: string) => themeColor,
      },
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
  },
  applicationName: {
    display: 'inline-block',
    fontSize: 14,
    fontWeight: 500,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    maxWidth: '15ch',
    '$application:hover &': {
      maxWidth: '10ch !important',
    },
  },
  applicationControls: {
    position: 'absolute',
    right: 3,
    top: 3,
    display: 'flex',
  },
  applicationControlsItem: {
    marginLeft: 10,
  },
  categoryName: {
    fontSize: 11,
    color: colors.textTertiary,
  },
  action: {
    width: 28,
    height: 28,
    flexShrink: 0,
    borderRadius: radius.md,
    backgroundColor: 'transparent',
    color: colors.textTertiary,
    opacity: 0,
    cursor: 'pointer',
    transition: `background-color ${transition.fast}, color ${transition.fast}, opacity ${transition.fast}`,
    '& path': {
      fill: 'currentColor',
    },
    '$application:hover &': {
      opacity: 1,
    },
    '&:hover': {
      backgroundColor: colors.fillActive,
      color: colors.textPrimary,
    },
  },
});

export type Props = ApplicationType & {
  shouldDisplayCategory: boolean,
  onSelect: (applicationId: string) => void,
};

const Application = ({
  id,
  name,
  categoryName,
  iconURL,
  themeColor,
  isExtension,
  shouldDisplayCategory,
  onSelect,
}: Props) => {
  const classes = useStyles(themeColor ?? colors.surfaceElevated);

  const onClick = () => {
    onSelect(id);
  };

  return (
    <div className={classes!.application}>
      <div className={classes!.applicationContent}>
        <ApplicationLogo
          applicationIconURL={iconURL || ''}
          applicationThemeColor={themeColor || 'transparent'}
          applicationIsExtension={Boolean(isExtension)}
        />
        <div className={classes!.applicationDetails}>
          <div className={classes!.applicationNameContainer}>
            <strong className={classes!.applicationName} title={name}>{name}</strong>
          </div>
          {shouldDisplayCategory && Boolean(categoryName) &&
          <div className={classes!.categoryName}>
            {categoryName}
          </div>
          }
        </div>
      </div>
      <div className={classes!.applicationControls}>
        <Icon
          symbolId={IconSymbol.PLUS}
          size={34}
          className={classes!.action}
          onClick={onClick}
        />
      </div>
    </div>
  );
};

export default Application;
