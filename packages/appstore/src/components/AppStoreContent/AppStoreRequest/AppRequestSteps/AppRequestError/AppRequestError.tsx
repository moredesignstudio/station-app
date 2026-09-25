import * as React from 'react';
import { createUseStyles } from 'react-jss';
import { colors } from '@src/theme';

const astroAwkwardPath: string = require('./astr-awkward.png');

const useStyles = createUseStyles({
  stepContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 38,
  },
  title: {
    textAlign: 'center',
    marginTop: 0,
    fontSize: 16,
    fontWeight: 600,
    lineHeight: '24px',
    letterSpacing: '-0.01em',
    color: colors.textPrimary,
  },
  text: {
    fontSize: 14,
    lineHeight: '22px',
    color: colors.textSecondary,
    textAlign: 'center',
    '& a': {
      color: colors.accentText,
    },
  },
  errorImage: {
    fontSize: 50,
    margin: 0,
    height: 100,
    marginBottom: 10,
  },
});

const AppRequestError = () => {
  const classes = useStyles();

  return (
    <div className={classes.stepContent}>
      <img className={classes.errorImage} src={astroAwkwardPath} />
      <h4 className={classes.title}>Something went wrong, <br /> we're sorry.</h4>
      <div className={classes.text}>
        Please retry in couples of minutes or post topic in our <a target="_blank" href="https://github.com/getstation/desktop-app/issues">Community</a> forum: we'll be there for you.
      </div>
    </div>
  );
};

export default AppRequestError;
