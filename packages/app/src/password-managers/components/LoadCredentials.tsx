import { Modal, ThemeTypes } from '@getstation/theme';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

export interface Classes {
  input: string,
  body: string,
}

export interface Props {
  classes?: Classes,
  applicationName: string,
  applicationIcon: string,
  themeColor: string,
  providerName: string,
}

@injectSheet((theme: ThemeTypes) => ({
  input: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    boxSizing: 'border-box',
    marginTop: -10,
    padding: [0, 20, 10],
    backgroundColor: theme.surface.elevated,
    zIndex: 1,
  },
  body: {
    marginTop: 50,
    height: 180,
  },
}))
export default class LoadCredentials extends React.PureComponent<Props, {}> {

  render() {
    const { themeColor, classes, applicationName, applicationIcon, providerName } = this.props;
    const description: any = (<div>We are loading your credentials<br />from {providerName} to {applicationName}</div>);

    return (
      <Modal
        title={`Please wait...`}
        description={description}
        applicationIcon={applicationIcon}
        themeColor={themeColor}
        isLoading={true}
      >
        <div className={classes!.body}/>
      </Modal>
    );
  }
}
