import { Icon, IconSymbol, Tooltip } from '@getstation/theme';
import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { colors, radius, shadow, transition } from '@src/theme';
import * as classNames from 'classnames';

const useStyles = createUseStyles({
  main: {
    height: 20,
    width: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    border: 'none',
    backgroundColor: colors.fillActive,
    borderRadius: radius.sm,
    position: 'relative',
    outline: 'none',
    cursor: 'pointer',
    transition: `background-color ${transition.fast}`,
    '&:hover:enabled': {
      backgroundColor: colors.fillSelected,
    },
    '&:disabled': {
      cursor: 'default',
    },
  },
  icon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    '& path': {
      fill: colors.textPrimary,
    },

    '&.disabled': {
      opacity: 0.3,
    },
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: colors.surfaceElevated,
    color: colors.textPrimary,
    borderRadius: radius.md,
    fontSize: 11,
    lineHeight: '16px',
    whiteSpace: 'nowrap',
    top: '-125%',
    padding: [3, 6],
    boxShadow: shadow.tooltip,
  },
});

type SquaredIconProps = {
  icon: IconSymbol,
  tooltip?: string,
  size?: number,
  onClick: () => void,
  disabled?: boolean,
};

const SquaredIcon: React.FunctionComponent<SquaredIconProps> = (
  { icon: symbolId, tooltip, size = 24, onClick, disabled }
) => {
  const classes = useStyles();

  const [showTooltip, setShowTooltip] = React.useState(false);

  return (
    <button
      className={classes!.main}
      onClick={onClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      disabled={disabled}
    >
      {
        tooltip &&
        showTooltip &&
        <Tooltip className={classes!.tooltip}>{tooltip}</Tooltip>
      }
      <Icon
        symbolId={symbolId}
        size={size}
        className={classNames(classes!.icon, { disabled })}
      />
    </button>
  );
};

export default SquaredIcon;
