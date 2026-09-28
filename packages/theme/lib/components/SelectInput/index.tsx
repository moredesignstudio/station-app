import React from 'react';
import Select, { components } from 'react-select';
import injectSheet, { WithSheet } from 'react-jss';
import { OptionProps } from 'react-select/src/components/Option';
import { NoticeProps } from 'react-select/src/components/Menu';
import { InputActionMeta } from 'react-select/src/types';

import { theme } from '../../jss';
import { IgnoreJSSNested } from '../../types';
import { RoundPicture } from '../RoundPicture';

const styles = {
  roundPicture: {
    marginRight: 10,
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
  select: {
    '& > div:first-child': {
      boxShadow: (({ error }: OwnProps) =>
        error ? `inset 0 0 0 1px ${theme.status.dangerBorder}` : `inset 0 0 0 1px ${theme.border.default}`) as any,
    },
  },
};

const customStyles = {
  container: (provided: any, _state: any) => ({
    ...provided,
    minWidth: 200,
    fontFamily: theme.font.sans,
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    minHeight: 32,
    borderRadius: theme.radius.md,
    fontSize: 13,
    fontWeight: 400,
    border: 'none',
    boxShadow: state.isFocused
      ? `inset 0 0 0 1px ${theme.accent.border}, ${theme.shadow.focus}`
      : `inset 0 0 0 1px ${state.menuIsOpen ? theme.border.strong : theme.border.default}`,
    color: theme.text.primary,
    backgroundColor: state.isFocused ? theme.fill.hover : theme.fill.subtle,
    cursor: 'pointer',
    transition: `box-shadow ${theme.transition.fast}, background-color ${theme.transition.fast}`,
    '&:hover': {
      boxShadow: `inset 0 0 0 1px ${theme.border.strong}`,
    },
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: '0 10px',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: theme.text.primary,
  }),
  input: (provided: any) => ({
    ...provided,
    color: theme.text.primary,
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: theme.text.tertiary,
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  indicatorsContainer: (provided: any) => ({
    ...provided,
  }),
  dropdownIndicator: (provided: any, state: any) => ({
    ...provided,
    padding: '0 8px',
    color: state.isFocused ? theme.text.primary : theme.text.tertiary,
    '&:hover': {
      color: theme.text.primary,
    },
  }),
  clearIndicator: (provided: any) => ({
    ...provided,
    color: theme.text.tertiary,
    '&:hover': {
      color: theme.text.primary,
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    marginTop: 4,
    backgroundColor: theme.surface.elevated,
    border: 'none',
    boxShadow: theme.shadow.panel,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    zIndex: theme.$zIndexSupra,
  }),
  menuList: (provided: any) => ({
    ...provided,
    padding: 4,
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: 13,
    padding: '6px 10px',
    borderRadius: theme.radius.sm,
    color: theme.text.primary,
    backgroundColor: state.isSelected
      ? theme.fill.selected
      : state.isFocused ? theme.fill.hover : 'transparent',
    '&:active': {
      backgroundColor: theme.fill.active,
    },
  }),
  noOptionsMessage: (provided: any) => ({
    ...provided,
    fontSize: 13,
    color: theme.text.secondary,
  }),
};

interface OwnProps {
  options: SelectInputOption[],
  value: SelectInputOption | null,
  inputValue?: string,
  onChange: (option: SelectInputOption) => void,
  onInputChange?: (value: string, action: InputActionMeta) => void,
  placeholder?: string,
  noOptionsMessage?: string,
  className?: string,
  label?: string,
  error?: string,
  forceHeader?: boolean,
}

export interface SelectInputOption {
  value: string,
  label: string,
  picture?: string,
}

type ValueType<T> = T | ReadonlyArray<T> | null | undefined;

type Props = OwnProps & WithSheet<IgnoreJSSNested<typeof styles>, {}>;

class SelectInputImpl extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  handleChange = (selectedOption: ValueType<SelectInputOption>) => {
    if (!selectedOption || Array.isArray(selectedOption)) return;

    // @ts-ignore TS not able to recognize selectedOption is not a ReadOnlyArray
    // https://github.com/microsoft/TypeScript/issues/17002
    this.props.onChange(selectedOption);
  }

  renderOption = (componentProps: OptionProps<SelectInputOption, false>) => {
    const { data } = componentProps;
    const { classes } = this.props;

    return (
      <components.Option {...componentProps}>
        {data.picture &&
          <RoundPicture
            className={classes.roundPicture}
            item={data}
            size={22}
            borderColor="transparent"
          />
        }
        <div>{data.label}</div>
      </components.Option>
    );
  }

  renderNoOptionsMessage = (componentProps: NoticeProps<SelectInputOption, false>) => {
    const { noOptionsMessage } = this.props;

    return (
      <components.NoOptionsMessage {...componentProps}>
        <p>{noOptionsMessage || 'No options'}</p>
      </components.NoOptionsMessage>
    );
  }

  renderHeader() {
    const { classes, label, error, forceHeader } = this.props;
    if (!forceHeader && !label && !error) return null;

    return (
      <div className={classes!.header}>
        {label
          ? <label className={classes!.label}>{label}</label>
          : <label className={classes!.label}>&nbsp;</label>
        }

        {error &&
        <span className={classes!.error}>{error}</span>
        }
      </div>
    );
  }

  render() {
    const { classes, className, options, placeholder, value } = this.props;

    return (
      <div className={className}>
        {this.renderHeader()}
        <Select<SelectInputOption>
          className={classes.select}
          placeholder={placeholder}
          value={value}
          inputValue={this.props.inputValue}
          onChange={this.handleChange}
          onInputChange={this.props.onInputChange}
          options={options}
          styles={customStyles}
          components={{
            Option: this.renderOption,
            NoOptionsMessage: this.renderNoOptionsMessage,
          }}
        />
      </div>
    );
  }
}

export const SelectInput = injectSheet(
  styles as IgnoreJSSNested<typeof styles>
)(SelectInputImpl) as React.ComponentType<OwnProps>;
