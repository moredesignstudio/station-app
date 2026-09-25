import { accentButtonMixin, colors, secondaryButtonMixin } from '@src/theme';
import { AppRequestStepsButtonsClassesProps }
  from '@src/components/AppStoreContent/AppStoreRequest/AppRequestStepsButtons/AppRequestStepsButtons';

const styles = {
  controlsContainer: {
    display: 'flex',
    justifyContent: ({ isOnContinueBtn = true }: AppRequestStepsButtonsClassesProps) =>
      isOnContinueBtn ? 'space-between' : 'center',
  },
  cancelBtn: {
    ...secondaryButtonMixin(),
    width: ({ isOnContinueBtn = true }: AppRequestStepsButtonsClassesProps) =>
      isOnContinueBtn ? 'calc(100%/2 - 7px)' : 'calc(100% - 14px)',
  },
  onContinueBtn: {
    ...accentButtonMixin(),
    width: ({ isOnContinueBtn = true }: AppRequestStepsButtonsClassesProps) =>
      isOnContinueBtn ? 'calc(100%/2 - 7px)' : 'calc(100% - 14px)',
    // `bgColor` lets callers paint a destructive action (see AppDeleteModalBody).
    backgroundColor: ({ bgColor }: AppRequestStepsButtonsClassesProps) => bgColor ? bgColor : colors.accent,
    '&:hover': {
      backgroundColor: ({ bgColor }: AppRequestStepsButtonsClassesProps) => bgColor ? bgColor : colors.accentHover,
      filter: ({ bgColor }: AppRequestStepsButtonsClassesProps) => bgColor ? 'brightness(1.08)' : 'none',
    },
    '&:active': {
      backgroundColor: ({ bgColor }: AppRequestStepsButtonsClassesProps) => bgColor ? bgColor : colors.accentActive,
    },
  },
};

export interface AppRequestStepsButtonsClasses {
  controlsContainer: string,
  cancelBtn: string,
  onContinueBtn: string,
}

export default styles;
