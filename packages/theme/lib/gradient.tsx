// @ts-ignore the type definition is broken, problem of import default :(
import createReactContext from 'create-react-context';
import * as React from 'react';
import { DARK_THEME_COLORS } from './constants';
import { flat, surface } from './tokens';

// @ts-ignore typing is correct as soon as 'create-react-context' is correct
const GradientColorsContext = createReactContext<string[]>(DARK_THEME_COLORS);

export interface GradientProviderProps {
  themeColors: string[];
  children: React.Component
}

/**
 * GradientProvider
 */
export class GradientProvider extends React.Component<GradientProviderProps> {
  render() {
    return (
      <GradientColorsContext.Provider value={this.props.themeColors}>
        {this.props.children}
      </GradientColorsContext.Provider>
    );
  }
}

type Omit<T, K extends keyof T> = T extends any ? Pick<T, Exclude<keyof T, K>> : never;

export interface InjectedProps {
  themeGradient: string,
}

/**
 * Which surface a component sits on. Names are historical: they used to pick
 * how much black overlay was applied on top of the time-of-day gradient.
 * - `normal`          → base surface (app background, overlays)
 * - `withOverlay`     → sidebar surface (the dock rail)
 * - `withDarkOverlay` → panel surface (quick-switch, subdock, popovers)
 */
export enum GradientType {
  normal,
  withOverlay,
  withDarkOverlay,
}

/**
 * computeGradient
 *
 * @param {GradientType} type - type of gradient.
 * @param {string[]} _themeGradientColors - ignored in the dark theme.
 * @return {string} a flat linear-gradient CSS value for `background-image`
 */
export function computeGradient(type: GradientType, _themeGradientColors?: string[]) {
  switch (type) {
    case GradientType.withOverlay:
      return flat(surface.sidebar);
    case GradientType.withDarkOverlay:
      return flat(surface.panel);
    case GradientType.normal:
    default:
      return flat(surface.base);
  }
}

// typing is inspired from https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-redux/index.d.ts
/**
 * Add the ThemeGradient ot the wrapped component.
 * @param gradientType - the type of gradient to return
 */
export const withGradient = (gradientType?: GradientType) =>
  <P extends InjectedProps>(WrappedComponent: React.ComponentType<P>):
    React.ComponentClass<Omit<P, keyof InjectedProps>> => {

    type HOCProps = Omit<P, keyof InjectedProps>;

    class WithGradient extends React.Component<HOCProps, {}> {
      static displayName = `WithGradient(${WrappedComponent.displayName || WrappedComponent.name})`;

      render() {
        return (
          <GradientColorsContext.Consumer>
            {(themeGradientColors: string[]) => this.renderChildren(themeGradientColors)}
          </GradientColorsContext.Consumer>
        );
      }

      renderChildren(themeGradientColors: string[]) {

        const themeGradient = computeGradient(gradientType || GradientType.normal, themeGradientColors);
        return <WrappedComponent themeGradient={themeGradient} {...(this.props as any)} />;
      }
    }

    return WithGradient;
  };
