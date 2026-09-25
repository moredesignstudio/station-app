import { ThemeTypes } from '@getstation/theme';
import { IProps } from '@src/components/AppStoreContent/AppStoreRequest/AppRequestSteps/AppData/AppData';
import { animStylesData } from '@src/shared/constants/constants';

// tslint:disable-next-line:max-line-length
const StripeImg = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAJUlEQVQoU2N89+7dfwY0ICQkxIguxjgUFKI7GsTH5m4M3w1ChQDSWCb4Kwsr/AAAAABJRU5ErkJggg==)';

/**
 * Monochrome custom-app icons are shipped as dark glyphs; this filter
 * re-inks them to (almost) `text.primary` so they read on dark surfaces.
 */
const lightGlyphFilter = 'brightness(0) invert(0.92)';

const styles = (theme: ThemeTypes) => ({
  stepContainer: {
    maxWidth: 310,
    marginTop: 21,
    width: '100%',
    '&.fade-enter': {
      position: 'static',
      transform: `translateX(${animStylesData.translateRight})`,
      '&.fade-enter-active': {
        transform: 'translateX(0)',
        transition: `transform ${animStylesData.transitionTime}`,
      },
    },
    '&.fade-enter-done': {
      position: 'static',
    },
    '&.fade-exit': {
      position: 'absolute',
      top: 39,
      left: 0,
      transform: 'translateX(0)',
      '&.fade-exit-active': {
        transform: ({ animExitDirection }: IProps) => animExitDirection ?
          `translateX(${animStylesData.translateLeft})` : `translateX(${animStylesData.translateRight})`,
        transition: `transform ${animStylesData.transitionTime}`,
      },
    },
    '&.fade-exit-done': {
      position: 'static',
      transform: ({ animExitDirection }: IProps) => animExitDirection ?
        `translateX(${animStylesData.translateLeft})` : `translateX(${animStylesData.translateRight})`,
    },
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: theme.text.primary,
  },
  itemContainer: {
    position: 'relative',
  },
  subLabel: {
    fontSize: 12,
    color: theme.text.secondary,
  },
  subLabelError: {
    position: 'absolute',
    top: '-20px',
    left: 0,
    fontSize: 12,
    color: theme.status.danger,
  },
  inputColorWrapper: {
    display: 'flex',
    margin: [23, 0, 30],
  },
  themeColorRender: {
    display: 'inline-flex',
    ...theme.mixins.size(32),
    boxShadow: `inset 0 0 0 1px ${theme.border.default}`,
    borderRadius: theme.radius.md,
    marginRight: 10,
    background: StripeImg,
  },
  inputColorText: {
    width: 80,
    height: 32,
    padding: [0, 10],
    border: 'none',
    boxShadow: `inset 0 0 0 1px ${theme.border.default}`,
    borderRadius: theme.radius.md,
    backgroundColor: theme.fill.subtle,
    color: theme.text.primary,
    fontFamily: theme.font.sans,
    fontSize: 13,
    outline: 'none',
    transition: `box-shadow ${theme.transition.fast}`,
    '&::placeholder': {
      color: theme.text.tertiary,
    },
    '&:focus': {
      boxShadow: `inset 0 0 0 1px ${theme.accent.border}, ${theme.shadow.focus}`,
    },
  },
  colorWheelWrapper: {
    display: 'inline-flex',
    marginLeft: 12,
  },
  inputColor: {
    ...theme.mixins.size(20),
    border: `1px solid ${theme.border.default}`,
    borderRadius: theme.radius.md,
    verticalAlign: 'middle',
    marginTop: 6,
    outline: 'none',
    position: 'absolute',
    opacity: 0,
    cursor: 'pointer',
  },
  uploadWrapper: {
    display: 'flex',
    alignItems: 'center',
    margin: [17, 0, 20],
  },
  uploadButton: {
    width: 50,
    height: 50,
    paddingTop: 5,
    borderRadius: 100,
    border: 0,
    outline: 'none',
    backgroundColor: theme.surface.elevated,
    cursor: 'pointer',
  },
  uploadInfo: {
    fontSize: 12,
    lineHeight: '18px',
    color: theme.text.secondary,
    marginLeft: 35,
  },
  imageUploadedWrapper: {
    position: 'relative',
    margin: [17, 0, 20],
  },
  imageUploadedBg: {
    ...theme.mixins.flexbox.containerCenter,
    width: 50,
    height: 50,
    borderRadius: 100,
    overflow: 'hidden',
  },
  imageUploaded: {
    ...theme.mixins.size(50),
  },
  imageRemoveIcon: {
    position: 'absolute',
    left: 50,
    top: '-5px',
    cursor: 'pointer',
  },
  select: {
    marginBottom: 30,
    position: 'relative',
  },
  selectContainer: {
    maxWidth: 67,
    height: 30,
    backgroundColor: theme.fill.subtle,
    boxShadow: `inset 0 0 0 1px ${theme.border.default}`,
    paddingLeft: 4,
    borderRadius: theme.radius.md,
    margin: [6, 0, 20],
    cursor: 'pointer',
    position: 'relative',
    transition: `background-color ${theme.transition.fast}`,
    '&:hover': {
      backgroundColor: theme.fill.hover,
    },
    '&:after' : {
      content: '""',
      display: 'inline-block',
      position: 'absolute',
      top: 10,
      left: 43,
      padding: 3,
      border: `solid ${theme.text.secondary}`,
      borderWidth: '0 2px 2px 0',
      transform: 'rotate(45deg)',
    },
  },
  selectIcon: {
    width: 30,
    height: 30,
    filter: lightGlyphFilter,
  },
  selectList: {
    display: 'none',
    flexWrap: 'wrap',
    minWidth: 330,
    maxWidth: 330,
    backgroundColor: theme.surface.elevated,
    padding: [5, 9, 3, 9],
    boxShadow: theme.shadow.panel,
    borderRadius: theme.radius.lg,
    position: 'absolute',
    top: 56,
    zIndex: 1,
    '&.isVisible': {
      display: 'flex',
    },
  },
  selectItem: {
    display: 'flex',
    width: 36,
    height: 36,
    opacity: 0.6,
    cursor: 'pointer',
    borderRadius: theme.radius.sm,
    transition: `opacity ${theme.transition.fast}, background-color ${theme.transition.fast}`,
    margin: [0, 3, 2, 0],
    '&:hover': {
      opacity: 1,
      backgroundColor: theme.fill.hover,
    },
  },
  selectItemIcon: {
    filter: lightGlyphFilter,
    width: '100%',
  },
  inputContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
});

export interface IClasses {
  stepContainer: string,
  label: string,
  itemContainer: string,
  subLabel: string,
  subLabelError: string,
  inputColorWrapper: string,
  themeColorRender: string,
  inputColorText: string,
  colorWheelWrapper: string,
  inputColor: string,
  uploadWrapper: string,
  uploadButton: string,
  uploadInfo: string,
  imageUploadedWrapper: string,
  imageUploadedBg: string,
  imageUploaded: string,
  imageRemoveIcon: string,
  select: string,
  selectContainer: string,
  selectIcon: string,
  selectList: string,
  selectItem: string,
  selectItemIcon: string,
  inputContainer: string,
}

export default styles;
