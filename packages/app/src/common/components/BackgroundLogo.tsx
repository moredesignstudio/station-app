import { ThemeTypes as Theme } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

export interface Classes {
  backgroundLogo: string,
}

export interface Props {
  classes?: Classes,
}

// Same outline as app/resources/illustration--half-logo.svg, inlined so the
// fill can follow the theme instead of the file's baked-in white gradient.
const HALF_LOGO_PATH = [
  'M874.052863,687.947137 L1182.42291,687.947137 L1182.42291,732 L874.052863,732 L874.052863,687.947137 Z',
  'M1028.23789,628.475771 C918.754124,628.475771 830,539.721646 830,430.237885 C830,320.754124',
  '918.754124,232 1028.23789,232 C1137.72165,232 1226.47577,320.754124 1226.47577,430.237885',
  'C1226.47577,539.721646 1137.72165,628.475771 1028.23789,628.475771 Z',
  'M1027.13656,575.612335 C1105.55334,575.612335 1169.20705,511.065919 1169.20705,431.339207',
  'C1169.20705,351.612496 1105.55334,287.066079 1027.13656,287.066079 C948.719792,287.066079',
  '885.066079,351.612496 885.066079,431.339207 C885.066079,511.065919 948.719792,575.612335',
  '1027.13656,575.612335 Z',
].join(' ');

const styles = (theme: Theme) => ({
  backgroundLogo: {
    position: 'absolute',
    bottom: 8,
    right: 10,
    width: 298,
    height: 488,
    zIndex: -1,
    opacity: 0.06,
    fill: theme.text.primary,
    pointerEvents: 'none',
  },
});

@injectSheet(styles)
export default class BackgroundLogo extends React.PureComponent<Props, {}> {
  render() {
    const { classes } = this.props;

    return (
      <svg
        className={classes!.backgroundLogo}
        viewBox="0 0 298 488"
        role="img"
        aria-label="more mail logo"
      >
        <path fillRule="evenodd" transform="translate(-830 -233)" d={HALF_LOGO_PATH} />
      </svg>
    );
  }
}
