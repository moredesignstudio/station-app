import { theme } from '../../jss';
import classNames from 'classnames';
import * as React from 'react';
import injectSheet, { WithSheet } from 'react-jss';
import { IgnoreJSSNested } from '../../types';

export enum InputSize {
  BIG, NORMAL, SMALL, XSMALL, XXSMALL,
}

export enum InputType {
  TEXT = 'text',
  PASSWORD = 'password',
}

interface OwnProps {
  sheet?: any,
  className?: string,
  inputClassName?: string,
  inputSize?: InputSize,
  forceHeader?: boolean, // default to true
  label?: string,
  error?: string,
  onValueChange?: (value: string, event: React.FormEvent<HTMLInputElement>) => any,
  refInput?: (inputEl: HTMLInputElement) => any,
}

const borderFor = (color: string) => `inset 0 0 0 1px ${color}`;

const styles = {
  container: {
    maxWidth: 500,
  },
  input: {
    display: 'block',
    appearance: 'none',
    border: 'none',
    boxShadow: (({ error }: OwnProps) =>
      error ? borderFor(theme.status.dangerBorder) : borderFor(theme.border.default)) as any,
    padding: [0, 10] as any,
    boxSizing: 'border-box',
    borderRadius: theme.radius.md,
    minWidth: 200,
    width: '100%',
    height: 32,
    lineHeight: '32px',
    ...theme.fontMixin(13, 400),
    transition: `box-shadow ${theme.transition.fast}, background-color ${theme.transition.fast}`,
    color: theme.text.primary,
    backgroundColor: theme.fill.subtle,
    caretColor: theme.accent.default,
    '&:hover:not(:disabled):not(:focus)': {
      boxShadow: (({ error }: OwnProps) =>
        error ? borderFor(theme.status.dangerBorder) : borderFor(theme.border.strong)) as any,
    },
    '&:disabled': {
      opacity: 0.4,
    },
    '&:focus': {
      outline: 'none',
      backgroundColor: theme.fill.hover,
      boxShadow: (({ error }: OwnProps) =>
        error
          ? `${borderFor(theme.status.danger)}, 0 0 0 2px ${theme.status.dangerSubtle}`
          : `${borderFor(theme.accent.border)}, ${theme.shadow.focus}`) as any,
    },
    '&::-webkit-input-placeholder': {
      color: theme.text.tertiary,
    },
  },
  inputXSmall: {
    height: 24,
    lineHeight: '24px',
    fontSize: 12,
  },
  inputXXSmall: {
    height: 20,
    lineHeight: '20px',
    fontSize: 11,
    padding: '0 8px',
  },
  inputSmall: {
    height: 28,
    lineHeight: '28px',
    fontSize: 12,
  },
  inputBig: {
    fontSize: 14,
    height: 38,
    lineHeight: '38px',
    padding: '0 12px',
    borderRadius: theme.radius.lg,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  label: {
    display: 'block',
    margin: [0, 0, 6, 0] as any,
    ...theme.fontMixin(12, 500),
    color: (({ error }: OwnProps) => error ? theme.status.danger : theme.text.secondary) as any,
  },
  error: {
    ...theme.fontMixin(11, 500),
    color: theme.status.danger,
    textAlign: 'right',
    padding: [0, 0, 6, 10] as any,
  },
};

type Props = OwnProps & WithSheet<IgnoreJSSNested<typeof styles>, {}> & React.HTMLProps<HTMLInputElement>;

class InputImpl extends React.Component<Props, {}> {

  public static defaultProps: Partial<Props> = {
    forceHeader: true,
    inputSize: InputSize.NORMAL,
    refInput: () => {},
  };

  constructor(props: Props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: React.FormEvent<HTMLInputElement>) {
    const { onChange, onValueChange } = this.props;
    const value = event.currentTarget.value;
    if (onChange) onChange(event);
    if (onValueChange) onValueChange(value, event);
  }

  renderHeader() {
    const { classes, label, error, forceHeader } = this.props;
    if (!forceHeader && !label && !error) return null;

    return (
      <div className={classes!.header}>
        {label ?
          <label className={classes!.label}>{label}</label>
          :
          <label className={classes!.label}>&nbsp;</label>
        }

        {error &&
        <span className={classes!.error}>{error}</span>
        }
      </div>
    );
  }

  render() {
    const { classes, inputClassName, className, inputSize, label, error, refInput,
            forceHeader, onValueChange, ...inputProps } = this.props;

    const sizeClassNames = {
      [InputSize.XXSMALL]: classes!.inputXXSmall,
      [InputSize.XSMALL]: classes!.inputXSmall,
      [InputSize.SMALL]: classes!.inputSmall,
      [InputSize.NORMAL]: '',
      [InputSize.BIG]: classes!.inputBig,
    };

    const _inputClassName = classNames(classes!.input, sizeClassNames[inputSize!], inputClassName);

    return (
      <div className={classNames(classes!.container, className)}>
        {this.renderHeader()}
        <input ref={refInput} className={_inputClassName} onChange={this.handleChange} {...inputProps}>
          {this.props.children}
        </input>
      </div>
    );
  }
}

export const Input = injectSheet(styles as IgnoreJSSNested<typeof styles>)(InputImpl);
