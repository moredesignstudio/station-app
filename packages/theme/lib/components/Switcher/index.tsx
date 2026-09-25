import classNames = require('classnames');
import * as React from 'react';
import injectSheet, { CSSProperties, WithSheet } from 'react-jss';
import * as shortid from 'shortid';
import { theme } from '../../jss';
import { IgnoreJSSNested } from '../../types';
import { Tooltip } from '../Tooltip';

export enum TEXT {
  ON_OFF,
  YES_NO,
}

interface OwnProps {
  disabledHint?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => any;
  text?: TEXT;
  disabled?: boolean;
}

const TRACK_WIDTH = 34;
const TRACK_HEIGHT = 20;
const KNOB = 16;

const transition = {
  transition: `all ${theme.transition.normal}`,
};

/**
 * A compact iOS / Notion style toggle. The on/off wording is kept in the DOM
 * for accessibility but is visually hidden.
 */
const styles = {
  hint: {
    width: 'initial',
    maxWidth: 200,
    marginTop: 20,
    marginRight: 5,
  },
  switcher: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  button: ((props: OwnProps): CSSProperties<OwnProps> => ({
    boxSizing: 'border-box',
    position: 'absolute',
    top: (TRACK_HEIGHT - KNOB) / 2,
    left: (TRACK_HEIGHT - KNOB) / 2,
    width: KNOB,
    height: KNOB,
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    borderRadius: '100%',
    background: theme.text.primary,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
    ...transition,
  })) as any,
  content: {
    position: 'absolute',
    width: 1,
    height: 1,
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    whiteSpace: 'nowrap',
  },
  contentLeft: {},
  contentRight: {},
  viewport: ((props: OwnProps): CSSProperties<OwnProps> => ({
    boxSizing: 'border-box',
    display: 'block',
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    overflow: 'hidden',
    position: 'relative',
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    borderRadius: theme.radius.pill,
    backgroundColor: theme.fill.strong,
    userSelect: 'none',
    ...transition,
  })) as any,
  toggle: {
    position: 'absolute',
    opacity: 0,
    width: 0,
    height: 0,
    '&:focus-visible + $viewport': {
      boxShadow: theme.shadow.focus,
    },
    '&:checked + $viewport': {
      backgroundColor: theme.accent.default,
    },
    '&:checked + $viewport $button': {
      left: TRACK_WIDTH - KNOB - (TRACK_HEIGHT - KNOB) / 2,
      background: theme.text.onAccent,
    },
    '&:disabled + $viewport': {
      opacity: 0.4,
    },
  },
};

type Props = OwnProps & WithSheet<IgnoreJSSNested<typeof styles>, {}>;

class SwitcherImpl extends React.PureComponent<Props, {}> {
  static defaultProps = {
    text: TEXT.ON_OFF,
    onChange: () => {},
    checked: false,
    disabled: false,
    disabledHint: '',
  };

  inputId: string;
  values: any;

  constructor(props: Props) {
    super(props);
    this.inputId = `switcher-input-${shortid.generate()}`;
    this.values = {
      [TEXT.ON_OFF]: { 0: 'off', 1: 'on' },
      [TEXT.YES_NO]: { 0: 'no', 1: 'yes' },
    };
  }

  render() {
    const { classes, checked, onChange, disabled, text, disabledHint } = this.props;

    const hint = disabled ? disabledHint : '';
    const values = this.values[text!];

    return (
      <div>
        <Tooltip hintClassname={classes.hint} tooltip={hint}>
          <input
            type="checkbox"
            id={this.inputId}
            className={classes.toggle}
            checked={checked}
            disabled={disabled}
            onChange={onChange}
          />
          <label className={classes.viewport} htmlFor={this.inputId}>
            <div className={classes.switcher}>
              <div className={classes.button}>&nbsp;</div>
              <div className={classNames(classes.content, classes.contentLeft)}>
                <span>{values[1]}</span>
              </div>
              <div className={classNames(classes.content, classes.contentRight)}>
                <span>{values[0]}</span>
              </div>
            </div>
          </label>
        </Tooltip>
      </div>
    );
  }
}

export const Switcher = injectSheet(styles as IgnoreJSSNested<typeof styles>)(SwitcherImpl);
