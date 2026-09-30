import { ThemeTypes as Theme } from '@getstation/theme';
import * as classNames from 'classnames';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

interface Classes {
  tab: string,
}

type RenderFunction = () => React.ReactElement | React.ReactElement[];

export interface Props {
  children: RenderFunction,
  classes?: Classes,
  onClick?: () => void,
  title: string,
  isActive?: boolean,
}

const styles = (theme: Theme) => ({
  tab: {
    ...theme.fontMixin(13),
    lineHeight: '20px',
    color: theme.text.secondary,
    padding: [6, 14],
    borderRadius: theme.radius.pill,
    boxSizing: 'border-box',
    cursor: 'pointer',
    userSelect: 'none',
    transition: `background-color ${theme.transition.fast}, color ${theme.transition.fast}`,
    '& a': {
      color: 'inherit',
      textDecoration: 'none',
    },
    '&:hover': {
      backgroundColor: theme.fill.hover,
      color: theme.text.primary,
    },
    '&.active': {
      backgroundColor: theme.fill.selected,
      color: theme.text.primary,
      fontWeight: 500,
    },
  },
});

@injectSheet(styles)
export default class Tab extends React.PureComponent<Props, {}> {
  render() {
    const { title, classes, isActive } = this.props;
    return (
      <li className={classNames(classes!.tab, { active: isActive })}>
        <a onClick={this.props.onClick}>
          {title}
        </a>
      </li>
    );
  }
}
