import { accent } from '@getstation/theme';
import PropTypes from 'prop-types';
import React from 'react';
import injectSheet from 'react-jss';
import SVGInline from 'react-svg-inline';

import OSBar from '../os-bar/OSBar';
import AboutWindowFooter from './components/AboutWindowFooter';
import AboutWindowVersions from './components/AboutWindowVersions';
import { getSVG } from '../theme/api';
import { isDarwin } from '../utils/process';

const styles = theme => ({
  container: {
    height: '100%',
    backgroundColor: theme.surface.base,
    color: theme.text.primary,
  },
  body: {
    display: 'flex',
    flex: 1,
    position: 'relative',
    height: '100%',
    padding: '32px 48px 48px 40px',
    color: theme.text.primary,
  },
  content: {
    flex: 1,
    position: 'relative',
    margin: '4px 40px 0 24px',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 4,
    height: '100%',
    backgroundColor: theme.accent.default,
  },
});

@injectSheet(styles)
class AboutWindowPresenter extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    isDownloadingUpdate: PropTypes.bool.isRequired,
    isCheckingUpdate: PropTypes.bool.isRequired,
    isUpdateAvailable: PropTypes.bool.isRequired,
    checkForUpdates: PropTypes.func.isRequired,
    releaseName: PropTypes.string,
    quitAndInstall: PropTypes.func.isRequired,
    themeColors: PropTypes.array.isRequired,
    appName: PropTypes.string,
    appVersion: PropTypes.string,
  };

  static defaultProps = {
    releaseName: undefined,
  }

  render() {
    const { classes } = this.props;

    // The app theme colors are the flat dark surface: the logo needs the accent ramp to stay visible.
    const inlineSVG = getSVG(accent.ramp, 80, false);

    return (
      <div className={classes.container}>
        { isDarwin && <OSBar /> }

        <div className={classes.body}>
          <SVGInline svg={inlineSVG} />

          <div className={classes.content}>
            <AboutWindowVersions
              isDownloadingUpdate={this.props.isDownloadingUpdate}
              isCheckingUpdate={this.props.isCheckingUpdate}
              isUpdateAvailable={this.props.isUpdateAvailable}
              checkForUpdates={this.props.checkForUpdates}
              quitAndInstall={this.props.quitAndInstall}
              releaseName={this.props.releaseName}
              appName={this.props.appName}
              appVersion={this.props.appVersion}
            />

            <AboutWindowFooter />
          </div>
        </div>

        <div className={classes.gradient} />
      </div>
    );
  }
}

export default AboutWindowPresenter;
