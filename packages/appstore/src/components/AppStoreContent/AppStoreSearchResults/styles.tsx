import { ThemeTypes } from '@getstation/theme';

const styles = (theme: ThemeTypes) => ({
  resultsSection: {
    padding: '30px 20px 0 20px',
  },
  resultsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 30,
    paddingBottom: 8,
    borderBottom: `1px solid ${theme.border.subtle}`,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: 600,
    lineHeight: '24px',
    letterSpacing: '-0.01em',
    color: theme.text.primary,
  },
  resultsAmount: {
    fontSize: 13,
    color: theme.text.secondary,
  },
  resultsContent: {
    padding: '47px 0 32px 0',
    margin: 0,
    listStyleType: 'none',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  resultsButtonContainer: {
    textAlign: 'center',
    marginBottom: 52,
  },
  resultsButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: 32,
    lineHeight: '32px',
    padding: [0, 16],
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: '-0.01em',
    color: theme.accent.text,
    textAlign: 'center',
    boxShadow: `inset 0 0 0 1px ${theme.accent.border}`,
    borderRadius: theme.radius.md,
    cursor: 'pointer',
    transition: `background-color ${theme.transition.fast}`,
    '&:hover': {
      backgroundColor: theme.accent.subtle,
    },
  },
  '@media (min-width: 600px)': {
    resultsSection: {
      padding: [34, 38, 0, 42],
    },
    resultsButtonContainer: {
      marginBottom: 70,
    },
  },
});

export interface AppStoreSearchResultsClasses {
  resultsSection: string,
  resultsHeader: string,
  resultsTitle: string,
  resultsAmount: string,
  resultsContent: string,
  resultsButtonContainer: string,
  resultsButton: string,
}

export default styles;
