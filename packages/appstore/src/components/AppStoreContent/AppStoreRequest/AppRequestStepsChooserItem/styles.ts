import { ThemeTypes } from '@getstation/theme';
import { accentButtonMixin } from '@src/theme';
import { AppRequestStepsChooserItemProps }
  from '@src/components/AppStoreContent/AppStoreRequest/AppRequestStepsChooserItem/AppRequestStepsChooserItem';

const styles = (theme: ThemeTypes) => ({
  itemContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.fill.subtle,
    border: `1px solid ${theme.border.subtle}`,
    borderRadius: theme.radius.lg,
    // NOTE: keep this a string; an array value here makes TS infer the sheet's Props as `number`.
    padding: '10px 12px',
    margin: '10px auto 10px',
    color: theme.text.primary,
    ...theme.fontMixin(13),
    transition: `background-color ${theme.transition.fast}`,
    '&:hover': {
      backgroundColor: theme.fill.hover,
    },
  },
  itemContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minWidth: 0,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: 500,
    color: theme.text.primary,
  },
  itemSubtitle: {
    fontSize: 12,
    color: theme.text.secondary,
    marginTop: 2,
  },
  itemButton: {
    ...accentButtonMixin(),
    height: 28,
    lineHeight: '28px',
    padding: [0, 12],
    fontSize: 12,
    marginLeft: 12,
    flexShrink: 0,
    backgroundColor: ({ btnBgColor }: AppRequestStepsChooserItemProps) =>
      btnBgColor ? btnBgColor : theme.accent.default,
  },
});

export interface AppRequestStepsChooserItemClasses {
  itemContainer: string,
  itemContent: string,
  itemTitle: string,
  itemSubtitle: string,
  itemButton: string,
}

export default styles;
