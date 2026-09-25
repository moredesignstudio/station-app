import { colors } from '@src/theme';

const styles = {
  stepContainer: {
    maxWidth: 300,
    marginTop: 38,
    marginBottom: 30,
    width: '100%',
  },
  subTitle: {
    marginBottom: 23,
    fontSize: 13,
    fontWeight: 600,
    color: colors.textPrimary,
  },
};

export interface IClasses {
  stepContainer: string,
  subTitle: string,
}

export default styles;
