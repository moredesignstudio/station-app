import { ThemeTypes } from '@getstation/theme';
import { AppRequestStepsInputProps } from '@src/components/AppStoreContent/AppStoreRequest/AppRequestStepsInput/AppRequestStepsInput';

const styles = (theme: ThemeTypes) => ({
  inputWrapper: {
    position: 'relative',
  },
  input: {
    display: 'block',
    appearance: 'none',
    border: 'none',
    boxShadow: (({ error }: AppRequestStepsInputProps) =>
      `inset 0 0 0 1px ${error ? theme.status.danger : theme.border.default}`) as any,
    padding: [0, 12] as any,
    boxSizing: 'border-box',
    borderRadius: theme.radius.md,
    minWidth: 200,
    width: '100%',
    height: 32,
    lineHeight: '32px',
    ...theme.fontMixin(13),
    transition: `box-shadow ${theme.transition.fast}, background-color ${theme.transition.fast}`,
    color: theme.text.primary,
    backgroundColor: theme.fill.subtle,
    '&:disabled': {
      opacity: 0.4,
    },
    '&:focus': {
      outline: 'none',
      boxShadow: (({ error }: AppRequestStepsInputProps) =>
        `inset 0 0 0 1px ${error ? theme.status.danger : theme.accent.border}, ${theme.shadow.focus}`) as any,
    },
    '&::placeholder': {
      color: theme.text.tertiary,
    },
  },
  error: {
    position: 'absolute',
    top: '-20px',
    left: 0,
    fontSize: 12,
    color: theme.status.danger,
  },
});

export interface AppRequestStepsInputClasses {
  inputWrapper: string,
  error: string,
  input: string,
}

export default styles;
