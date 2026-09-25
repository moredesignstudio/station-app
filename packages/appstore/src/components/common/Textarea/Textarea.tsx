/**
 * This File should move to theme when it will support hooks
 */

import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { debounce } from 'lodash';
import { colors, inputMixin, radius } from '@src/theme';

const useStyles = createUseStyles({
  textarea: {
    ...inputMixin(),
    resize: 'none',
    textAlign: 'justify',
    padding: [12, 14],
    borderRadius: radius.lg,
    fontFamily: 'inherit',
    fontSize: 13,
    lineHeight: '20px',
    '&:disabled': {
      color: colors.textSecondary,
    },
  },
  textAreaLabel: {
    display: 'block',
    fontWeight: 600,
    fontSize: 13,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  textareaExplanation: {
    color: colors.textSecondary,
  },
});

type OwnProps = {
  canEdit: boolean
  text?: string | undefined,
  label?: string,
  placeholder: string,
  rows?: number,
  cols?: number,
  onChange: (e: any) => any,
  maxLength?: number,
};

/**
 * Dumb statefull component (to be able to use is 'as it') + controll it with the parrent
 */
export const Textarea = (
  { canEdit = false, text, placeholder, label, onChange, rows = 10, cols = 70, maxLength = 4096 }: OwnProps,
) => {
  const classes = useStyles();

  return (
    <section>
      <label htmlFor="text" className={classes.textAreaLabel}>{label}</label>
      <textarea
        className={classes.textarea}
        value={text}
        name="text"
        disabled={!canEdit}
        placeholder={!text ? placeholder : undefined}
        spellCheck={false}
        rows={rows}
        cols={cols}
        onChange={canEdit ? (event) => onChange(event.target.value) : undefined}
        maxLength={maxLength}
      >
        {text}
      </textarea>
    </section>
  );
};
